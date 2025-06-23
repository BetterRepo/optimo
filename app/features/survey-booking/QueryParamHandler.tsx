"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import HomeContent from './components/HomeContent';
import { SurveyFormData } from './types/FormData';
import { Warehouse } from './types/Warehouse';
import { findWarehouseByZip } from './utils/findWarehouseByZip';

export default function QueryParamHandler() {
  const searchParams = useSearchParams();
  const isAdditionalSurvey = searchParams.get("additionalSurveyBooking") === "true";
  const isSurveyBooking = searchParams.get("surveyBooking") === "true";
  const token = searchParams.get("token") || "";
  const disableAddress = searchParams.get("disableAddress") === "true";
  
  console.log('URL Parameters:', {
    additionalSurveyBooking: searchParams.get("additionalSurveyBooking"),
    surveyBooking: searchParams.get("surveyBooking"),
    quickbaseRecordId: searchParams.get("quickbaseRecordId"),
    token: token,
    disableAddress
  });

  const [formData, setFormData] = useState<SurveyFormData>({
    isAdditionalSurvey,
    isSurveyBooking,
    internal: isAdditionalSurvey || isSurveyBooking,
    disableAddress,
    quickbaseRecordId: searchParams.get("quickbaseRecordId") || "",
    projectName: searchParams.get("projectName") || "",
    customerEmail: searchParams.get("customerEmail") || "",
    customerPhone: searchParams.get("customerPhone") || "",
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    token: token,
    // Add new fields at the top
    language: 'en',
    phone: '',
    email: '',
    
    // Address info
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    warehouse: 'Out of Region' as Warehouse,
    
    // Secondary contact info
    hasSecondaryContact: false,
    secondaryContactName: '',
    secondaryContactRelationship: '',
    secondaryContactPhone: '',
    secondaryContactEmail: '',
    secondaryContactLanguage: 'en',
    
    // Legacy secondary contact fields
    secondaryFirstName: '',
    secondaryLastName: '',
    secondaryPhone: '',
    secondaryEmail: '',
    secondaryLanguage: 'en',
    
    // Tenant info
    hasTenants: false,
    tenantName: '',
    tenantPhone: '',
    tenantEmail: '',
    tenantLanguage: 'en',
    
    // Contact preferences
    preferredContactMethod: 'phone',
    preferredContactTime: 'morning',
    
    // Property info
    propertyType: 'single_family',
    propertyOwnership: 'own',
    propertyAccess: 'no_restrictions',
    parkingAvailable: true,
    specialInstructions: '',
    pets: false,
    petDetails: '',
    
    // Survey Questions
    hasBatteries: false,
    designPreference: '',
    isSharedRoof: false,
    hasRecentConstruction: false,
    constructionDetails: '',
    roofAge: '',
    roofMaterial: '',
    roofLayers: '',
    hasHOA: false,
    hoaName: '',
    hoaPhone: '',
    hoaEmail: '',
    hasHOAContact: false,
    hasVaultedCeilings: false,
    numberOfStories: '',
    stories: '',
    hasOngoingConstruction: false,
    ongoingConstructionDetails: '',
    hasExistingSolar: false,
    existingSolarDetails: '',
    hasSkylights: false,
    skylightCount: '',
    roofVentType: '',
    hasOutsidePanel: false,
    hasBlockedAccess: false,
    gateAccessType: '',
    gateCode: '',
    
    // Time slot fields
    selectedDate: '',
    selectedTimeSlot: ''
  });

  console.log('Form Data State:', {
    isAdditionalSurvey: formData.isAdditionalSurvey,
    isSurveyBooking: formData.isSurveyBooking,
    quickbaseRecordId: formData.quickbaseRecordId
  });

  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ value: string; reservationId: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const postalCode = searchParams.get("postalCode") || "";
    const warehouse = findWarehouseByZip(postalCode);
    const language = searchParams.get("language") || "en";
    
    // Get phone numbers and emails with fallbacks
    const phone = searchParams.get("phone") || ""; 
    const email = searchParams.get("email") || "";
    const customerEmail = searchParams.get("customerEmail") || "";
    const customerPhone = searchParams.get("customerPhone") || "";

    console.log('Parsing URL parameters for survey booking:', {
      phone, email, customerEmail, customerPhone,
      isAdditionalSurvey: searchParams.get("additionalSurveyBooking") === "true",
      isSurveyBooking: searchParams.get("surveyBooking") === "true",
      firstName: searchParams.get("firstName"),
      lastName: searchParams.get("lastName"),
      token: searchParams.get("token"),
    });

    setFormData(prevData => ({
      ...prevData,
      isAdditionalSurvey: searchParams.get("additionalSurveyBooking") === "true",
      isSurveyBooking: searchParams.get("surveyBooking") === "true",
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      streetAddress: searchParams.get("streetAddress") || "",
      city: searchParams.get("city") || "",
      state: searchParams.get("state") || "",
      postalCode,
      warehouse,
      token: searchParams.get("token") || "",
      // Add contact info from URL parameters with fallbacks
      language: language === "Spanish" ? "Spanish" : "English",
      phone: phone || customerPhone || "",
      email: email || customerEmail || "",
      customerEmail: customerEmail || email || "",
      customerPhone: customerPhone || phone || "",
      quickbaseRecordId: searchParams.get("quickbaseRecordId") || "",
    }));
  }, [searchParams]);

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <HomeContent
        formData={formData}
        setFormData={setFormData}
        availableSlots={availableSlots}
        setAvailableSlots={setAvailableSlots}
        orderNo={orderNo}
        setOrderNo={setOrderNo}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </React.Suspense>
  );
}