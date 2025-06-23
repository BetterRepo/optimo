import { NextResponse } from 'next/server';
import { generateLocationId } from '../../utils/locationHelper';
import { createOrderLocation } from '../../utils/optimoLocationHelper';

// Add cutoff time check to the API side as a final safety measure
function isPastCutoffTime() {
  // Use the consistent PST date function
  const pstDate = getCurrentPSTDate();
  
  // Check if current PST time is 5 PM or later
  const isPast5PM = pstDate.getHours() >= 17; // 5 PM = 17:00
  
  console.log(`[API fetchSlots] Current PST time: ${pstDate.toLocaleTimeString()}, Hour: ${pstDate.getHours()}, Past 5 PM cutoff: ${isPast5PM}`);
  
  return isPast5PM;
}

// Get a proper PST date for consistent date checking
function getCurrentPSTDate() {
  // Create a formatter that will give us PST time components
  const pstFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });
  
  // Get the parts of the current time in PST
  const parts = pstFormatter.formatToParts(new Date());
  
  // Build an object with the date components
  const dateComponents = parts.reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = parseInt(part.value, 10);
    }
    return acc;
  }, {} as Record<string, number>);
  
  // Create a new Date object using PST components
  // Month is 0-indexed in JavaScript Date
  const pstDate = new Date(
    dateComponents.year,
    dateComponents.month - 1,
    dateComponents.day,
    dateComponents.hour,
    dateComponents.minute,
    dateComponents.second
  );
  
  return pstDate;
}

// Function to check if a date is tomorrow based on PST time
function isTomorrow(dateString: string): boolean {
  // Get the current PST date
  const today = getCurrentPSTDate();
  
  // Create tomorrow's date in PST
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Reset hours to compare just the dates
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  
  // Parse the input date
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  
  // Debug output to verify values
  console.log(`[API fetchSlots] Date comparison: 
    Input date: ${dateString} (${date.toISOString()})
    PST Today: ${today.toISOString()} 
    PST Tomorrow: ${tomorrow.toISOString()}
  `);
  
  const isSameDate = date.getTime() === tomorrow.getTime();
  
  if (isSameDate) {
    console.log(`[API fetchSlots] Date ${dateString} is TOMORROW in PST`);
  } else {
    const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    console.log(`[API fetchSlots] Date ${dateString} is ${diffDays} days from today in PST`);
  }
  
  return isSameDate;
}

// Check if a date is a weekend (returns true for weekends)
function isWeekend(dateString: string): boolean {
  const date = new Date(dateString);
  const day = date.getDay();
  const isWeekendDay = day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  
  if (isWeekendDay) {
    console.log(`[API fetchSlots] Date ${dateString} is a WEEKEND (day ${day})`);
  }
  
  return isWeekendDay;
}

