import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useThemeContext } from '../context/ThemeContext';
import { storageUtils } from '../services/api';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useThemeContext();
  const location = useLocation();
  
  // Verificar se usuário está logado
  const [userType, setUserType] = useState<'empresa' | 'usuario' | null>(null);

  useEffect(() => {
    const empresaId = storageUtils.getEmpresaId();
    const usuarioId = storageUtils.getUsuarioId();
    
    if (empresaId) {
      setUserType('empresa');
    } else if (usuarioId) {
      setUserType('usuario');
    } else {
      setUserType(null);
    }
  }, [location]); // Recalcula quando a rota muda

  // Links dinâmicos baseado no tipo de usuário
  const getNavLinks = () => {
    const baseLinks = [
      { to: '/', label: 'Home' },
    ];

    // Se estiver logado como empresa
    if (userType === 'empresa') {
      return [
        ...baseLinks,
        { to: '/empresa/dashboardEmpresa', label: 'Dashboard' },
        { to: '/integrantes', label: 'Integrantes' },
        { to: '/faq', label: 'FAQ' },
      ];
    }
    
    // Se estiver logado como usuário
    if (userType === 'usuario') {
      return [
        ...baseLinks,
        { to: '/usuario/dashboardUsuario', label: 'Dashboard' },
        { to: '/integrantes', label: 'Integrantes' },
        { to: '/faq', label: 'FAQ' },
      ];
    }

    // Se não estiver logado
    return [
      ...baseLinks,
      { to: '/login', label: 'Login' },
      { to: '/cadastro', label: 'Cadastro' },
      { to: '/integrantes', label: 'Integrantes' },
      { to: '/faq', label: 'FAQ' },
    ];
  };

  const navLinks = getNavLinks();

  // Função para verificar se o link está ativo
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">LU</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg text-gray-900 dark:text-white">
              LevelUp Work
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium transition-all px-3 py-2 rounded-lg ${
                  isActiveLink(link.to)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Alternar tema"
              title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-900 dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1 border-t border-gray-200 dark:border-gray-800 pt-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  isActiveLink(link.to)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};