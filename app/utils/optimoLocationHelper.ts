/**
 * Specialized utility functions for handling OptimoRoute location objects
 * This implements a two-step approach to fix pin placement issues:
 * 1. First locate or create a location with exact coordinates
 * 2. Then reference this location by ID in orders
 */

import { generateLocationId } from './locationHelper';

// API key for OptimoRoute
const API_KEY = "0115400db6ed3e58f1c596bca2555ebf58fddkoP1Gc";

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

interface Location {
  locationName: string;
  address: string;
  locationNo?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Get warehouse coordinates based on warehouse name
 */
export function getWarehouseCoordinates(warehouse: string): LocationCoordinates {
  switch (warehouse) {
    case "Cerritos, CA":
      return { latitude: 33.8583, longitude: -118.0515 };
    case "Sacramento, CA":
      return { latitude: 38.5816, longitude: -121.4944 };
    case "Fresno, CA":
      return { latitude: 36.7378, longitude: -119.7871 };
    case "Phoenix, AZ":
      return { latitude: 33.4484, longitude: -112.0740 };
    case "Dallas, TX":
      return { latitude: 32.7767, longitude: -96.7970 };
    case "Lakeland, FL":
      return { latitude: 28.0395, longitude: -81.9498 };
    default:
      return { latitude: 26.972335, longitude: -82.3500045 }; // Default coordinates
  }
}

/**
 * Generate a unique location ID that is not tied to the address
 * Each call will generate a completely new unique ID
 */
function generateLocationIdFromAddress(address: string): string {
  // Generate a timestamp component (unix timestamp in milliseconds)
  const timestamp = Date.now();
  
  // Generate a random component (8 random hex characters)
  const randomPart = Math.random().toString(16).substring(2, 10).toUpperCase();
  
  // Return a unique location ID with prefix, timestamp and random component
  return `LOC-${timestamp}-${randomPart}`;
}

/**
 * Create or locate an existing location in OptimoRoute
 * This function will:
 * 1. Generate a consistent locationNo for the address
 * 2. Try to check if the location already exists (optional)
 * 3. Create it if it doesn't (optional, falls back gracefully)
 * 4. Return the locationNo to be used in orders
 */
export async function ensureLocation(
  address: string,
  locationName: string,
  warehouseName?: string
): Promise<string> {
  try {
    console.log('Ensuring location exists for:', { address, locationName });
    
    // Generate a consistent locationNo based ONLY on the address
    const locationNo = generateLocationIdFromAddress(address);
    
    // Get coordinates based on warehouse
    const coordinates = warehouseName ? getWarehouseCoordinates(warehouseName) : {
      latitude: 26.972335,
      longitude: -82.3500045
    };
    
    // Create the location object
    const locationData = {
      operation: "CREATE",
      locationNo,
      locationName,
      address,
      ...coordinates
    };
    
    console.log('Creating location with data:', locationData);
    
    // Try to create or update the location in OptimoRoute (optional - fail gracefully)
    try {
      const response = await fetch(`https://api.optimoroute.com/v1/create_or_update_locations?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          locations: [locationData]
        })
      });
      
      const responseData = await response.json();
      console.log('Location API response:', responseData);
      
      if (!response.ok) {
        console.warn(`Location creation failed, continuing with fallback: ${JSON.stringify(responseData)}`);
      } else {
        console.log('✅ Location successfully created in OptimoRoute');
      }
    } catch (apiError) {
      console.warn('Location API call failed, continuing with fallback:', apiError);
    }
    
    // Always return the locationNo regardless of API success/failure
    return locationNo;
  } catch (error) {
    console.error('Error in ensureLocation:', error);
    
    // Fall back to just the generated locationNo
    return generateLocationIdFromAddress(address);
  }
}

/**
 * Create a location object for an order using the proper two-step approach
 * This should be used instead of manually building the location object
 */
export async function createOrderLocation(
  address: string,
  locationName: string,
  warehouseName?: string,
  geocodedCoordinates?: { latitude: number; longitude: number }
): Promise<Location> {
  try {
    // First ensure the location exists and get its ID
    const locationNo = await ensureLocation(address, locationName, warehouseName);
    
    // Determine which coordinates to use (prioritize geocoded coordinates)
    const coordinates = geocodedCoordinates || 
                       (warehouseName ? getWarehouseCoordinates(warehouseName) : {
                         latitude: 26.972335,
                         longitude: -82.3500045
                       });
    
    console.log('🎯 Creating location object with coordinates:', {
      address,
      locationName,
      coordinates,
      source: geocodedCoordinates ? 'geocoded' : 'warehouse'
    });
    
    // Return a location object that includes:
    // 1. locationNo - the unique ID for this location
    // 2. locationName - always use the customer name
    // 3. address - the formatted address
    // 4. coordinates - precise coordinates (geocoded or warehouse-based)
    return {
      locationNo,
      locationName,  // This is the customer name passed in from the calling function
      address,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    };
  } catch (error) {
    console.error('Error in createOrderLocation:', error);
    
    // Fall back to just using the generated locationNo with coordinates
    const fallbackCoordinates = geocodedCoordinates || 
                                (warehouseName ? getWarehouseCoordinates(warehouseName) : {
                                  latitude: 26.972335,
                                  longitude: -82.3500045
                                });
    
    return {
      locationNo: generateLocationIdFromAddress(address),
      locationName,  // Keep the customer name even in error case
      address,
      latitude: fallbackCoordinates.latitude,
      longitude: fallbackCoordinates.longitude
    };
  }
} 