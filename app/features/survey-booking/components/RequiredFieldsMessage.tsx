import React from 'react';

export const RequiredFieldsMessage: React.FC = () => {
  return (
    <div className="my-4 p-4 bg-gradient-to-r from-red-50 to-red-50 border-l-4 border-red-500 rounded-md shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            Please complete all required fields to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequiredFieldsMessage; 