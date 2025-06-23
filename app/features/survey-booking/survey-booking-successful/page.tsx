'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BookingRecap {
  formData: any;
  selectedSlot: {
    value: string;
    reservationId: string;
  };
  selectedDate: Date | null;
  actualSurveyDateStr: string | null;
  orderNo: string;
  slotDate?: string;
}

export default function Page() {
  const [recap, setRecap] = useState<BookingRecap | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [urlDateParam, setUrlDateParam] = useState<string | null>(null);

  // Add debugging useEffect to log date information when recap changes
  useEffect(() => {
    if (recap) {
      console.log("⭐ RECAP DATE INFO:", {
        slotDate: recap.slotDate, 
        slotValue: recap.selectedSlot?.value,
        actualSurveyDateStr: recap.actualSurveyDateStr
      });
    }
  }, [recap]);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
    
    // Get date from URL query parameter if available
    const urlParams = new URLSearchParams(window.location.search);
    const dateFromUrl = urlParams.get('date');
    console.log("Date from URL parameter:", dateFromUrl);
    
    // Store the URL date parameter in state for direct access in the component
    if (dateFromUrl) {
      setUrlDateParam(dateFromUrl);
    }
    
    const storedRecap = localStorage.getItem('bookingRecap');
    console.log("Loading booking recap from localStorage:", storedRecap ? "Found" : "Not found");
    
    if (storedRecap) {
      try {
        const parsedRecap = JSON.parse(storedRecap);
        console.log("Parsed booking recap FULL DATA:", parsedRecap);
        console.log("Important date fields:", {
          selectedDate: parsedRecap.selectedDate,
          actualSurveyDateStr: parsedRecap.actualSurveyDateStr,
          slotDate: parsedRecap.slotDate,
          slotValue: parsedRecap.selectedSlot?.value
        });
        
        // Extract the date from the slot value if available
        if (parsedRecap.selectedSlot?.value) {
          try {
            const slotParts = parsedRecap.selectedSlot.value.split(" - ");
            const extractedSlotDate = slotParts[0]?.split("T")[0] || "";
            console.log("Extracted slotDate from selectedSlot.value:", extractedSlotDate);
            
            // Store the extracted date in the recap object
            if (extractedSlotDate && !parsedRecap.slotDate) {
              parsedRecap.slotDate = extractedSlotDate;
              console.log("Added slotDate to recap:", extractedSlotDate);
            }
          } catch (e) {
            console.error("Error extracting slotDate from selectedSlot.value:", e);
          }
        }
        
        // ALWAYS update the recap with the date from URL if available
        if (dateFromUrl) {
          console.log("Updating recap with date from URL:", dateFromUrl);
          
          // ONLY use URL date if no existing data is available
          if (!parsedRecap.slotDate && !parsedRecap.actualSurveyDateStr) {
            console.log("No existing date data, using URL date");
            parsedRecap.actualSurveyDateStr = dateFromUrl;
            parsedRecap.slotDate = dateFromUrl;
            
            // If direct URL parameter testing, create a fake slot value that matches the URL date
            // This ensures proper display in test/debug scenarios
            if (!parsedRecap.selectedSlot || !parsedRecap.selectedSlot.value) {
              console.log("Creating test slot value from URL date");
              parsedRecap.selectedSlot = parsedRecap.selectedSlot || {};
              
              // Format: 2026-01-01T09:00:00 - 2026-01-01T13:00:00
              const timeSlot = `${dateFromUrl}T09:00:00 - ${dateFromUrl}T13:00:00`;
              parsedRecap.selectedSlot.value = timeSlot;
            }
          } else {
            console.log("Existing date data found, NOT overriding with URL date");
            console.log("Keeping original dates:", {
              slotDate: parsedRecap.slotDate,
              actualSurveyDateStr: parsedRecap.actualSurveyDateStr
            });
          }
        }
        
        setRecap(parsedRecap);
      } catch (error) {
        console.error("Error parsing booking recap:", error);
      }
    } else if (dateFromUrl) {
      // If we have a URL date but no recap, create a minimal recap for testing/debugging
      console.log("No recap found, creating minimal recap from URL date");
      const timeSlot = `${dateFromUrl}T09:00:00 - ${dateFromUrl}T13:00:00`;
      
      const testRecap: BookingRecap = {
        formData: {
          firstName: "Test",
          lastName: "User",
          streetAddress: "123 Test St",
          city: "Test City",
          state: "CA",
          postalCode: "12345",
          warehouse: "Testing Area",
          projectName: "URL Test Project"
        },
        selectedSlot: {
          value: timeSlot,
          reservationId: "test-reservation"
        },
        selectedDate: null,
        actualSurveyDateStr: dateFromUrl,
        orderNo: "TEST-ORDER",
        slotDate: dateFromUrl
      };
      
      setRecap(testRecap);
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const currentYear = new Date().getFullYear();

  // Animation classes
  const fadeIn = "animate-[fadeIn_0.6s_ease-in-out]";
  const slideUp = "animate-[slideUp_0.5s_ease-in-out]";
  const scaleIn = "animate-[scaleIn_0.5s_ease-in-out]";

  // Format date for better display - prioritize slotDate over other sources
  const formatDate = (slotValue?: string, actualDate?: string | null) => {
    console.log("DEBUG: formatDate called with", { slotValue, actualDate });
    console.log("DEBUG: Available date sources", { 
      urlDateParam, 
      slotDate: recap?.slotDate,
      actualSurveyDateStr: recap?.actualSurveyDateStr
    });
    
    // Helper function to format date in US time regardless of user's timezone
    const formatDateInUSTimezone = (dateStr: string) => {
      try {
        // Parse the date string (YYYY-MM-DD)
        const [year, month, day] = dateStr.split('-').map(Number);
        
        // Create a date object with the specified components in US Eastern Time
        // Note: We're using UTC and then adjusting to approximate US Eastern time
        // This is a simplification that works for display purposes
        const date = new Date(Date.UTC(year, month - 1, day));
        
        // Adjust for US Eastern Time (UTC-4 or UTC-5 depending on DST)
        // We're using a fixed offset for simplification
        const usDate = new Date(date.getTime() - 4 * 60 * 60 * 1000);
        
        // Format the date using US conventions - WITHOUT the day of week
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"];
        
        return `${monthNames[month - 1]} ${day}, ${year}`;
      } catch (e) {
        console.error("Error formatting date in US timezone:", e, dateStr);
        return dateStr || '';
      }
    };
    
    // First priority: use slotDate from the recap data if available
    if (recap?.slotDate) {
      try {
        console.log("DEBUG: Using slotDate from recap:", recap.slotDate);
        return formatDateInUSTimezone(recap.slotDate);
      } catch (e) {
        console.error("Error using slotDate from recap:", e);
      }
    }
    
    // Second priority: extract from slot value
    if (slotValue) {
      try {
        // Extract the date from the first part of the slot value (e.g. "2026-01-02T13:00:00 - 2026-01-02T17:00:00")
        const firstDatePart = slotValue.split(' - ')[0]; // e.g. "2026-01-02T13:00:00"
        const datePart = firstDatePart.split('T')[0]; // e.g. "2026-01-02"
        
        console.log("DEBUG: Parsed datePart from slot:", datePart);
        return formatDateInUSTimezone(datePart);
      } catch (e) {
        console.error("Error formatting slot date:", e, slotValue);
      }
    }
    
    // Fallback to URL parameter or stored date string if slot parsing fails
    if (urlDateParam || actualDate) {
      const dateToUse = urlDateParam || actualDate;
      try {
        return formatDateInUSTimezone(dateToUse!);
    } catch (e) {
        console.error("Error formatting fallback date:", e, dateToUse);
        // Fall back to the original date string if there's an error
        return dateToUse || '';
      }
    }
    
    return 'Date not available';
  };
  
  // Format time for better display - show time range from slot value
  const formatTime = (slotValue?: string) => {
    if (!slotValue) return '';
    
    try {
      // Parse the time range from the slot value (e.g. "2026-01-02T13:00:00 - 2026-01-02T17:00:00")
      const [startDateTime, endDateTime] = slotValue.split(' - ');
      
      // Extract times from both parts
      const startTimePart = startDateTime.split('T')[1]?.substring(0, 5); // e.g. "13:00"
      const endTimePart = endDateTime.split('T')[1]?.substring(0, 5);     // e.g. "17:00"
      
      if (!startTimePart || !endTimePart) return '';
      
      // Format start time
      const startHour = parseInt(startTimePart.split(':')[0]);
      const startMinute = startTimePart.split(':')[1];
      const startPeriod = startHour >= 12 ? 'PM' : 'AM';
      const formattedStartHour = startHour % 12 === 0 ? 12 : startHour % 12;
      
      // Format end time
      const endHour = parseInt(endTimePart.split(':')[0]);
      const endMinute = endTimePart.split(':')[1];
      const endPeriod = endHour >= 12 ? 'PM' : 'AM';
      const formattedEndHour = endHour % 12 === 0 ? 12 : endHour % 12;
      
      // Return a nicely formatted time range
      return `${formattedStartHour}:${startMinute} ${startPeriod} - ${formattedEndHour}:${endMinute} ${endPeriod}`;
    } catch (e) {
      console.error("Error formatting time:", e, slotValue);
      return 'Time not available';
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto w-full bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Background container */}
      <div className="relative w-full bg-[url('/images/be-2.png')] bg-cover bg-center bg-no-repeat">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60" />

        {/* Content container with proper scrolling */}
        <div className="relative w-full py-12 pb-24 px-4 flex flex-col items-center">
          <div className={`w-full max-w-3xl mb-12 ${fadeIn}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Success header with gradient - less prominent */}
              <div className="bg-gradient-to-r from-green-500/90 to-teal-500/90 p-5 text-center">
                <div className={`flex justify-center mb-2 ${scaleIn}`} style={{ animationDelay: '0.2s' }}>
                  <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h1 className={`text-xl font-medium text-white ${fadeIn}`} style={{ animationDelay: '0.4s' }}>
                  Your Project and Survey have been successfully submitted!
                </h1>
              </div>

              <div className="p-8">
                {recap && (
                  <div className={`mb-6 ${slideUp}`} style={{ animationDelay: '0.5s' }}>
                    {/* Add project name heading at the top */}
                    {recap.formData.projectName && (
                      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                          Project: {recap.formData.projectName}
                        </h2>
                      </div>
                    )}
                    
                    <div className="flex items-center mb-4">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full mr-3"></div>
                      <h2 className="text-lg  text-gray-800 dark:text-white">Appointment Details</h2>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                            <p className="text-base  text-gray-900 dark:text-gray-100">
                              {recap.formData.firstName} {recap.formData.lastName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Project</p>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                              {recap.formData.projectName || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                            <p className="text-base  text-gray-900 dark:text-gray-100">
                              {recap.formData.streetAddress}, {recap.formData.city}, {recap.formData.state} {recap.formData.postalCode}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Area</p>
                            <p className="text-base  text-gray-900 dark:text-gray-100">{recap.formData.warehouse}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Appointment</p>
                            <p className="text-base text-gray-900 dark:text-gray-100">
                              {/* Date display: prioritize slotDate */}
                              {formatDate(recap.selectedSlot.value, recap.actualSurveyDateStr)}
                              
                              {/* Time display */}
                              {' from '}
                              {formatTime(recap.selectedSlot.value)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`space-y-6 ${fadeIn}`} style={{ animationDelay: '0.7s' }}>
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                      <span className="text-indigo-600 dark:text-indigo-400 text-lg font-medium">?</span>
                    </div>
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white">What Happens Next?</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-md border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
                      <h3 className="text-base font-medium text-blue-800 dark:text-blue-300 mb-4 pl-4">For Your Customer:</h3>
                      <ul className="space-y-3 list-none pl-4">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">
                            We will send a text and email to the customer welcoming them to Better Earth. In that email and text, they will receive the link to their customer portal. Make sure to send customers to their portal to stay updated on their project!
                          </span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">
                            Next, we will assign the customer a project manager who will be the primary point of contact for the entire project.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 shadow-md border border-green-100 dark:border-green-900/30 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-500 to-teal-500"></div>
                      <h3 className="text-base font-medium text-green-800 dark:text-green-300 mb-4 pl-4">For You:</h3>
                      <ul className="space-y-3 list-none pl-4">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">
                            We will text you every step of the way to keep you in the loop about your project.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">
                            We will scrub the project you have submitted and let you know if any action is needed for the project to move forward without delays.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">
                            Once the survey is completed and the scrub is approved, be on the lookout for the Scope of Work for your project confirming the final project details.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      To find your project manager and stay up to date on your project, we recommend you check out:
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mb-2">
                      <Link href="https://pangea.betterearth.solar/" 
                        className="inline-flex items-center px-5 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-md transition duration-200 transform hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pangea
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add animation keyframes and ensure proper scrolling */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        /* Ensure proper scrolling behavior */
        html, body {
          height: 100%;
          min-height: 100%;
          margin: 0;
          padding: 0;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Set a specific min-height to ensure content is visible */
        .min-h-screen {
          min-height: 100vh;
          height: auto;
          position: relative;
          overflow-y: visible;
        }
        
        /* Add extra padding for mobile devices */
        @media screen and (max-width: 768px) {
          .pb-24 {
            padding-bottom: 8rem !important;
          }
        }
        
        /* Add even more padding for shorter screens */
        @media screen and (max-height: 700px) {
          .pb-24 {
            padding-bottom: 12rem !important;
          }
        }
      `}</style>
    </div>
  );
}

