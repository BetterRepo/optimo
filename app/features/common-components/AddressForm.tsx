import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { LanguageContext } from "../../features/common-components/CentralBlock";
import { lookupTable } from "../survey-booking/data/lookupTable";
import GoogleAutocomplete from "./GoogleAutocomplete";

interface AddressFormProps {
  formData: {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    warehouse: string;
    isAdditionalSurvey: boolean;
    latitude?: number;
    longitude?: number;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onValidAddress?: () => void;
}

interface AddressSuggestion {
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    state_code?: string;
    postcode?: string;
    town?: string;
    village?: string;
  };
}

const US_STATES: Record<string, string> = {
  Florida: "FL",
  California: "CA",
  Texas: "TX",
  Arizona: "AZ",
};

const WAREHOUSES = [
  "",
  "Out of Region",
  "Sacramento, CA",
  "Fresno, CA",
  "Cerritos, CA",
  "Phoenix, AZ",
  "Dallas, TX",
  "Lakeland, FL",
] as const;

const findWarehouseByZip = (zipCode: string): string => {
  // Special case for Concord area
  if (zipCode === "94518") {
    return "Sacramento, CA";
  }

  const entry = lookupTable.find((entry) => entry.zip === zipCode);
  if (entry) {
    return entry.warehouse;
  }

  // If zip starts with 945 (Concord area), map to Sacramento
  if (zipCode.startsWith("945")) {
    return "Sacramento, CA";
  }

  return "Out of Region";
};

// Parse Google Places address components
const parseGoogleAddress = (place: google.maps.places.PlaceResult) => {
  const components = place.address_components || [];
  let streetNumber = "";
  let route = "";
  let city = "";
  let state = "";
  let postalCode = "";

  components.forEach((component) => {
    const types = component.types;
    if (types.includes("street_number")) {
      streetNumber = component.long_name;
    } else if (types.includes("route")) {
      route = component.long_name;
    } else if (types.includes("locality")) {
      city = component.long_name;
    } else if (types.includes("administrative_area_level_1")) {
      state = component.short_name;
    } else if (types.includes("postal_code")) {
      postalCode = component.long_name;
    }
  });

  const streetAddress =
    streetNumber && route ? `${streetNumber} ${route}` : route;

  return { streetAddress, city, state, postalCode };
};

// Add address abbreviation mapping
const ADDRESS_ABBREVIATIONS: Record<string, string> = {
  // Directions
  n: "north",
  e: "east",
  s: "south",
  w: "west",
  ne: "northeast",
  nw: "northwest",
  se: "southeast",
  sw: "southwest",

  // Street types
  st: "street",
  rd: "road",
  dr: "drive",
  ave: "avenue",
  blvd: "boulevard",
  ln: "lane",
  ct: "court",
  pl: "place",
  pkwy: "parkway",
  cir: "circle",
  trl: "trail",
  hwy: "highway",
  expy: "expressway",
  fwy: "freeway",

  // Apartment/unit types
  apt: "apartment",
  ste: "suite",
  unit: "unit",
  bldg: "building",
  fl: "floor",
};

// Function to expand address abbreviations
const expandAddressAbbreviations = (address: string): string => {
  // Split the address into words
  const words = address.split(" ");

  // Process each word
  const expandedWords = words.map((word) => {
    // Remove any punctuation for checking
    const cleanWord = word
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

    // Check if the word is an abbreviation
    if (ADDRESS_ABBREVIATIONS[cleanWord]) {
      // Replace the cleaned word portion with expansion while keeping punctuation
      return word.replace(
        new RegExp(cleanWord, "i"),
        ADDRESS_ABBREVIATIONS[cleanWord]
      );
    }

    return word;
  });

  // Join the expanded words back into an address
  return expandedWords.join(" ");
};

