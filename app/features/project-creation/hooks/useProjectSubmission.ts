import { useState } from 'react';
import { ProjectCreationFormData } from '../types';

export const useProjectSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWarnings, setShowWarnings] = useState(false);

  const handleSubmit = async (formData: ProjectCreationFormData) => {
    console.log('handleSubmit called with:', JSON.stringify(formData, null, 2));
    setIsSubmitting(true);
    setError(null);

    // Validate fields before submitting
    if (!formData.firstName || !formData.lastName || !formData.customerEmail) {
      setIsSubmitting(false);
      setError("Missing required fields");
      return;
    }

    try {
      // Ensure leadType is set at the top level
      const leadType = formData.leadType || '';
      console.log('Setting lead type:', leadType);
      
      // Process ubillFiles to ensure they're in the correct format
      const ubillFiles = Array.isArray(formData.ubillFiles) && formData.ubillFiles.length > 0 
        ? formData.ubillFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            url: file.url
          })) 
        : [];
      
      // Extract URLs from all uploaded files
      const ubillFilesUrls = ubillFiles.length > 0 
        ? ubillFiles.map(file => file.url).join(';') 
        : "";
      
      // Create a string of filenames for reference
      const ubillFilesNames = ubillFiles.length > 0 
        ? ubillFiles.map(file => file.name).join(';') 
        : "";
      
      console.log('UBill Files:', ubillFiles);
      console.log('UBill Files URLs:', ubillFilesUrls);
      
      // Check if there's secondary contact information to include
      const hasSecondaryContact = !!(formData as any).secondaryFirstName || !!(formData as any).secondaryLastName;
      
      // Create secondary contact section if applicable
      const secondaryContact = hasSecondaryContact ? {
        firstName: (formData as any).secondaryFirstName || '',
        lastName: (formData as any).secondaryLastName || '',
        email: (formData as any).secondaryEmail || '',
        phone: (formData as any).secondaryPhone || '',
        relationship: (formData as any).secondaryRelationship || ''
      } : undefined;
      
      console.log('Secondary Contact:', hasSecondaryContact ? 'Yes' : 'No', secondaryContact);
      
      // Check if there's tenant information to include
      const hasTenants = !!(formData as any).hasTenants;
      
      // Create tenant section if applicable
      const tenant = hasTenants ? {
        firstName: (formData as any).tenantFirstName || '',
        lastName: (formData as any).tenantLastName || '',
        email: (formData as any).tenantEmail || '',
        phone: (formData as any).tenantPhone || ''
      } : undefined;
      
      console.log('Tenant Information:', hasTenants ? 'Yes' : 'No', tenant);
      
      // Retrieve salesCompany from localStorage if available
      let salesCompany = '';
      try {
        const storedSalesCompany = typeof window !== 'undefined' ? localStorage.getItem('salesCompany') : null;
        if (storedSalesCompany) {
          salesCompany = storedSalesCompany;
          console.log('Retrieved salesCompany from localStorage:', salesCompany);
        }
      } catch (error) {
        console.error('Error retrieving salesCompany from localStorage:', error);
      }
      
      // Debug lgcyCanvassId value
      console.log('DEBUG - lgcyCanvassId value:', formData.lgcyCanvassId);
      console.log('DEBUG - salesCompany value:', salesCompany);
      
      const payload = {
        // Add leadType at the top level of the payload - this is important for Zapier
        leadType,
        
        // Add lgcyCanvassId and salesCompany directly at top level (not conditional)
        lgcyCanvassId: formData.lgcyCanvassId || '',
        salesCompany: salesCompany || '',
        
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          salesRepEmail: formData.salesRepEmail,
          salesRepEmail2: formData.salesRepEmail2,
          dialerEmail: formData.dialerEmail,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          preferredLanguage: formData.preferredLanguage,
          internalToken: formData.internalToken,
        },
        projectDetails: {
          financeCompany: formData.financeCompany,
          financeType: formData.financeType,
          escalator: formData.escalator,
          term: formData.term,
          leadType,  // Repeat leadType in project details
          moduleCount: formData.moduleCount,
          moduleType: formData.moduleType,
          storage: formData.storage,
          storageOption: formData.storageOption,
          adders: Array.isArray(formData.adders) ? formData.adders.join(';') : formData.adders,
          ubillFile: formData.ubillFile ? {
            name: formData.ubillFile.name,
            type: formData.ubillFile.type,
            size: formData.ubillFile.size,
            url: formData.ubillFile.url
          } : undefined,
          ubillFiles,
          u_bill_upload: "",
          lgcyCanvassId: formData.lgcyCanvassId || '',
          salesCompany: salesCompany || '',
          // Other fields removed as requested previously:
          // epc, kwhRate, leadId, pangeaId, insightlyId, interestRate, 
          // yearlyProduction, financeOrg
        },
        address: {
          street: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          warehouse: formData.warehouse
        },
        // Include secondary contact information if available
        secondaryContact,
        hasSecondaryContact,
        // Keep these top-level entries for backwards compatibility
        secondaryFirstName: (formData as any).secondaryFirstName || '',
        secondaryLastName: (formData as any).secondaryLastName || '',
        secondaryEmail: (formData as any).secondaryEmail || '',
        secondaryPhone: (formData as any).secondaryPhone || '',
        secondaryRelationship: (formData as any).secondaryRelationship || '',
        // Include tenant information
        tenant,
        hasTenants,
        tenantFirstName: (formData as any).tenantFirstName || '',
        tenantLastName: (formData as any).tenantLastName || '',
        tenantEmail: (formData as any).tenantEmail || '',
        tenantPhone: (formData as any).tenantPhone || '',
        // Include ubillFiles at the top level for easy access in Zapier
        ubillFiles,
        ubillFilesUrls,
        ubillFilesNames,
        // Add direct download URLs for easy access
        ubillFilesDirectUrls: ubillFilesUrls,  // We're already storing direct URLs now
      };

      console.log("Payload being sent to webhook-proxy:", JSON.stringify(payload, null, 2));

      // Use the webhook-proxy endpoint with target information
      const response = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Target-Webhook': 'project-creation'
        },
        body: JSON.stringify({
          targetUrl: 'https://hooks.zapier.com/hooks/catch/16426358/2wogpdo/',
          payload
        })
      });

      if (!response.ok) throw new Error('Failed to submit project');

      const responseData = await response.json();
      console.log('Response data:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting, error, showWarnings, setShowWarnings };
};

