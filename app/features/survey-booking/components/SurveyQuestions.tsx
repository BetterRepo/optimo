"use client";

import React from "react";
import { SurveyFormData } from '../types/FormData';
import { BatteryNotice } from './home/BatteryNotice';

interface SurveyQuestionsProps {
  formData: SurveyFormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  hasSubmitAttempt?: boolean;
}

export const SurveyQuestions: React.FC<SurveyQuestionsProps> = ({
  formData,
  handleChange,
  hasSubmitAttempt = false,
}) => {
  const handleRadioChange = (field: string, value: boolean | string, fullText: string) => {
    const e = {
      target: {
        id: field,
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    const textField = {
      target: {
        id: `${field}Text`,
        value: fullText,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(e);
    handleChange(textField);
  };

  return (
    <div className="mb-8">
      <div className="space-y-8">
        {/* Battery Installation Question */}
        <div>
          <div className={`border ${formData.hasBatteries === undefined ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {formData.hasBatteries === undefined && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Are we installing any batteries as part of this project?{" "}
              <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Indicate whether this project includes battery installation
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasBatteries"
                  id="hasBatteries-yes"
                  checked={formData.hasBatteries === true}
                  onChange={() => handleRadioChange("hasBatteries", true, "Yes")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasBatteries-yes" className="text-gray-700 cursor-pointer">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasBatteries"
                  id="hasBatteries-no"
                  checked={formData.hasBatteries === false}
                  onChange={() => handleRadioChange("hasBatteries", false, "No")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasBatteries-no" className="text-gray-700 cursor-pointer">
                  No
                </label>
              </div>
            </div>
            
            {formData.hasBatteries === true && <BatteryNotice />}
          </div>
        </div>

        {/* Design Preference Question */}
        <div>
          <div className={`border ${hasSubmitAttempt && !formData.designPreference ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && !formData.designPreference && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Which design option do you prefer?{" "}
              <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select your preferred approach for panel placement
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="designPreference"
                  id="designPreference-sunlight"
                  checked={formData.designPreference === "bestSunlight"}
                  onChange={() =>
                    handleRadioChange("designPreference", "bestSunlight", "Design the system for maximum efficiency")
                  }
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="designPreference-sunlight" className="text-gray-700 cursor-pointer">
                  Design the system for maximum efficiency
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="designPreference"
                  id="designPreference-match"
                  checked={formData.designPreference === "matchProposed"}
                  onChange={() =>
                    handleRadioChange("designPreference", "matchProposed", "Design the system to match the proposal design as closely as possible")
                  }
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="designPreference-match" className="text-gray-700 cursor-pointer">
                  Design the system to match the proposal design as closely as possible
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Roof Question */}
        <div>
          <div className={`border ${hasSubmitAttempt && formData.isSharedRoof === undefined ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && formData.isSharedRoof === undefined && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Is this a shared roof? <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Indicate if this property has a shared roof with other units
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="isSharedRoof"
                  id="isSharedRoof-yes"
                  checked={formData.isSharedRoof === true}
                  onChange={() => handleRadioChange("isSharedRoof", true, "Yes, please place the design system exactly as specified")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="isSharedRoof-yes" className="text-gray-700 cursor-pointer">
                  Yes, please place the design system exactly as specified
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="isSharedRoof"
                  id="isSharedRoof-no"
                  checked={formData.isSharedRoof === false}
                  onChange={() => handleRadioChange("isSharedRoof", false, "No")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="isSharedRoof-no" className="text-gray-700 cursor-pointer">
                  No
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Construction Question */}
        <div>
          <div className={`border ${hasSubmitAttempt && formData.hasRecentConstruction === undefined ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && formData.hasRecentConstruction === undefined && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Has the home been built in the last 12 months? Or any construction
              that has changed the layout of the roof in the last 12 months?{" "}
              <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Indicate if there has been recent construction affecting the roof
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasRecentConstruction"
                  id="hasRecentConstruction-yes"
                  checked={formData.hasRecentConstruction === true}
                  onChange={() =>
                    handleRadioChange("hasRecentConstruction", true, "Yes")
                  }
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasRecentConstruction-yes" className="text-gray-700 cursor-pointer">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasRecentConstruction"
                  id="hasRecentConstruction-no"
                  checked={formData.hasRecentConstruction === false}
                  onChange={() =>
                    handleRadioChange("hasRecentConstruction", false, "No")
                  }
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasRecentConstruction-no" className="text-gray-700 cursor-pointer">
                  No
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Vaulted Ceilings Question */}
        <div>
          <div className={`border ${hasSubmitAttempt && formData.hasVaultedCeilings === undefined ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && formData.hasVaultedCeilings === undefined && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Are there vaulted ceilings in the home? **Meaning are there any
              areas where the ceiling is not flat, but is angled like the roof is?{" "}
              <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Indicate if the home has vaulted ceilings in any room
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasVaultedCeilings"
                  id="hasVaultedCeilings-yes"
                  checked={formData.hasVaultedCeilings === true}
                  onChange={() => handleRadioChange("hasVaultedCeilings", true, "Yes")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasVaultedCeilings-yes" className="text-gray-700 cursor-pointer">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasVaultedCeilings"
                  id="hasVaultedCeilings-no"
                  checked={formData.hasVaultedCeilings === false}
                  onChange={() => handleRadioChange("hasVaultedCeilings", false, "No")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasVaultedCeilings-no" className="text-gray-700 cursor-pointer">
                  No
                </label>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 border-l-3 border-blue-400 rounded shadow-sm flex items-center">
              <span className="mr-2 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
              <a href="https://help.betterearth.io/knowledge/frequently-asked-questions/what-is-a-vaulted-ceiling#block-8aeba92c994c40a684a168b8c8a8a5c2" target="_blank" rel="noopener noreferrer" className="text-blue-700 text-sm hover:underline">
                See examples of vaulted ceilings
              </a>
            </div>
          </div>
        </div>

        <div>
          <div className={`border ${hasSubmitAttempt && !formData.stories ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && !formData.stories && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <label className="block text-lg font-bold text-gray-800 mb-3">
              How many stories is the home?{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              id="stories"
              value={formData.stories || ""}
              onChange={handleChange}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-1/2 max-w-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white dark:bg-[#3A3B3C] dark:text-white"
            >
              <option value="">Please Select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>

        <div>
          <div className={`border ${hasSubmitAttempt && formData.hasOngoingConstruction === undefined ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && formData.hasOngoingConstruction === undefined && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <label className="block text-lg font-bold text-gray-800 mb-1">
              Is there any ongoing construction, open permits or un-permitted
              structures on the property? <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-8 mt-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasOngoingConstruction"
                  id="hasOngoingConstruction-yes"
                  checked={formData.hasOngoingConstruction === true}
                  onChange={() => handleRadioChange("hasOngoingConstruction", true, "Yes")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasOngoingConstruction-yes" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasOngoingConstruction"
                  id="hasOngoingConstruction-no"
                  checked={formData.hasOngoingConstruction === false}
                  onChange={() => handleRadioChange("hasOngoingConstruction", false, "No")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasOngoingConstruction-no" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  No
                </label>
              </div>
            </div>

            {formData.hasOngoingConstruction && (
              <div className="mt-4">
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                  Enter details regarding open permits/construction{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="ongoingConstructionDetails"
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         bg-white dark:bg-[#3A3B3C] dark:text-white"
                  rows={4}
                  value={formData.ongoingConstructionDetails || ""}
                  onChange={handleChange}
                  placeholder="Type here..."
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className={`border ${hasSubmitAttempt && formData.hasExistingSolar === undefined ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && formData.hasExistingSolar === undefined && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <label className="block text-lg font-bold text-gray-800 mb-1">
              Is there an existing solar system on the property (not solar water
              heating)? <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-8 mt-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasExistingSolar"
                  id="hasExistingSolar-yes"
                  checked={formData.hasExistingSolar === true}
                  onChange={() => handleRadioChange("hasExistingSolar", true, "Yes")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasExistingSolar-yes" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasExistingSolar"
                  id="hasExistingSolar-no"
                  checked={formData.hasExistingSolar === false}
                  onChange={() => handleRadioChange("hasExistingSolar", false, "No")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasExistingSolar-no" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  No
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className={`border ${hasSubmitAttempt && formData.hasHOA === undefined ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && formData.hasHOA === undefined && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <label className="block text-lg font-bold text-gray-800 mb-1">
              Is there an HOA associated with this property?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-8 mt-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasHOA"
                  id="hasHOA-yes"
                  checked={formData.hasHOA === true}
                  onChange={() => handleRadioChange("hasHOA", true, "Yes")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasHOA-yes" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasHOA"
                  id="hasHOA-no"
                  checked={formData.hasHOA === false}
                  onChange={() => handleRadioChange("hasHOA", false, "No")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasHOA-no" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  No
                </label>
              </div>
            </div>
            {formData.hasHOA && (
              <div className="mt-4">
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                  HOA Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="hoaName"
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         bg-white dark:bg-[#3A3B3C] dark:text-white"
                  value={formData.hoaName || ""}
                  onChange={handleChange}
                  placeholder="HOA Name"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className={`border ${hasSubmitAttempt && !formData.mainPanelLocation ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && !formData.mainPanelLocation && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <label className="block text-lg font-bold text-gray-800 mb-1">
              Where is your main electrical panel? <span className="text-red-500">*</span>
            </label>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mt-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="mainPanelLocation"
                  id="mainPanelLocation-inside"
                  checked={formData.mainPanelLocation === "inside"}
                  onChange={() => handleRadioChange("mainPanelLocation", "inside", "Inside the home")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="mainPanelLocation-inside" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  Inside the home
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="mainPanelLocation"
                  id="mainPanelLocation-outside"
                  checked={formData.mainPanelLocation === "outside"}
                  onChange={() => handleRadioChange("mainPanelLocation", "outside", "Outside the home")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="mainPanelLocation-outside" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  Outside the home
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="mainPanelLocation"
                  id="mainPanelLocation-garage"
                  checked={formData.mainPanelLocation === "garage"}
                  onChange={() => handleRadioChange("mainPanelLocation", "garage", "In the garage")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="mainPanelLocation-garage" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  In the garage
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="mainPanelLocation"
                  id="mainPanelLocation-other"
                  checked={formData.mainPanelLocation === "other"}
                  onChange={() => handleRadioChange("mainPanelLocation", "other", "Other")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="mainPanelLocation-other" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  Other
                </label>
              </div>
            </div>
            {formData.mainPanelLocation === "other" && (
              <div className="mt-4">
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                  Please specify other location{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="mainPanelOtherLocation"
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         bg-white dark:bg-[#3A3B3C] dark:text-white"
                  value={formData.mainPanelOtherLocation || ""}
                  onChange={handleChange}
                  placeholder="Describe the location"
                />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className={`border ${hasSubmitAttempt && formData.hasSubPanels === undefined ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && formData.hasSubPanels === undefined && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <label className="block text-lg font-bold text-gray-800 mb-1">
              Are there any sub-panels?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-8 mt-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasSubPanels"
                  id="hasSubPanels-yes"
                  checked={formData.hasSubPanels === true}
                  onChange={() => handleRadioChange("hasSubPanels", true, "Yes")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasSubPanels-yes" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasSubPanels"
                  id="hasSubPanels-no"
                  checked={formData.hasSubPanels === false}
                  onChange={() => handleRadioChange("hasSubPanels", false, "No")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasSubPanels-no" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  No
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className={`border ${hasSubmitAttempt && formData.hasBlockedAccess === undefined ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && formData.hasBlockedAccess === undefined && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <label className="block text-lg font-bold text-gray-800 mb-1">
              Is access to the home or electrical panel blocked?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-8 mt-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasBlockedAccess"
                  id="hasBlockedAccess-yes"
                  checked={formData.hasBlockedAccess === true}
                  onChange={() => handleRadioChange("hasBlockedAccess", true, "Yes")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasBlockedAccess-yes" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="hasBlockedAccess"
                  id="hasBlockedAccess-no"
                  checked={formData.hasBlockedAccess === false}
                  onChange={() => handleRadioChange("hasBlockedAccess", false, "No")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="hasBlockedAccess-no" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  No
                </label>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-800/50 border-l-3 border-red-400 dark:border-red-500 rounded shadow-sm flex items-center">
              <span className="mr-2 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </span>
              <p className="text-gray-700 dark:text-gray-300 text-sm">Additional survey fees may apply if access is denied</p>
            </div>
          </div>
        </div>

        <div>
          <div className={`border ${hasSubmitAttempt && !formData.gateAccessType ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg p-6 transition-colors duration-300`}>
            {hasSubmitAttempt && !formData.gateAccessType && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      This question requires an answer before you can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <label className="block text-lg font-bold text-gray-800 mb-1">
              Do you have an access code for the neighborhood/property?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-8 mt-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="gateAccessType"
                  id="gateAccessType-yes"
                  checked={formData.gateAccessType === "yes"}
                  onChange={() => handleRadioChange("gateAccessType", "yes", "Yes, I'll be there to provide access")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="gateAccessType-yes" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  Yes, I&apos;ll be there to provide access
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="gateAccessType"
                  id="gateAccessType-code"
                  checked={formData.gateAccessType === "code"}
                  onChange={() => handleRadioChange("gateAccessType", "code", "Yes, I have a code")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="gateAccessType-code" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  Yes, I have a code
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="gateAccessType"
                  id="gateAccessType-no"
                  checked={formData.gateAccessType === "no"}
                  onChange={() => handleRadioChange("gateAccessType", "no", "No")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="gateAccessType-no" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  No
                </label>
              </div>
            </div>
            
            {formData.gateAccessType === "code" && (
              <div className="mt-4">
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                  Please enter the access code{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="gateCode"
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         bg-white dark:bg-[#3A3B3C] dark:text-white"
                  value={formData.gateCode || ""}
                  onChange={handleChange}
                  placeholder="Enter access code"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="border border-gray-300 rounded-lg p-6">
            <label className="block text-lg font-bold text-gray-800 mb-1">
              Are there any dogs on the property?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-8 mt-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="pets"
                  id="pets-yes"
                  checked={formData.pets === true}
                  onChange={() => handleRadioChange("pets", true, "Yes")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="pets-yes" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="pets"
                  id="pets-no"
                  checked={formData.pets === false}
                  onChange={() => handleRadioChange("pets", false, "No")}
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                />
                <label htmlFor="pets-no" className="text-gray-700 dark:text-gray-200 cursor-pointer">
                  No
                </label>
              </div>
            </div>
            
            {formData.pets && (
              <>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                  <p className="text-amber-800 dark:text-amber-300 text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    We ask that all dogs be restrained for the duration of the survey
                  </p>
                </div>
                
                <div className="mt-4">
                  <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                    Please provide details about your dogs (breed, size, temperament){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="petDetails"
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           bg-white dark:bg-[#3A3B3C] dark:text-white"
                    rows={4}
                    value={formData.petDetails || ""}
                    onChange={handleChange}
                    placeholder="Describe your dogs..."
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
