"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Ribbon } from "../common-components/Ribbon";
import { CentralBlock } from "../common-components/CentralBlock";
import Image from "next/image";
import ProjectCreationForm from "./components/ProjectCreationForm";
import FeatureHeader from "../common-components/FeatureHeader";
import { FaProjectDiagram } from "react-icons/fa";
// import { Logo } from "../common-components/Logo";
import { Footer } from "../common-components/Footer";
import FallbackBanner from "../common-components/FallbackBanner";
import { HelpBubble } from "../common-components/HelpBubble";

export default function ProjectCreationPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main
        className="flex-1 relative"
        style={{
          backgroundImage: 'url("/images/be-2.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Ribbon />
        <div className="absolute inset-0 bg-black/50 transition-opacity duration-200 opacity-0 dark:opacity-100" />

        {/* Logo removed as requested */}

        <div className="container mx-auto pt-40 px-4 pb-20">
          <CentralBlock>
            <FeatureHeader title="Create New Project" Icon={FaProjectDiagram} />
            <div className="bg-white dark:bg-[#151821] rounded-lg shadow-xl p-6">
              {/* <FallbackBanner /> */}
              <Suspense
                fallback={
                  <div className="text-center p-10">Loading form...</div>
                }
              >
                <ProjectCreationForm />
              </Suspense>
            </div>
          </CentralBlock>
        </div>
      </main>

      <Footer />
      <HelpBubble />
    </div>
  );
}
