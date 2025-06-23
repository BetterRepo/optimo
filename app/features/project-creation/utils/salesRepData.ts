import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface SalesRep {
  recordId: string;
  relatedSalesCompany: string;
  fullName: string;
  salesCompanyName: string;
  companyEmail: string;
}

// Load the CSV data at build time
let salesReps: SalesRep[] = [];

try {
  // Path to CSV file - adjust if needed based on where the file will be deployed
  const csvFilePath = path.join(process.cwd(), 'Sales_Reps.csv');
  
  if (fs.existsSync(csvFilePath)) {
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    
    // Parse CSV data
    salesReps = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as SalesRep[];
    
    // Filter out any records without company email
    salesReps = salesReps.filter(rep => rep.companyEmail && rep.companyEmail.trim() !== '');
    
    console.log(`Loaded ${salesReps.length} sales reps from CSV`);
  } else {
    console.error('Sales_Reps.csv file not found at:', csvFilePath);
  }
} catch (error) {
  console.error('Error loading sales reps CSV data:', error);
}

export function getSalesReps(): SalesRep[] {
  return salesReps;
}

// For client-side usage, we need to fetch the data via API
export async function fetchSalesReps(): Promise<SalesRep[]> {
  try {
    const response = await fetch('/api/sales-reps');
    if (!response.ok) {
      throw new Error('Failed to fetch sales reps data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sales reps data:', error);
    return [];
  }
} 