import { Warehouse } from './Warehouse';

// Define customer information types
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Define address information types
export interface AddressInfo {
  streetAddress: string;
  aptUnit?: string;
  city: string;
  state: string;
  postalCode: string;
}

// Define time slot types
export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  formattedDate?: string;
  formattedTimeRange?: string;
}

// Define validation error types
export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  timeSlot?: string;
  terms?: string;
  general?: string;
}

// Existing SurveyFormData interface
export interface SurveyFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  aptUnit?: string;
  city: string;
  state: string;
  postalCode: string;
  selectedTimeSlot: string;
  termsAccepted?: boolean;
  notes?: string;
  warehouse?: Warehouse;
  // New field for preferred survey dates when no slots are available
  preferredSurveyDates?: string[];
  texasProximity?: 'Dallas' | 'Houston'; // New field for Texas locations
  // 🌍 Geocoding coordinates (added for Optimo location accuracy)
  latitude?: number;
  longitude?: number;
}

export interface SurveyFormData {
  // New fields
  isAdditionalSurvey: boolean;
  isSurveyBooking: boolean;
  internal: boolean;
  quickbaseRecordId: string;
  token: string;
  
  // Basic contact info
  firstName: string;
  lastName: string;
  language: string;
  phone: string;
  email: string;
  
  // Address info
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  warehouse?: Warehouse;
  texasProximity?: 'Dallas' | 'Houston'; // New field for Texas locations
  
  // 🌍 Geocoding coordinates (added for Optimo location accuracy)
  latitude?: number;
  longitude?: number;
  
  // Secondary contact info
  hasSecondaryContact: boolean;
  secondaryContactName: string;
  secondaryContactRelationship: string;
  secondaryContactPhone: string;
  secondaryContactEmail: string;
  secondaryContactLanguage: string;
  
  // Legacy secondary contact fields
  secondaryFirstName: string;
  secondaryLastName: string;
  secondaryPhone: string;
  secondaryEmail: string;
  secondaryLanguage: string;
  
  // Tenant info
  hasTenants: boolean;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  tenantLanguage: string;
  
  // Contact preferences
  preferredContactMethod: string;
  preferredContactTime: string;
  
  // Property info
  propertyType: string;
  propertyOwnership: string;
  propertyAccess: string;
  parkingAvailable: boolean;
  specialInstructions: string;
  pets: boolean;
  petDetails: string;
  
  // Survey Questions
  hasBatteries?: boolean;
  hasBatteriesText?: string;
  includeStorage?: boolean;
  includeStorageText?: string;
  designPreference: string;
  designPreferenceText?: string;
  isSharedRoof?: boolean;
  isSharedRoofText?: string;
  hasRecentConstruction?: boolean;
  hasRecentConstructionText?: string;
  constructionDetails: string;
  roofAge: string;
  roofMaterial: string;
  roofLayers: string;
  hasHOA?: boolean;
  hasHOAText?: string;
  hoaName: string;
  hoaPhone: string;
  hoaEmail: string;
  hasHOAContact?: boolean;
  hasHOAContactText?: string;
  hasVaultedCeilings?: boolean;
  hasVaultedCeilingsText?: string;
  numberOfStories: string;
  stories: string;
  hasOngoingConstruction?: boolean;
  hasOngoingConstructionText?: string;
  ongoingConstructionDetails: string;
  hasExistingSolar?: boolean;
  hasExistingSolarText?: string;
  existingSolarDetails: string;
  hasSkylights?: boolean;
  hasSkylightsText?: string;
  skylightCount: string;
  roofVentType: string;
  hasOutsidePanel?: boolean;
  hasOutsidePanelText?: string;
  hasSubPanels?: boolean;
  hasSubPanelsText?: string;
  hasBlockedAccess?: boolean;
  hasBlockedAccessText?: string;
  gateAccessType: "yes" | "code" | "no" | "";
  gateAccessTypeText?: string;
  gateCode: string;
  mainPanelLocation: string;
  mainPanelLocationText?: string;
  mainPanelOtherLocation: string;
  
  // Time slot fields
  selectedDate: string;
  selectedTimeSlot: string;
  
  type?: string;
  
  projectName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Additional fields to store full text values
  petsText?: string;
  
  // Feedback field
  feedbackRating?: 'happy' | 'neutral' | 'unhappy';
  feedbackComments?: string;
} 