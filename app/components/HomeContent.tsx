import React, { useState, useEffect } from "react";
import { CustomerForm } from "../features/common-components/CustomerForm";
import { AddressForm } from "../features/common-components/AddressForm";
// import Header from "../features/common-components/Header"; // Component not found
import SurveyInformation from "../features/survey-booking/components/SurveyInformation";
import { SlotList } from "../features/survey-booking/components/SlotList";
import { DatePicker } from "../features/survey-booking/components/DatePicker";
// Update this path - we need to check where it actually exists
import { SecondaryContact } from "../features/survey-booking/components/SecondaryContact";
import { TenantContact } from "../features/survey-booking/components/TenantContact";
// import { ProjectQuestions } from "../features/survey-booking/components/ProjectQuestions"; // Component not found
import { driverMapping } from "../features/survey-booking/data/DriverLookupTable";
import type { Warehouse } from "../features/survey-booking/data/DriverLookupTable";

// Function to get warehouse-specific time windows
const getWarehouseTimeWindows = (warehouse: string) => {
  switch (warehouse) {
    case 'Phoenix, AZ':
      // Arizona gets custom time windows: 7am-11am and 10am-2pm only
      return [
        { twFrom: "07:00", twTo: "11:00" }, // 7am-11am slot
        { twFrom: "10:00", twTo: "14:00" }  // 10am-2pm slot
      ];
    default:
      // All other territories get the standard 3 time windows
      return [
        { twFrom: "07:30", twTo: "11:00" }, // 7:30am-11am slot
        { twFrom: "10:00", twTo: "14:00" }, // 10am-2pm slot  
        { twFrom: "13:00", twTo: "17:00" }  // 1pm-5pm slot
      ];
  }
};

// Define these types locally since we can't find the imported files
// Define ProjectQuestions component locally
const ProjectQuestions: React.FC<{formData: FormData, handleChange: (e: React.ChangeEvent<any>) => void}> = 
  ({formData, handleChange}) => <div>Project Questions Component</div>;

interface FormData {
  firstName: string;
  lastName: string;
  language: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  warehouse: string;
  hasSecondaryContact: boolean;
  secondaryContactName: string;
  secondaryContactRelationship: string;
  secondaryContactPhone: string;
  secondaryContactEmail: string;
  hasTenants: boolean;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  hasBatteries: boolean;
  designPreference: string;
  isSharedRoof: boolean;
  hasRecentConstruction: boolean;
  hasVaultedCeilings: boolean;
  stories: string;
  hasOngoingConstruction: boolean;
  ongoingConstructionDetails?: string;
  hasExistingSolar: boolean;
  hasHOA: boolean;
  hasHOAContact: boolean;
  hoaName?: string;
  hoaPhone?: string;
  hoaEmail?: string;
  hasOutsidePanel: boolean;
  hasBlockedAccess: boolean;
  gateAccessType: "yes" | "code" | "no" | "";
  gateCode?: string;
  // Add missing required properties
  isAdditionalSurvey: boolean;
  isSurveyBooking: boolean;
  quickbaseRecordId: string;
}

interface HomeContentProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  availableSlots: any[];
  setAvailableSlots: React.Dispatch<React.SetStateAction<any[]>>;
  selectedSlot: { value: string; reservationId: string } | null;
  setSelectedSlot: React.Dispatch<React.SetStateAction<{ value: string; reservationId: string } | null>>;
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  orderNo: string | null;
  setOrderNo: React.Dispatch<React.SetStateAction<string | null>>;
}

