// SlotList.tsx
import React from "react";
import { Slot } from "./Slot";

interface SlotListProps {
  availableSlots: any[] | undefined;
  selectedSlot: { value: string; reservationId: string } | null;
  handleSlotSelect: (value: string, reservationId: string) => void;
}

export const SlotList: React.FC<SlotListProps> = ({
  availableSlots = [],
  selectedSlot,
  handleSlotSelect,
}) => {
  if (!availableSlots) return null;

  const formatTime = (time: string) => {
    const timeOnly = time.split("T")[1].substring(0, 5);
    const [hours, minutes] = timeOnly.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const formattedMinutes = minutes.padStart(2, "0");
    return `${hour12}:${formattedMinutes} ${ampm}`;
  };

  return (
    <div className="space-y-3">
      {availableSlots.length > 0 ? (
        availableSlots.map((slot, index) => {
          const originalSlot = `${slot.from} - ${slot.to}`;
          const formattedSlot = `${formatTime(slot.from)} - ${formatTime(
            slot.to
          )}`;
          // Add star inside the slot label for the first slot
          const slotLabel =
            index === 0 ? `${formattedSlot} ⭐️` : formattedSlot;
          return (
            <div key={index} className="flex items-center w-full">
              <div className="flex-1">
                <Slot
                  valueSlot={slotLabel}
                  onSelect={() =>
                    handleSlotSelect(originalSlot, slot.reservationId)
                  }
                  isSelected={selectedSlot?.value === originalSlot}
                  reservationId={slot.reservationId}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center">No available slots</p>
      )}
    </div>
  );
};

export default SlotList;
