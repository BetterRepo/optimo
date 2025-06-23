import React from 'react';
import { SurveyFormData } from '../types/FormData';

interface Props {
  formData: SurveyFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AdditionalSurveyFields: React.FC<Props> = ({ formData, handleChange }) => {
  // Show fields for both additional survey and survey booking
  if (!formData.isAdditionalSurvey && !formData.isSurveyBooking) return null;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="projectName"
            value={formData.projectName}
            onChange={handleChange}
            readOnly
            className="p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-md w-full 
                     bg-gray-100 dark:bg-[#3A3B3C] 
                     text-gray-500 dark:text-gray-400
                     cursor-not-allowed opacity-75"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
            Customer Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            readOnly
            className="p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-md w-full 
                     bg-gray-100 dark:bg-[#3A3B3C] 
                     text-gray-500 dark:text-gray-400
                     cursor-not-allowed opacity-75"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
            Customer Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            readOnly
            className="p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-md w-full 
                     bg-gray-100 dark:bg-[#3A3B3C] 
                     text-gray-500 dark:text-gray-400
                     cursor-not-allowed opacity-75"
          />
        </div>
      </div>
    </div>
  );
}; 