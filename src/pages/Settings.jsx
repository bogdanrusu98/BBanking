import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../hooks/ThemeContext';
const Settings = () => {
  const { theme, toggleTheme } = useTheme(); // Folosim hook-ul pentru a obține tema și funcția de toggle

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-700 rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="flex items-center justify-between">
        <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full focus:outline-none"
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
