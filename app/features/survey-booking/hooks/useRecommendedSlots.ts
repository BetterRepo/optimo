import { useState, useEffect } from "react";
import { driverMapping } from "../data/DriverLookupTable";
import type { Warehouse } from "../data/DriverLookupTable";
import { isWeekend, addDays, getDay, format, isSameDay } from "date-fns";
import { generateLocationId } from "../../../utils/locationHelper";
// import { createOrderLocation } from '../../../utils/optimoLocationHelper';

// Function to get warehouse-specific time windows
const getWarehouseTimeWindows = (warehouse: string) => {
  switch (warehouse) {
    case "Phoenix, AZ":
      // Arizona gets custom time windows: 7am-11am and 10am-2pm only
      return [
        { twFrom: "07:00", twTo: "11:00" }, // 7am-11am slot
        { twFrom: "10:00", twTo: "14:00" }, // 10am-2pm slot
      ];
    default:
      // All other warehouses get standard 3 time windows
      return [
        { twFrom: "07:30", twTo: "11:00" }, // Morning slot
        { twFrom: "10:00", twTo: "14:00" }, // Afternoon slot
        { twFrom: "13:00", twTo: "17:00" }, // Evening slot
      ];
  }
};

interface Slot {
  from: string;
  to: string;
  reservationId: string;
  cost?: number;
  time?: string;
}

interface RecommendedSlots {
  firstSlot: Slot | null;
  secondSlot: Slot | null;
  loading: boolean;
  error: string | null;
  createdOrderNo: string | null;
}

