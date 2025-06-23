/**
 * Utility functions for handling location data in OptimoRoute integration
 */

/**
 * Generates a unique location ID that is not tied to the address
 * Each call generates a unique ID with timestamp and random components
 * 
 * @param address Full address string (not used for ID generation, only for logging)
 * @param fallback Optional fallback string (not used for ID generation)
 * @returns A unique location ID
 */
export function generateLocationId(address: string, fallback?: string): string {
  // Generate a timestamp component (unix timestamp in milliseconds)
  const timestamp = Date.now();
  
  // Generate a random component (8 random hex characters)
  const randomPart = Math.random().toString(16).substring(2, 10).toUpperCase();
  
  // Return a unique location ID with prefix, timestamp and random component
  return `LOC-${timestamp}-${randomPart}`;
}

/**
 * Simple hash function to convert a string to a numeric hash
 * This doesn't need to be cryptographically secure, just consistent
 * 
 * @param str String to hash
 * @returns A string representation of the hash
 */
function hashString(str: string): string {
  let hash = 0;
  
  if (str.length === 0) {
    return '0';
  }
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to positive hex string and take first 8 characters
  return Math.abs(hash).toString(16).substring(0, 8).toUpperCase();
} 