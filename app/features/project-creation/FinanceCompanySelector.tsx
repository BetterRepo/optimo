"use client";

import React, { useState, useRef } from "react";
import {
  LeadType,
  ModuleType,
  StorageOption,
  Adder,
  FinanceCompany,
  FinanceType,
  ProjectCreationFormData,
} from "./types";

interface FinanceCompanySelectorProps {
  selectedCompany: FinanceCompany | "";
  selectedEscalator: string;
  selectedTerm: string;
  selectedLeadType: LeadType | "";
  selectedModuleCount: string;
  selectedModuleType: ModuleType | "";
  selectedStorage: StorageOption;
  selectedAdders: Adder[];
  selectedStorageOption: StorageOption;
  selectedInterestRate: string;
  selectedYearlyProduction: string;
  selectedFinanceOrg: string;
  selectedLgcyCanvassId: string;
  selectedEpc: string;
  selectedKwhRate: string;
  selectedLeadId: string;
  selectedPangeaId: string;
  selectedInsightlyId: string;
  selectedSalesRepEmail: string;
  selectedSalesRepEmail2: string;
  selectedDialerEmail: string;
  selectedCustomerEmail: string;
  selectedCustomerPhone: string;
  selectedSystemSize: string;
  formData: ProjectCreationFormData;
  onCompanyChange: (value: FinanceCompany | "") => void;
  onEscalatorChange: (value: string) => void;
  onTermChange: (value: string) => void;
  onLeadTypeChange: (value: LeadType | "") => void;
  onModuleCountChange: (value: string) => void;
  onModuleTypeChange: (value: ModuleType | "") => void;
  onStorageChange: (value: StorageOption) => void;
  onAddersChange: (value: Adder[]) => void;
  onStorageOptionChange: (value: StorageOption) => void;
  onInterestRateChange: (value: string) => void;
  onYearlyProductionChange: (value: string) => void;
  onFinanceOrgChange: (value: string) => void;
  onLgcyCanvassIdChange: (value: string) => void;
  onEpcChange: (value: string) => void;
  onKwhRateChange: (value: string) => void;
  onLeadIdChange: (value: string) => void;
  onPangeaIdChange: (value: string) => void;
  onInsightlyIdChange: (value: string) => void;
  onSalesRepEmailChange: (value: string) => void;
  onSalesRepEmail2Change: (value: string) => void;
  onDialerEmailChange: (value: string) => void;
  onCustomerEmailChange: (value: string) => void;
  onCustomerPhoneChange: (value: string) => void;
  onSystemSizeChange: (value: string) => void;
  onFileUpload: (files: FileList) => Promise<boolean>;
  onToggleWelcomeCall?: (isChecked: boolean) => void;
}

