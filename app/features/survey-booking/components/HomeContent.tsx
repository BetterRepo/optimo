// HomeContent.tsx

"use client";

import React from "react";
import { BookingForm } from "../components/home/BookingForm";
import { SurveyFormData } from "../types/FormData";

interface HomeContentProps {
  formData: SurveyFormData;
  setFormData: React.Dispatch<React.SetStateAction<SurveyFormData>>;
  availableSlots: any[];
  setAvailableSlots: React.Dispatch<React.SetStateAction<any[]>>;
  orderNo: string | null;
  setOrderNo: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSlot: { value: string; reservationId: string } | null;
  setSelectedSlot: React.Dispatch<React.SetStateAction<{ value: string; reservationId: string } | null>>;
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const HomeContent: React.FC<HomeContentProps> = ({
  formData,
  setFormData,
  availableSlots,
  setAvailableSlots,
  orderNo,
  setOrderNo,
  selectedSlot,
  setSelectedSlot,
  selectedDate,
  setSelectedDate
}) => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-120px)] flex flex-col">
      <div className="flex-grow bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 overflow-y-auto">
        <BookingForm 
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
      </div>
    </div>
  );
};

export default HomeContent;