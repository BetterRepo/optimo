import React from 'react';

interface NoAvailabilityNoticeProps {
  address?: string;
  onContactSupport?: () => void;
}

export const NoAvailabilityNotice: React.FC<NoAvailabilityNoticeProps> = ({
  address,
  onContactSupport
}) => {
  return (
    <div className="mt-6 p-5 bg-white border border-red-200 rounded-lg shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">No Available Time Slots Found</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>
              We&apos;re having trouble finding available time slots for {address ? <span className="font-medium">&quot;{address}&quot;</span> : 'this address'}.
            </p>
            <p className="mt-1">
              This could be due to one of the following reasons:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>No available appointments in our system for this location</li>
              <li>The address may be outside our service area</li>
              <li>There might be a technical issue with our scheduling system</li>
            </ul>
          </div>
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onContactSupport}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#195061] hover:bg-[#154455] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#195061]"
              >
                Contact Support
              </button>
              <a
                href="/features/survey-booking"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#195061]"
              >
                Try a Different Address
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoAvailabilityNotice; 