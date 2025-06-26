"use client"; // Ensure this is at the top of the file

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

interface DatePickerProps {
  onSelect?: (date: Date | undefined) => void; // Accepts an optional onSelect prop
  warehouse?: string; // Add warehouse prop to check for Florida-specific exclusions
}

export function DatePicker({ onSelect, warehouse }: DatePickerProps) {
  // Get the current PST date and time
  function getCurrentPSTDate() {
    // Create a formatter that will give us PST time components
    const pstFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

    // Get the parts of the current time in PST
    const parts = pstFormatter.formatToParts(new Date());

    // Build an object with the date components
    const dateComponents = parts.reduce((acc, part) => {
      if (part.type !== "literal") {
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

    console.log(`DatePicker - Generated PST date: ${pstDate.toISOString()}`);
    return pstDate;
  }

  // Function to determine if we're past the cutoff time (5 PM PST)
  function isPastCutoffTime() {
    const pstDate = getCurrentPSTDate();
    const isPast5PM = pstDate.getHours() >= 17; // 5 PM = 17:00

    console.log(
      `DatePicker - Current PST time: ${pstDate.toLocaleTimeString()}, Hour: ${pstDate.getHours()}, Past 5 PM: ${isPast5PM}`
    );

    return isPast5PM;
  }

  const isCutoff = isPastCutoffTime();

  // Calculate all dates based on PST current date
  const today = getCurrentPSTDate();
  // Reset hours to start of day for consistent date comparisons
  today.setHours(0, 0, 0, 0);

  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  console.log(`DatePicker - PST Today: ${format(today, "yyyy-MM-dd")}`);
  console.log(`DatePicker - PST Tomorrow: ${format(tomorrow, "yyyy-MM-dd")}`);

  // If it's past 5 PM PST, minimum booking is 2 days out, otherwise 1 day
  const minAdvanceDays = isCutoff ? 2 : 1;
  console.log(
    `DatePicker - Minimum advance days: ${minAdvanceDays} (cutoff passed: ${isCutoff})`
  );

  // Set initial default date - will be adjusted for weekends below
  let defaultDate = isCutoff ? dayAfterTomorrow : tomorrow;

  // Custom function to disable dates - VERY explicit checks
  function isDateDisabled(date: Date) {
    // First check: Is it a weekend?
    const dayOfWeek = getDay(date);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday

    // Second check: Is it before our minimum allowed date?
    // Compare using midnight-aligned dates for consistent comparison
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);

    const minDate = isCutoff ? dayAfterTomorrow : tomorrow;
    const isTooEarly = dateToCheck < minDate;

    // Florida-specific blackout dates (May 15-16, 2025)
    const isFloridaBlackoutDate =
      warehouse === "Lakeland, FL" &&
      date.getFullYear() === 2025 &&
      date.getMonth() === 4 &&
      (date.getDate() === 15 || date.getDate() === 16);

    if (isFloridaBlackoutDate) {
      console.log(
        `DatePicker - Date ${format(
          date,
          "yyyy-MM-dd"
        )} disabled because: Florida blackout date`
      );
    }

    const isDisabled = isWeekend || isTooEarly || isFloridaBlackoutDate;

    if (isDisabled) {
      console.log(
        `DatePicker - Date ${format(date, "yyyy-MM-dd")} disabled because: ${
          isWeekend
            ? "weekend"
            : isTooEarly
            ? "too early (cutoff rule)"
            : isFloridaBlackoutDate
            ? "Florida blackout date"
            : "unknown"
        }`
      );
    }

    return isDisabled;
  }

  // Find the next valid date (not weekend, respects cutoff)
  while (isDateDisabled(defaultDate)) {
    console.log(
      `DatePicker - Default date ${format(
        defaultDate,
        "yyyy-MM-dd"
      )} is invalid, adding one day`
    );
    defaultDate = addDays(defaultDate, 1);
  }

  console.log(
    `DatePicker - Final default date: ${format(defaultDate, "yyyy-MM-dd")}`
  );

  // Set the default state to the next available valid day
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);

  function handleSelect(selectedDate: Date | undefined) {
    if (selectedDate && isDateDisabled(selectedDate)) {
      console.error(
        `DatePicker - Prevented selection of disabled date: ${format(
          selectedDate,
          "yyyy-MM-dd"
        )}`
      );
      return; // Prevent selecting disabled dates as a safeguard
    }

    setDate(selectedDate); // Update the internal state

    if (onSelect) {
      onSelect(selectedDate); // Call the parent-provided onSelect function if it exists
    }
  }

  return (
    <div className="flex flex-col items-center w-full min-h-[420px] px-2 sm:px-0">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100 dark:border-gray-800 flex flex-col items-center">
        <h2 className="text-2xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white mb-2 tracking-tight">
          Select a Date
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-4 sm:mb-6 text-sm">
          Choose your preferred survey date from the calendar below.
        </p>
        <div className="w-full flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            fromDate={isCutoff ? dayAfterTomorrow : tomorrow}
            disabled={isDateDisabled}
            initialFocus
            className="rounded-xl border shadow bg-white dark:bg-gray-900 mx-auto mb-4 w-full max-w-xs sm:max-w-full"
          />
        </div>
        <div className="flex items-center mt-2 text-sm justify-center w-full">
          <ClockIcon className="mr-2 h-4 w-4 text-amber-500" />
          <span
            className={
              isCutoff ? "text-amber-600 font-medium" : "text-gray-500"
            }
          >
            {isCutoff
              ? "Cutoff time passed (5:00 PM PST) - Next day booking unavailable"
              : "Cutoff time: 5:00 PM PST"}
          </span>
        </div>
      </div>
    </div>
  );
}
