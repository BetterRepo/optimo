import React from "react";
import { useRecommendedSlots } from "../hooks/useRecommendedSlots";
import { TimeSlotCard } from "./RecommendedTimeSlots/TimeSlotCard";
import { Button } from "@/app/features/common-components/button";
import UnavailableLocationNotice from "./UnavailableLocationNotice";

// Define a type for the form data with flexible warehouse field
interface FormDataWithFlexibleWarehouse {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  warehouse?: string;
  isAdditionalSurvey?: boolean;
  preferredSurveyDates?: string[];
  [key: string]: any; // Allow for additional fields
}

interface RecommendedTimeSlotsProps {
  onPickAnotherDate: () => void;
  formData: FormDataWithFlexibleWarehouse;
  orderNo: string | null;
  onSlotSelect: (value: string, reservationId: string, orderNo: string) => void;
  selectedRecommendedSlot: { value: string; reservationId: string } | null;
  resetAddressFields?: () => void;
  onUpdateFormData?: (data: Partial<FormDataWithFlexibleWarehouse>) => void;
  setAvailableSlots: (slots: TimeSlot[]) => void;
}

// Define a type for the time slot
interface TimeSlot {
  from: string;
  to: string;
  time: string;
  reservationId: string;
}

const RecommendedTimeSlots: React.FC<RecommendedTimeSlotsProps> = ({
  onPickAnotherDate,
  formData,
  orderNo,
  onSlotSelect,
  selectedRecommendedSlot,
  resetAddressFields,
  onUpdateFormData,
  setAvailableSlots,
}) => {
  const { firstSlot, secondSlot, loading, error, createdOrderNo } =
    useRecommendedSlots(formData, orderNo);
  React.useEffect(() => {
    console.log("yeaaah in here");
    // Only set slots if they exist
    setAvailableSlots([firstSlot, secondSlot].filter(Boolean) as TimeSlot[]);
  }, [firstSlot, secondSlot, setAvailableSlots]);
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSlotClick = (slot: TimeSlot) => {
    const slotTime = `${slot.from} - ${slot.to}`;

    if (selectedRecommendedSlot?.value === slotTime) {
      onSlotSelect("", "", ""); // Clear the selection, which will enable the button
    } else {
      onSlotSelect(slotTime, slot.reservationId, createdOrderNo || ""); // Select slot, which will disable the button
    }
  };

  const isSlotSelected = (slot: TimeSlot) => {
    const slotTime = `${slot.from} - ${slot.to}`;
    return selectedRecommendedSlot?.value === slotTime;
  };

  const handleTryAnotherAddress = () => {
    if (resetAddressFields) {
      resetAddressFields();
    }

    // Scroll to the top of the page for user to enter new address
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Build address string for display
  const addressString = formData
    ? `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.postalCode}`
    : "Your address";

  return (
    <div className="mt-6">
      <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Recommended Time Slots
      </h4>

      {/* Cutoff time notice - only shown when error condition exists */}
      {error && error.includes("cutoff") && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-amber-600 mt-0.5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium">Booking Cutoff Time: 5:00 PM PST</p>
              <p className="text-sm mt-1">
                Next-day appointments are not available after 5:00 PM PST. The
                earliest available date is 2 days out.
              </p>
            </div>
          </div>
        </div>
      )}

      {error ? (
        <UnavailableLocationNotice
          address={addressString}
          reason={error}
          onTryAnotherAddress={handleTryAnotherAddress}
          onUpdateFormData={onUpdateFormData}
        />
      ) : loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : !firstSlot && !secondSlot ? (
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
              <svg
                className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Available Slots Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We couldn't find any available slots for your address at this
              time.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => onUpdateFormData?.({ showPreferredDates: true })}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-[#195061] hover:bg-[#154455] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#195061]"
            >
              Select Preferred Dates
            </button>
            <button
              onClick={handleTryAnotherAddress}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#195061]"
            >
              Try Another Address
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {firstSlot && (
              <div
                onClick={() => handleSlotClick(firstSlot as TimeSlot)}
                className={`bg-green-50 dark:bg-green-900/20 rounded-lg p-6 cursor-pointer transition-all ${
                  isSlotSelected(firstSlot as TimeSlot)
                    ? "ring-2 ring-green-500 dark:ring-green-400"
                    : "hover:shadow-md"
                }`}
              >
                <div className="flex items-center mb-4">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xl text-gray-900 dark:text-white">
                    {formatDate((firstSlot as TimeSlot).from)}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-900/40 rounded-lg p-6 border border-green-100 dark:border-transparent">
                  <span className="text-green-600 dark:text-green-400 text-xl font-medium block mb-2">
                    {(firstSlot as TimeSlot).time}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Best Choice
                  </span>
                </div>
              </div>
            )}

            {secondSlot && (
              <div
                onClick={() => handleSlotClick(secondSlot as TimeSlot)}
                className={`bg-green-50 dark:bg-green-900/20 rounded-lg p-6 cursor-pointer transition-all ${
                  isSlotSelected(secondSlot as TimeSlot)
                    ? "ring-2 ring-green-500 dark:ring-green-400"
                    : "hover:shadow-md"
                }`}
              >
                <div className="flex items-center mb-4">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xl text-gray-900 dark:text-white">
                    {formatDate((secondSlot as TimeSlot).from)}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-900/40 rounded-lg p-6 border border-green-100 dark:border-transparent">
                  <span className="text-green-600 dark:text-green-400 text-xl font-medium block mb-2">
                    {(secondSlot as TimeSlot).time}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    2nd Best Choice
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={onPickAnotherDate}
              disabled={!!selectedRecommendedSlot?.value}
              className={`
            inline-flex items-center justify-center 
            px-4 py-3 text-gl font-normal
            text-white
            rounded-[18px]
            transition-all duration-300 ease-in-out
            shadow-lg hover:shadow-xl
            transform hover:-translate-y-0.5
            ${
              !!selectedRecommendedSlot?.value
                ? "bg-gradient-to-r from-[#98D8B1]/80 to-[#7AC7A0]/80 cursor-not-allowed"
                : "bg-[#195061] hover:bg-[#143e4e]"
            }
            backdrop-blur-sm
            border border-white/10
          `}
            >
              Pick Another Date
              <svg
                className="ml-2 h-6 w-6 text-white/90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendedTimeSlots;
