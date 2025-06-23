"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProjectCreationFormData } from '../types';
import { Logo } from '../../common-components/Logo';

export default function ProjectCreationSuccessful() {
  const [recap, setRecap] = useState<ProjectCreationFormData | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
    
    const storedRecap = localStorage.getItem('projectCreationRecap');
    if (storedRecap) {
      setRecap(JSON.parse(storedRecap));
      localStorage.removeItem('projectCreationRecap');
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Animation classes for elements as they appear
  const fadeIn = "animate-[fadeIn_0.6s_ease-in-out]";
  const slideUp = "animate-[slideUp_0.5s_ease-in-out]";
  const scaleIn = "animate-[scaleIn_0.5s_ease-in-out]";

  return (
    <div className="min-h-screen overflow-y-auto w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 py-12 px-4 pb-24">
        <div className="text-center space-y-4">
          <div className={`flex justify-center ${scaleIn}`}>
            <div className="h-16 w-16 bg-gradient-to-br from-green-400/90 to-emerald-500/90 rounded-full flex items-center justify-center shadow-md">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <div className={`space-y-3 ${fadeIn}`} style={{ animationDelay: '0.2s' }}>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
              Project Submitted Successfully!
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Thank you for submitting your TPO project. We&apos;re excited to begin your solar journey!
            </p>
          </div>
        </div>

        {recap && (
          <div className={`w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${slideUp}`} style={{ animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-4 px-8">
              <h2 className="text-lg font-bold text-white">Project Summary</h2>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{recap.firstName} {recap.lastName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      {recap.streetAddress}, {recap.city}, {recap.state} {recap.postalCode}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Warehouse</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{recap.warehouse}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Finance Company</p>
                    <p className="text-base  text-gray-900 dark:text-white">{recap.financeCompany}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Finance Type</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{recap.financeType}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Lead Type</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{recap.leadType}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Module Count</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{recap.moduleCount}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Module Type</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{recap.moduleType}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage Option</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{recap.storage}</p>
                  </div>
                </div>
              </div>
              
              {recap.adders.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start mb-4">
                    <svg className="h-5 w-5 text-teal-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Additional Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recap.adders.map((adder, index) => (
                      <div key={index} className="flex items-center bg-gray-50 dark:bg-gray-700/30 rounded-lg px-4 py-2.5">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300 font-bold">{adder}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`w-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-12 text-center shadow-xl ${fadeIn}`} style={{ animationDelay: '0.5s' }}>
          <div className="max-w-2xl mx-auto">
            <svg className="h-16 w-16 text-blue-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready for Your Site Survey?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Schedule your site survey now to move forward with your solar journey
            </p>
            <Link
              href={{
                pathname: recap?.state?.toUpperCase() === 'AZ' || 
                         recap?.state?.toUpperCase() === 'ARIZONA' || 
                         recap?.warehouse === 'Phoenix, AZ' 
                  ? '/features/survey-booking/arizona-contact'
                  : '/features/survey-booking',
                query: (recap && 
                       recap.state?.toUpperCase() !== 'AZ' && 
                       recap.state?.toUpperCase() !== 'ARIZONA' && 
                       recap.warehouse !== 'Phoenix, AZ') ? {
                  firstName: recap.firstName,
                  lastName: recap.lastName,
                  streetAddress: recap.streetAddress,
                  city: recap.city,
                  state: recap.state,
                  postalCode: recap.postalCode,
                  warehouse: recap.warehouse
                } : {}
              }}
              className="inline-flex items-center justify-center px-8 py-4 
                       bg-white text-blue-700 text-lg font-bold rounded-lg 
                       shadow-lg hover:bg-blue-50 hover:shadow-xl
                       transition-all duration-200 transform hover:scale-105"
            >
              Schedule Site Survey 
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Add animation keyframes and ensure proper scrolling */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        /* Ensure proper scrolling behavior */
        html, body {
          height: 100%;
          min-height: 100%;
          margin: 0;
          padding: 0;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Set a specific min-height to ensure content is visible */
        .min-h-screen {
          min-height: 100vh;
          height: auto;
          position: relative;
          overflow-y: visible;
        }
        
        /* Add extra padding for mobile devices */
        @media screen and (max-width: 768px) {
          .pb-24 {
            padding-bottom: 8rem !important;
          }
        }
        
        /* Add even more padding for shorter screens */
        @media screen and (max-height: 700px) {
          .pb-24 {
            padding-bottom: 12rem !important;
          }
        }
      `}</style>
    </div>
  );
} 