// Helper function to convert File to base64
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = typeof reader.result === 'string' 
        ? reader.result.split(',')[1] 
        : '';
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

const formatNameCase = (name: string): string => {
  // Split on spaces, hyphens, and apostrophes while keeping the delimiters
  return name.trim().toLowerCase().split(/(?=['\s-])|(?<=['\s-])/)
    .map((part) => {
      return /[a-z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part;
    })
    .join('');
};

const validateEmail = (email: string): boolean => {
  const trimmedEmail = email.trim().toLowerCase();
  
  // Extract domain from email
  const domain = trimmedEmail.split('@')[1];
  
  // Check if email is empty
  if (!trimmedEmail) {
    return false;
  }
  
  // Check basic email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return false;
  }
  
  // Check for common test/temporary email domains
  if (domain) {
    const disallowedDomains = [
      'test.com',
      'example.com',
      'mailinator.com',
      'tempmail.com',
      'fakeemail.com',
      'fakeinbox.com',
      'yopmail.com',
      'mailnesia.com',
      'guerrillamail.com',
      'sharklasers.com',
      'temp-mail.org',
      '10minutemail.com'
    ];
    
    // Check for obviously fake domains
    if (disallowedDomains.some(banned => domain === banned || domain.endsWith(`.${banned}`))) {
      return false;
    }
    
    // Check for suspicious patterns in the domain
    if (domain.includes('temp') || 
        domain.includes('fake') || 
        domain.includes('test') || 
        domain.includes('disposable') ||
        domain.includes('throwaway')) {
      return false;
    }
  }
  
  // Check length
  if (trimmedEmail.length > 100) {
    return false;
  }
  
  return true;
}; 