export const useRecommendedSlots = (formData: any, orderNo: string | null) => {
  console.log("useRecommendedSlots hook called with:", { formData, orderNo });

  const [recommendedSlots, setRecommendedSlots] = useState<RecommendedSlots>({
    firstSlot: null,
    secondSlot: null,
    loading: false,
    error: null,
    createdOrderNo: null,
  });

  const fetchRecommendedSlots = async () => {
    try {
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

        console.log(
          `RECOMMENDED SLOTS - Generated PST date: ${pstDate.toISOString()}`
        );
        return pstDate;
      }

      // Critical business rule: Function to determine if we're past the cutoff time (5 PM PST)
      function isPastCutoffTime() {
        const pstDate = getCurrentPSTDate();
        const isPast5PM = pstDate.getHours() >= 17; // 5 PM = 17:00

        console.log(
          `RECOMMENDED SLOTS - Current PST time: ${pstDate.toLocaleTimeString()}, Hour: ${pstDate.getHours()}, Past 5 PM cutoff: ${isPast5PM}`
        );

        return isPast5PM;
      }

      // Core business rule: Calculate booking days based on cutoff time
      const now = getCurrentPSTDate();
      // Reset hours to start of day for consistent date comparisons
      now.setHours(0, 0, 0, 0);

      const tomorrow = addDays(now, 1);
      const dayAfterTomorrow = addDays(now, 2);

      console.log(
        `RECOMMENDED SLOTS - PST Today: ${format(now, "yyyy-MM-dd")}`
      );
      console.log(
        `RECOMMENDED SLOTS - PST Tomorrow: ${format(tomorrow, "yyyy-MM-dd")}`
      );

      // If past 5 PM PST, earliest booking is 2 days out; otherwise 1 day out
      const isCutoff = isPastCutoffTime();
      const minDaysOut = isCutoff ? 2 : 1;

      console.log(
        `RECOMMENDED SLOTS - Business rule: Minimum ${minDaysOut} days out (cutoff passed: ${isCutoff})`
      );

      // Helper function to check if date is a weekend - with explicit day check
      function isWeekendDay(date: Date) {
        const day = getDay(date);
        const isWeekend = day === 0 || day === 6; // 0 is Sunday, 6 is Saturday

        if (isWeekend) {
          console.log(
            `RECOMMENDED SLOTS - Date ${format(
              date,
              "EEEE MM/dd/yyyy"
            )} is a weekend (day ${day})`
          );
        }

        return isWeekend;
      }

      // Helper function to check if date is valid for booking
      function isValidBookingDate(date: Date) {
        // First check: Is it a weekend?
        if (isWeekendDay(date)) {
          return false;
        }

        // Second check: Is it before our minimum allowed date?
        // Compare using midnight-aligned dates for consistent comparison
        const dateToCheck = new Date(date);
        dateToCheck.setHours(0, 0, 0, 0);

        const minDate = isCutoff ? dayAfterTomorrow : tomorrow;
        const isTooEarly = dateToCheck < minDate;

        if (isTooEarly) {
          console.log(
            `RECOMMENDED SLOTS - Date ${format(
              date,
              "MM/dd/yyyy"
            )} is too early (cutoff rule)`
          );
          return false;
        }

        return true;
      }

      // Find first available valid booking date
      let firstDay = isCutoff ? dayAfterTomorrow : tomorrow;
      console.log(
        `RECOMMENDED SLOTS - Initial first day: ${format(
          firstDay,
          "EEEE MM/dd/yyyy"
        )}`
      );

      while (!isValidBookingDate(firstDay)) {
        console.log(
          `RECOMMENDED SLOTS - First day is invalid, advancing to next day`
        );
        firstDay = addDays(firstDay, 1);
      }

      // Find second available valid booking date
      let secondDay = addDays(firstDay, 1);
      while (!isValidBookingDate(secondDay) || isSameDay(secondDay, firstDay)) {
        console.log(
          `RECOMMENDED SLOTS - Second day is invalid, advancing to next day`
        );
        secondDay = addDays(secondDay, 1);
      }

      console.log(`RECOMMENDED SLOTS - Final valid dates: 
        First: ${format(firstDay, "EEEE MM/dd/yyyy")}
        Second: ${format(secondDay, "EEEE MM/dd/yyyy")}
      `);

      // Convert to UTC dates for API
      const firstWeekday = new Date(
        Date.UTC(
          firstDay.getFullYear(),
          firstDay.getMonth(),
          firstDay.getDate()
        )
      );

      const secondWeekday = new Date(
        Date.UTC(
          secondDay.getFullYear(),
          secondDay.getMonth(),
          secondDay.getDate()
        )
      );

      // Prepare dates for API call
      let formattedDates = [
        firstWeekday.toISOString().split("T")[0],
        secondWeekday.toISOString().split("T")[0],
      ];

      // FINAL EMERGENCY CHECK: Direct string check to prevent Sunday April 27, 2025
      formattedDates = formattedDates.filter((date) => {
        if (date === "2025-04-27") {
          console.error(
            `🚨 EMERGENCY: Preventing known Sunday 4/27/2025 from being requested 🚨`
          );
          return false;
        }
        return true;
      });

      // Create helper to check for Florida blackout dates
      const isFloridaBlackoutDate = (dateString: string): boolean => {
        // Check if the warehouse or address indicates Florida
        const isFloridaLocation =
          formData.warehouse === "Lakeland, FL" ||
          formData.state === "FL" ||
          formData.state === "Florida";

        if (!isFloridaLocation) return false;

        const date = new Date(dateString);
        return (
          date.getFullYear() === 2025 &&
          date.getMonth() === 4 && // May is month 4 (0-indexed)
          (date.getDate() === 15 || date.getDate() === 16)
        );
      };

      // Filter out Florida blackout dates
      formattedDates = formattedDates.filter((dateString) => {
        if (isFloridaBlackoutDate(dateString)) {
          console.log(`Filtering out Florida blackout date: ${dateString}`);
          return false;
        }
        return true;
      });

      // Find up to 5 available valid booking dates
      let validDays = [];
      let searchDay = isCutoff ? dayAfterTomorrow : tomorrow;

      while (validDays.length < 5) {
        if (isValidBookingDate(searchDay)) {
          validDays.push(new Date(searchDay));
        }
        searchDay = addDays(searchDay, 1);
      }

      // Convert to UTC dates for API
      let recommendedDates = validDays.map(
        (d) =>
          new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
            .toISOString()
            .split("T")[0]
      );

      // FINAL EMERGENCY CHECK: Direct string check to prevent Sunday April 27, 2025
      recommendedDates = recommendedDates.filter((date) => {
        if (date === "2025-04-27") {
          console.error(
            `🚨 EMERGENCY: Preventing known Sunday 4/27/2025 from being requested 🚨`
          );
          return false;
        }
        return true;
      });

      // Filter out Florida blackout dates
      recommendedDates = recommendedDates.filter((dateString) => {
        if (isFloridaBlackoutDate(dateString)) {
          console.log(`Filtering out Florida blackout date: ${dateString}`);
          return false;
        }
        return true;
      });

      // If we've filtered out all dates, add more weekdays
      let addDay =
        validDays.length > 0
          ? addDays(validDays[validDays.length - 1], 1)
          : searchDay;
      while (recommendedDates.length < 5) {
        while (
          isWeekendDay(addDay) ||
          isFloridaBlackoutDate(addDay.toISOString().split("T")[0])
        ) {
          console.log(
            `Skipping weekend/blackout for replacement date: ${format(
              addDay,
              "EEEE MM/dd/yyyy"
            )}`
          );
          addDay = addDays(addDay, 1);
        }
        const additionalWeekday = new Date(
          Date.UTC(addDay.getFullYear(), addDay.getMonth(), addDay.getDate())
        );
        recommendedDates.push(additionalWeekday.toISOString().split("T")[0]);
        addDay = addDays(addDay, 1);
      }

      console.log(
        "RECOMMENDED SLOTS - Final dates being sent to API:",
        recommendedDates
      );

      const generatedOrderNo = `BE${Date.now()}`;

      // Format the address string
      const formattedAddress = `${
        formData.streetAddress
          ? formData.streetAddress.replace(/Street/i, "St")
          : ""
      }, ${formData.city}, ${formData.state} ${formData.postalCode}, USA`;

      // First create or get location using our new function
      // const locationData = await createOrderLocation(
      //   formattedAddress,
      //   `${formData.firstName} ${formData.lastName}`.trim(),
      //   formData.warehouse
      // );

      console.log(
        "Created/retrieved location for recommended slots:" /* locationData */
      );

      // Add geocoding acceptance properties to the location object
      const locationWithAcceptance = {
        // ...locationData,
        locationName: `${formData.firstName} ${formData.lastName}`.trim(),
        address: formattedAddress,
        // acceptMultipleResults: true,
        // acceptPartialMatch: true,
        // 🎯 Include coordinates if available from geocoding (prevents Optimo geocoding errors)
        // ...(formData.latitude &&
        // 	formData.longitude && {
        // 		latitude: formData.latitude,
        // 		longitude: formData.longitude,
        // 	}),
      };

      const payload = {
        order: {
          operation: "CREATE",
          orderNo: generatedOrderNo,
          type: "D",
          location: locationWithAcceptance, // Use the enhanced location object
          duration: 60,
          customField4: "Odey",
        },
        slots: {
          dates: recommendedDates,
          timeWindows: getWarehouseTimeWindows(formData.warehouse),
        },
        planning: {
          //driver details
          // Only include useDrivers if we have drivers and warehouse is not Out of Region
          ...(driverMapping[formData.warehouse as Warehouse]?.length > 0 &&
            formData.warehouse !== "Out of Region" && {
              useDrivers: driverMapping[formData.warehouse as Warehouse].map(
                (driver) => ({
                  driverExternalId: driver.driverExternalId,
                })
              ),
            }),
          clustering: false,
          lockType: "NONE",
          balancing: "ON_FORCE",
          balanceBy: "WT",
          balancingFactor: 0.8,
          startWith: "CURRENT",
        },
      };

      // const response = await fetch("/api/recommendSlots", {
      const response = await fetch("/api/bookingSlots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API response:", data);

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch slots");
      }

      // Check if API returned a new orderNo (happens with ERR_ORD_EXISTS error handling)
      const effectiveOrderNo = data.orderNo || generatedOrderNo;
      if (data.orderNo) {
        console.log("Using new orderNo from API response:", data.orderNo);
      }

      // Sort slots by date ascending, then by cost ascending
      const sortedSlots = data.slots.sort((a: any, b: any) => {
        const dateA = new Date(a.from).getTime();
        const dateB = new Date(b.from).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return (a.cost || 0) - (b.cost || 0);
      });
      const [cheapestSlot, secondCheapestSlot] = sortedSlots;

      // Format the times for display
      const formatTimeFromISO = (isoString: string) => {
        const time = isoString.split("T")[1].slice(0, 5);
        const [hours, minutes] = time.split(":");
        const period = +hours >= 12 ? "PM" : "AM";
        const displayHours = +hours % 12 || 12;
        return `${displayHours}:${minutes} ${period}`;
      };

      setRecommendedSlots({
        firstSlot: cheapestSlot
          ? {
              from: cheapestSlot.from,
              to: cheapestSlot.to,
              time: `${formatTimeFromISO(
                cheapestSlot.from
              )} - ${formatTimeFromISO(cheapestSlot.to)}`,
              reservationId: cheapestSlot.reservationId,
            }
          : null,
        secondSlot: secondCheapestSlot
          ? {
              from: secondCheapestSlot.from,
              to: secondCheapestSlot.to,
              time: `${formatTimeFromISO(
                secondCheapestSlot.from
              )} - ${formatTimeFromISO(secondCheapestSlot.to)}`,
              reservationId: secondCheapestSlot.reservationId,
            }
          : null,
        loading: false,
        error: null,
        createdOrderNo: effectiveOrderNo,
      });
    } catch (error: unknown) {
      console.error("Error fetching slots:", error);

      // Format nicer error messages for specific conditions
      let errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch recommended slots";

      // Use a function to check if this is a cutoff time related issue
      const checkIfCutoffTimeError = () => {
        // Re-use the same PST date logic
        const pstFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
        });

        const parts = pstFormatter.formatToParts(new Date());
        const hour = parts.find((part) => part.type === "hour")?.value;
        const hourValue = hour ? parseInt(hour, 10) : 0;

        // Check if it's past 5 PM (17:00) PST
        return hourValue >= 17;
      };

      if (checkIfCutoffTimeError()) {
        errorMessage =
          "Due to cutoff time (5:00 PM PST), next-day availability is limited. Please select a date at least 2 days out.";
      }

      setRecommendedSlots((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  // useEffect(() => {
  //   if (!formData?.warehouse || !formData?.streetAddress) return;
  //   console.log("in useRecommendedSlots effect with formData:", formData);
  //   setRecommendedSlots((prev) => ({
  //     ...prev,
  //     loading: true,
  //     error: null,
  //   }));
  //   fetchRecommendedSlots();
  // }, [formData]);

  return {
    ...recommendedSlots,
    createdOrderNo: recommendedSlots.createdOrderNo,
  };
};

const formatTime = (time: string) => {
  const [hour, minute] = time.split(":");
  const period = +hour < 12 ? "AM" : "PM";
  const formattedHour = +hour % 12 || 12;
  return `${formattedHour}:${minute} ${period}`;
};
