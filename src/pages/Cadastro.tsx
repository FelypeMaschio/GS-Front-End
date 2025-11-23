import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastroAPI } from '../services/api';

export default function Cadastro() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'empresa' | 'usuario'>('empresa');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);

  // Form states
  const [empresaForm, setEmpresaForm] = useState({
    nome_empresa: '',
    cnpj: '',
    setor: '',
    data_criacao: '',
    email_corporativo: '',
    senha_corporativa: '',
  });

  const [usuarioForm, setUsuarioForm] = useState({
    nome_usuario: '',
    email: '',
    senha: '',
    nm_empresa: '',
  });

  // Carregar lista de empresas quando mudar para a aba de usuário
  const handleTabChange = async (tab: 'empresa' | 'usuario') => {
    setActiveTab(tab);
    if (tab === 'usuario' && empresas.length === 0) {
      setLoadingEmpresas(true);
      const { data, error } = await cadastroAPI.listarEmpresas();
      setLoadingEmpresas(false);
      if (error) {
        setMessage({ type: 'error', text: 'Erro ao carregar empresas' });
      } else if (data) {
        setEmpresas(data);
      }
    }
  };

  // Cadastro de Empresa
  const handleCadastroEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await cadastroAPI.criarEmpresa(empresaForm);

    if (error) {
      setMessage({ type: 'error', text: `Erro ao cadastrar empresa: ${error}` });
    } else {
      setMessage({ type: 'success', text: 'Empresa cadastrada com sucesso!' });
      setEmpresaForm({ nome_empresa: '', cnpj: '', setor: '', data_criacao: '', email_corporativo: '', senha_corporativa: '' });
      setTimeout(() => navigate('/login/empresa'), 2000);
    }

    setLoading(false);
  };

  // Cadastro de Usuário
  const handleCadastroUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await cadastroAPI.criarUsuario(usuarioForm);

    if (error) {
      setMessage({ type: 'errr', text: `Erro ao cadastrar usuário: ${error}` });
    } else {
      setMessage({ type: 'success', text: 'Usuário cadastrado com sucesso!' });
      setUsuarioForm({ nome_usuario: '', email: '', senha: '', nm_empresa: '' });
      setTimeout(() => navigate('/login/usuario'), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Cadastro
        </h1>

        {/* Abas */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => handleTabChange('empresa')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === 'empresa'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Empresa
          </button>
          <button
            onClick={() => handleTabChange('usuario')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === 'usuario'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Usuário
          </button>
        </div>

        {/* Mensagens */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Formulário de Empresa */}
        {activeTab === 'empresa' && (
          <form onSubmit={handleCadastroEmpresa} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome da Empresa
              </label>
              <input
                type="text"
                value={empresaForm.nome_empresa}
                onChange={(e) => setEmpresaForm({ ...empresaForm, nome_empresa: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CNPJ
              </label>
              <input
                type="text"
                value={empresaForm.cnpj}
                onChange={(e) => setEmpresaForm({ ...empresaForm, cnpj: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Setor
              </label>
              <input
                type="text"
                value={empresaForm.setor}
                onChange={(e) => setEmpresaForm({ ...empresaForm, setor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data de Criação (AAAA-MM-DD)
              </label>
              <input
                type="date"
                value={empresaForm.data_criacao}
                onChange={(e) => setEmpresaForm({ ...empresaForm, data_criacao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Corporativo
              </label>
              <input
                type="email"
                value={empresaForm.email_corporativo}
                onChange={(e) => setEmpresaForm({ ...empresaForm, email_corporativo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Senha Corporativa
              </label>
              <input
                type="password"
                value={empresaForm.senha_corporativa}
                onChange={(e) => setEmpresaForm({ ...empresaForm, senha_corporativa: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Empresa'}
            </button>
          </form>
        )}

        {/* Formulário de Usuário */}
        {activeTab === 'usuario' && (
          <form onSubmit={handleCadastroUsuario} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome do Usuário
              </label>
              <input
                type="text"
                value={usuarioForm.nome_usuario}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, nome_usuario: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={usuarioForm.email}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={usuarioForm.senha}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, senha: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Empresa
              </label>
              <select
                value={usuarioForm.nm_empresa}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, nm_empresa: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Selecione uma empresa</option>
                {loadingEmpresas ? (
                  <option disabled>Carregando...</option>
                ) : (
                  empresas.map((empresa) => (
                    <option key={empresa} value={empresa}>
                      {empresa}
                    </option>
                  ))
                )}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          Já tem conta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Fazer login
          </button>
        </p>
      </div>
    </div>
  );
}
