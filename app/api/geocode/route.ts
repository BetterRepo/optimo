import { NextRequest, NextResponse } from "next/server";
import { getCoordinatesFromAddress } from "../../utils/simpleGeocode";

/**
 * API endpoint to get coordinates from an address
 * 
 * Usage: POST /api/geocode
 * Body: { "address": "14th St, Vallejo, CA 94590, USA" }
 * 
 * Returns: { "latitude": 38.1014672, "longitude": -122.231098, "formattedAddress": "..." }
 */
export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      console.log('❌ No address provided in request');
      return NextResponse.json(
        { success: false, error: "Address is required" },
        { status: 400 }
      );
    }

    console.log('🗺️ GEOCODE API CALLED with address:', address);

    // Call our geocoding function
    const coordinates = await getCoordinatesFromAddress(address);

    if (coordinates) {
      console.log('✅ GEOCODE API SUCCESS:', coordinates);
      return NextResponse.json({
        success: true,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        formattedAddress: coordinates.formattedAddress,
        address: address
      });
    } else {
      console.log('❌ GEOCODE API FAILED: No coordinates found');
      return NextResponse.json(
        { success: false, error: "Could not geocode address" },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('❌ GEOCODE API ERROR:', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 