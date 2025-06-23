import React from 'react';

export const BatteryInstallationNotice: React.FC = () => {
  return (
    <div className="my-6 p-4 bg-gradient-to-r from-[#195061]/10 to-[#195061]/5 border-l-4 border-[#195061] rounded-md shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#195061]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Please be aware that batteries will be installed on the outside of the customer&apos;s home. If the necessary space to install the selected number of batteries is not available, you will be notified on your Scope Of Work.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BatteryInstallationNotice; 