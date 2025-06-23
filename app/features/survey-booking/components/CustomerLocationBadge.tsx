import React from 'react';
import { SurveyFormData } from '../types/FormData';

interface CustomerLocationBadgeProps {
  formData: SurveyFormData;
  className?: string;
}

export const CustomerLocationBadge: React.FC<CustomerLocationBadgeProps> = ({ 
  formData,
  className = '' 
}) => {
  const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
  const address = `${formData.streetAddress || ''}, ${formData.city || ''}, ${formData.state || ''} ${formData.postalCode || ''}`.trim();
  
  // Only render if we have at least a name or address
  if (!fullName && !address) return null;

  // Only display the customer name with address if name is available
  const displayText = fullName 
    ? `${fullName} - ${address}`
    : address;

  return (
    <div className={`inline-flex items-center bg-gray-100 dark:bg-gray-700 rounded-full py-1 px-3 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#195061] mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-xs">
        {displayText}
      </span>
    </div>
  );
};

export default CustomerLocationBadge; 