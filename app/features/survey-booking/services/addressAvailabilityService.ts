// This is a mock service that would normally check against a database or API
// to determine if an address is in an area with known availability issues.

interface AddressInfo {
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

// List of problematic zip codes (this would come from a database in a real app)
const problematicZipCodes = [
  '94590', // Example problematic zip code
  '10001', // Example problematic zip code
  '60007', // Example problematic zip code
];

// List of problematic cities (this would come from a database in a real app)
const problematicCities = [
  'Remote City', // Example city with no service
  'Far Away', // Example city with no service
];

/**
 * Checks if an address is likely to have availability issues
 * based on known problematic areas.
 */
export const checkAddressAvailability = (address: AddressInfo): Promise<{
  isAvailable: boolean;
  reason?: string;
}> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      if (!address.postalCode || !address.city || !address.state) {
        resolve({
          isAvailable: false,
          reason: 'Incomplete address information',
        });
        return;
      }

      // Check if in problematic zip code
      if (problematicZipCodes.includes(address.postalCode)) {
        resolve({
          isAvailable: false,
          reason: 'This zip code is currently experiencing service limitations',
        });
        return;
      }

      // Check if in problematic city
      if (problematicCities.some(city => 
        address.city?.toLowerCase().includes(city.toLowerCase()))) {
        resolve({
          isAvailable: false,
          reason: 'This city is outside our service area',
        });
        return;
      }

      // Simulate some addresses being problematic based on a simple hash
      const addressString = `${address.streetAddress}-${address.city}-${address.state}`.toLowerCase();
      const addressHash = addressString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Make ~10% of addresses unavailable for testing purposes
      if (addressHash % 10 === 0) {
        resolve({
          isAvailable: false,
          reason: 'This specific address has limited availability',
        });
        return;
      }

      resolve({ isAvailable: true });
    }, 500);
  });
};

/**
 * Estimates how far into the future we need to look to find 
 * available slots for a particular address.
 * Returns days or null if not estimable.
 */
export const estimateAvailabilityDelay = (address: AddressInfo): Promise<number | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Similar logic as above
      const addressString = `${address.streetAddress}-${address.city}-${address.state}`.toLowerCase();
      const addressHash = addressString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      if (addressHash % 10 === 1) {
        // Likely to find slots within 7 days
        resolve(7);
      } else if (addressHash % 10 === 2) {
        // Likely to find slots within 14 days
        resolve(14);
      } else if (addressHash % 10 === 3) {
        // Likely to find slots within 30 days
        resolve(30);
      } else if (addressHash % 10 === 0) {
        // No estimate available for problematic addresses
        resolve(null);
      } else {
        // Most addresses have good availability
        resolve(3);
      }
    }, 300);
  });
};

export default {
  checkAddressAvailability,
  estimateAvailabilityDelay,
}; 