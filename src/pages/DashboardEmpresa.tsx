import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, LogOut, RefreshCw } from 'lucide-react';
import { desafiosAPI, storageUtils } from '../services/api';

interface Desafio {
  id_desafio?: number;
  idDesafio?: number;
  id_empresa?: number;
  titulo?: string;
  descricao?: string;
  categoria?: string;
  dificuldade?: string;
  xp_recompensa?: number;
  ativo?: boolean;
}

const getDesafioId = (d: Desafio): number => d.id_desafio || d.idDesafio || 0;

export default function DashboardEmpresa() {
  const navigate = useNavigate();
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDesafio, setEditingDesafio] = useState<Desafio | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    dificuldade: 'medio',
    xp_recompensa: 100,
  });

  const empresaId = storageUtils.getEmpresaId();

  const showMessage = useCallback((type: 'success' | 'error', text: string, duration = 4000) => {
    setMessage({ type, text });
    const timer = setTimeout(() => setMessage(null), duration);
    return () => clearTimeout(timer);
  }, []);

  const carregarDesafios = useCallback(async (silencioso = false) => {
    if (!empresaId) return;
    
    if (!silencioso) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const { data, error, status } = await desafiosAPI.listarDesafiosEmpresa(empresaId);
      
      if (status === 404 || (error && error.includes('404'))) {
        setDesafios([]);
      } else if (error) {
        console.error('Erro ao carregar desafios:', error);
        if (!silencioso) {
          showMessage('error', 'Err ao carregar desafios');
        }
      } else if (data) {
        setDesafios(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      if (!silencioso) {
        showMessage('error', 'Erro inesperado ao carregar dados');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [empresaId, showMessage]);

  useEffect(() => {
    if (!empresaId) {
      navigate('/login/empresa');
      return;
    }
    carregarDesafios();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    storageUtils.removeEmpresaId();
    navigate('/login');
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      categoria: '',
      dificuldade: 'medio',
      xp_recompensa: 100,
    });
    setEditingDesafio(null);
    setShowForm(false);
  };

  // ✅ CORRIGIDO: Incluindo campo "ativo" obrigatório
  const handleSaveDesafio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresaId) return;

    try {
      if (editingDesafio) {
        // ATUALIZAR
        const idDesafio = getDesafioId(editingDesafio);
        
        const payload = {
          id_desafio: idDesafio,
          id_empresa: editingDesafio.id_empresa || empresaId,
          titulo: formData.titulo,
          descricao: formData.descricao,
          categoria: formData.categoria,
          dificuldade: formData.dificuldade,
          xp_recompensa: formData.xp_recompensa,
          ativo: editingDesafio.ativo !== undefined ? editingDesafio.ativo : true, // ✅ CAMPO OBRIGATÓRIO
        };
        
        console.log('📝 Payload de atualização:', payload);
        
        const { error, status } = await desafiosAPI.atualizarDesafio(payload);
        
        if (error) {
          showMessage('error', `Erro ao atualizar desafio: ${error}`);
          return;
        }
        
        if (status === 200 || status === 201 || status === 204) {
          showMessage('success', 'Desafio atualizado com sucesso!');
          resetForm();
          carregarDesafios(true);
        }
      } else {
        // CRIAR NOVO DESAFIO
        const payload = {
          id_empresa: empresaId,
          titulo: formData.titulo,
          descricao: formData.descricao,
          categoria: formData.categoria,
          dificuldade: formData.dificuldade,
          xp_recompensa: formData.xp_recompensa,
        };
        
        console.log('📝 Payload de criação:', payload);
        
        const { error, status } = await desafiosAPI.criarDesafio(payload);
        
        if (error) {
          showMessage('error', `Erro ao criar desafio: ${error}`);
          return;
        }
        
        if (status === 200 || status === 201) {
          showMessage('success', 'Desafio criado com sucesso!');
          resetForm();
          carregarDesafios(true);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showMessage('error', 'Erro de conexão ao salvar desafio');
    }
  };

  const handleEditDesafio = (desafio: Desafio) => {
    setEditingDesafio(desafio);
    setFormData({
      titulo: desafio.titulo || '',
      descricao: desafio.descricao || '',
      categoria: desafio.categoria || '',
      dificuldade: desafio.dificuldade || 'medio',
      xp_recompensa: desafio.xp_recompensa || 100,
    });
    setShowForm(true);
  };

  // ✅ CORRIGIDO: Melhor tratamento de erros
  const handleDeleteDesafio = async (desafio: Desafio) => {
    const id = getDesafioId(desafio);
    if (!id) {
      showMessage('error', 'ID do desafio não encontrado');
      return;
    }
    
    const confirmMessage = `Tem certeza que deseja deletar "${desafio.titulo}"?\n\n⚠️ ATENÇÃO: Se houver usuários com este desafio aceito, a exclusão pode falhar.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setActionLoading(id);

    try {
      console.log(`🗑️ Tentando deletar desafio ID: ${id}`);
      const { error, status } = await desafiosAPI.deletarDesafio(id);
      
      console.log('📡 Resposta delete:', { error, status });

      // Sucesso
      if (status === 200 || status === 204) {
        setDesafios(prev => prev.filter(d => getDesafioId(d) !== id));
        showMessage('success', 'Desafio deletado com sucesso!');
        return;
      }

      // Erros específicos
      if (error) {
        if (status === 500 || error.toLowerCase().includes('constraint') || error.toLowerCase().includes('foreign key')) {
          showMessage('error', '❌ Não foi possível deletar. O desafio está vinculado a usuários que o aceitaram.');
        } else if (status === 404) {
          showMessage('error', 'Desafio não encontrado.');
        } else {
          showMessage('error', `Erro ao deletar: ${error}`);
        }
      }
    } catch (error) {
      console.error('❌ Exceção ao deletar:', error);
      showMessage('error', 'Erro de conexão ao deletar. Verifique sua internet.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefresh = () => {
    carregarDesafios(true);
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Empresa
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Gerencie seus desafios para os funcionários
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </motion.div>

        {/* Mensagens */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg shadow-md ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Botão Criar Desafio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => {
              if (showForm && !editingDesafio) {
                resetForm();
              } else {
                resetForm();
                setShowForm(true);
              }
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            {showForm && !editingDesafio ? 'Cancelar' : 'Criar Novo Desafio'}
          </button>
        </motion.div>

        {/* Formulário de Desafio */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingDesafio ? 'Editar Desafio' : 'Novo Desafio'}
            </h2>
            <form onSubmit={handleSaveDesafio} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Categoria"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <textarea
                placeholder="Descrição"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                rows={4}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData.dificuldade}
                  onChange={(e) => setFormData({ ...formData, dificuldade: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="facil">Fácil</option>
                  <option value="medio">Médio</option>
                  <option value="dificil">Difícil</option>
                </select>
                <input
                  type="number"
                  placeholder="XP de Recompensa"
                  value={formData.xp_recompensa}
                  onChange={(e) => setFormData({ ...formData, xp_recompensa: parseInt(e.target.value) || 0 })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  min={1}
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  {editingDesafio ? 'Atualizar' : 'Criar'} Desafio
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Lista de Desafios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Seus Desafios ({desafios.length})
          </h2>

          {desafios.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-md">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Nenhum desafio criado ainda.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Clique em "Criar Novo Desafio" para começar!
              </p>
            </div>
          ) : (
            desafios.map((desafio) => {
              const id = getDesafioId(desafio);
              const isDeleting = actionLoading === id;
              
              return (
                <div
                  key={id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {desafio.titulo}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {desafio.descricao}
                      </p>
                      <div className="flex gap-4 text-sm flex-wrap">
                        <span className="text-gray-500 dark:text-gray-400">
                          Categoria: <strong>{desafio.categoria}</strong>
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          Dificuldade: <strong>{desafio.dificuldade}</strong>
                        </span>
                        <span className="text-yellow-500">
                          XP: <strong>+{desafio.xp_recompensa}</strong>
                        </span>
                        <span className="text-gray-400 text-xs">
                          ID: {id}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditDesafio(desafio)}
                        disabled={isDeleting}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDesafio(desafio)}
                        disabled={isDeleting}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
                        title="Deletar"
                      >
                        {isDeleting ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}