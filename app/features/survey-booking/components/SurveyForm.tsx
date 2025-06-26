"use client";

import React from "react";
import { CustomerForm } from "../../common-components/CustomerForm";
import { AddressForm } from "../../common-components/AddressForm";
import { SurveyQuestions } from "./SurveyQuestions";
import { AdditionalSurveyFields } from "./AdditionalSurveyFields";
import RecommendedTimeSlots from "./RecommendedTimeSlots";
import { SurveyFormData } from "../types/FormData";

interface SurveyFormProps {
  formData: SurveyFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  showSlots: boolean;
  setShowSlots: (show: boolean) => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({
  formData,
  handleChange,
  showSlots,
  setShowSlots,
}) => {
  return (
    <div className="Form">
      <CustomerForm formData={formData} handleChange={handleChange} />
      <AdditionalSurveyFields formData={formData} handleChange={handleChange} />
      <AddressForm
        formData={formData}
        handleChange={handleChange}
        onValidAddress={() => {}}
      />

      {formData.warehouse && formData.warehouse !== "Out of Region" && (
        <div className="mt-6 p-4 bg-white dark:bg-[#1a1a1a] rounded-lg shadow">
          <RecommendedTimeSlots onPickAnotherDate={() => setShowSlots(true)} />
          {!formData.isAdditionalSurvey && !formData.isSurveyBooking && (
            <SurveyQuestions formData={formData} handleChange={handleChange} />
          )}
        </div>
      )}
    </div>
  );
};
