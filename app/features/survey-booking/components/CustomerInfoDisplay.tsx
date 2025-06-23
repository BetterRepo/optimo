import React from 'react';
import { SurveyFormData } from '../types/FormData';
import CustomerLocationBadge from './CustomerLocationBadge';

interface CustomerInfoDisplayProps {
  formData: SurveyFormData;
  showName?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showAddress?: boolean;
  asLocationBadge?: boolean;
  className?: string;
}

export const CustomerInfoDisplay: React.FC<CustomerInfoDisplayProps> = ({
  formData,
  showName = true,
  showEmail = false,
  showPhone = false,
  showAddress = true,
  asLocationBadge = true,
  className = '',
}) => {
  // If showing as a badge, use the CustomerLocationBadge component
  if (asLocationBadge) {
    return <CustomerLocationBadge formData={formData} className={className} />;
  }

  // Otherwise show as separate elements
  const fullName = showName ? `${formData.firstName || ''} ${formData.lastName || ''}`.trim() : '';
  const email = showEmail && formData.email ? formData.email : '';
  const phone = showPhone && formData.phone ? formData.phone : '';
  const address = showAddress 
    ? `${formData.streetAddress || ''}, ${formData.city || ''}, ${formData.state || ''} ${formData.postalCode || ''}`.trim() 
    : '';

  // Don't render if no data to show
  if (!fullName && !email && !phone && !address) return null;

  return (
    <div className={`flex flex-col ${className}`}>
      {fullName && (
        <div className="flex items-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm text-gray-700 dark:text-gray-300">{fullName}</span>
        </div>
      )}
      
      {email && (
        <div className="flex items-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-700 dark:text-gray-300">{email}</span>
        </div>
      )}
      
      {phone && (
        <div className="flex items-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-sm text-gray-700 dark:text-gray-300">{phone}</span>
        </div>
      )}
      
      {address && (
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-gray-700 dark:text-gray-300">{address}</span>
        </div>
      )}
    </div>
  );
};

export default CustomerInfoDisplay; 