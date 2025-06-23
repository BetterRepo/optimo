import React from 'react';
import { SurveyFormData } from '../types/FormData';

interface BookingSummaryCardProps {
  formData: SurveyFormData;
  selectedDate?: string;
  selectedTimeSlot?: string;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  formData,
  selectedDate,
  selectedTimeSlot,
}) => {
  // Only render if at least date or time slot is selected
  if (!selectedDate && !selectedTimeSlot) return null;

  return (
    <div className="mt-8 mb-8 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
      {/* Header */}
      <div className="bg-[#195061] text-white px-4 py-3">
        <h3 className="text-lg font-semibold">Booking Summary</h3>
        <p className="text-sm opacity-90">Please verify the details below</p>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date & Time Section */}
          <div className="border-b pb-3 md:border-b-0 md:border-r md:pr-4 md:pb-0 border-gray-200 dark:border-gray-700">
            <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Appointment Details</h4>
            
            <div className="space-y-2">
              {selectedDate && (
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#195061]/10 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#195061]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{selectedDate}</p>
                  </div>
                </div>
              )}
              
              {selectedTimeSlot && (
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#195061]/10 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#195061]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Time Slot</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{selectedTimeSlot}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Location Section */}
          <div className="pt-3 md:pt-0 md:pl-4">
            <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Location Details</h4>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-[#195061]/10 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#195061]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                {formData.firstName && formData.lastName && (
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {formData.firstName} {formData.lastName}
                  </p>
                )}
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {formData.streetAddress}
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {formData.city}, {formData.state} {formData.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#195061] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            You&apos;ll receive a confirmation email with a specific 2-hour arrival window the evening before your appointment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryCard; 