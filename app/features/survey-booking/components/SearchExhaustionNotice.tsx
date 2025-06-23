import React from 'react';

interface SearchExhaustionNoticeProps {
  onReportIssue: () => void;
  onKeepSearching: () => void;
}

export const SearchExhaustionNotice: React.FC<SearchExhaustionNoticeProps> = ({
  onReportIssue,
  onKeepSearching,
}) => {
  return (
    <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-yellow-800">We&apos;ve searched extensively</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              We&apos;ve looked through many dates but haven&apos;t found any available time slots for this address.
            </p>
            <p className="mt-1">
              This could mean that:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>There might be limited or no availability in your area</li>
              <li>Our scheduling system is experiencing high demand</li>
              <li>There could be a technical issue with our system</li>
            </ul>
          </div>
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onKeepSearching}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Keep Searching
              </button>
              <button
                type="button"
                onClick={onReportIssue}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#195061]"
              >
                Report Issue to Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchExhaustionNotice; 