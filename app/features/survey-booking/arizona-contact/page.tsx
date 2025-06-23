"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import DarkModeToggle from "@/app/components/DarkModeToggle";

export default function ArizonaContactPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Check if dark mode is enabled
    const darkModeEnabled = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModeEnabled);

    // Set a timer to stop the confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Handle dark mode toggle
  const handleDarkModeToggle = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  };

  // Animation classes
  const fadeIn = "animate-[fadeIn_0.6s_ease-in-out]";
  const slideUp = "animate-[slideUp_0.5s_ease-in-out]";
  const scaleIn = "animate-[scaleIn_0.5s_ease-in-out]";

  return (
    <div className="min-h-screen overflow-y-auto w-full bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Background container */}
      <div className="relative w-full bg-[url('/images/be-2.png')] bg-cover bg-center bg-no-repeat">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60" />

        {/* Confetti overlay */}
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={350}
            gravity={0.15}
          />
        )}

        {/* Content container with proper scrolling */}
        <div className="relative w-full py-12 pb-24 px-4 flex flex-col items-center">
          <div className={`w-full max-w-3xl mb-12 ${fadeIn}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Success header with gradient - matching survey-booking-successful design */}
              <div className="bg-gradient-to-r from-green-500/90 to-teal-500/90 p-5 text-center">
                <div className={`flex justify-center mb-2 ${scaleIn}`} style={{ animationDelay: '0.2s' }}>
                  <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h1 className={`text-xl font-medium text-white ${fadeIn}`} style={{ animationDelay: '0.4s' }}>
                  Your Project and Survey have been successfully submitted!
                </h1>
              </div>

              <div className="p-8">
                <div className={`mb-6 ${slideUp}`} style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center mb-4">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full mr-3"></div>
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white">Thank You for Your Interest!</h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    We've received your information for our Arizona service area.
                  </p>
                </div>

                <div className={`space-y-6 ${fadeIn}`} style={{ animationDelay: '0.7s' }}>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 shadow-md border border-blue-100 dark:border-blue-900/30">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Important Information</h3>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      For customers in Arizona, our process is different. Instead of scheduling a survey appointment:
                    </p>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 mb-6">
                      <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                        A representative will contact you within 24-48 hours
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Our Arizona team will reach out to discuss your solar project needs directly.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-md border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
                        <h3 className="text-base font-medium text-blue-800 dark:text-blue-300 mb-4 pl-4">What to Expect:</h3>
                        <ul className="space-y-3 list-none pl-4">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">
                              Our Arizona team will discuss your project requirements and provide information about our solar solutions.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">
                              We'll assess your property using satellite imagery and provide a preliminary estimate.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">
                              We'll assign you a dedicated project manager who will guide you through the entire process.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 shadow-md border border-green-100 dark:border-green-900/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-500 to-teal-500"></div>
                        <h3 className="text-base font-medium text-green-800 dark:text-green-300 mb-4 pl-4">For You:</h3>
                        <ul className="space-y-3 list-none pl-4">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">
                              We'll keep you informed throughout the entire process with regular updates.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">
                              We'll provide a detailed Scope of Work tailored to your specific needs and property.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">
                              Our Arizona team specializes in streamlined installations with minimal disruption to your home.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  
                    <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        To find your project manager and stay up to date on your project, we recommend you check out:
                      </p>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mb-2">
                        <Link href="https://www.notion.so/Pangea-ff446c0516854eb69eb929009c7579ba?pvs=21" 
                          className="inline-flex items-center px-5 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-md transition duration-200 transform hover:scale-105">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pangea
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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