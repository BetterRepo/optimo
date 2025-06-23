import React from 'react';

const FallbackBanner = () => {
  return (
    <div className="bg-[#FFF9E6] p-4 text-center text-gray-600">
      If you experience any issues with this form, please use our{' '}
      <a
        href="https://betterearth.jotform.com/232435696388167"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-700"
      >
        alternative form
      </a>
    </div>
  );
};

export default FallbackBanner; 