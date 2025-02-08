import { useEffect, useState } from 'react';
import { initFlowbite } from 'flowbite';
import { FaSun, FaMoon } from 'react-icons/fa';

const Settings = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    initFlowbite();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="flex items-center justify-between">
        <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none"
        >
          {theme === 'dark' ? (
            <FaMoon className="text-yellow-400" />
          ) : (
            <FaSun className="text-orange-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;
