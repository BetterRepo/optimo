import React from 'react';

interface LanguageToggleProps {
  isSpanish: boolean;
  toggleLanguage: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ isSpanish, toggleLanguage }) => {
  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle Language"
    >
      {isSpanish ? 'EN' : 'ES'}
    </button>
  );
}; 