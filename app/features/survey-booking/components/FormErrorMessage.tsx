import React from 'react';

export const FormErrorMessage: React.FC = () => {
  return (
    <div className="my-4 py-4 px-6 bg-gray-50 rounded flex items-start">
      <svg className="h-5 w-5 text-red-500 flex-shrink-0 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <span className="text-gray-700">
        Please fill in all required fields: <span className="bg-blue-100 px-1">Time slot selection</span>
      </span>
    </div>
  );
};

export default FormErrorMessage; 