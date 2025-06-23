import { NextRequest, NextResponse } from "next/server";

// This function handles the POST request to update an order.
export async function POST(req: NextRequest) {
  const apiKey = "0115400db6ed3e58f1c596bca2555ebf58fddkoP1Gc";
  const url = `https://api.optimoroute.com/v1/create_or_update_orders?key=${apiKey}`;

  try {
    const payload = await req.json();
    console.log("Submitting payload to OptimoRoute API:", payload);

    // Add geocoding acceptance to any orders with locations
    if (payload.orders && Array.isArray(payload.orders)) {
      payload.orders.forEach((order: any) => {
        if (order.location && typeof order.location === 'object') {
          // Remove problematic properties if they exist
          if ('acceptMultipleResults' in order.location) {
            delete order.location.acceptMultipleResults;
          }
          if ('acceptPartialMatch' in order.location) {
            delete order.location.acceptPartialMatch;
          }
          
          // Make sure we have coordinates to avoid geocoding issues
          if (order.location.address && (!order.location.latitude || !order.location.longitude)) {
            console.log('🌍 No coordinates provided - checking if this is a warehouse address or customer address');
            // Extract warehouse from address if available
            const address = order.location.address || '';
            const warehouseMatch = address.match(/(Cerritos|Sacramento|Fresno|Phoenix|Dallas|Lakeland)/i);
            const warehouse = warehouseMatch ? warehouseMatch[0] : null;
            
            // Only set warehouse coordinates for warehouse addresses
            // For customer addresses, let OptimoRoute handle geocoding
            if (warehouse && (address.toLowerCase().includes('warehouse') || address.toLowerCase().includes('ca') || address.toLowerCase().includes('tx') || address.toLowerCase().includes('fl'))) {
              console.log(`🏢 Using warehouse coordinates for ${warehouse}`);
              if (warehouse.includes('Cerritos')) {
                order.location.latitude = 33.8583;
                order.location.longitude = -118.0515;
              } else if (warehouse.includes('Sacramento')) {
                order.location.latitude = 38.5816;
                order.location.longitude = -121.4944;
              } else if (warehouse.includes('Fresno')) {
                order.location.latitude = 36.7378;
                order.location.longitude = -119.7871;
              } else if (warehouse.includes('Phoenix')) {
                order.location.latitude = 33.4484;
                order.location.longitude = -112.0740;
              } else if (warehouse.includes('Dallas')) {
                order.location.latitude = 32.7767;
                order.location.longitude = -96.7970;
              } else if (warehouse.includes('Lakeland')) {
                order.location.latitude = 28.0395;
                order.location.longitude = -81.9498;
              }
            } else {
              // For customer addresses, let OptimoRoute handle geocoding by not providing coordinates
              console.log('🎯 Customer address detected - letting OptimoRoute handle geocoding for accurate pin placement');
              console.log('   Address to be geocoded:', address);
              // Don't set any coordinates - let OptimoRoute geocode the address
            }
          } else if (order.location.latitude && order.location.longitude) {
            console.log('🎯 Using provided geocoded coordinates:', {
              latitude: order.location.latitude,
              longitude: order.location.longitude,
              address: order.location.address
            });
          }
        }
      });
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("OptimoRoute API Response:", data);

      if (data.success) {
        console.log("Order successfully created or updated.");
        return NextResponse.json({ success: true, data });
      } else {
        console.warn("Order creation/update failed:", data.message || "Unknown error.");
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Order creation/update failed.",
          },
          { status: 400 }
        );
      }
    } else {
      const errorData = await response.json();
      console.error("OptimoRoute API Error:", errorData);

      if (errorData.code === "ERR_INVALID_OR_EXPIRED_RESERVATION") {
        console.warn("Reservation is invalid or expired.");
        return NextResponse.json(
          {
            success: false,
            message: "The reservation ID is invalid or has expired. Please try selecting a new slot.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(errorData, { status: response.status });
    }
  } catch (error: any) {
    console.error("An unexpected error occurred:", error.message || error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error: " + (error.message || "Unknown error.") },
      { status: 500 }
    );
  }
}
