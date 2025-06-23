import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderNo } = await request.json();
    
    console.log("🗑️ DeleteOrder API called for orderNo:", orderNo);

    if (!orderNo) {
      console.error("Error: orderNo is required");
      return NextResponse.json(
        { success: false, message: "Order number is required" },
        { status: 400 }
      );
    }

    const apiKey = "0115400db6ed3e58f1c596bca2555ebf58fddkoP1Gc";
    
    // Make the delete request to OptimoRoute
    const response = await fetch(
      `https://api.optimoroute.com/v1/delete_order?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNo: orderNo
        }),
      }
    );

    const responseData = await response.json();
    console.log("OptimoRoute delete response:", responseData);

    if (response.ok && responseData.success) {
      console.log(`✅ Order ${orderNo} deleted successfully`);
      return NextResponse.json({
        success: true,
        message: `Order ${orderNo} deleted successfully`,
        data: responseData
      });
    } else {
      console.error(`❌ Failed to delete order ${orderNo}:`, responseData);
      return NextResponse.json({
        success: false,
        message: responseData.message || `Failed to delete order ${orderNo}`,
        error: responseData
      }, { status: response.status });
    }
    
  } catch (error) {
    console.error("DeleteOrder unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while deleting the order", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 