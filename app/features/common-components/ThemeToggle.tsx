"use client";

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  isSpanish: boolean;
  toggleLanguage: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isSpanish, toggleLanguage }) => {
  const [isDark, setIsDark] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const salesKnowledgeBaseUrl = "https://www.notion.so/better-earth/Survey-Booking-with-Optimo-17ef51ba750180e68a45e945a0ad058a";

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <a
        href={salesKnowledgeBaseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title="Sales Knowledge Base"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700 dark:text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </a>
      
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                   hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                   flex items-center gap-2"
          aria-label="Select language"
        >
          <svg 
            className="h-5 w-5 text-gray-700 dark:text-gray-200" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          <span className="font-inter text-sm font-medium text-gray-700 dark:text-gray-200">
           
          </span>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu">
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsDropdownOpen(false);
                }}
                className={`${
                  !isSpanish ? 'bg-gray-100 dark:bg-gray-600' : ''
                } w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2`}
                role="menuitem"
              >
                <img src="/Flag_of_the_United_States.svg.png" alt="English" className="w-6 h-4 object-cover rounded-sm" />
                English
              </button>
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsDropdownOpen(false);
                }}
                className={`${
                  isSpanish ? 'bg-gray-100 dark:bg-gray-600' : ''
                } w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2`}
                role="menuitem"
              >
                <img src="/Flag_of_Spain.svg.png" alt="Español" className="w-6 h-4 object-cover rounded-sm" />
                Español
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsDark(!isDark)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        ) : (
          <Moon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        )}
      </button>
    </div>
  );
};