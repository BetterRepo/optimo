import React, { useState, useEffect, useCallback } from 'react';
import { DatePicker } from '../DatePicker';
import { TexasDatePicker } from '../TexasDatePicker';
import { SlotList } from '../SlotList';
import { SurveyFormData } from '../../types/FormData';
import BookingSummaryCard from '../BookingSummaryCard';
import ContactSupportModal from '../ContactSupportModal';
import { Calendar } from '@/app/components/ui/calendar';
import UnavailableLocationNotice from '../../components/UnavailableLocationNotice';

interface TimeSlotSectionProps {
  formData: SurveyFormData;
  showSlots: boolean;
  loading: boolean;
  errorMessage: string;
  onDateSelect: (date: Date | undefined) => void;
  availableSlots: any[];
  selectedSlot: { value: string; reservationId: string } | null;
  onSlotSelect: (value: string, reservationId: string) => void;
  onUpdateFormData?: (data: Partial<SurveyFormData>) => void;
  resetAddressFields?: () => void;
}

export const TimeSlotSection: React.FC<TimeSlotSectionProps> = ({
  formData,
  showSlots,
  loading,
  errorMessage,
  onDateSelect,
  availableSlots,
  selectedSlot,
  onSlotSelect,
  onUpdateFormData,
  resetAddressFields,
}) => {
  // Format selected date for display if there is a selected slot
  const selectedDate = selectedSlot ? availableSlots.find(slot => slot.value === selectedSlot.value)?.date : '';
  
  // State to track searching attempts
  const [searchAttempts, setSearchAttempts] = useState(0);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [preferredDates, setPreferredDates] = useState<Date[]>([]);
  
  // Address string for display
  const addressString = `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.postalCode}`;

  // Determine if we should show Texas specific scheduling
  const isTexasWarehouse = formData.warehouse === 'Dallas, TX';

  // Reset search attempts when address changes
  useEffect(() => {
    console.log('Address changed, resetting counters');
    setSearchAttempts(0);
    setShowNoResultsMessage(false);
    setPreferredDates([]);
  }, [formData.streetAddress, formData.city, formData.state, formData.postalCode]);

  // Track ANY date selection attempts that result in no slots
  useEffect(() => {
    // Count any attempt that has finished loading
    // and resulted in no available slots
    if (!loading && availableSlots.length === 0 && showSlots) {
      console.log('No slots found, incrementing counter');
      setSearchAttempts(prev => {
        const newCount = prev + 1;
        console.log(`Attempt count: ${newCount}`);
        return newCount;
      });
    }
  }, [loading, availableSlots.length, showSlots]);

  // Separate effect to check attempt count and show message
  useEffect(() => {
    // Show message after 5 failed attempts
    if (searchAttempts >= 5 && !showNoResultsMessage) {
      console.log('Showing no results message after 5 attempts');
      setShowNoResultsMessage(true);
    }
  }, [searchAttempts, showNoResultsMessage]);

  // Update form data with preferred dates whenever they change
  useEffect(() => {
    if (preferredDates.length > 0 && onUpdateFormData) {
      // Format dates to ISO strings for the API
      const formattedDates = preferredDates.map(date => date.toISOString().split('T')[0]);
      
      // Update the form data with preferred dates
      onUpdateFormData({
        preferredSurveyDates: formattedDates
      });
      
      console.log('Updated preferred survey dates:', formattedDates);
    }
  }, [preferredDates, onUpdateFormData]);

  // Handle 'Report Issue' click
  const handleReportIssue = useCallback(() => {
    setIsSupportModalOpen(true);
  }, []);

  // Handle 'Try Another Address' click
  const handleTryAnotherAddress = useCallback(() => {
    // Reset all address fields
    if (resetAddressFields) {
      resetAddressFields();
    }
    
    // Reset counters and error message
    setSearchAttempts(0);
    setShowNoResultsMessage(false);
    
    // Scroll to the top of the page for user to enter new address
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [resetAddressFields]);

  // Force increment counter for testing
  const forceIncrement = useCallback(() => {
    setSearchAttempts(prev => prev + 1);
  }, []);

  // Handle date selection for preferred dates
  const handlePreferredDateSelect = useCallback((date: Date | Date[]) => {
    if (Array.isArray(date)) {
      setPreferredDates(date);
    } else {
      setPreferredDates(prev => {
        // Toggle the date selection
        const dateExists = prev.some(d => 
          d.getFullYear() === date.getFullYear() && 
          d.getMonth() === date.getMonth() && 
          d.getDate() === date.getDate()
        );
        
        if (dateExists) {
          return prev.filter(d => 
            !(d.getFullYear() === date.getFullYear() && 
              d.getMonth() === date.getMonth() && 
              d.getDate() === date.getDate())
          );
        } else {
          return [...prev, date];
        }
      });
    }
  }, []);

  // Function to disable weekends
  const disableWeekends = useCallback((date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  }, []);

  // Function to determine if error message should be shown
  const shouldShowErrorMessage = (message: string, selectedDate: Date | null) => {
    // Don't show error messages for April 25th when it's been correctly selected
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      if (dateStr === '2025-04-25' && message.includes('tomorrow is not available')) {
        return false;
      }
    }
    
    // Don't show the "tomorrow is not available" message when user has already selected a valid date
    if (selectedDate && message.includes('tomorrow is not available')) {
      // Get the current PST date
      const pstFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
      
      const pstDateStr = pstFormatter.format(new Date());
      const pstDate = new Date(pstDateStr);
      
      // If selected date is at least 2 days from today (PST), the message is irrelevant
      const twoDaysLater = new Date(pstDate);
      twoDaysLater.setDate(pstDate.getDate() + 2);
      
      if (selectedDate >= twoDaysLater) {
        return false;
      }
    }
    
    return true;
  };

  return (
    <div>
      <hr className="my-6 h-px bg-gradient-to-r from-green-200/50 to-emerald-600/50 border-0 dark:from-green-500/30 dark:to-emerald-600/30" />
      <div className="w-full">
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-2xl text-center font-semibold text-gray-900 dark:text-white mb-2">
          Select Your Preferred Time
        </h2>
          {/* Debug info - now clickable to force increment for testing */}
        </div>

        {/* Show error message after 5 attempts or when error message is "Geocoder did not return an exact match" */}
        {(showNoResultsMessage || errorMessage.includes("Geocoder did not return an exact match")) ? (
          <UnavailableLocationNotice
            address={addressString}
            onTryAnotherAddress={handleTryAnotherAddress}
            onUpdateFormData={onUpdateFormData}
          />
        ) : (
          <>
            <div className="bg-gradient-to-r from-[#195061]/10 to-[#195061]/5 border-l-4 border-[#195061] rounded-md shadow-sm p-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#195061]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Please select any available slot you like. This reserves your preferred slot - you&apos;ll receive a specific 2-hour arrival window the evening before via text and email.
                    <span className="ml-1 text-red-600 font-medium">*</span>
                  </p>
                </div>
              </div>
            </div>

        <div className="grid sm:grid-cols-2">
          <div className="pt-10 col-span-1 grid place-items-center h-full">
                {/* Use the TexasDatePicker for Dallas warehouse, otherwise use regular DatePicker */}
                {isTexasWarehouse ? (
                  <TexasDatePicker 
                    onSelect={onDateSelect}
                    texasProximity={formData.texasProximity}
                    warehouse={formData.warehouse}
                  />
                ) : (
                  <DatePicker onSelect={onDateSelect} warehouse={formData.warehouse} />
                )}
          </div>
          <div className="slots-container mt-6 col-span-1">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : errorMessage && shouldShowErrorMessage(errorMessage, selectedDate) ? (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-center">
                    <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
                    <button 
                      className="mt-2 px-4 py-1 bg-[#195061] hover:bg-[#143e4e] text-white rounded-md text-sm"
                      onClick={() => onDateSelect(undefined)}
                    >
                      Pick Another Date
                    </button>
                    {searchAttempts >= 2 && (
                      <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Having trouble finding available dates? 
                          <button 
                            onClick={handleTryAnotherAddress}
                            className="ml-1 text-[#195061] hover:underline font-medium"
                          >
                            Try another address
                          </button>
                        </p>
                      </div>
                    )}
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
            
            {/* Booking summary card */}
            {selectedSlot && (
              <BookingSummaryCard 
                formData={formData} 
                selectedDate={selectedDate}
                selectedTimeSlot={selectedSlot.value} 
              />
            )}
          </>
        )}

        {/* Contact Support Modal */}
        <ContactSupportModal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
          address={addressString}
          userName={`${formData.firstName} ${formData.lastName}`.trim()}
          userEmail={formData.email}
          userPhone={formData.phone}
        />
      </div>
    </div>
  );
};
