import React from 'react';

interface AlternativeFormNoticeProps {
  alternativeFormUrl?: string;
}

export const AlternativeFormNotice: React.FC<AlternativeFormNoticeProps> = ({ 
  alternativeFormUrl = "#" 
}) => {
  return (
    <div className="my-4 p-4 bg-gradient-to-r from-amber-50 to-amber-50 border-l-4 border-amber-500 rounded-md shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5 text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-800">
            If you experience any issues with this form, please use our <a href={alternativeFormUrl} className="font-medium underline hover:no-underline">alternative form</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlternativeFormNotice; 