export interface FormData {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  warehouse: string;
  hasSecondaryContact: boolean;
  secondaryContact?: {
    name?: string;
    phone?: string;
    email?: string;
    relationship?: string;
  };
  hasTenants: boolean;
  tenant?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  preferredLanguage: string;
} 