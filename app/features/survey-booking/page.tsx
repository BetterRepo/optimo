"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QueryParamHandler from "./QueryParamHandler";
import { Ribbon } from "../common-components/Ribbon";
import { CentralBlock } from "../common-components/CentralBlock";
import Image from "next/image";
import { Footer } from "../common-components/Footer";
import { HelpBubble } from "../common-components/HelpBubble";
import FeatureHeader from "../common-components/FeatureHeader";
import { FaCalendarCheck } from "react-icons/fa";

// Extract search params logic to a client component
function SearchParamsHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams?.get("state");
  const warehouse = searchParams?.get("warehouse");

  useEffect(() => {
    // Arizona redirect logic - DISABLED to enable AZ booking
    // Get state and normalize to uppercase to handle case sensitivity
    const normalizedState = state ? state.toUpperCase() : '';
    
    // NOTE: Arizona redirect logic has been disabled to enable AZ survey booking
    // Previously redirected Arizona customers to the Arizona contact page
    // if (normalizedState === 'AZ' || normalizedState === 'ARIZONA' || warehouse === 'Phoenix, AZ') {
    //   console.log("👀 Arizona detected in SurveyBookingPage. State:", state, "Warehouse:", warehouse);
    //   console.log("🔄 Redirecting to Arizona contact page");
    //   router.push('/features/survey-booking/arizona-contact');
    // }
    
    console.log("👀 State detected in SurveyBookingPage. State:", state, "Warehouse:", warehouse);
  }, [state, warehouse, router]);

  return null;
}

export default function SurveyBookingPage() {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow relative">
        <Ribbon />
        <div 
          className="absolute inset-0 bg-[url('/images/be-2.png')] bg-cover bg-center bg-no-repeat animate-kenburns"
        >
          {/* Background overlay filter */}
          <div className="absolute inset-0 bg-black/20 backdrop-brightness-[0.9] backdrop-saturate-[0.9]" />

          {/* Existing filters */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-200/10 via-amber-100/5 to-sky-200/5 mix-blend-soft-light transition-opacity duration-200 opacity-100 dark:opacity-0" />
          <div className="absolute inset-0 bg-[#f5d0a3]/10 mix-blend-overlay transition-opacity duration-200 opacity-100 dark:opacity-0" />
          <div className="absolute inset-0 bg-black/50 transition-opacity duration-200 opacity-0 dark:opacity-100" />
        </div>

        {/* Content container */}
        <div className="container mx-auto py-16 px-4 relative">
          <CentralBlock>
            <FeatureHeader title="Book a Survey" Icon={FaCalendarCheck} />
            {/* Wrap both components that use search params in Suspense */}
            <Suspense fallback={<div>Loading...</div>}>
              <SearchParamsHandler />
              <QueryParamHandler />
            </Suspense>
          </CentralBlock>
        </div>
      </div>
      
      <div className="w-full">
        <Footer />
        <HelpBubble />
      </div>
    </div>
  );
}