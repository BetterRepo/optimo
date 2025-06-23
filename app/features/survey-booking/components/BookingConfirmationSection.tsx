import React from 'react';
import { SurveyFormData } from '../types/FormData';
import CustomerLocationBadge from './CustomerLocationBadge';

interface BookingConfirmationSectionProps {
  formData: SurveyFormData;
  selectedDate?: string;
  selectedTimeSlot?: string;
}

export const BookingConfirmationSection: React.FC<BookingConfirmationSectionProps> = ({
  formData,
  selectedDate,
  selectedTimeSlot,
}) => {
  // Only render if at least date or time slot is selected
  if (!selectedDate && !selectedTimeSlot) return null;

  return (
    <div className="mt-6 mb-8 border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Booking Confirmation</h3>
      
      <div className="flex flex-col space-y-3">
        {selectedDate && (
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#195061]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Date: <span className="font-semibold text-[#195061] dark:text-[#83b5c3]">{selectedDate}</span>
              </p>
            </div>
          </div>
        )}
        
        {selectedTimeSlot && (
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#195061]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Time Slot: <span className="font-semibold text-[#195061] dark:text-[#83b5c3]">{selectedTimeSlot}</span>
              </p>
            </div>
          </div>
        )}
        
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#195061]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Location: <span className="font-semibold text-gray-800 dark:text-gray-200">
                {formData.firstName && formData.lastName
                  ? `${formData.firstName} ${formData.lastName} - `
                  : ''
                }
                {formData.streetAddress}, {formData.city}, {formData.state} {formData.postalCode}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gradient-to-r from-[#195061]/10 to-[#195061]/5 border-l-4 border-[#195061] rounded-md">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Please verify that all details are correct before proceeding with your booking.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmationSection; 