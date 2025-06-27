import React, { useEffect, useState } from "react";
import { CustomerForm } from "../../../common-components/CustomerForm";
import { AddressForm } from "../../../common-components/AddressForm";
import { SurveyQuestions } from "../SurveyQuestions";
import { TimeSlotSection } from "../home/TimeSlotSection";
import { useBookingForm } from "./hooks/useBookingForm";
import { OutOfRegionMessage } from "../OutOfRegionMessage";
import { SectionDivider } from "../common/SectionDivider";
import { SubmitButton } from "../common/SubmitButton";
import RecommendedTimeSlots from "../RecommendedTimeSlots";
import { AdditionalSurveyFields } from "../AdditionalSurveyFields";
import { SurveyFormData } from "../../types/FormData";
import FallbackBanner from "../../../common-components/FallbackBanner";
import FeedbackSelector from "../../components/FeedbackSelector";
import ProjectError from "@/app/features/common-components/ProjectError";

interface BookingFormProps {
  formData: SurveyFormData;
  setFormData: React.Dispatch<React.SetStateAction<SurveyFormData>>;
  availableSlots: any[];
  setAvailableSlots: React.Dispatch<React.SetStateAction<any[]>>;
  orderNo: string | null;
  setOrderNo: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSlot: { value: string; reservationId: string } | null;
  setSelectedSlot: React.Dispatch<
    React.SetStateAction<{ value: string; reservationId: string } | null>
  >;
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  formData: formDataProp,
  setFormData: setFormDataProp,
  availableSlots: availableSlotsProp,
  setAvailableSlots: setAvailableSlotsProp,
  orderNo,
  setOrderNo,
  selectedSlot: selectedSlotProp,
  setSelectedSlot: setSelectedSlotProp,
  selectedDate: selectedDateProp,
  setSelectedDate: setSelectedDateProp,
}) => {
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    isSubmitting,
    showSlots,
    setShowSlots,
    slotErrorMessage,
    orderErrorMessage,
    selectedSlot,
    setSelectedSlot,
    availableSlots,
    onDateSelect,
    handleSlotSelect,
    testWebhook,
  } = useBookingForm();

  // Add state to track submission attempts
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);

  // Custom submit handler to track submission attempts
  const handleFormSubmit = () => {
    setHasSubmitAttempt(true);
    handleSubmit();
  };

  useEffect(() => {
    if (formData) {
      handleChange({
        target: {
          id: "type",
          value: formData.isAdditionalSurvey
            ? "Additional Survey Booking"
            : "Survey Booking",
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [formData.isAdditionalSurvey]);

  // Add useEffect to set showSlots to true on component mount
  useEffect(() => {
    setShowSlots(true);
  }, []);

  const handleRecommendedSlotSelect = (
    value: string,
    reservationId: string,
    orderNo: string
  ) => {
    setSelectedSlot({
      value,
      reservationId,
      orderNo,
    });
  };

  const handlePickAnotherDate = () => {
    setSelectedSlot(null);
  };

  // Function to reset address fields
  const resetAddressFields = () => {
    // Clear address fields in form data
    handleChange({
      target: {
        id: "streetAddress",
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>);

    handleChange({
      target: {
        id: "city",
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>);

    handleChange({
      target: {
        id: "state",
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>);

    handleChange({
      target: {
        id: "postalCode",
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>);

    // Also ensure warehouse is reset to a valid value if it was undefined
    if (!formData.warehouse) {
      handleChange({
        target: {
          id: "warehouse",
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }

    // Reset slots and related state
    setSelectedSlot(null);
    setShowSlots(false);
  };
  console.log("formData", formData);
  const isOutOfRegion = formData.warehouse === "Out of Region";

  return (
    <div className="space-y-8">
      {formData.city === "" && <ProjectError />}

      <CustomerForm formData={formData} handleChange={handleChange} />
      <AdditionalSurveyFields formData={formData} handleChange={handleChange} />
      <AddressForm
        formData={{
          ...formData,
          warehouse: formData.warehouse || "",
        }}
        handleChange={handleChange}
        onValidAddress={() => {}}
      />

      {/* Texas Proximity Question - Only display for Dallas warehouse */}
      {formData.warehouse === "Dallas, TX" && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-sm border border-blue-100 dark:border-blue-800/40">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Is the project located closer to Dallas or Houston?
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div
              className={`flex items-center p-4 ${
                formData.texasProximity === "Dallas"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              } 
                rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 border ${
                  formData.texasProximity === "Dallas"
                    ? "border-blue-600"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              onClick={() => {
                handleChange({
                  target: {
                    id: "texasProximity",
                    value: "Dallas",
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              <input
                type="radio"
                id="texasProximityDallas"
                name="texasProximity"
                checked={formData.texasProximity === "Dallas"}
                onChange={() => {}}
                className={`h-5 w-5 ${
                  formData.texasProximity === "Dallas"
                    ? "text-white border-white"
                    : "text-blue-600 border-gray-300"
                }`}
              />
              <label
                htmlFor="texasProximityDallas"
                className="ml-3 block font-medium cursor-pointer flex-1"
              >
                Dallas
              </label>
              {formData.texasProximity === "Dallas" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div
              className={`flex items-center p-4 ${
                formData.texasProximity === "Houston"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              } 
                rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 border ${
                  formData.texasProximity === "Houston"
                    ? "border-blue-600"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              onClick={() => {
                handleChange({
                  target: {
                    id: "texasProximity",
                    value: "Houston",
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              <input
                type="radio"
                id="texasProximityHouston"
                name="texasProximity"
                checked={formData.texasProximity === "Houston"}
                onChange={() => {}}
                className={`h-5 w-5 ${
                  formData.texasProximity === "Houston"
                    ? "text-white border-white"
                    : "text-blue-600 border-gray-300"
                }`}
              />
              <label
                htmlFor="texasProximityHouston"
                className="ml-3 block font-medium cursor-pointer flex-1"
              >
                Houston
              </label>
              {formData.texasProximity === "Houston" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="mt-5 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg text-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-amber-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-amber-800 dark:text-amber-200">
                  <span className="font-medium">Important:</span> Your selection
                  affects available survey days.
                </p>
                <ul className="mt-1 text-amber-700 dark:text-amber-300 list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-medium">Dallas area:</span> Surveys on
                    Wednesday and Thursday
                  </li>
                  <li>
                    <span className="font-medium">Houston area:</span> Surveys
                    on Monday, Tuesday, and Friday
                  </li>
                  <li>
                    <span className="font-medium">Note:</span> Weekends are not
                    available for surveys
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">
            This helps us determine the best service team for your project.
          </p>
        </div>
      )}

      {formData.city != "" && formData.warehouse && (
        <div className="">
          {isOutOfRegion ? (
            <OutOfRegionMessage />
          ) : (
            <>
              {/* Only show RecommendedTimeSlots for non-Texas warehouses */}
              {formData.warehouse !== "Dallas, TX" &&
                availableSlotsProp.length < 1 && (
                  <RecommendedTimeSlots
                    setAvailableSlots={setAvailableSlotsProp}
                    onPickAnotherDate={() => setShowSlots(true)}
                    formData={formData}
                    orderNo={selectedSlot?.orderNo || null}
                    onSlotSelect={handleRecommendedSlotSelect}
                    selectedRecommendedSlot={selectedSlot}
                    resetAddressFields={resetAddressFields}
                    onUpdateFormData={(data) => {
                      // Convert data updates to use handleChange format
                      Object.entries(data).forEach(([key, value]) => {
                        handleChange({
                          target: {
                            id: key,
                            value: value,
                          },
                        } as React.ChangeEvent<HTMLInputElement>);
                      });
                    }}
                  />
                )}

              {/* For Texas locations, always show the time slot picker */}
              {formData.warehouse === "Dallas, TX" ? (
                <TimeSlotSection
                  formData={formData}
                  showSlots={true}
                  loading={loading}
                  errorMessage={slotErrorMessage}
                  onDateSelect={onDateSelect}
                  availableSlots={availableSlots}
                  selectedSlot={selectedSlot}
                  onSlotSelect={handleSlotSelect}
                  resetAddressFields={resetAddressFields}
                />
              ) : (
                showSlots && (
                  <TimeSlotSection
                    formData={formData}
                    showSlots={showSlots}
                    loading={loading}
                    errorMessage={slotErrorMessage}
                    onDateSelect={onDateSelect}
                    availableSlots={availableSlotsProp}
                    selectedSlot={selectedSlot}
                    onSlotSelect={handleSlotSelect}
                    resetAddressFields={resetAddressFields}
                  />
                )
              )}

              {!formData.internal && (
                <>
                  <br></br>
                  <div className="text-gray-700 dark:text-gray-300 text-sm mb-6 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-800/50 border-l-3 border-indigo-400 dark:border-indigo-500 rounded shadow-sm flex items-center">
                    <span className="mr-2 text-indigo-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Please provide accurate details for your installation
                  </div>
                  <SurveyQuestions
                    formData={formData}
                    handleChange={handleChange}
                    hasSubmitAttempt={hasSubmitAttempt}
                  />
                </>
              )}

              {/* Add the feedback selector */}
              {false && (
                <div className="mt-8 mb-4 overflow-hidden rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
                  {/* Modern gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-slate-800 opacity-90"></div>

                  {/* Decorative elements */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-indigo-500 opacity-75"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>

                  <div className="relative p-3 z-10">
                    <h3 className="text-base font-bold text-center text-gray-700 dark:text-gray-200 mb-2">
                      Share Your Feedback
                    </h3>

                    <FeedbackSelector
                      value={
                        formData.feedbackRating as
                          | "happy"
                          | "neutral"
                          | "unhappy"
                      }
                      onChange={(value) => {
                        handleChange({
                          target: {
                            id: "feedbackRating",
                            value,
                          },
                        } as React.ChangeEvent<HTMLInputElement>);
                      }}
                    />

                    {formData.feedbackRating && (
                      <div className="mt-1 opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards] max-w-md mx-auto">
                        <textarea
                          id="feedbackComments"
                          className="w-full px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white/80 dark:bg-gray-700/90 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:text-white"
                          rows={1}
                          value={formData.feedbackComments || ""}
                          onChange={handleChange}
                          placeholder="Additional comments (optional)"
                        ></textarea>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="py-4">
        <SubmitButton
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          errorMessage={orderErrorMessage}
        />
      </div>
    </div>
  );
};
