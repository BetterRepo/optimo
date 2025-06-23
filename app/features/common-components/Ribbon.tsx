"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const Ribbon = () => {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    // Function to get today's date with time in PST (Pacific Standard Time)
    const getUSDate = () => {
      // Format date and time in US style with Pacific Time
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: 'America/Los_Angeles' // Pacific Time (PST/PDT)
      };
      
      return new Date().toLocaleString('en-US', options);
    };
    
    // Update the date every second
    setCurrentDate(getUSDate());
    
    // Set up an interval to update the time every second
    const intervalId = setInterval(() => {
      setCurrentDate(getUSDate());
    }, 1000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full bg-[#00D37F] py-2 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Date on the left */}
        <div className="text-white text-sm md:text-base font-medium">
          {currentDate} PST
        </div>
        
        {/* Link in the center */}
        <div className="flex-grow text-center">
          <Link 
            href="https://help.betterearth.io/1caf51ba750180629dd9ccaf7856d4f9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm md:text-base underline hover:opacity-90"
          >
            Click Here to View a Clean Deal Checklist for Each Financier
          </Link>
        </div>
        
        {/* Empty div for balance */}
        <div className="w-20 md:w-40"></div>
      </div>
    </div>
  );
}; 