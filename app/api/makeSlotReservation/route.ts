import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderNo, timeSlot } = await request.json();
    
    console.log("makeSlotReservation API called with:", { orderNo, timeSlot });

    if (!orderNo) {
      console.error("Error: orderNo is required");
      return NextResponse.json(
        { success: false, message: "Order number is required" },
        { status: 400 }
      );
    }

    if (!timeSlot) {
      console.error("Error: timeSlot is required");
      return NextResponse.json(
        { success: false, message: "Time slot is required" },
        { status: 400 }
      );
    }

    const apiKey = "0115400db6ed3e58f1c596bca2555ebf58fddkoP1Gc";
    
    // Extract date and times from the timeSlot value
    // timeSlot format: "2026-01-09T10:00:00 - 2026-01-09T14:00:00"
    const [fromDateTime, toDateTime] = timeSlot.split(' - ');
    const date = fromDateTime.split('T')[0]; // Get YYYY-MM-DD
    const fromTime = fromDateTime.split('T')[1].substring(0, 5); // Get HH:MM
    const toTime = toDateTime.split('T')[1].substring(0, 5); // Get HH:MM
    
    console.log("Parsed time slot:", { date, fromTime, toTime });
    
    // Make the reservation request to OptimoRoute
    const reservationPayload = {
      orderNo: orderNo,
      date: date,
      timeWindow: {
        twFrom: fromTime,
        twTo: toTime
      }
    };
    
    console.log("Making reservation with payload:", JSON.stringify(reservationPayload, null, 2));
    
    const response = await fetch(
      `https://api.optimoroute.com/v1/booking_reserve?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationPayload),
      }
    );

    console.log("OptimoRoute reservation response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OptimoRoute reservation error:", errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Failed to make reservation: ${errorText}` 
        },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    console.log("OptimoRoute reservation response:", JSON.stringify(responseData, null, 2));
    
    if (responseData.success && responseData.reservationId) {
      return NextResponse.json({
        success: true,
        reservationId: responseData.reservationId,
        message: "Reservation created successfully"
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: responseData.message || "Failed to create reservation" 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Error in makeSlotReservation:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Internal server error" 
      },
      { status: 500 }
    );
  }
} 