import React from 'react';
import { SurveyFormData } from '../types/FormData';

interface CustomerLocationDisplayProps {
  formData: SurveyFormData;
}

export const CustomerLocationDisplay: React.FC<CustomerLocationDisplayProps> = ({ formData }) => {
  const fullName = `${formData.firstName} ${formData.lastName}`.trim();
  const address = `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.postalCode}`.trim();
  
  // Only display the name if it's available
  const displayText = fullName 
    ? `${fullName} - ${address}`
    : address;
    
  return (
    <div className="flex items-center text-gray-700 dark:text-gray-300">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span className="text-sm font-medium">{displayText}</span>
    </div>
  );
};

export default CustomerLocationDisplay; 