import { createContext, useContext } from 'react';

// Definição dos tipos de tema disponíveis
export type Theme = 'light' | 'dark';

// Interface que define a estrutura do contexto de tema
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Criação do contexto com valor inicial undefined
// Isso força o uso do Provider e permite melhor detecção de erros
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook customizado para facilitar o uso do contexto
// Garante que o contexto seja usado apenas dentro do ThemeProvider
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error(
      'useThemeContext deve ser usado dentro de um ThemeProvider. ' +
      'Certifique-se de envolver seu componente com <ThemeProvider>.'
    );
  }
  
  return context;
};