export const FinanceCompanySelector: React.FC<FinanceCompanySelectorProps> = ({
  selectedCompany,
  selectedEscalator,
  selectedTerm,
  selectedLeadType,
  selectedModuleCount,
  selectedModuleType,
  selectedStorage,
  selectedAdders,
  selectedStorageOption,
  selectedInterestRate,
  selectedYearlyProduction,
  selectedFinanceOrg,
  selectedLgcyCanvassId,
  selectedEpc,
  selectedKwhRate,
  selectedLeadId,
  selectedPangeaId,
  selectedInsightlyId,
  selectedSalesRepEmail,
  selectedSalesRepEmail2,
  selectedDialerEmail,
  selectedCustomerEmail,
  selectedCustomerPhone,
  selectedSystemSize,
  formData,
  onCompanyChange,
  onEscalatorChange,
  onTermChange,
  onLeadTypeChange,
  onModuleCountChange,
  onModuleTypeChange,
  onStorageChange,
  onAddersChange,
  onStorageOptionChange,
  onInterestRateChange,
  onYearlyProductionChange,
  onFinanceOrgChange,
  onLgcyCanvassIdChange,
  onEpcChange,
  onKwhRateChange,
  onLeadIdChange,
  onPangeaIdChange,
  onInsightlyIdChange,
  onSalesRepEmailChange,
  onSalesRepEmail2Change,
  onDialerEmailChange,
  onCustomerEmailChange,
  onCustomerPhoneChange,
  onSystemSizeChange,
  onFileUpload,
  onToggleWelcomeCall,
}) => {
  // Add state for tracking uploaded HOI files
  const [hoiFiles, setHoiFiles] = useState<
    Array<{ name: string; size: number }>
  >([]);
  const [isUploadingHoi, setIsUploadingHoi] = useState(false);

  // Logo Container Component for standardized display
  const LogoContainer = ({
    company,
    isSelected,
  }: {
    company: { id: string; label: string; logoPath: string };
    isSelected: boolean;
  }) => {
    return (
      <div
        key={company.id}
        className={`relative cursor-pointer rounded-xl shadow-sm transition-all duration-300 
          ${
            isSelected
              ? "border-2 border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md transform -translate-y-1"
              : "border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }`}
      >
        <input
          type="radio"
          id={`company-${company.id}`}
          name="financeCompany"
          value={company.id}
          checked={isSelected}
          onChange={(e) => onCompanyChange(e.target.value as FinanceCompany)}
          className="sr-only"
        />
        <label
          htmlFor={`company-${company.id}`}
          className="block p-4 cursor-pointer h-full"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="h-24 w-full flex items-center justify-center p-2 bg-white rounded-lg">
              <div className="w-32 h-20 flex items-center justify-center relative">
                <img
                  src={company.logoPath}
                  alt={`${company.label} logo`}
                  className="max-h-full max-w-full object-contain"
                  style={{
                    objectFit: "contain",
                    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.style.display = "none";

                    // Create text fallback
                    const parent = target.parentElement;
                    if (parent) {
                      const textFallback = document.createElement("span");
                      textFallback.textContent = company.label;
                      textFallback.className =
                        "text-lg font-semibold text-gray-700 dark:text-gray-300";
                      parent.appendChild(textFallback);
                    }
                  }}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-800 dark:text-white">
                {company.label}
              </div>
            </div>
          </div>
          {isSelected && (
            <div className="absolute top-2 right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </label>
      </div>
    );
  };

  const companies = [
    {
      id: "LightReach",
      label: "LightReach",
      logoPath: "/images/lightrach-1.png",
    },
    { id: "GoodLeap", label: "GoodLeap", logoPath: "/images/goodleap.png" },
    { id: "Sungage", label: "Sungage", logoPath: "/images/sungage.png" },
    { id: "EnFin", label: "EnFin", logoPath: "/images/enfin-1.png" },
    { id: "HomeRun", label: "HomeRun", logoPath: "/images/homerun-1.png" },
    { id: "Dividend", label: "Dividend", logoPath: "/images/dividend-1.png" },
    { id: "Sunrun", label: "Sunrun", logoPath: "/images/sunrun.png" },
    { id: "Cash", label: "Cash", logoPath: "/images/cash-1.png" },
  ];

  // Filter companies based on finance type
  const filteredCompanies = companies.filter((company) => {
    // If formData or financeType is not set, show all companies
    if (!formData?.financeType) {
      return true;
    }

    switch (formData.financeType) {
      case "Cash":
        return company.id === "Cash";
      case "Loan":
        return ["GoodLeap", "EnFin", "Dividend", "Sungage"].includes(
          company.id
        );
      case "Lease":
      case "PPA":
        return ["GoodLeap", "EnFin", "LightReach", "Sunrun"].includes(
          company.id
        );
      case "PACE":
        return company.id === "HomeRun";
      case "Prepaid-PPA":
        return company.id === "Sunrun";
      default:
        return false; // Don't show any companies for unknown finance types
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
          Finance Companies
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredCompanies.map((company) => (
          <LogoContainer
            key={company.id}
            company={company}
            isSelected={selectedCompany === company.id}
          />
        ))}
      </div>

      {/* Financier's Welcome Call Checkbox section */}
      <div className="mt-6 mb-6">
        <div
          className={`p-6 rounded-lg shadow-sm ${
            formData.welcomeCallCompleted
              ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
              : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-grow">
              {/* Finance-specific verification text */}
              {(selectedCompany as string) === "EnFin" && (
                <h4
                  className={`text-base font-bold ${
                    formData.welcomeCallCompleted
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  I verify that my EnFin customer has completed the EnFin
                  Welcome Call and cleared all stipulations (if needed){" "}
                  <span className="text-red-500">*</span>
                </h4>
              )}

              {/* GoodLeap text */}
              {(selectedCompany as string) === "GoodLeap" && (
                <h4
                  className={`text-base font-bold ${
                    formData.welcomeCallCompleted
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  I verify that my Goodleap customer has completed their Digital
                  Welcome Call (with Call Pilot), payment information, and title
                  / ID information (if needed){" "}
                  <span className="text-red-500">*</span>
                </h4>
              )}

              {/* LightReach text */}
              {(selectedCompany as string) === "LightReach" && (
                <h4
                  className={`text-base font-bold ${
                    formData.welcomeCallCompleted
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  I verify that my LightReach customer has completed their
                  welcome checklist, uploaded their ID, payment information, and
                  title information (if needed){" "}
                  <span className="text-red-500">*</span>
                </h4>
              )}

              {/* Other finance companies */}
              {!selectedCompany && (
                <h4
                  className={`text-base font-bold ${
                    formData.welcomeCallCompleted
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  I have completed the financier&apos;s Welcome Call & uploaded
                  necessary documentation{" "}
                  <span className="text-red-500">*</span>
                </h4>
              )}

              {/* Sunnova section */}
              {(selectedCompany as string) === "Sunnova" && (
                <div>
                  <h4
                    className={`text-base font-bold ${
                      formData.welcomeCallCompleted
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    I have completed the Sunnova Welcome Call or Digital Welcome
                    Checklist. <span className="text-red-500">*</span>
                  </h4>
                  <div className="mt-2">
                    <a
                      href="https://help.betterearth.io/knowledge/finance-information/sunnova#block-e4e8636569dc49728469f89ebd5f4ec3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
                    >
                      Click here for information about submitting a Sunnova
                      project
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              )}

              <p
                className={`mt-3 text-sm flex items-center ${
                  formData.welcomeCallCompleted
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formData.welcomeCallCompleted ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1.5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verification complete! You can now proceed with your TPO
                    project submission
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1.5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    This step is required before proceeding with your TPO
                    project submission
                  </>
                )}
              </p>

              {/* Single, highly-visible direct trigger to toggle verification */}
              <button
                type="button"
                className={`mt-4 py-3 px-6 w-full rounded-md border-2 shadow-md font-bold text-base transition-colors duration-200 ${
                  formData.welcomeCallCompleted
                    ? "bg-white border-green-600 text-green-700 hover:bg-green-50"
                    : "bg-white border-red-600 text-red-700 hover:bg-red-50"
                }`}
                onClick={() => {
                  const isChecked = !formData.welcomeCallCompleted;
                  console.log("DIRECT TOGGLE - setting to:", isChecked);

                  // Method 1: Try the direct toggle function if available
                  if (onToggleWelcomeCall) {
                    console.log("Using direct toggle function");
                    onToggleWelcomeCall(isChecked);
                  }

                  // Method 2: Use the traditional way through email special value
                  if (onCustomerEmailChange) {
                    console.log("Using indirect toggle through customer email");
                    const originalEmail = formData.customerEmail || "";
                    const specialValue = `__WELCOME_CALL_${isChecked}__${originalEmail}`;
                    onCustomerEmailChange(specialValue);
                  }

                  // Method 3: Try using window-exposed function (emergency fallback)
                  setTimeout(() => {
                    if (formData.welcomeCallCompleted !== isChecked) {
                      console.log("State didn't update, trying window method");
                      try {
                        // @ts-expect-error - Accessing dynamically added window property
                        if (window.forceToggleWelcomeCallStatus) {
                          // @ts-expect-error - Accessing dynamically added window property
                          window.forceToggleWelcomeCallStatus(isChecked);
                        }
                      } catch (e) {
                        console.error("Window method failed", e);
                      }
                    }
                  }, 300);
                }}
              >
                {formData.welcomeCallCompleted
                  ? "✓ VERIFICATION CONFIRMED - Click to Change"
                  : "⚠️ CLICK HERE TO VERIFY COMPLETION"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
          Module Type <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
          Select the type of solar panels to be installed
        </p>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="module-base"
              name="moduleType"
              value="Base Module (405w JA Panel)"
              checked={selectedModuleType === "Base Module (405w JA Panel)"}
              onChange={(e) => onModuleTypeChange(e.target.value as ModuleType)}
              className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <label
              htmlFor="module-base"
              className="text-gray-700 dark:text-gray-200"
            >
              Base Module (405w JA Panel)
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="module-premium"
              name="moduleType"
              value="Premium Module (410w QCell Panel)"
              checked={
                selectedModuleType === "Premium Module (410w QCell Panel)"
              }
              onChange={(e) => onModuleTypeChange(e.target.value as ModuleType)}
              className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <label
              htmlFor="module-premium"
              className="text-gray-700 dark:text-gray-200"
            >
              Premium Module (410w QCell Panel)
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
          Battery Storage <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
          Is there a battery storage system included in this project?
        </p>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-2 border border-gray-200 dark:border-gray-700">
          {["Yes", "No"].map((option) => (
            <div key={option} className="flex items-center space-x-3">
              <input
                type="radio"
                id={`storage-${option}`}
                name="storage"
                value={option}
                checked={selectedStorage === option}
                onChange={(e) => onStorageChange(option as StorageOption)}
                className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label
                htmlFor={`storage-${option}`}
                className="text-gray-700 dark:text-gray-200"
              >
                {option}
              </label>
            </div>
          ))}
        </div>

        {selectedStorage === "Yes" && (
          <div className="mt-6">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
              Storage Option <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
              Select the specific battery storage configuration
            </p>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-2 border border-gray-200 dark:border-gray-700">
              {[
                "1 SE Energy Bank (No Bkup)",
                "2 SE Energy Bank (No Bkup)",
                "3 SE Energy Bank (No Bkup)",
                "1 Enphase 5P (No Bkup)",
                "1 Enphase 5P (Partial Backup)",
                "2 Enphase 5P (No Bkup)",
                "2 Enphase 5P (Partial Backup)",
                "3 Enphase 5P (No Bkup)",
                "3 Enphase 5P (WH Backup)",
                "4 Enphase 5P (No Bkup)",
                "4 Enphase 5P (WH Backup)",
                "1 Franklin Batt (Partial Backup)",
                "1 SE Energy Bank (Partial Backup)",
                "2 SE Energy Bank (WH Backup)",
                "3 SE Energy Bank (WH Backup)",
                "1 Tesla PowerWall 3 (WH Backup)",
                "2 Tesla PowerWall 3 (WH Backup)",
                "3 Tesla PowerWall 3 (WH Backup)",
                "4 Tesla PowerWall 3 (WH Backup)",
              ].map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`storage-option-${option}`}
                    name="storage-option"
                    value={option}
                    checked={selectedStorageOption === option}
                    onChange={(e) =>
                      onStorageOptionChange(option as StorageOption)
                    }
                    className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label
                    htmlFor={`storage-option-${option}`}
                    className="text-gray-700 dark:text-gray-200"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* System Size field - Only for FL state */}
      {formData.state === "FL" && (
        <div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
            System Size <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
            Enter the system size in kW (e.g., 12.50)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="number"
                id="systemSize"
                value={selectedSystemSize}
                onChange={(e) => {
                  // Allow only numbers with up to 2 decimal places
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
                    onSystemSizeChange(value);
                  }
                }}
                step="0.01"
                min="0"
                max="999.99"
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         transition-colors duration-200"
              />
            </div>
          </div>

          {/* Insurance Information Section - Only when system size > 11.75 */}
          {selectedSystemSize && parseFloat(selectedSystemSize) > 11.75 && (
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-orange-600 dark:text-orange-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h4 className="text-base font-bold text-orange-800 dark:text-orange-200">
                    Insurance Information Required{" "}
                    <span className="text-red-500">*</span>
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    For systems over 11.75 kW, please provide homeowner&apos;s
                    insurance information and upload the declaration pages of
                    your HOI (Homeowner&apos;s Insurance).
                  </p>

                  {/* File Upload Section for HOI Declaration Pages */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                      HOI Declaration Pages{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    {/* Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        hoiFiles.length > 0
                          ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20"
                          : "border-orange-300 dark:border-orange-600 hover:border-orange-400 dark:hover:border-orange-500"
                      }`}
                    >
                      <input
                        type="file"
                        id="hoiDeclarationPages"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        multiple
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setIsUploadingHoi(true);
                            try {
                              const filesArray = Array.from(e.target.files);
                              const success = await onFileUpload(
                                e.target.files
                              );
                              if (success) {
                                setHoiFiles((prev) => [
                                  ...prev,
                                  ...filesArray.map((file) => ({
                                    name: file.name,
                                    size: file.size,
                                  })),
                                ]);
                              }
                            } catch (error) {
                              console.error(
                                "Error uploading HOI declaration pages:",
                                error
                              );
                            } finally {
                              setIsUploadingHoi(false);
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor="hoiDeclarationPages"
                        className="cursor-pointer"
                      >
                        <div className="space-y-2">
                          {isUploadingHoi ? (
                            <>
                              <svg
                                className="mx-auto h-8 w-8 text-orange-500 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              <div className="text-sm text-orange-700 dark:text-orange-300">
                                Uploading files...
                              </div>
                            </>
                          ) : hoiFiles.length > 0 ? (
                            <>
                              <svg
                                className="mx-auto h-8 w-8 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <div className="text-sm text-green-700 dark:text-green-300">
                                <span className="font-medium">
                                  Files uploaded successfully!
                                </span>
                                <br />
                                Click to upload additional files
                              </div>
                            </>
                          ) : (
                            <>
                              <svg
                                className="mx-auto h-8 w-8 text-orange-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <div className="text-sm text-orange-700 dark:text-orange-300">
                                <span className="font-medium">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </div>
                            </>
                          )}
                          <div className="text-xs text-orange-600 dark:text-orange-400">
                            PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Uploaded Files List */}
                    {hoiFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h5 className="text-sm font-medium text-green-800 dark:text-green-200">
                          Uploaded Files ({hoiFiles.length}):
                        </h5>
                        {hoiFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800"
                          >
                            <div className="flex items-center space-x-2">
                              <svg
                                className="h-4 w-4 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-sm text-green-800 dark:text-green-200 font-medium">
                                {file.name}
                              </span>
                              <span className="text-xs text-green-600 dark:text-green-400">
                                ({(file.size / 1024 / 1024).toFixed(1)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setHoiFiles((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                      Please ensure the declaration pages clearly show the
                      property address, coverage amounts, and policy details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
          Please check off any add-on products or services sold to the customer
        </h3>
        <div className="mt-1">
          <a
            href="https://help.betterearth.io/adder-options"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
          >
            Click here for information on different add-on products and services
            offered by Better Earth
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
        <div className="space-y-2 mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2">
          {[
            "25 Yr. SE Inverter Warranty Extension",
            "Admin Fee",
            "Attic Run",
            "EV Charger + Install",
            "Ground Mount (16+ Panels)",
            "Equipment in Garage",
            "NEM Aggregation",
            "NEM 2.0 Transfer",
            "Panel Skirting-Metal",
            "Pigeon/Squirrel Guard-Mesh",
            "Remove Existing Solar System",
            "Reroof",
            "Thermal Solar Removal",
          ].map((adder) => (
            <div key={adder} className="flex items-center space-x-3 py-1.5">
              <input
                type="checkbox"
                id={`adder-${adder}`}
                value={adder}
                checked={selectedAdders.includes(adder as Adder)}
                onChange={(e) => {
                  const newAdders = e.target.checked
                    ? [...selectedAdders, adder as Adder]
                    : selectedAdders.filter((a) => a !== adder);
                  onAddersChange(newAdders);
                }}
                className="form-checkbox text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label
                htmlFor={`adder-${adder}`}
                className="text-gray-700 dark:text-gray-200"
              >
                {adder}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Conditional Email of Dialer field */}
      {selectedSalesRepEmail.includes("@betterearth.solar") &&
        selectedLeadId.includes("LightReach") && (
          <div className="mt-6">
            <label className="block text-gray-700 dark:text-gray-200 font-semibold">
              Email of Dialer (if applicable)
            </label>
            <input
              type="email"
              value={selectedDialerEmail}
              onChange={(e) => onDialerEmailChange(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     bg-white dark:bg-[#3A3B3C] dark:text-white"
              placeholder="Enter dialer email"
            />
          </div>
        )}
    </div>
  );
};
