import React, { useContext } from "react";
import { LanguageContext } from "../../common-components/CentralBlock";

interface CustomerFormProps {
  formData: {
    firstName: string;
    lastName: string;
    isAdditionalSurvey: boolean;
    isSurveyBooking: boolean;
    insightlyRecordId: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  formData,
  handleChange,
}) => {
  const { t } = useContext(LanguageContext);
  
  return (
    <div className="mb-8 pt-10">
      {formData.isAdditionalSurvey && (
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
            Insightly Record ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="insightlyRecordId"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700 placeholder-gray-400"
            value={formData.insightlyRecordId}
            onChange={handleChange}
            placeholder="Enter Insightly Record ID"
          />
        </div>
      )}
      
      {!formData.isAdditionalSurvey && !formData.isSurveyBooking && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
              {t('firstName')} <span className="text-red-500">{t('required')}</span>
            </label>
            <input
              type="text"
              id="firstName"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full 
                       focus:outline-none focus:border-purple-500
                       bg-white dark:bg-[#3A3B3C] dark:text-white"
              value={formData.firstName}
              onChange={handleChange}
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
                       focus:outline-none focus:border-purple-500
                       bg-white dark:bg-[#3A3B3C] dark:text-white"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;
