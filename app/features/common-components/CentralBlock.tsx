"use client";

import React, { useState, createContext, useContext } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { translations } from '../../translations';

type TranslationKey = 
  | 'yes'
  | 'no'
  | 'firstName'
  | 'lastName'
  | 'streetAddress'
  | 'city'
  | 'state'
  | 'postalCode'
  | 'warehouse'
  | 'preferredLanguage'
  | 'step2Title'
  | 'secondaryContactQuestion'
  | 'secondaryContactName'
  | 'secondaryContactRelationship'
  | 'secondaryContactPhone'
  | 'secondaryContactEmail'
  | 'selectRelationship'
  | 'spouse'
  | 'partner'
  | 'parent'
  | 'child'
  | 'friend'
  | 'otherFamily'
  | 'other'
  | 'required'
  | 'selectLanguage'
  | 'tenantQuestion'
  | 'tenantName'
  | 'tenantPhone'
  | 'tenantEmail';

export const LanguageContext = createContext({
  isSpanish: false,
  toggleLanguage: () => {},
  t: (key: TranslationKey) => key as string
});

export const useLanguage = () => useContext(LanguageContext);

export const CentralBlock = ({ children }: { children: React.ReactNode }) => {
  const [isSpanish, setIsSpanish] = useState(false);

  const toggleLanguage = () => {
    setIsSpanish(prev => !prev);
    console.log('Language toggled:', !isSpanish);
  };

  const t = (key: TranslationKey) => {
    const lang = isSpanish ? 'es' : 'en';
    const translation = translations[lang][key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ isSpanish, toggleLanguage, t }}>
      <div className="fixed top-[50px] left-0 right-0 bottom-[10px] m-auto
                    bg-white dark:bg-[#262626] rounded-lg shadow-lg p-8 px-16
                    w-[90%] max-w-[800px] h-[85%] max-h-[900px] overflow-auto z-50
                    transition-colors duration-200 dark:text-white">
        <ThemeToggle isSpanish={isSpanish} toggleLanguage={toggleLanguage} />
        {children}
      </div>
    </LanguageContext.Provider>
  );
}; 