const HomeContent: React.FC<HomeContentProps> = ({
  formData,
  setFormData,
  availableSlots,
  setAvailableSlots,
  selectedSlot,
  setSelectedSlot,
  selectedDate,
  setSelectedDate,
  orderNo,
  setOrderNo,
}) => {
  // Handle the form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const [slotErrorMessage, setSlotErrorMessage] = useState(""); // For fetchSlots errors
  const [orderErrorMessage, setOrderErrorMessage] = useState(""); // For updateOrder errors
  const [successMessage, setSuccessMessage] = useState(""); // For success messages
  const [loading, setLoading] = useState(false); // For global loading state
  const [showSlots, setShowSlots] = useState(false);

  // Get drivers based on the warehouse
  const drivers = driverMapping[formData.warehouse as Warehouse] || [];

  // Function to handle slot selection
  const handleSlotSelect = (value: string, reservationId: string) => {
    setSelectedSlot({ value, reservationId });
  };

  // Function to handle date selection and API call to get available slots
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);
    // Format the date as YYYY-MM-DD without timezone conversion to prevent date shifting
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    // Generate a more unique order number with timestamp + random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const generatedOrderNo = `BE${timestamp}${randomString}`;
    setOrderNo(generatedOrderNo);

    // Get drivers only if warehouse is not Out of Region
    const drivers = formData.warehouse !== "Out of Region" ? driverMapping[formData.warehouse as Warehouse] || [] : [];

    // Construct API request payload
    const bookingData = {
      order: {
        operation: "CREATE",
        orderNo: generatedOrderNo,
        type: "D",
        location: {
          locationName: "Project Address",
          address: `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.postalCode}, United States`,
        },
        duration: 60, // Duration in minutes
      },
      slots: {
        dates: [formattedDate],
        timeWindows: getWarehouseTimeWindows(formData.warehouse),
      },
      planning: {
        // Only include useDrivers if we have drivers
        ...(drivers.length > 0 && { 
          useDrivers: drivers.map(driver => ({
            driverExternalId: driver.driverExternalId
          }))
        }),
        clustering: false,
        lockType: "RESOURCES"
      },
    };
    console.log(bookingData);

    try {
      setLoading(true);
      const response = await fetch("/api/fetchSlots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
    
      if (response.ok) {
        const responseData = await response.json();
        console.log("Fetched slots:", responseData);
    
        if (responseData.success) {
          setAvailableSlots(responseData.slots || []);
          setSlotErrorMessage(""); // Clear any previous errors
        } else {
          console.error("Failed to fetch slots:", responseData.message);
          setAvailableSlots([]);
          setSlotErrorMessage(responseData.message || "Failed to fetch slots.");
        }
      } else {
        console.error("API call failed:", response.statusText);
        setAvailableSlots([]);
        setSlotErrorMessage(response.statusText || "API call failed.");
      }
    } catch (error: any) {
      console.error("Error calling API:", error);
      setAvailableSlots([]);
      setSlotErrorMessage(
        error.message || "An unexpected error occurred while fetching slots."
      );
    } finally {
      setLoading(false); // Ensure loading is reset
    }
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedSlot.reservationId) {
      setOrderErrorMessage("Please select a time slot before submitting.");
      return;
    }

    if (!orderNo) {
      setOrderErrorMessage("Order number is missing. Please try again.");
      return;
    }

    const reservationData = {
      payload: {
        reservationId: selectedSlot.reservationId,
        orderNo,
        surveyDate: selectedDate ? 
          `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` 
          : null,
        timeSlot: selectedSlot.value,
        formData
      },
      params: {}
    };

    try {
      setLoading(true); 

      // Step 1: Send data to the webhook
      const webhookResponse = await fetch("https://webhooks.workato.com/webhooks/rest/49f37552-9667-45f9-a324-1b4f58455632/survey-optimo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error("Webhook error response:", errorText);
        setOrderErrorMessage("Failed to send data. Please try again.");
        return;
      }

      // Step 2: Make reservation with OptimoRoute
      const reservationResponse = await fetch("/api/MakeReservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: selectedSlot.reservationId,
          createOrderIfBookingFails: false,
        }),
      });

      if (!reservationResponse.ok) {
        const errorText = await reservationResponse.text();
        console.error("Reservation error response:", errorText);
        setOrderErrorMessage("Failed to make reservation. Please try again.");
        return;
      }

      // If both steps are successful, redirect to the success page
      console.log("Data sent and reservation made successfully");
      window.location.href = "/submissionSuccessful";
    } catch (error) {
      setOrderErrorMessage("Something went wrong. Please try again later.");
      console.error("Error during submission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidAddress = () => {
    setShowSlots(true);
  };

  return (
    <div className="h-full">
      <div className="Form">
        <CustomerForm formData={formData} handleChange={handleChange} />
        <AddressForm 
          formData={formData} 
          handleChange={handleChange}
          onValidAddress={handleValidAddress}
        />

<hr className="my-6 h-px bg-gradient-to-r from-green-500/50 to-emerald-600/50 border-0 dark:from-green-500/30 dark:to-emerald-600/30" />
        <div className="w-full">
          <h2 className="text-2xl text-center font-semibold text-gray-900 dark:text-white mb-6">
            Select Your Preferred Time
          </h2>

          <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm mb-8">
            <p className="text-gray-700 dark:text-gray-200">
              Please select any available slot. This reserves your preferred day - you&apos;ll receive a specific 2-hour arrival window the evening before via text and email, along with live tracking.
            </p>

            <div className="flex items-start space-x-2 mt-4 text-green-600 dark:text-gray-300">
              <svg className="w-4 h-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                Someone must be present during the survey to provide access to the attic, electrical equipment, and other areas of the property.
              </p>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2">
          <div className="pt-10 col-span-1 grid place-items-center h-full">
            <DatePicker onSelect={handleDateSelect} />
          </div>
          <div className="slots-container mt-6 col-span-1">
            <SlotList
              availableSlots={availableSlots}
              selectedSlot={selectedSlot}
              handleSlotSelect={handleSlotSelect}
            />
          </div>
        </div>

        {/* Display error messages or success messages */}
        <div className="mt-4 text-center">
          {slotErrorMessage && (
            <p className="text-red-600 font-semibold flex items-center justify-center">
              ⚠️ {slotErrorMessage}
            </p>
          )}
          {orderErrorMessage && (
            <p className="text-red-600 font-semibold flex items-center justify-center">
              ⚠️ {orderErrorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-green-600 font-semibold flex items-center justify-center">
              ✅ {successMessage}
            </p>
          )}
          {loading && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-200 font-medium text-lg">
                  Checking availability...
                </p>
              </div>
            </div>
          )}
        </div>

        
        <hr className="my-6 h-px bg-gradient-to-r from-green-500/50 to-emerald-600/50 border-0 dark:from-green-500/30 dark:to-emerald-600/30" />
        

        
        <SecondaryContact formData={formData} handleChange={handleChange} />
        
        <hr className="my-6 h-px bg-gradient-to-r from-green-500/50 to-emerald-600/50 border-0 dark:from-green-500/30 dark:to-emerald-600/30" />
        
        <TenantContact formData={formData} handleChange={handleChange} />
        
        <hr className="my-6 h-px bg-gradient-to-r from-green-500/50 to-emerald-600/50 border-0 dark:from-green-500/30 dark:to-emerald-600/30" />
        
        <ProjectQuestions formData={formData} handleChange={handleChange} />
        

        <div className="mt-8">
          <div className="mt-6 flex justify-center items-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-4 text-base font-semibold text-white 
                       bg-gradient-to-r from-green-500 to-emerald-600 
                       hover:from-green-600 hover:to-emerald-700
                       rounded-lg shadow-lg 
                       transform transition-all duration-200 ease-in-out hover:scale-[1.02]
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                       disabled:opacity-50 disabled:cursor-not-allowed
                       dark:focus:ring-offset-gray-800"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;