export async function POST(request: Request) {
  console.log('\n=== FETCH SLOTS API CALLED ===');
  
  try {
    const bookingData = await request.json();
    console.log('Booking Data:', JSON.stringify(bookingData, null, 2));

    // ====== CRITICAL BUSINESS RULE: Enforce 5 PM PST cutoff ======
    const isCutoff = isPastCutoffTime();
    
    // Check if the requested booking date is tomorrow and we're past the cutoff
    if (bookingData.order?.date) {
      // If it's a weekend or (past cutoff and tomorrow), reject the request
      if (isWeekend(bookingData.order.date)) {
        console.log(`[API fetchSlots] Rejected weekend date: ${bookingData.order.date}`);
        return NextResponse.json({
          success: false,
          message: "Booking is not available on weekends. Please select a weekday."
        });
      }
      
      if (isCutoff && isTomorrow(bookingData.order.date)) {
        console.log(`[API fetchSlots] Rejected tomorrow's date (${bookingData.order.date}) due to 5 PM PST cutoff`);
        return NextResponse.json({
          success: false,
          message: "Booking for tomorrow is not available after 5:00 PM PST. Please select a date that is at least 2 days out."
        });
      }
    }
    
    // Filter out weekend dates from the request before processing
    if (bookingData.slots?.dates && Array.isArray(bookingData.slots.dates)) {
      const originalDates = [...bookingData.slots.dates];
      
      bookingData.slots.dates = bookingData.slots.dates.filter((date: string) => {
        // First filter: Remove weekends
        if (isWeekend(date)) {
          console.log(`[API fetchSlots] Filtered out weekend date: ${date}`);
          return false;
        }
        
        // Second filter: Remove tomorrow if past cutoff time
        if (isCutoff && isTomorrow(date)) {
          console.log(`[API fetchSlots] Filtered out tomorrow (${date}) due to 5 PM PST cutoff`);
          return false;
        }
        
        return true;
      });
      
      console.log('Date filtering results (fetchSlots):', {
        original: originalDates,
        filtered: bookingData.slots.dates,
        cutoffApplied: isCutoff,
        removedDates: originalDates.filter(d => !bookingData.slots.dates.includes(d))
      });
      
      // If all dates were filtered out (all were weekends or tomorrow after cutoff), return an error
      if (bookingData.slots.dates.length === 0) {
        return NextResponse.json({
          success: false,
          message: "All selected dates are invalid. Please select weekdays that respect the 5 PM PST cutoff rule."
        });
      }
    }

    // Ensure the order data has all required fields
    if (!bookingData.order?.orderNo) {
      console.error('Error: Missing required orderNo in request');
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required orderNo field' 
      }, { status: 400 });
    }
    
    // Ensure date is properly formatted as YYYY-MM-DD
    // BUT: Handle the case where dates are in slots.dates instead of order.date
    if (bookingData.order?.date) {
      // Validate existing order.date format - don't "fix" it if it's already correct to avoid timezone shifts
      if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingData.order.date)) {
        console.error('Error: Invalid date format:', bookingData.order?.date);
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid date format. Please use YYYY-MM-DD.' 
        }, { status: 400 });
      }
    } else if (bookingData.slots?.dates && bookingData.slots.dates.length > 0) {
      // If no order.date but we have slots.dates, use the first date directly without conversion
      console.log('No order.date found, using first date from slots.dates:', bookingData.slots.dates[0]);
      bookingData.order.date = bookingData.slots.dates[0];
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required date field' 
      }, { status: 400 });
    }
    
    // Validate location data
    if (!bookingData.order?.location?.address) {
      console.error('Error: Missing required location address in request');
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required location address' 
      }, { status: 400 });
    }

    // If location doesn't have locationNo, create it first to ensure proper pin placement
    if (bookingData.order?.location && !bookingData.order.location.locationNo) {
      try {
        // Extract warehouse from tags if available
        const warehouseName = bookingData.order.tags?.[1]?.replace('_', ', ');
        
        // Create or get location first
        const geocodedCoordinates = (bookingData.order.location.latitude && bookingData.order.location.longitude) ? {
          latitude: bookingData.order.location.latitude,
          longitude: bookingData.order.location.longitude
        } : undefined;
        
        const locationData = await createOrderLocation(
          bookingData.order.location.address,
          bookingData.order.location.locationName,
          warehouseName,
          geocodedCoordinates
        );
        
        console.log('Created/retrieved location for slots:', locationData);
        
        // Replace the location object with our improved version
        bookingData.order.location = locationData;
      } catch (locationError) {
        console.error('Error creating location:', locationError);
        
        // Continue with the existing flow using the current location object
        // Ensure we have coordinates for the location to avoid geocoding issues
        if (bookingData.order?.location) {
          // Remove problematic properties if they exist
          if ('acceptMultipleResults' in bookingData.order.location) {
            delete bookingData.order.location.acceptMultipleResults;
          }
          if ('acceptPartialMatch' in bookingData.order.location) {
            delete bookingData.order.location.acceptPartialMatch;
          }
          
          // Fall back to adding locationNo directly
          if (!bookingData.order.location.locationNo) {
            bookingData.order.location.locationNo = generateLocationId(
              bookingData.order.location.address,
              bookingData.order.location.locationName || 'location'
            );
          }
          
          // Add coordinates if missing - but preserve geocoded coordinates if they exist
          if (!bookingData.order.location.latitude || !bookingData.order.location.longitude) {
            console.log('🌍 No coordinates provided - using warehouse defaults');
            // Extract warehouse from address if available
            const address = bookingData.order.location.address || '';
            const warehouseMatch = address.match(/(Cerritos|Sacramento|Fresno|Phoenix|Dallas|Lakeland)/i);
            const warehouse = warehouseMatch ? warehouseMatch[0] : null;
            
            // Set coordinates based on warehouse or use default
            if (warehouse) {
              if (warehouse.includes('Cerritos')) {
                bookingData.order.location.latitude = 33.8583;
                bookingData.order.location.longitude = -118.0515;
              } else if (warehouse.includes('Sacramento')) {
                bookingData.order.location.latitude = 38.5816;
                bookingData.order.location.longitude = -121.4944;
              } else if (warehouse.includes('Fresno')) {
                bookingData.order.location.latitude = 36.7378;
                bookingData.order.location.longitude = -119.7871;
              } else if (warehouse.includes('Phoenix')) {
                bookingData.order.location.latitude = 33.4484;
                bookingData.order.location.longitude = -112.0740;
              } else if (warehouse.includes('Dallas')) {
                bookingData.order.location.latitude = 32.7767;
                bookingData.order.location.longitude = -96.7970;
              } else if (warehouse.includes('Lakeland')) {
                bookingData.order.location.latitude = 28.0395;
                bookingData.order.location.longitude = -81.9498;
              }
            } else {
              // Default to a safe coordinate to prevent geocoding errors
              bookingData.order.location.latitude = 26.972335;
              bookingData.order.location.longitude = -82.3500045;
            }
          } else {
            console.log('🎯 Using provided geocoded coordinates:', {
              latitude: bookingData.order.location.latitude,
              longitude: bookingData.order.location.longitude,
              address: bookingData.order.location.address
            });
          }
        }
      }
    }

    const apiKey = "0115400db6ed3e58f1c596bca2555ebf58fddkoP1Gc";
    
    // For CRM bookings, always create the order first
    if (bookingData.isCRMBooking === true || (bookingData.order?.tags && bookingData.order.tags.includes("CRM"))) {
      console.log('CRM Booking detected - creating order directly first');
      
      try {
        const createResponse = await fetch(`https://api.optimoroute.com/v1/create_or_update_orders?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orders: [bookingData.order]
          })
        });
        
        const createData = await createResponse.json();
        console.log('Direct order creation result:', createData);
        
        if (createResponse.ok && createData.success) {
          // Successfully created the order - now generate a new orderNo for the slots API
          // to avoid the ERR_ORD_EXISTS error
          const originalOrderNo = bookingData.order.orderNo;
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
          const temporaryOrderNo = `TEMP${timestamp}${randomString}`;
          
          console.log(`Order ${originalOrderNo} was created successfully. Using temporary orderNo ${temporaryOrderNo} for slots API.`);
          
          // Store the original orderNo to return in the response
          const savedOrderNo = bookingData.order.orderNo;
          
          // Use a temporary orderNo for the slots API call
          bookingData.order.orderNo = temporaryOrderNo;
          
          // Add a flag to restore the original orderNo in the response
          bookingData._originalOrderNo = savedOrderNo;
        } else if (!createResponse.ok || !createData.success) {
          console.error('Failed to create order directly:', createData);
          // Continue anyway to try fetching slots
        }
      } catch (createError) {
        console.error('Error during direct order creation:', createError);
        // Continue to try normal slot fetching
      }
    }
    
    const url = `https://api.optimoroute.com/v1/booking_slots?key=${apiKey}`;

    // Clean up the location object before sending to OptimoRoute API
    if (bookingData.order?.location) {
      // Remove properties that OptimoRoute API doesn't accept
      delete bookingData.order.location.acceptMultipleResults;
      delete bookingData.order.location.acceptPartialMatch;
    }

    console.log('API URL:', url);
    console.log('Sending booking data to OptimoRoute API:', JSON.stringify(bookingData, null, 2));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      console.log('OptimoRoute API response status:', response.status);

      // Handle different types of errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OptimoRoute Error Response:', {
          status: response.status,
          text: errorText
        });

        // Try to parse the error response to check for geocoding errors
        try {
          const errorData = JSON.parse(errorText);
          console.log('Parsed error response:', errorData);
          
          // Check specifically for multiple geocoding results error
          if (errorData.code === 'ERR_LOC_GEOCODING_MULTIPLE' && errorData.geocodingResults && errorData.geocodingResults.length > 0) {
            console.log('Multiple geocoding results found - using first result:', errorData.geocodingResults[0]);
            
            // Extract the first geocoding result
            const firstResult = errorData.geocodingResults[0];
            const [address, latitude, longitude] = firstResult;
            
            // Create a modified order with the exact coordinates from the first result
            const modifiedOrder = {...bookingData.order};
            if (!modifiedOrder.location) {
              modifiedOrder.location = {};
            }
            
            modifiedOrder.location.latitude = latitude;
            modifiedOrder.location.longitude = longitude;
            modifiedOrder.location.address = address;
            
            // Add locationNo for consistent pin placement
            if (!modifiedOrder.location.locationNo && address) {
              modifiedOrder.location.locationNo = generateLocationId(
                address, 
                modifiedOrder.location.locationName || modifiedOrder.customField1 || 'location'
              );
            }
            
            // Try creating the order with the exact coordinates
            console.log('Creating order with exact coordinates from first geocoding result');
            const createResponse = await fetch(`https://api.optimoroute.com/v1/create_or_update_orders?key=${apiKey}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                orders: [modifiedOrder]
              })
            });
            
            const createData = await createResponse.json();
            console.log('Create with coordinates response:', createData);
            
            if (createResponse.ok && createData.success) {
              // If successful, try fetching slots again with the same order
              const slotsRetryResponse = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  ...bookingData,
                  order: modifiedOrder
                })
              });
              
              if (slotsRetryResponse.ok) {
                const retryData = await slotsRetryResponse.json();
                console.log('Retry slots response:', retryData);
                
                if (retryData.success && retryData.slots) {
                  return NextResponse.json({ 
                    success: true, 
                    slots: retryData.slots
                  });
                }
              }
              
              // If we still couldn't get slots, return empty slots but with success
              return NextResponse.json({ 
                success: true, 
                slots: [],
                message: 'No available slots found for the selected date. Please try another date.'
              });
            }
          }
          
          // Handle error when order already exists
          if (errorData.code === 'ERR_ORD_EXISTS') {
            console.log('Order already exists, generating new orderNo');
            
            // Create a modified order with a new orderNo
            const modifiedOrder = {...bookingData.order};
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
            modifiedOrder.orderNo = `TEMP${timestamp}${randomString}`;
            
            console.log('Retrying with new orderNo:', modifiedOrder.orderNo);
            
            // Try fetching slots again with the new orderNo
            const slotsRetryResponse = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                ...bookingData,
                order: modifiedOrder
              })
            });
            
            if (slotsRetryResponse.ok) {
              const retryData = await slotsRetryResponse.json();
              console.log('Retry slots response with new orderNo:', retryData);
              
              // Now delete the temporary order since we no longer need it
              try {
                console.log('Deleting temporary order:', modifiedOrder.orderNo);
                const deleteResponse = await fetch(`https://api.optimoroute.com/v1/delete_orders?key=${apiKey}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    orderNos: [modifiedOrder.orderNo]
                  })
                });
                
                const deleteResult = await deleteResponse.json();
                console.log('Delete temporary order result:', deleteResult);
              } catch (deleteError) {
                console.error('Failed to delete temporary order:', deleteError);
                // Continue anyway, this is just cleanup
              }
              
              if (retryData.success && retryData.slots) {
                // Include the new orderNo in the response so the client can update
                return NextResponse.json({ 
                  success: true, 
                  slots: retryData.slots,
                  orderNo: bookingData.order.orderNo // Return the original orderNo
                });
              }
            }
          }
        } catch (parseError) {
          console.error('Failed to parse error response for geocoding check:', parseError);
          // Continue with the regular error handling
        }

        // For any error, try direct order creation as fallback
        console.log('API failed - trying direct order creation as fallback');
        try {
          const createResponse = await fetch(`https://api.optimoroute.com/v1/create_or_update_orders?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              orders: [bookingData.order]
            })
          });
          
          console.log('Direct create response status:', createResponse.status);
          
          if (createResponse.ok) {
            const createData = await createResponse.json();
            console.log('Direct create response:', JSON.stringify(createData, null, 2));
            
            if (createData.success) {
              console.log('Successfully created order directly. Returning empty slots array.');
              // Return empty slots array to allow user to pick another date
              return NextResponse.json({ 
                success: true, 
                slots: [],
                message: 'No available slots found for the selected date. Please try another date.'
              });
            }
          }
        } catch (createError) {
          console.error('Failed fallback creation:', createError);
        }
        
        return NextResponse.json({ 
          success: false, 
          message: 'No available slots found for this date. Please try selecting a different date.' 
        }, { status: 200 }); // Return 200 to avoid showing error message
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', responseText);
        return NextResponse.json({ 
          success: false, 
          message: 'Could not retrieve available slots. Please try again or select a different date.' 
        }, { status: 200 }); // Return 200 to avoid error display
      }

      console.log('OptimoRoute Response:', JSON.stringify(data, null, 2));
      
      // Check if slots array exists and has items
      if (!data.slots || data.slots.length === 0) {
        return NextResponse.json({ 
          success: true, 
          slots: [],
          message: 'No available slots found for the selected date. Please try another date.',
          // If we have an original orderNo, return it to the client
          ...(bookingData._originalOrderNo && { orderNo: bookingData._originalOrderNo })
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        slots: data.slots,
        // If we have an original orderNo, return it to the client
        ...(bookingData._originalOrderNo && { orderNo: bookingData._originalOrderNo })
      });
    } catch (apiError) {
      console.error('API Call Error:', apiError);
      return NextResponse.json({ 
        success: false, 
        message: 'Could not connect to scheduling service. Please try again later.' 
      }, { status: 200 }); // Return 200 to avoid error display
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An unexpected error occurred. Please try again later.' 
    }, { status: 200 }); // Return 200 to avoid error display
  }
}
