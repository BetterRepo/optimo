import * as React from "react";

interface SlotProps {
  valueSlot: string;
  onSelect: (value: string, reservationId: string) => void;
  isSelected: boolean;
  reservationId: string;
}

export function Slot({ valueSlot, onSelect, isSelected, reservationId }: SlotProps) {
  return (
    <button
  onClick={() => onSelect(valueSlot, reservationId)}
  className={`max-w-[200px] mx-auto p-3 rounded-xl transition-all duration-200 ease-in-out
            text-base font-medium block w-full
            ${
              isSelected
                ? 'bg-green-50 border-2 border-[#5FCF87] text-[#5FCF87] dark:bg-green-900/20 dark:text-[#5FCF87]'
                : 'border border-[#5FCF87] text-[#5FCF87] dark:text-[#5FCF87] hover:border-[#1a5c31] hover:bg-green-50/50 dark:hover:bg-green-900/10'
            }
            shadow-sm hover:shadow-md`}
>
  {valueSlot}
</button>
  );
}