export const AddressForm: React.FC<AddressFormProps> = ({
  formData,
  handleChange,
  onValidAddress,
}) => {
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const isAddressValid =
      formData.streetAddress &&
      formData.city &&
      formData.state &&
      formData.postalCode;

    // Only call onValidAddress if it exists and all fields are filled
    if (isAddressValid && onValidAddress) {
      onValidAddress();
    }
  }, [
    formData.streetAddress,
    formData.city,
    formData.state,
    formData.postalCode,
  ]);

  useEffect(() => {
    // Update warehouse whenever postal code changes
    if (formData.postalCode) {
      const warehouse = findWarehouseByZip(formData.postalCode);
      handleChange({
        target: {
          id: "warehouse",
          value: warehouse,
        },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
  }, [formData.postalCode]);

  // Handle Google Places selection
  const handleGooglePlaceSelect = async (
    place: google.maps.places.PlaceResult
  ) => {
    console.log("Google Place selected:", place);

    const { streetAddress, city, state, postalCode } =
      parseGoogleAddress(place);
    const warehouse = findWarehouseByZip(postalCode);

    // Update all form fields
    const fields = [
      { id: "streetAddress", value: streetAddress },
      { id: "city", value: city },
      { id: "state", value: state },
      { id: "postalCode", value: postalCode },
      { id: "warehouse", value: warehouse },
    ];

    fields.forEach((field) => {
      handleChange({
        target: { id: field.id, value: field.value },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // 🚀 NEW: Call geocoding API when address is selected
    try {
      const fullAddress = `${streetAddress}, ${city}, ${state} ${postalCode}, USA`;
      console.log(
        "🔄 Calling geocoding API for selected address:",
        fullAddress
      );

      const response = await fetch("/api/geocode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: fullAddress,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ GEOCODING SUCCESS - Address coordinates:", {
          address: fullAddress,
          latitude: data.latitude,
          longitude: data.longitude,
          formattedAddress: data.formattedAddress,
        });

        // 🎯 Store coordinates in form data for use in location objects
        handleChange({
          target: { id: "latitude", value: data.latitude },
        } as React.ChangeEvent<HTMLInputElement>);

        handleChange({
          target: { id: "longitude", value: data.longitude },
        } as React.ChangeEvent<HTMLInputElement>);
      } else {
        console.log("❌ GEOCODING FAILED - Response not OK:", response.status);
      }
    } catch (error) {
      console.log("❌ GEOCODING ERROR:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mt-6 relative">
        <label
          htmlFor="streetAddress"
          className="block text-[#1E293B] dark:text-white text-base font-semibold mb-3"
        >
          Street Address <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <GoogleAutocomplete
            onSelect={handleGooglePlaceSelect}
            placeholder="Enter your address"
            className="w-full px-4 py-4 rounded-xl 
                     border-2 border-gray-200/60 dark:border-gray-600/50
                     bg-white dark:bg-[#151821] text-gray-700 dark:text-gray-200
                     focus:outline-none focus:border-green-400 dark:focus:border-green-500 
                     focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30
                     transition-all duration-200 ease-in-out
                     hover:border-gray-300 dark:hover:border-gray-500"
            value={formData.streetAddress}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-green-600 dark:text-green-400 font-medium">
            🌍 Google
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-3">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-4 rounded-xl 
                     border-2 border-gray-200/60 dark:border-gray-600/50
                     bg-white dark:bg-[#151821] text-gray-700 dark:text-gray-200
                     focus:outline-none focus:border-green-400 dark:focus:border-green-500 
                     focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30
                     transition-all duration-200 ease-in-out
                     hover:border-gray-300 dark:hover:border-gray-500
                     disabled:opacity-60 disabled:cursor-not-allowed
                       disabled:hover:border-gray-200 dark:disabled:hover:border-gray-600"
            placeholder="Enter city name"
            disabled={true} // City is auto-filled based on warehouse
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-3">
            State <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-4 rounded-xl appearance-none
                       border-2 border-gray-200/60 dark:border-gray-600/50
                       bg-white dark:bg-[#151821] text-gray-700 dark:text-gray-200
                       focus:outline-none focus:border-green-400 dark:focus:border-green-500 
                       focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30
                       transition-all duration-200 ease-in-out
                       hover:border-gray-300 dark:hover:border-gray-500
                       cursor-pointer
                       disabled:opacity-60 disabled:cursor-not-allowed
                       disabled:hover:border-gray-200 dark:disabled:hover:border-gray-600
                       "
              disabled={true} // State is auto-filled based on warehouse
            >
              <option value="" className="text-gray-500">
                Select State
              </option>
              <option value="TX" className="text-gray-900 dark:text-white">
                TX
              </option>
              <option value="CA" className="text-gray-900 dark:text-white">
                CA
              </option>
              <option value="FL" className="text-gray-900 dark:text-white">
                FL
              </option>
              <option value="AZ" className="text-gray-900 dark:text-white">
                AZ
              </option>
              <option
                value="Out of Region"
                className="text-gray-900 dark:text-white"
              >
                Out of Region
              </option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-3">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full px-4 py-4 rounded-xl 
                     border-2 border-gray-200/60 dark:border-gray-600/50
                     bg-white dark:bg-[#151821] text-gray-700 dark:text-gray-200
                     focus:outline-none focus:border-green-400 dark:focus:border-green-500 
                     focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30
                     transition-all duration-200 ease-in-out
                     hover:border-gray-300 dark:hover:border-gray-500
                     disabled:opacity-60 disabled:cursor-not-allowed
                       disabled:hover:border-gray-200 dark:disabled:hover:border-gray-600"
            placeholder="Enter postal code"
            disabled={true} // Postal code is auto-filled based on warehouse
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-3">
            Warehouse <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="warehouse"
              value={formData.warehouse}
              onChange={handleChange}
              className="w-full px-4 py-4 rounded-xl appearance-none
                       border-2 border-gray-200/60 dark:border-gray-600/50
                       bg-white dark:bg-[#151821] text-gray-700 dark:text-gray-200
                       focus:outline-none focus:border-green-400 dark:focus:border-green-500 
                       focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30
                       transition-all duration-200 ease-in-out
                       hover:border-gray-300 dark:hover:border-gray-500
                       disabled:opacity-60 disabled:cursor-not-allowed
                       disabled:hover:border-gray-200 dark:disabled:hover:border-gray-600"
              required
              disabled={true}
            >
              <option value="" className="text-gray-500">
                Please Select
              </option>
              {WAREHOUSES.filter((w) => w !== "").map((warehouse) => (
                <option
                  key={warehouse}
                  value={warehouse}
                  className="text-gray-900 dark:text-white"
                >
                  {warehouse}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
          {formData.warehouse && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Warehouse is automatically determined by your zip code and cannot
              be changed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
