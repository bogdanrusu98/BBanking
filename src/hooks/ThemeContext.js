import React, { createContext, useContext, useState, useEffect } from 'react';

// Creăm contextul
const ThemeContext = createContext();

// Creăm un provider pentru a partaja tema
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Aplicăm tema global pe document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Salvăm tema în localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Creăm un hook pentru a consuma contextul
export const useTheme = () => {
  return useContext(ThemeContext);
};
