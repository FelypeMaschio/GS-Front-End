import React, { useState, useEffect, useCallback } from 'react';
import { ThemeContext, type Theme } from '../context/ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Função auxiliar para obter o tema inicial de forma síncrona
const getInitialTheme = (): Theme => {
  // 1. Tenta carregar o tema salvo no localStorage
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  
  // 2. Se não houver tema salvo, verifica a preferência do sistema
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // 3. Padrão: tema claro
  return 'light';
};

// Aplica o tema inicial diretamente no DOM antes da primeira renderização do React
// Isso evita o "flash" de tema claro/escuro e garante que a classe 'dark' esteja presente
// se o tema inicial for escuro.
const initialTheme = getInitialTheme();
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

/**
 * ThemeProvider - Componente que gerencia o estado do tema da aplicação
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // O estado inicial é o tema que já foi aplicado ao DOM
  const [theme, setTheme] = useState<Theme>(initialTheme);

  /**
   * Função que alterna entre os temas light e dark
   */
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      
      // Salva a preferência no localStorage para persistência
      localStorage.setItem('theme', newTheme);
      
      return newTheme;
    });
  }, []);

  /**
   * Efeito que aplica a classe 'dark' no elemento <html>
   * Este efeito só é executado quando o estado 'theme' muda, garantindo a alternância.
   */
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
