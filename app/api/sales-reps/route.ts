import { NextResponse } from 'next/server';
import salesReps from './salesData';

export interface SalesRep {
  recordId: string;
  relatedSalesCompany: string;
  fullName: string;
  salesCompanyName: string;
  companyEmail: string;
}

// Mock data sample to ensure the route works
const mockSalesReps: SalesRep[] = [
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
  }
];

export async function GET() {
  try {
    console.log(`Serving ${salesReps.length} sales reps`);
    return NextResponse.json(salesReps);
  } catch (error) {
    console.error('Error in sales-reps API route:', error);
    return NextResponse.json({ error: 'Failed to load sales representatives' }, { status: 500 });
  }
} 