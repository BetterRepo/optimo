import { NextRequest, NextResponse } from "next/server";
import { generateLocationId } from "../../utils/locationHelper";
import { createOrderLocation } from "../../utils/optimoLocationHelper";

// This function handles POST requests to make a reservation.
export async function POST(request: NextRequest) {
  try {
    const { reservationId, createOrderIfBookingFails, orderData } = await request.json();
    
    console.log("MakeReservation API called with:", { 
      reservationId, 
      createOrderIfBookingFails,
      orderData: orderData ? "Provided" : "Not provided"
    });

    if (!reservationId) {
      console.error("Error: reservationId is required");
      return NextResponse.json(
        { success: false, message: "Reservation ID is required" },
        { status: 400 }
      );
    }

    // Define the API key directly here
    const apiKey = "0115400db6ed3e58f1c596bca2555ebf58fddkoP1Gc";
    
    // For CRM bookings, always try to create the order directly first
    if (createOrderIfBookingFails === true && orderData) {
      console.log("This is a CRM booking - creating order directly first");
      
      try {
        // Make sure we have lat/lng in the location object - this avoids geocoding issues
        if (orderData.location && typeof orderData.location === 'object') {
          // Remove problematic properties if they exist
          if ('acceptMultipleResults' in orderData.location) {
            delete orderData.location.acceptMultipleResults;
          }
          if ('acceptPartialMatch' in orderData.location) {
            delete orderData.location.acceptPartialMatch;
          }
          
          // If locationName is "Survey Customer", replace it with a better value
          if (orderData.location.locationName === "Survey Customer") {
            // Try to get a better name from available fields
            const customerName = orderData.customField1 || 
                                orderData.email || 
                                orderData.phone || 
                                "Customer";
            
            console.log(`Replacing generic "Survey Customer" with "${customerName}"`);
            orderData.location.locationName = customerName;
          }

          // If locationNo is not present, create or get location first
          if (!orderData.location.locationNo && orderData.location.address) {
            try {
              // Create or get location
              const geocodedCoordinates = (orderData.location.latitude && orderData.location.longitude) ? {
                latitude: orderData.location.latitude,
                longitude: orderData.location.longitude
              } : undefined;
              
              const locationData = await createOrderLocation(
                orderData.location.address,
                orderData.location.locationName || orderData.customField1 || 'location',
                // Try to extract warehouse from tags if available
                orderData.tags?.[1]?.replace('_', ', '),
                geocodedCoordinates
              );
              
              console.log('Created/retrieved location:', locationData);
              
              // Replace the location object with our improved version
              orderData.location = locationData;
            } catch (locationError) {
              console.error('Error creating location:', locationError);
              // Fall back to adding locationNo directly if the API call fails
              orderData.location.locationNo = generateLocationId(
                orderData.location.address,
                orderData.location.locationName || orderData.customField1 || 'location'
              );
            }
          }
          
          // Make sure we have coordinates to avoid geocoding issues - only if not using locationNo approach
          if ((!orderData.location.locationNo || orderData.location.latitude) && 
              (!orderData.location.latitude || !orderData.location.longitude)) {
            console.log('🌍 No coordinates provided - using warehouse defaults');
            // Extract warehouse from address if available
            const address = orderData.location.address || '';
            const warehouseMatch = address.match(/(Cerritos|Sacramento|Fresno|Phoenix|Dallas|Lakeland)/i);
            const warehouse = warehouseMatch ? warehouseMatch[0] : null;
            
            // Set coordinates based on warehouse or use default
            if (warehouse) {
              if (warehouse.includes('Cerritos')) {
                orderData.location.latitude = 33.8583;
                orderData.location.longitude = -118.0515;
              } else if (warehouse.includes('Sacramento')) {
                orderData.location.latitude = 38.5816;
                orderData.location.longitude = -121.4944;
              } else if (warehouse.includes('Fresno')) {
                orderData.location.latitude = 36.7378;
                orderData.location.longitude = -119.7871;
              } else if (warehouse.includes('Phoenix')) {
                orderData.location.latitude = 33.4484;
                orderData.location.longitude = -112.0740;
              } else if (warehouse.includes('Dallas')) {
                orderData.location.latitude = 32.7767;
                orderData.location.longitude = -96.7970;
              } else if (warehouse.includes('Lakeland')) {
                orderData.location.latitude = 28.0395;
                orderData.location.longitude = -81.9498;
              }
            } else {
              // Default to a safe coordinate to prevent geocoding errors
              orderData.location.latitude = 26.972335;
              orderData.location.longitude = -82.3500045;
            }
          } else if (orderData.location.latitude && orderData.location.longitude) {
            console.log('🎯 Using provided geocoded coordinates:', {
              latitude: orderData.location.latitude,
              longitude: orderData.location.longitude,
              address: orderData.location.address
            });
          }
        }
        
        const createOrderResponse = await fetch(
          `https://api.optimoroute.com/v1/create_or_update_orders?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orders: [orderData]
            }),
          }
        );
        
        const createOrderResult = await createOrderResponse.json();
        console.log("📋 DETAILED ORDER CREATION DEBUG:");
        console.log("   Order data sent:", JSON.stringify(orderData, null, 2));
        console.log("   API Response:", JSON.stringify(createOrderResult, null, 2));
        console.log("   Order should have:");
        console.log("   - Time windows:", orderData.timeWindows);
        console.log("   - Driver assigned:", orderData.assignedTo);
        console.log("   - Date:", orderData.date);
        console.log("   - Duration:", orderData.duration);
        
        // If order creation was successful, skip the reservation step
        if (createOrderResult.success) {
          console.log("✅ Order created successfully, skipping reservation step");
          
          // Add a small delay and then verify the order was created properly
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Verify the order exists and is scheduled
          try {
            const verifyResponse = await fetch(
              `https://api.optimoroute.com/v1/get_orders?key=${apiKey}&orderNos=${orderData.orderNo}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            
            const verifyResult = await verifyResponse.json();
            console.log("🔍 ORDER VERIFICATION:", JSON.stringify(verifyResult, null, 2));
            
            if (verifyResult.success && verifyResult.orders && verifyResult.orders.length > 0) {
              const createdOrder = verifyResult.orders[0];
              console.log("📋 CREATED ORDER DETAILS:");
              console.log("   Status:", createdOrder.status);
              console.log("   Time windows:", createdOrder.timeWindows);
              console.log("   Assigned to:", createdOrder.assignedTo);
              console.log("   Date:", createdOrder.date);
              console.log("   Location:", createdOrder.location);
            }
          } catch (verifyError) {
            console.error("Error verifying order:", verifyError);
          }
          
          return NextResponse.json({
            success: true,
            message: "Order created successfully",
            orderCreated: true,
            orderNo: orderData.orderNo,
            orderDetails: createOrderResult
          });
        }
        
        // Handle the case where order already exists
        if (!createOrderResult.success && createOrderResult.code === 'ERR_ORD_EXISTS') {
          console.log('Order already exists, generating new orderNo');
          
          // Generate a new order number with more randomness
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
          const newOrderNo = `TEMP${timestamp}${randomString}`;
          
          console.log('Retrying with new orderNo:', newOrderNo);
          
          // Create a modified order with the new orderNo
          const modifiedOrder = {...orderData, orderNo: newOrderNo};
          
          // Try creating order again with new orderNo
          const retryCreateResponse = await fetch(
            `https://api.optimoroute.com/v1/create_or_update_orders?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orders: [modifiedOrder]
              }),
            }
          );
          
          const retryCreateResult = await retryCreateResponse.json();
          console.log("Retry order creation result:", retryCreateResult);
          
          if (retryCreateResult.success) {
            // After we've successfully used the temporary order, clean it up
            try {
              console.log('Deleting temporary order:', newOrderNo);
              const deleteResponse = await fetch(
                `https://api.optimoroute.com/v1/delete_orders?key=${apiKey}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    orderNos: [newOrderNo]
                  }),
                }
              );
              
              const deleteResult = await deleteResponse.json();
              console.log("Delete temporary order result:", deleteResult);
            } catch (deleteError) {
              console.error("Failed to delete temporary order:", deleteError);
              // Continue anyway, this is just cleanup
            }
            
            // Return success for CRM bookings since we've created the order
            console.log("✅ Order created successfully with new orderNo, skipping reservation step");
            return NextResponse.json({
              success: true,
              message: "Order created successfully with new orderNo",
              orderCreated: true,
              orderNo: orderData.orderNo
            });
          }
        }
      } catch (createError) {
        console.error("Failed to create order directly:", createError);
        // Continue to reservation attempt
      }
    }

    console.log("Making reservation with ID:", reservationId);
    
    // Make the API call to OptimoRoute with the reservation data
    const response = await fetch(
      `https://api.optimoroute.com/v1/booking_reserve?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId,
          createOrderIfBookingFails: true, // Always set to true to ensure order creation
        }),
      }
    );

    try {
      const responseText = await response.text();
      console.log("Raw OptimoRoute response:", responseText);
      
      if (response.ok && responseText) {
        try {
          const responseData = JSON.parse(responseText);
          console.log("Reservation successful:", responseData);
          return NextResponse.json(responseData);
        } catch (parseError) {
          console.error("Failed to parse successful response:", responseText);
          // Return success anyway to continue flow
          return NextResponse.json({ success: true, message: "Reservation completed" });
        }
      } else {
        console.error("Reservation failed with status:", response.status);
        
        if (createOrderIfBookingFails === true) {
          // For CRM bookings, continue the flow even if reservation fails
          console.log("Continuing despite reservation failure for CRM booking");
          return NextResponse.json({
            success: true,
            message: "Proceeding with order creation despite reservation failure",
            forceContinue: true
          });
        }
        
        try {
          const errorData = responseText ? JSON.parse(responseText) : { success: false, message: "Empty response" };
          console.log("Error data:", errorData);
          return NextResponse.json(errorData, { status: response.status });
        } catch (parseError) {
          return NextResponse.json({ 
            success: false, 
            message: "Failed to parse error response" 
          }, { status: response.status });
        }
      }
    } catch (responseError) {
      console.error("Error processing response:", responseError);
      return NextResponse.json(
        { success: false, message: "Error processing response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("MakeReservation unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred.", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
