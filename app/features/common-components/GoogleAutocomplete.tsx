"use client";

import React, { useRef, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];

interface GoogleAutocompleteProps {
  onSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

export default function GoogleAutocomplete({ 
  onSelect, 
  placeholder = "Enter address with Google Autocomplete...",
  className = "p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:outline-none focus:border-green-500 bg-white dark:bg-[#151821] dark:text-white",
  value = ""
}: GoogleAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
    language: "en",
    region: "US"
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;
    
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" },
      fields: ["formatted_address", "geometry", "address_components"],
    });

    // Set language preference for the autocomplete service
    const service = new google.maps.places.AutocompleteService();

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        onSelect(place);
      }
    });

    // Cleanup function
    return () => {
      if (window.google && window.google.maps && window.google.maps.event) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isLoaded, onSelect]);

  if (loadError) {
    return (
      <input
        ref={inputRef}
        placeholder="Google Maps failed to load. Please enter address manually."
        className={className}
        value={value}
        readOnly
      />
    );
  }

  if (!isLoaded) {
    return (
      <input
        ref={inputRef}
        placeholder="Loading Google Maps..."
        className={className}
        disabled
      />
    );
  }

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      className={className}
      defaultValue={value}
    />
  );
} 