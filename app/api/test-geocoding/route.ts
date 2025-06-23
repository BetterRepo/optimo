import { NextRequest, NextResponse } from "next/server";
import { getCoordinatesFromAddress } from "../../utils/simpleGeocode";
import { getWarehouseCoordinates } from "../../utils/optimoLocationHelper";

/**
 * Test endpoint for Google Geocoding Service
 * This is for testing only and doesn't affect existing booking functionality
 * 
 * Usage: POST /api/test-geocoding
 * Body: { "address": "123 Main St, Los Angeles, CA 90001" }
 */
export async function POST(request: NextRequest) {
  try {
    const { address, warehouse } = await request.json();

    if (!address) {
      return NextResponse.json(
        { success: false, error: "Address is required" },
        { status: 400 }
      );
    }

    console.log('🧪 Testing geocoding for:', address);

    // Test Google Geocoding using existing function
    const googleResult = await getCoordinatesFromAddress(address);

    // Test fallback coordinates using existing function
    const fallbackResult = warehouse ? getWarehouseCoordinates(warehouse) : {
      latitude: 26.972335,
      longitude: -82.3500045
    };

    const response = {
      success: true,
      originalAddress: address,
      warehouse: warehouse || 'not provided',
      googleGeocoding: googleResult ? {
        success: true,
        coordinates: googleResult,
        formattedAddress: googleResult.formattedAddress
      } : {
        success: false,
        error: "Could not geocode address"
      },
      fallbackCoordinates: {
        success: true,
        coordinates: fallbackResult,
        source: warehouse ? 'warehouse' : 'default'
      },
      recommendation: googleResult
        ? 'Use Google geocoding result' 
        : 'Use fallback coordinates'
    };

    console.log('🧪 Geocoding test complete:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error("❌ Test geocoding error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for quick testing via browser
 * Usage: GET /api/test-geocoding?address=123 Main St, Los Angeles, CA 90001
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const warehouse = searchParams.get('warehouse');

  if (!address) {
    return NextResponse.json(
      { success: false, error: "Address parameter is required" },
      { status: 400 }
    );
  }

  // Use the same logic as POST
  return POST(new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ address, warehouse }),
    headers: {
      'Content-Type': 'application/json'
    }
  }));
} 