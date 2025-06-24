import { NextRequest, NextResponse } from "next/server";
import type { BookingSlotsPayload } from "../../types/bookingSlot";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received booking slots request:", body);
    const response = await fetch(
      "https://api.optimoroute.com/v1/booking_slots?key=0115400db6ed3e58f1c596bca2555ebf58fddkoP1Gc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    console.log("data", data);
    return NextResponse.json({
      success: true,
      slots: data.slots,
      //   // Include original orderNo if we stored it
      //   ...(body._originalOrderNo && { orderNo: body._originalOrderNo }),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
