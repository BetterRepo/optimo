'use client';

import { useState, useEffect, useRef } from 'react';
import { SalesRep } from '../utils/salesRepData';

interface SalesRepAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  id?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export default function SalesRepAutocomplete({
  value,
  onChange,
  onBlur,
  id,
  placeholder = 'Enter sales representative email',
  className = '',
  required = false,
  error = false,
  errorMessage = '',
}: SalesRepAutocompleteProps) {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SalesRep[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  // Load sales rep data from API
  useEffect(() => {
    const loadSalesReps = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/sales-reps');
        if (response.ok) {
          const data = await response.json();
          setSalesReps(data);
        }
      } catch (error) {
        console.error('Error loading sales rep data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSalesReps();
  }, []);

  // Handle input change and filter suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    onChange(userInput);

    // Filter suggestions based on input
    if (userInput.trim() === '') {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = salesReps.filter(
      (rep) =>
        rep.companyEmail?.toLowerCase().includes(userInput.toLowerCase()) ||
        rep.fullName?.toLowerCase().includes(userInput.toLowerCase()) ||
        rep.salesCompanyName?.toLowerCase().includes(userInput.toLowerCase())
    );

    // Sort by relevance - emails that start with the input first
    filtered.sort((a, b) => {
      const aStartsWithEmail = a.companyEmail?.toLowerCase().startsWith(userInput.toLowerCase());
      const bStartsWithEmail = b.companyEmail?.toLowerCase().startsWith(userInput.toLowerCase());
      
      if (aStartsWithEmail && !bStartsWithEmail) return -1;
      if (!aStartsWithEmail && bStartsWithEmail) return 1;
      
      // Then sort by name
      return a.fullName?.localeCompare(b.fullName || '') || 0;
    });

    setFilteredSuggestions(filtered.slice(0, 10)); // Limit to top 10 matches
    setShowSuggestions(true);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (email: string) => {
    onChange(email);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle blur event - close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle blur event for validation
  const handleBlur = () => {
    // Short delay to allow suggestion clicking
    setTimeout(() => {
      if (onBlur) {
        onBlur(value);
      }
    }, 200);
  };

  // Base input style
  const baseInputClass = `p-2 border rounded-md w-full 
                    focus:outline-none focus:ring-2
                    transition-colors duration-200`;
                    
  // Error or normal styling
  const inputClass = error
    ? `${baseInputClass} border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500`
    : `${baseInputClass} border-gray-300 dark:border-gray-600 focus:ring-blue-500 
       bg-white dark:bg-[#3A3B3C] dark:text-white`;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="email"
        id={id}
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`${inputClass} ${className}`}
        placeholder={placeholder}
        required={required}
        aria-invalid={error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {error && errorMessage && (
        <div 
          id={`${id}-error`}
          className="mt-2 px-3 py-2 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-200 border-l-4 border-red-500 rounded"
        >
          ⚠️ {errorMessage}
        </div>
      )}
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionBoxRef}
          className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {filteredSuggestions.map((rep, index) => (
              <li 
                key={index}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex flex-col"
                onClick={() => handleSelectSuggestion(rep.companyEmail)}
              >
                <span className="font-medium text-blue-600 dark:text-blue-400">{rep.companyEmail}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {rep.fullName} {rep.salesCompanyName ? `· ${rep.salesCompanyName}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 