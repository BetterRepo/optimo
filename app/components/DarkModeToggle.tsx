import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: (isDarkMode: boolean) => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    onToggle(newMode);
    
    // Apply dark mode to html element for global styles
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 
               hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-gray-700 dark:text-gray-200" />
      ) : (
        <Moon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
      )}
    </button>
  );
};

export default DarkModeToggle; 