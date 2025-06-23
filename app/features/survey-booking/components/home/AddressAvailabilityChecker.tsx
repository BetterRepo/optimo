import React, { useEffect } from 'react';
import { SurveyFormData } from '../../types/FormData';
import useAddressAvailability from '../../hooks/useAddressAvailability';
import { UnavailableLocationNotice } from '../UnavailableLocationNotice';

interface AddressAvailabilityCheckerProps {
  formData: SurveyFormData;
  isAddressComplete: boolean;
  onChangeAddress: () => void;
}

export function AddressAvailabilityChecker({ 
  formData, 
  isAddressComplete,
  onChangeAddress 
}: AddressAvailabilityCheckerProps) {
  const { 
    status, 
    reason, 
    isChecking, 
    checkCurrentAddress 
  } = useAddressAvailability(formData);

  // Check address availability when address is complete
  useEffect(() => {
    if (isAddressComplete) {
      checkCurrentAddress();
    }
  }, [isAddressComplete, checkCurrentAddress]);

  // If we're still checking or not unavailable, don't show anything
  if (status !== 'unavailable') {
    return null;
  }

  // Handler for contact support
  const handleContactSupport = () => {
    window.open('mailto:support@optimo-route.com?subject=Appointment Scheduling Issue', '_blank');
  };

  return (
    <div className="mt-6" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <UnavailableLocationNotice 
        address={`${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.postalCode}`}
        reason={reason}
        onTryAnotherAddress={onChangeAddress}
        onContactSupport={handleContactSupport}
      />
    </div>
  );
}

export default AddressAvailabilityChecker; 