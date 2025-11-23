import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { loginAPI, storageUtils } from '../services/api';

interface LoginProps {
  isEmpresa?: boolean;
}

export default function Login({ isEmpresa }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Determinar se é login de empresa ou usuário baseado na rota
  const isEmpresaLogin = isEmpresa !== undefined ? isEmpresa : location.pathname === '/login/empresa';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validação básica
      if (!formData.email || !formData.password) {
        setError('Preencha todos os campos');
        setLoading(false);
        return;
      }

      // Chamar API de login
      let response;
      if (isEmpresaLogin) {
        response = await loginAPI.loginEmpresa({
          email_login_empresa: formData.email,
          senha_login_empresa: formData.password,
        });
      } else {
        response = await loginAPI.loginUsuario({
          email_login_usuario: formData.email,
          senha_login_usuario: formData.password,
        });
      }

      // Verificar se houve erro
      if (response.error) {
        // Mensagens de erro personalizadas baseadas no status
        if (response.status === 401) {
          setError('Email ou senha inválidos.');
        } else if (response.status === 422) {
          setError('Tipo de login incorreto. Verifique se está usando o login correto (Empresa/Usuário).');
        } else {
          setError(`Erro ao fazer login: ${response.error}`);
        }
        setLoading(false);
        return;
      }

      // Verificar se recebeu o ID
      if (!response.data) {
        setError('Erro ao pocessar autenticação. Tente novamente.');
        setLoading(false);
        return;
      }

      // Salvar ID no localStorage e redirecionar
      const userId = response.data;
      console.log('Login bem-sucedido! ID recebido:', userId);

      if (isEmpresaLogin) {
        storageUtils.setEmpresaId(userId);
        console.log('ID da empresa salvo no localStorage:', userId);
        navigate('/empresa/dashboardEmpresa', { replace: true });
      } else {
        storageUtils.setUsuarioId(userId);
        console.log('ID do usuário salvo no localStorage:', userId);
        navigate('/usuario/dashboardUsuario', { replace: true });
      }

    } catch (err) {
      console.error('Erro durante o login:', err);
      setError('Erro inesperado ao processar autenticação. Tente novamente.');
      setLoading(false);
    }
  };

  // Se não especificado isEmpresa, mostrar seleção
  if (isEmpresa === undefined && location.pathname === '/login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-2xl">LU</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Bem-vindo
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Escolha como deseja fazer login
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/login/empresa')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Login Empresa
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/login/usuario')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Login Usuário
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Não tem conta?{' '}
                <button
                  onClick={() => navigate('/cadastro')}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Cadastre-se
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">LU</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bem-vindo de Volta
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEmpresaLogin ? 'Login da Empresa' : 'Login do Usuário'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Processando...' : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Não tem conta?{' '}
              <button
                onClick={() => navigate('/cadastro')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Cadastre-se
              </button>
            </p>
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Voltar para seleção de login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}