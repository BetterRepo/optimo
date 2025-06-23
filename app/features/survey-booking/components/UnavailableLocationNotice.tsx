import React, { useState } from 'react';
import { Calendar } from '@/app/components/ui/calendar';

interface UnavailableLocationNoticeProps {
  address: string;
  reason?: string;
  onTryAnotherAddress: () => void;
  onUpdateFormData?: (data: Partial<any>) => void;
}

export const UnavailableLocationNotice: React.FC<UnavailableLocationNoticeProps> = ({
  address,
  reason,
  onTryAnotherAddress,
  onUpdateFormData,
}) => {
  const [preferredDates, setPreferredDates] = useState<Date[]>([]);

  // Handle date selection for preferred dates and automatically update parent
  const handlePreferredDateSelect = (date: Date | Date[]) => {
    let updatedDates: Date[] = [];
    
    if (Array.isArray(date)) {
      updatedDates = date;
      setPreferredDates(date);
    } else {
      // Toggle the date selection
      const dateExists = preferredDates.some(d => 
        d.getFullYear() === date.getFullYear() && 
        d.getMonth() === date.getMonth() && 
        d.getDate() === date.getDate()
      );
      
      if (dateExists) {
        updatedDates = preferredDates.filter(d => 
          !(d.getFullYear() === date.getFullYear() && 
            d.getMonth() === date.getMonth() && 
            d.getDate() === date.getDate())
        );
      } else {
        if (preferredDates.length < 3) { // Limit to 3 preferred dates
          updatedDates = [...preferredDates, date];
        } else {
          updatedDates = preferredDates;
        }
      }
      
      setPreferredDates(updatedDates);
    }
    
    // Automatically update parent component with the selected dates
    if (onUpdateFormData) {
      // Format dates to ISO strings
      const formattedDates = updatedDates.map(date => date.toISOString().split('T')[0]);
      
      onUpdateFormData({
        preferredSurveyDates: formattedDates,
        hasPreferredDates: formattedDates.length > 0
      });
    }
  };

  // Function to disable weekends
  const disableWeekends = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  return (
    <div className="mt-6 p-5 bg-white border border-red-200 rounded-lg shadow-md" data-unavailable-notice="true">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops, it looks like we ran into a problem
        </h3>
        
        <p className="text-gray-600 mb-2 max-w-lg">
          We&apos;re having difficulty finding available appointments for:
        </p>
        
        <div className="p-3 bg-gray-50 rounded-md mb-4 w-full max-w-md">
          <p className="font-medium text-gray-800">{address}</p>
        </div>
        
        {reason ? (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md w-full max-w-md">
            <p className="text-yellow-800 font-medium">{reason}</p>
          </div>
        ) : (
          <p className="text-gray-600 mb-4 max-w-lg">
            This could be due to an issue with the address or because there are no available time slots in this area.
          </p>
        )}
        
        {!reason && (
          <ul className="text-left text-gray-600 mb-6 space-y-2 max-w-md">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              This location is outside our service area
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              All available appointment times have been booked
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              There may be a technical issue with our scheduling system
            </li>
          </ul>
        )}
        
        <div className="w-full max-w-md mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <p className="text-blue-800 dark:text-blue-200 font-medium text-sm">
              Please select up to 3 preferred weekdays (no weekends). Our team will contact you to schedule a survey on one of your selected dates.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <Calendar
              mode="multiple"
              selected={preferredDates}
              onSelect={(days) => {
                if (days) handlePreferredDateSelect(days);
              }}
              disabled={(date) => {
                // Disable past dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const twoMonthsFromNow = new Date();
                twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
                
                // Disable weekends and dates outside 2-month range
                return date < today || date > twoMonthsFromNow || disableWeekends(date);
              }}
              className="rounded-md"
            />
          </div>
          
          {preferredDates.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Your Selected Dates:</h4>
              <ul className="space-y-1">
                {preferredDates.map((date, index) => (
                  <li key={index} className="text-gray-600">
                    {date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-center mt-4">
            <button
              onClick={onTryAnotherAddress}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#195061] hover:bg-[#154455] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#195061]"
            >
              Try Another Address
            </button>
          </div>
          
          {preferredDates.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md w-full max-w-md">
              <p className="text-green-800 font-medium text-sm">
                Thank you! Our team will contact you to schedule your survey on one of your preferred dates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnavailableLocationNotice; 