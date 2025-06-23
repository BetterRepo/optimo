import React from 'react';

interface SubmitButtonProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  errorMessage?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  isSubmitting,
  errorMessage,
}) => {
  return (
    <div className="mt-8">
      {errorMessage && (
        <div className="p-3 mb-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-800/50 border-l-3 border-red-400 dark:border-red-500 rounded shadow-sm flex items-center">
          <span className="mr-2 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </span>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{errorMessage}</p>
        </div>
      )}
      <div className="flex justify-center">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="relative px-8 py-2.5 text-base font-medium text-white
                   bg-gradient-to-r from-green-500 to-emerald-600
                   hover:from-green-400 hover:to-emerald-500
                   rounded-lg shadow
                   transform transition-all duration-200 ease-in-out hover:translate-y-[-1px]
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   dark:focus:ring-offset-gray-800
                   w-auto max-w-xs"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </div>
          ) : (
            'Submit & Schedule Survey'
          )}
        </button>
      </div>
    </div>
  );
}; 