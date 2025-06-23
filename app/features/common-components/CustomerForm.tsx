"use client";

import React, { useContext } from "react";
import { LanguageContext } from "./CentralBlock";
import { usePathname } from 'next/navigation';

interface CustomerFormProps {
  formData: {
    firstName: string;
    lastName: string;
    isAdditionalSurvey: boolean;
    isSurveyBooking: boolean;
    quickbaseRecordId: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  formData,
  handleChange,
}) => {
  const { t } = useContext(LanguageContext);
  const pathname = usePathname();
  const isProjectCreation = pathname?.includes('project-creation');
  
  return (
    <div className="mb-8 pt-10">
      {/* Only show title if not in project creation or if it's additional survey/survey booking */}
      {(!isProjectCreation || formData.isAdditionalSurvey || formData.isSurveyBooking) && (
        <div className="relative mb-12">
          <h2 className="text-center text-3xl font-bold 
                       bg-gradient-to-r from-[#58b37e] to-[#053058] dark:from-[#8efbbc] dark:to-[#1db7e2]
                       bg-clip-text text-transparent pb-2">
            {isProjectCreation ? 'Enter Your Project Details' : 
             formData.isAdditionalSurvey ? 'Additional Survey Booking' : 
             t('step2Title')}
          </h2>
        </div>
      )}

      {(formData.isAdditionalSurvey || formData.isSurveyBooking) && (
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
            QuickBase Record ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="quickbaseRecordId"
            className="w-full px-4 py-3 rounded-lg border border-gray-300/50 dark:border-gray-600/50 
                     bg-gray-100 dark:bg-[#3A3B3C] text-gray-500 dark:text-gray-400
                     cursor-not-allowed opacity-75"
            value={formData.quickbaseRecordId}
            onChange={handleChange}
            readOnly
          />
        </div>
      )}
      
      {!formData.isAdditionalSurvey && !formData.isSurveyBooking && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700  dark:text-gray-200 font-semibold mb-1">
              {t('firstName')} <span className="text-red-500">{t('required')}</span>
            </label>
            <input
              type="text"
              id="firstName"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full 
                       focus:outline-none focus:border-green-500
                       bg-white dark:bg-[#151821] dark:text-white no-blue-bg"
              value={formData.firstName}
              onChange={handleChange}
              style={{ backgroundColor: 'white' }}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
              {t('lastName')} <span className="text-red-500">{t('required')}</span>
            </label>
            <input
              type="text"
              id="lastName"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full 
                       focus:outline-none focus:border-green-500
                       bg-white dark:bg-[#151821] dark:text-white no-blue-bg"
              value={formData.lastName}
              onChange={handleChange}
              style={{ backgroundColor: 'white' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerForm; 