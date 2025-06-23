import React from 'react';
import { DatePicker } from '../DatePicker';
import { SlotList } from '../SlotList';
import { SurveyFormData } from '../../types/FormData';
import { CustomerLocationDisplay } from '../CustomerLocationDisplay';

interface EnhancedTimeSlotSectionProps {
  formData: SurveyFormData;
  showSlots: boolean;
  loading: boolean;
  errorMessage: string;
  onDateSelect: (date: Date | undefined) => void;
  availableSlots: any[];
  selectedSlot: { value: string; reservationId: string } | null;
  onSlotSelect: (value: string, reservationId: string) => void;
}

export const EnhancedTimeSlotSection: React.FC<EnhancedTimeSlotSectionProps> = ({
  formData,
  showSlots,
  loading,
  errorMessage,
  onDateSelect,
  availableSlots,
  selectedSlot,
  onSlotSelect
}) => {
  // Function to determine if error message should be shown
  const shouldShowErrorMessage = (message: string, formData: SurveyFormData) => {
    if (!message) return false;
    
    // Don't show error messages for dates already selected in the date picker
    if (formData && 'date' in formData && formData.date && message.includes('tomorrow is not available')) {
      // Get the current PST date
      const pstFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
      
      const pstDateStr = pstFormatter.format(new Date());
      const pstDate = new Date(pstDateStr);
      
      // If selected date is at least 2 days from today (PST), don't show the message
      const twoDaysLater = new Date(pstDate);
      twoDaysLater.setDate(pstDate.getDate() + 2);
      
      const selectedDate = new Date(formData.date as string);
      if (selectedDate >= twoDaysLater) {
        return false;
      }
    }
    
    return true;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Select a Time Slot
      </h3>
      <div className="text-gray-600 dark:text-gray-400 mb-6">
        <p>Select your preferred date and time for the survey.</p>
        
        {/* Cutoff time notice */}
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-amber-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Booking Cutoff Time: 5:00 PM PST</p>
              <p className="text-sm mt-1">
                Next-day appointments are not available after 5:00 PM PST. If you're booking after the cutoff time, 
                the earliest available date will be 2 days out.
              </p>
            </div>
          </div>
        </div>
      </div>

      {formData && formData.streetAddress && (
        <div className="mb-6">
          <CustomerLocationDisplay formData={formData} />
        </div>
      )}

      <div className="grid sm:grid-cols-2">
        <div className="pt-10 col-span-1 grid place-items-center h-full">
          <DatePicker onSelect={onDateSelect} />
        </div>
        <div className="slots-container mt-6 col-span-1">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : shouldShowErrorMessage(errorMessage, formData) ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-center">
              <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
              <button 
                className="mt-2 px-4 py-1 bg-[#195061] hover:bg-[#143e4e] text-white rounded-md text-sm"
                onClick={() => onDateSelect(undefined)}
              >
                Pick Another Date
              </button>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Please select a date
              </p>
            </div>
          ) : (
            <SlotList
              availableSlots={availableSlots}
              selectedSlot={selectedSlot}
              handleSlotSelect={onSlotSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedTimeSlotSection; 