import React from 'react';

export const OutOfRegionMessage: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <div className="flex items-center space-x-3 mb-4">
      <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Outside Service Area
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          We apologize, but this location is outside our current service area. Please contact Better Earth directly to discuss survey options.
          And checkout our territory map{' '}
          <a
            href="https://help.betterearth.io/territory-map#block-a1ded0c0121942529f2b0973c7a708e6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline font-medium transition-colors duration-200"
          >
            here
          </a>.
        </p>
      </div>
    </div>
  </div>
  );
}; 