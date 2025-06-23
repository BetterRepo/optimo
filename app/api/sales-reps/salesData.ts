import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

export interface SalesRep {
  recordId: string;
  relatedSalesCompany: string;
  fullName: string;
  salesCompanyName: string;
  companyEmail: string;
}

let salesReps: SalesRep[] = [];

try {
  // Path to the CSV file in the root directory
  const csvFilePath = path.join(process.cwd(), 'Sales_Reps.csv');
  
  // Read the CSV file
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  
  // Parse the CSV data
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  
  // Transform the records into SalesRep objects
  salesReps = records.map((record: any) => ({
    recordId: record['Record ID#'] || '',
    relatedSalesCompany: record['Related Sales Company'] || '',
    fullName: record['Full Name'] || '',
    salesCompanyName: record['Sales Company Name'] || '',
    companyEmail: record['Company Email'] || ''
  }));
  
  console.log(`Loaded ${salesReps.length} sales reps from CSV file`);
} catch (error) {
  console.error('Error loading sales reps from CSV:', error);
  
  // Fallback to sample data if CSV loading fails
  salesReps = [
    {
      recordId: "11599",
      relatedSalesCompany: "",
      fullName: "radia test",
      salesCompanyName: "",
      companyEmail: "radia@gmail.com"
    },
    {
      recordId: "11601",
      relatedSalesCompany: "503",
      fullName: "Rafael Matha",
      salesCompanyName: "RC ELECTRIC LLC",
      companyEmail: "rafael.matha@gmail.com"
    },
    {
      recordId: "11607",
      relatedSalesCompany: "3",
      fullName: "Ariel Hernandez",
      salesCompanyName: "100 Mill Solar",
      companyEmail: "ariel.hernandez@betterearth.solar"
    },
    {
      recordId: "67",
      relatedSalesCompany: "79",
      fullName: "Abby Ross",
      salesCompanyName: "Better Earth",
      companyEmail: "abby.ross@betterearth.solar"
    },
    {
      recordId: "88",
      relatedSalesCompany: "79",
      fullName: "Abeselom Semere",
      salesCompanyName: "Better Earth",
      companyEmail: "abeselom.semere@betterearth.solar"
    },
    {
      recordId: "85",
      relatedSalesCompany: "79",
      fullName: "Abraham Teklehaimanot",
      salesCompanyName: "Better Earth",
      companyEmail: "abraham.teklehaimanot@betterearth.solar"
    },
    {
      recordId: "86",
      relatedSalesCompany: "79",
      fullName: "Abubek Mamedowv",
      salesCompanyName: "Better Earth",
      companyEmail: "abubek.mamedowv@betterearth.solar"
    },
    {
      recordId: "87",
      relatedSalesCompany: "79",
      fullName: "Acosta, Carlos",
      salesCompanyName: "Better Earth",
      companyEmail: "carlos.acosta@betterearth.solar"
    },
    {
      recordId: "11",
      relatedSalesCompany: "79",
      fullName: "Adam Acosta",
      salesCompanyName: "Better Earth",
      companyEmail: "adam.acosta@betterearth.solar"
    },
    {
      recordId: "12",
      relatedSalesCompany: "79",
      fullName: "Adam Arredondo",
      salesCompanyName: "Better Earth",
      companyEmail: "adam.arredondo@betterearth.solar"
    }
  ];
  console.log('Using fallback sample data instead');
}

export default salesReps; 