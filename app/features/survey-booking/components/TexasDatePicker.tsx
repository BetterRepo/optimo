"use client";

import * as React from "react";
import { format, addDays, isWeekend, getDay, isSameDay } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/features/common-components/button";
import { Calendar } from "@/app/features/common-components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/features/common-components/popover";

interface TexasDatePickerProps {
  onSelect?: (date: Date | undefined) => void;
  texasProximity?: 'Dallas' | 'Houston';
  warehouse?: string; // Add warehouse prop to check for Florida-specific exclusions
}

export function TexasDatePicker({ onSelect, texasProximity, warehouse }: TexasDatePickerProps) {
  // DEBUG: Log the props being received
  console.log(`TexasDatePicker - Component props:`, { 
    texasProximity, 
    warehouse,
    propsReceived: { texasProximity, warehouse } 
  });
  
  // Get the current PST date and time
  function getCurrentPSTDate() {
    // Create a formatter that will give us PST time components
    const pstFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    
    // Get the parts of the current time in PST
    const parts = pstFormatter.formatToParts(new Date());
    
    // Build an object with the date components
    const dateComponents = parts.reduce((acc, part) => {
      if (part.type !== 'literal') {
        acc[part.type] = parseInt(part.value, 10);
      }
      return acc;
    }, {} as Record<string, number>);
    
    // Create a new Date object using PST components (in local time zone)
    // Month is 0-indexed in JavaScript Date
    const pstDate = new Date(
      dateComponents.year,
      dateComponents.month - 1,
      dateComponents.day,
      dateComponents.hour,
      dateComponents.minute,
      dateComponents.second
    );
    
    console.log(`TexasDatePicker - Generated PST date: ${pstDate.toISOString()}`);
    return pstDate;
  }
  
  // Function to determine if we're past the cutoff time (5 PM PST)
  function isPastCutoffTime() {
    const pstDate = getCurrentPSTDate();
    const isPast5PM = pstDate.getHours() >= 17; // 5 PM = 17:00
    
    console.log(`TexasDatePicker - Current PST time: ${pstDate.toLocaleTimeString()}, Hour: ${pstDate.getHours()}, Past 5 PM: ${isPast5PM}`);
    
    return isPast5PM;
  }
  
  const isCutoff = isPastCutoffTime();
  
  // Calculate all dates based on PST current date
  const today = getCurrentPSTDate();
  // Reset hours to start of day for consistent date comparisons
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);
  
  console.log(`TexasDatePicker - PST Today: ${format(today, 'yyyy-MM-dd')}`);
  console.log(`TexasDatePicker - PST Tomorrow: ${format(tomorrow, 'yyyy-MM-dd')}`);
  
  // If it's past 5 PM PST, minimum booking is 2 days out, otherwise 1 day
  const minAdvanceDays = isCutoff ? 2 : 1;
  console.log(`TexasDatePicker - Minimum advance days: ${minAdvanceDays} (cutoff passed: ${isCutoff})`);
  
  // Set initial default date - will be adjusted for weekends and Texas rules below
  let defaultDate = isCutoff ? dayAfterTomorrow : tomorrow;
  
  // Custom function to disable dates - combining cutoff rule, weekends, and Texas rules
  function isDateDisabled(date: Date) {
    // First check: Is it a weekend?
    const dayOfWeek = getDay(date);
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;
    
    // DEBUG: Log the proximity and day being checked
    console.log(`TexasDatePicker - Checking date ${format(date, 'yyyy-MM-dd')} (day ${dayOfWeek}) with proximity: ${texasProximity}`);
    
    // Sunday and Saturday are always blocked (weekends)
    if (isSunday || isSaturday) {
      console.log(`TexasDatePicker - Date ${format(date, 'yyyy-MM-dd')} disabled because: Weekend (${isSunday ? 'Sunday' : 'Saturday'}) - dayOfWeek: ${dayOfWeek}`);
      return true;
    }
    
    // Second check: Is it before our minimum allowed date?
    // Compare using midnight-aligned dates for consistent comparison
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    const minDate = isCutoff ? dayAfterTomorrow : tomorrow;
    const isTooEarly = dateToCheck < minDate;
    
    if (isTooEarly) {
      console.log(`TexasDatePicker - Date ${format(date, 'yyyy-MM-dd')} disabled because: too early (cutoff rule)`);
      return true;
    }
    
    // Third check: Texas proximity rules
    let isInvalidForTexas = false;
    if (texasProximity === 'Dallas') {
      // Dallas: Only allow Wednesday (3) and Thursday (4)
      isInvalidForTexas = !(dayOfWeek === 3 || dayOfWeek === 4);
      console.log(`TexasDatePicker - Dallas check: day ${dayOfWeek}, allowed days: Wed(3), Thu(4), isInvalid: ${isInvalidForTexas}`);
    } else if (texasProximity === 'Houston') {
      // Houston: Only allow Monday (1), Tuesday (2), and Friday (5)
      isInvalidForTexas = !(dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 5);
      console.log(`TexasDatePicker - Houston check: day ${dayOfWeek}, allowed days: Mon(1), Tue(2), Fri(5), isInvalid: ${isInvalidForTexas}`);
    } else {
      console.log(`TexasDatePicker - No proximity selected or unrecognized proximity: ${texasProximity}`);
    }
    
    // Florida-specific blackout dates (May 15-16, 2025)
    const isFloridaBlackoutDate = warehouse === 'Lakeland, FL' && (
      (date.getFullYear() === 2025 && date.getMonth() === 4 && (date.getDate() === 15 || date.getDate() === 16))
    );
    
    if (isFloridaBlackoutDate) {
      console.log(`TexasDatePicker - Date ${format(date, 'yyyy-MM-dd')} disabled because: Florida blackout date`);
    }
    
    const isDisabled = isInvalidForTexas || isFloridaBlackoutDate;
    
    if (isDisabled) {
      const reason = isInvalidForTexas ? `invalid day for ${texasProximity}` : 
                    (isFloridaBlackoutDate ? 'Florida blackout date' : 'unknown');
      
      console.log(`TexasDatePicker - Date ${format(date, 'yyyy-MM-dd')} disabled because: ${reason}`);
    } else {
      console.log(`TexasDatePicker - Date ${format(date, 'yyyy-MM-dd')} is ENABLED for ${texasProximity}`);
    }
    
    return isDisabled;
  }
  
  // Find the next valid date (not weekend, respects cutoff and Texas rules)
  while (isDateDisabled(defaultDate)) {
    console.log(`TexasDatePicker - Default date ${format(defaultDate, 'yyyy-MM-dd')} is invalid, adding one day`);
    defaultDate = addDays(defaultDate, 1);
  }
  
  console.log(`TexasDatePicker - Final default date: ${format(defaultDate, 'yyyy-MM-dd')}`);
  
  // Set the default state to undefined so the user must make a selection
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  // DEBUG: Monitor prop changes
  React.useEffect(() => {
    console.log(`TexasDatePicker - useEffect triggered, texasProximity changed to:`, texasProximity);
  }, [texasProximity]);

  function handleSelect(selectedDate: Date | undefined) {
    if (selectedDate && isDateDisabled(selectedDate)) {
      console.error(`TexasDatePicker - Prevented selection of disabled date: ${format(selectedDate, 'yyyy-MM-dd')}`);
      return; // Prevent selecting disabled dates as a safeguard
    }
    
    setDate(selectedDate); // Update the internal state

    if (onSelect) {
      onSelect(selectedDate); // Call the parent-provided onSelect function if it exists
    }
  }

  return (
    <div className="flex flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            fromDate={isCutoff ? dayAfterTomorrow : tomorrow} // Enforce minimum date based on cutoff
            disabled={isDateDisabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      {/* Cutoff time indicator */}
      <div className="flex items-center mt-2 text-sm">
        <ClockIcon className="mr-1 h-3.5 w-3.5 text-amber-500" />
        <span className={isCutoff ? "text-amber-600 font-medium" : "text-gray-500"}>
          {isCutoff 
            ? "Cutoff time passed (5:00 PM PST) - Next day booking unavailable" 
            : "Cutoff time: 5:00 PM PST"}
        </span>
      </div>
    </div>
  );
} 