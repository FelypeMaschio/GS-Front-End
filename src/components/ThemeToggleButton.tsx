import { Moon, Sun } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';

/**
 * ThemeToggleButton - Componente reutilizável para alternar o tema
 * 
 * Este componente pode ser usado em qualquer lugar da aplicação
 * para fornecer um botão de alternância de tema.
 * 
 * Exemplo de uso:
 * ```tsx
 * import { ThemeToggleButton } from './components/ThemeToggleButton';
 * 
 * function MyComponent() {
 *   return (
 *     <div>
 *       <ThemeToggleButton />
 *     </div>
 *   );
 * }
 * ```
 */
export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md"
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};
