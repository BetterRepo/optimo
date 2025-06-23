export type LeadType = 'Self Gen (Doors)' | 'Self Gen (Events)' | 'Self Gen (Referral)' | 'Self Gen (Other)' | 'Dealer';
export type ModuleType = 'Base Module (405w JA Panel)' | 'Premium Module (410w QCell Panel)';
export type StorageOption = 
  | 'Yes' 
  | 'No'
  | '1 SE Energy Bank (No Bkup)'
  | '2 SE Energy Bank (No Bkup)'
  | '3 SE Energy Bank (No Bkup)'
  | '1 Enphase 5P (No Bkup)'
  | '1 Enphase 5P (Partial Backup)'
  | '2 Enphase 5P (No Bkup)'
  | '2 Enphase 5P (Partial Backup)'
  | '3 Enphase 5P (No Bkup)'
  | '3 Enphase 5P (WH Backup)'
  | '4 Enphase 5P (No Bkup)'
  | '4 Enphase 5P (WH Backup)'
  | '1 Franklin Batt (Partial Backup)'
  | '1 SE Energy Bank (Partial Backup)'
  | '2 SE Energy Bank (WH Backup)'
  | '3 SE Energy Bank (WH Backup)'
  | '1 Tesla PowerWall 3 (WH Backup)'
  | '2 Tesla PowerWall 3 (WH Backup)'
  | '3 Tesla PowerWall 3 (WH Backup)'
  | '4 Tesla PowerWall 3 (WH Backup)'
  | '';
export type Adder = string;

export type FinanceCompany = 'LightReach' | 'GoodLeap' | 'EnFin' | 'HomeRun' | 'Dividend' | 'Sunrun' | 'Cash';
export type FinanceType = 'Loan' | 'Cash' | 'Lease' | 'PPA' | 'PACE' | 'Prepaid-PPA';

export interface ProjectCreationFormData {
  firstName: string;
  lastName: string;
  preferredLanguage: 'English' | 'Spanish' | '';
  hasCompletedWelcomeCall: boolean;
  welcomeCallCompleted: boolean;
  financeCompany: FinanceCompany | '';
  financeType: FinanceType | '';
  escalator: string;
  term: string;
  leadType: LeadType | '';
  moduleCount: string;
  moduleType: ModuleType | '';
  storage: StorageOption | '';
  storageOption: StorageOption | '';
  adders: Adder[];
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  warehouse: string;
  systemSize: string;
  additionalNotes: string;
  ubillFile?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
  ubillFiles?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  isAdditionalSurvey: boolean;
  isSurveyBooking: boolean;
  insightlyRecordId: string;
  interestRate: string;
  yearlyProduction: string;
  financeOrg: string;
  lgcyCanvassId: string;
  epc: string;
  kwhRate: string;
  leadId: string;
  pangeaId: string;
  insightlyId: string;
  salesRepEmail: string;
  salesRepEmail2: string;
  dialerEmail: string;
  customerEmail: string;
  customerPhone: string;
  internalToken: string;
  
  // Secondary contact fields
  secondaryFirstName?: string;
  secondaryLastName?: string;
  secondaryEmail?: string;
  secondaryPhone?: string;
  secondaryRelationship?: string;
  
  // Tenant information
  hasTenants?: boolean;
  tenantFirstName?: string;
  tenantLastName?: string;
  tenantEmail?: string;
  tenantPhone?: string;
} 