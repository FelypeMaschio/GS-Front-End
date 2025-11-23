import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Zap, Award, TrendingUp, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { desafiosUsuarioAPI, storageUtils } from '../services/api';

interface Desafio {
  id_desafio?: number;
  idDesafio?: number;
  titulo?: string;
  descricao?: string;
  categoria?: string;
  dificuldade?: string;
  xp_recompensa?: number;
  xpRecompensa?: number; // ✅ ADICIONADO: campo da API de desafios aceitos
}

interface Stats {
  id_status_usuario: number;
  id_usuario: number;
  desafios_concluidos: number;
  nivel_atual: number;
  xp_atual: number;
  xp_total: number;
}

const getDesafioId = (d: Desafio): number => d.id_desafio || d.idDesafio || 0;

// ✅ NOVA FUNÇÃO: Obter XP de forma unificada (suporta ambos os formatos)
const getDesafioXP = (d: Desafio): number => {
  return d.xpRecompensa ?? d.xp_recompensa ?? 0;
};

export default function DashboardUsuario() {
  const navigate = useNavigate();
  const [desafiosDisponiveis, setDesafiosDisponiveis] = useState<Desafio[]>([]);
  const [desafiosAceitos, setDesafiosAceitos] = useState<Desafio[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'disponiveis' | 'aceitos'>('disponiveis');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [idsAceitos, setIdsAceitos] = useState<Set<number>>(new Set());

  const usuarioId = storageUtils.getUsuarioId();

  const showMessage = useCallback((type: 'success' | 'error' | 'warning', text: string, duration = 4000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), duration);
  }, []);

  const carregarDados = useCallback(async (silencioso = false) => {
    if (!usuarioId) return;
    
    if (!silencioso) setLoading(true);
    else setRefreshing(true);
    
    try {
      const [dispRes, aceitosRes, statsRes] = await Promise.all([
        desafiosUsuarioAPI.listarDisponiveis(usuarioId),
        desafiosUsuarioAPI.listarAceitos(usuarioId),
        desafiosUsuarioAPI.obterStats(usuarioId),
      ]);

      let aceitosIds = new Set<number>();
      if (!aceitosRes.error && aceitosRes.data && Array.isArray(aceitosRes.data)) {
        const aceitos = aceitosRes.data as Desafio[];
        console.log('📊 Desafios aceitos com XP:', aceitos.map(d => ({
          id: getDesafioId(d),
          titulo: d.titulo,
          xp: getDesafioXP(d) // ✅ Usando função unificada
        })));
        setDesafiosAceitos(aceitos);
        aceitosIds = new Set(aceitos.map(getDesafioId));
        setIdsAceitos(aceitosIds);
      } else if (aceitosRes.status === 404) {
        setDesafiosAceitos([]);
        setIdsAceitos(new Set());
      }

      if (!dispRes.error && dispRes.data && Array.isArray(dispRes.data)) {
        const disponiveis = (dispRes.data as Desafio[]).filter(
          d => !aceitosIds.has(getDesafioId(d))
        );
        console.log('📊 Desafios disponíveis com XP:', disponiveis.map(d => ({
          id: getDesafioId(d),
          titulo: d.titulo,
          xp: getDesafioXP(d) // ✅ Usando função unificada
        })));
        setDesafiosDisponiveis(disponiveis);
      } else if (dispRes.status === 404) {
        setDesafiosDisponiveis([]);
      }

      if (!statsRes.error && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      if (!silencioso) showMessage('error', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [usuarioId, showMessage]);

  useEffect(() => {
    if (!usuarioId) {
      navigate('/login/usuario');
      return;
    }
    carregarDados();
  }, [usuarioId, navigate, carregarDados]);

  const handleLogout = () => {
    storageUtils.removeUsuarioId();
    navigate('/login');
  };

  const handleAceitarDesafio = async (idDesafio: number) => {
    if (!usuarioId || actionLoading) return;

    if (idsAceitos.has(idDesafio)) {
      showMessage('warning', 'Você já aceitou este desafio!');
      return;
    }

    setActionLoading(idDesafio);

    try {
      const { error, status } = await desafiosUsuarioAPI.aceitarDesafio(usuarioId, idDesafio);
      
      if (error) {
        if (error.toLowerCase().includes('já aceito') || error.toLowerCase().includes('already')) {
          showMessage('warning', 'Este desafio já foi aceito anteriormente');
          setIdsAceitos(prev => new Set([...prev, idDesafio]));
        } else {
          showMessage('error', `Erro ao aceitar: ${error}`);
        }
        return;
      }

      if (status === 200 || status === 201 || status === 204) {
        setIdsAceitos(prev => new Set([...prev, idDesafio]));
        showMessage('success', 'Desafio aceito com sucesso! 🎉', 3000);
        setActiveTab('aceitos');
        await carregarDados(true);
      }
    } catch (error) {
      console.error('❌ Exceção ao aceitar:', error);
      showMessage('error', 'Erro inesperado ao aceitar desafio');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConcluirDesafio = async (idDesafio: number) => {
    if (!usuarioId || actionLoading) return;
    if (!confirm('Tem certeza que deseja marcar este desafio como concluído?')) return;

    setActionLoading(idDesafio);

    try {
      console.log(`✅ Iniciando conclusão do desafio ${idDesafio}...`);
      showMessage('warning', '⏳ Processando... A API pode demorar até 60s.', 60000);

      const { error, status } = await desafiosUsuarioAPI.concluirDesafio(usuarioId, idDesafio);
      
      console.log('📡 Resposta concluir:', { error, status });
      setMessage(null);

      if (error) {
        if (error.includes('Timeout') || error.includes('timeout')) {
          showMessage('error', '⏱️ Timeout: A API demorou muito. Tente novamente.');
        } else if (error.toLowerCase().includes('já concluído') || error.toLowerCase().includes('already')) {
          showMessage('warning', 'Este desafio já foi concluído anteriormente.');
          setDesafiosAceitos(prev => prev.filter(d => getDesafioId(d) !== idDesafio));
          setIdsAceitos(prev => {
            const newSet = new Set(prev);
            newSet.delete(idDesafio);
            return newSet;
          });
        } else {
          showMessage('error', `Erro ao concluir: ${error}`);
        }
        return;
      }

      if (status === 200 || status === 201 || status === 204) {
        setDesafiosAceitos(prev => prev.filter(d => getDesafioId(d) !== idDesafio));
        setIdsAceitos(prev => {
          const newSet = new Set(prev);
          newSet.delete(idDesafio);
          return newSet;
        });

        showMessage('success', '🎉 Parabéns! Desafio concluído! 🏆', 5000);
        setTimeout(() => carregarDados(true), 2000);
      } else {
        showMessage('error', `Status inesperado: ${status}`);
      }
    } catch (error) {
      console.error('❌ Exceção ao concluir:', error);
      setMessage(null);
      
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        showMessage('error', '🌐 Erro de rede: Verifique sua conexão.');
      } else {
        showMessage('error', 'Erro inesperado ao concluir desafio.');
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Usuário</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Acompanhe seus desafios e progresso</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => carregarDados(true)} disabled={refreshing}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold shadow-lg disabled:opacity-50">
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
              <LogOut className="w-5 h-5" /> Sair
            </button>
          </div>
        </motion.div>

        {/* Mensagens */}
        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg shadow-md flex items-start gap-3 ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100' 
                : message.type === 'warning'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
            }`}>
            {message.type === 'warning' && <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            <span className="flex-1">{message.text}</span>
          </motion.div>
        )}

        {/* Stats */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nível Atual</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.nivel_atual}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">XP Atual</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.xp_atual}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">XP Total</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.xp_total}</p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Desafios Concluídos</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.desafios_concluidos}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Abas */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
            <button onClick={() => setActiveTab('disponiveis')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'disponiveis' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 dark:text-gray-400'}`}>
              Desafios Disponíveis ({desafiosDisponiveis.length})
            </button>
            <button onClick={() => setActiveTab('aceitos')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'aceitos' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 dark:text-gray-400'}`}>
              Desafios Aceitos ({desafiosAceitos.length})
            </button>
          </div>
        </div>

        {/* Lista de Desafios */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {activeTab === 'disponiveis' ? (
            desafiosDisponiveis.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-md">
                <p className="text-gray-600 dark:text-gray-400 text-lg">Nenhum desafio disponível no momento.</p>
              </div>
            ) : (
              desafiosDisponiveis.map((desafio) => {
                const id = getDesafioId(desafio);
                const xp = getDesafioXP(desafio); // ✅ Usando função unificada
                const isProcessing = actionLoading === id;
                const jaAceito = idsAceitos.has(id);
                return (
                  <div key={id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{desafio.titulo}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{desafio.descricao}</p>
                    <div className="flex gap-4 text-sm flex-wrap mb-4">
                      <span className="text-gray-700 dark:text-gray-300">Categoria: <strong>{desafio.categoria}</strong></span>
                      <span className="text-gray-700 dark:text-gray-300">Dificuldade: <strong>{desafio.dificuldade}</strong></span>
                      <span className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                        <Zap className="w-4 h-4" />
                        <strong>XP: {xp}</strong> {/* ✅ CORRIGIDO */}
                      </span>
                    </div>
                    <button onClick={() => handleAceitarDesafio(id)} disabled={isProcessing || jaAceito || actionLoading !== null}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      {isProcessing ? 'Aceitando...' : jaAceito ? 'Já Aceito' : 'Aceitar Desafio'}
                    </button>
                  </div>
                );
              })
            )
          ) : (
            desafiosAceitos.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-md">
                <p className="text-gray-600 dark:text-gray-400 text-lg">Você ainda não aceitou nenhum desafio.</p>
              </div>
            ) : (
              desafiosAceitos.map((desafio) => {
                const id = getDesafioId(desafio);
                const xp = getDesafioXP(desafio); // ✅ Usando função unificada
                const isProcessing = actionLoading === id;
                return (
                  <div key={id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{desafio.titulo}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{desafio.descricao}</p>
                    <div className="flex gap-4 text-sm flex-wrap mb-4">
                      <span className="text-gray-700 dark:text-gray-300">Categoria: <strong>{desafio.categoria}</strong></span>
                      <span className="text-gray-700 dark:text-gray-300">Dificuldade: <strong>{desafio.dificuldade}</strong></span>
                      <span className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                        <Zap className="w-4 h-4" />
                        <strong>XP: {xp}</strong> {/* ✅ CORRIGIDO */}
                      </span>
                    </div>
                    <button onClick={() => handleConcluirDesafio(id)} disabled={isProcessing || actionLoading !== null}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      {isProcessing ? '⏳ Concluindo...' : 'Concluir Desafio'}
                    </button>
                  </div>
                );
              })
            )
          )}
        </motion.div>
      </div>
    </div>
  );
}