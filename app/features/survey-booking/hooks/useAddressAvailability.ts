import { useState, useEffect } from 'react';
import { SurveyFormData } from '../types/FormData';
import { checkAddressAvailability, estimateAvailabilityDelay } from '../services/addressAvailabilityService';

type AvailabilityStatus = 'checking' | 'available' | 'unavailable' | 'unknown';

interface UseAddressAvailabilityResult {
  isChecking: boolean;
  status: AvailabilityStatus;
  reason?: string;
  estimatedDelay: number | null;
  checkCurrentAddress: () => Promise<void>;
}

export function useAddressAvailability(formData: SurveyFormData): UseAddressAvailabilityResult {
  const [status, setStatus] = useState<AvailabilityStatus>('unknown');
  const [isChecking, setIsChecking] = useState(false);
  const [reason, setReason] = useState<string | undefined>(undefined);
  const [estimatedDelay, setEstimatedDelay] = useState<number | null>(null);

  // Extract address information
  const addressInfo = {
    streetAddress: formData.streetAddress,
    city: formData.city,
    state: formData.state,
    postalCode: formData.postalCode,
  };

  // Check if the address has changed
  useEffect(() => {
    // Reset state when address changes
    setStatus('unknown');
    setReason(undefined);
    setEstimatedDelay(null);
  }, [addressInfo.streetAddress, addressInfo.city, addressInfo.state, addressInfo.postalCode]);

  // Function to check the current address
  const checkCurrentAddress = async () => {
    if (!addressInfo.streetAddress || !addressInfo.city || !addressInfo.state || !addressInfo.postalCode) {
      return;
    }

    setIsChecking(true);
    setStatus('checking');

    try {
      // Check if address is available
      const result = await checkAddressAvailability(addressInfo);
      
      if (result.isAvailable) {
        setStatus('available');
        
        // If available, get estimated delay
        const delay = await estimateAvailabilityDelay(addressInfo);
        setEstimatedDelay(delay);
      } else {
        setStatus('unavailable');
        setReason(result.reason);
        setEstimatedDelay(null);
      }
    } catch (error) {
      console.error('Error checking address availability:', error);
      setStatus('unknown');
      setReason('Error checking address availability');
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isChecking,
    status,
    reason,
    estimatedDelay,
    checkCurrentAddress,
  };
}

export default useAddressAvailability; 