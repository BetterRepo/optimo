import { NextResponse } from 'next/server';

// Add cutoff time check to the API side as a final safety measure
function isPastCutoffTime() {
  // Use the consistent PST date function
  const pstDate = getCurrentPSTDate();
  
  // Check if current PST time is 5 PM or later
  const isPast5PM = pstDate.getHours() >= 17; // 5 PM = 17:00
  
  console.log(`[API] Current PST time: ${pstDate.toLocaleTimeString()}, Hour: ${pstDate.getHours()}, Past 5 PM cutoff: ${isPast5PM}`);
  
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
  console.log(`[API] Date comparison: 
    Input date: ${dateString} (${date.toISOString()})
    PST Today: ${today.toISOString()} 
    PST Tomorrow: ${tomorrow.toISOString()}
  `);
  
  const isSameDate = date.getTime() === tomorrow.getTime();
  
  if (isSameDate) {
    console.log(`[API] Date ${dateString} is TOMORROW in PST`);
  } else {
    const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    console.log(`[API] Date ${dateString} is ${diffDays} days from today in PST`);
  }
  
  return isSameDate;
}

// Check if a date is a weekend (returns true for weekends)
function isWeekend(dateString: string): boolean {
  const date = new Date(dateString);
  const day = date.getDay();
  const isWeekendDay = day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  
  if (isWeekendDay) {
    console.log(`[API] Date ${dateString} is a WEEKEND (day ${day})`);
  }
  
  return isWeekendDay;
}

// Add this function to filter weekend slots from API responses
function filterWeekendSlots(slots: any[]) {
  if (!Array.isArray(slots)) return [];
  
  // EMERGENCY CHECK: Directly filter out 4/27/2025 which is a Sunday
  return slots.filter(slot => {
    if (!slot || !slot.from) return false;
    
    // Direct string check for problematic date
    if (slot.from.includes("2025-04-27")) {
      console.error(`🚨 EMERGENCY: Filtering out Sunday 4/27/2025 slot: ${slot.from} 🚨`);
      return false;
    }
    
    const date = new Date(slot.from);
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
    
    if (isWeekend) {
      console.warn(`Filtering out weekend slot: ${slot.from} (day ${day})`);
      return false;
    }
    
    // DOUBLE CHECK Sunday specifically
    if (day === 0) {
      console.error(`🚨 SUNDAY DETECTED AND FILTERED: ${slot.from} 🚨`);
      return false;
    }
    
    return true;
  });
}

// Add function to check if a date is a Florida blackout date
function isFloridaBlackoutDate(dateString: string, location?: any): boolean {
  // Check if the location address contains Florida indicators
  const isFloridaLocation = location && 
    typeof location.address === 'string' && 
    (location.address.includes(', FL ') || 
     location.address.includes('Florida') ||
     location.address.endsWith(', FL'));
  
  if (!isFloridaLocation) return false;
  
  const date = new Date(dateString);
  const isBlackout = date.getFullYear() === 2025 && 
                     date.getMonth() === 4 && // May is month 4 (0-indexed)
                     (date.getDate() === 15 || date.getDate() === 16);
  
  if (isBlackout) {
    console.log(`[API] Date ${dateString} is a FLORIDA BLACKOUT DATE`);
  }
  
  return isBlackout;
}

export async function POST(request: Request) {
  console.log('POST /api/recommendSlots started');
  
  try {
    const body = await request.json();
    console.log('🚀 RECEIVED RECOMMEND SLOTS REQUEST:', JSON.stringify(body, null, 2));
    
    // Extract location from the request for Florida detection
    const location = body.order?.location;
    
    // ====== CRITICAL BUSINESS RULE: Enforce 5 PM PST cutoff ======
    const isCutoff = isPastCutoffTime();
    
    // Filter out weekend dates, tomorrow if past cutoff, and Florida blackout dates
    if (body.slots?.dates && Array.isArray(body.slots.dates)) {
      const originalDates = [...body.slots.dates];
      
      body.slots.dates = body.slots.dates.filter((date: string) => {
        // First filter: Remove weekends
        if (isWeekend(date)) {
          console.log(`[API] Filtered out weekend date: ${date}`);
          return false;
        }
        
        // Second filter: Remove tomorrow if past cutoff time
        if (isCutoff && isTomorrow(date)) {
          console.log(`[API] Filtered out tomorrow (${date}) due to 5 PM PST cutoff`);
          return false;
        }
        
        // Third filter: Remove Florida blackout dates (May 15-16, 2025)
        if (isFloridaBlackoutDate(date, location)) {
          console.log(`[API] Filtered out Florida blackout date: ${date}`);
          return false;
        }
        
        return true;
      });
      
      console.log('Date filtering results (recommendSlots API):', {
        original: originalDates,
        filtered: body.slots.dates,
        cutoffApplied: isCutoff,
        removedDates: originalDates.filter(d => !body.slots.dates.includes(d))
      });
      
      // If all dates were filtered out, return an error
      if (body.slots.dates.length === 0) {
        return NextResponse.json({
          success: false,
          message: "All selected dates were invalid. Please select weekdays that respect the 5 PM PST cutoff rule."
        });
      }
    }
    
    // Additional filtering for dates in the order itself
    if (body.order?.date) {
      // If it's a weekend or (past cutoff and tomorrow), reject the request
      if (isWeekend(body.order.date) || (isCutoff && isTomorrow(body.order.date))) {
        console.log(`[API] Rejected order date ${body.order.date} (weekend or past cutoff)`);
        return NextResponse.json({
          success: false,
          message: "Booking date is invalid. Please select a weekday that respects the 5 PM PST cutoff rule."
        });
      }
    }

    // Remove problematic properties if they exist
    if (body.order?.location) {
      if ('acceptMultipleResults' in body.order.location) {
        delete body.order.location.acceptMultipleResults;
      }
      if ('acceptPartialMatch' in body.order.location) {
        delete body.order.location.acceptPartialMatch;
      }
      
      // Remove latitude and longitude to allow API to handle geocoding
      if ('latitude' in body.order.location) {
        delete body.order.location.latitude;
      }
      if ('longitude' in body.order.location) {
        delete body.order.location.longitude;
      }
    }

    const apiKey = "0115400db6ed3e58f1c596bca2555ebf58fddkoP1Gc";
    
    // First try to create the order directly to see if it already exists
    try {
      const createResponse = await fetch(`https://api.optimoroute.com/v1/create_or_update_orders?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orders: [body.order]
        })
      });
      
      const createData = await createResponse.json();
      console.log('Pre-check order creation result:', createData);
      
      if (!createResponse.ok || !createData.success) {
        if (createData.code === 'ERR_ORD_EXISTS') {
          console.log('Order already exists, generating new orderNo for slots API call');
          
          // Generate a new orderNo for the slots API
          const originalOrderNo = body.order.orderNo;
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
          const temporaryOrderNo = `TEMP${timestamp}${randomString}`;
          
          console.log(`Using temporary orderNo ${temporaryOrderNo} for slots API.`);
          
          // Store the original orderNo to return in the response
          const savedOrderNo = body.order.orderNo;
          
          // Use a temporary orderNo for the slots API call
          body.order.orderNo = temporaryOrderNo;
          
          // Add a flag to restore the original orderNo in the response
          body._originalOrderNo = savedOrderNo;
        }
      }
    } catch (createError) {
      console.error('Error during pre-check order creation:', createError);
      // Continue with normal flow
    }
    
    const url = `https://api.optimoroute.com/v1/booking_slots?key=${apiKey}`;

    console.log('Calling OptimoRoute API:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OptimoRoute Error Response:', {
        status: response.status,
        text: errorText
      });
      
      // Try to parse the error to check for geocoding errors
      try {
        const errorData = JSON.parse(errorText);
        console.log('Error response parsed:', errorData);
        
        // Handle multiple geocoding results
        if (errorData.code === 'ERR_LOC_GEOCODING_MULTIPLE' && errorData.geocodingResults && errorData.geocodingResults.length > 0) {
          console.log('Multiple geocoding results - using first result with coordinates');
          const firstResult = errorData.geocodingResults[0];
          const [address, latitude, longitude] = firstResult;
          
          // Create a new order with the address AND coordinates from first result
          // This prevents OptimoRoute from trying to geocode again
          const modifiedOrder = {...body.order};
          modifiedOrder.location = {
            ...modifiedOrder.location,
            address,
            latitude,
            longitude
          };
          
          console.log('Retrying with address and coordinates from first result:', {
            address,
            latitude,
            longitude
          });
          
          const retryResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...body,
              order: modifiedOrder
            })
          });
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            console.log('Retry response:', retryData);
            return NextResponse.json(retryData);
          }
        }
        
        // Handle when order already exists
        if (errorData.code === 'ERR_ORD_EXISTS') {
          console.log('Order already exists, generating new orderNo');
          
          // Create a modified order with a new orderNo
          const modifiedOrder = {...body.order};
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
          modifiedOrder.orderNo = `TEMP${timestamp}${randomString}`;
          
          console.log('Retrying with new orderNo:', modifiedOrder.orderNo);
          
          // Try booking slots again with the new orderNo
          const retryResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...body,
              order: modifiedOrder
            })
          });
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            console.log('Retry booking response with new orderNo:', retryData);
            
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
            
            // Add the new orderNo to the response
            if (retryData.success) {
              return NextResponse.json({ 
                ...retryData,
                orderNo: body.order.orderNo // Return the original orderNo
              });
            }
            return NextResponse.json(retryData);
          }
        }
        
        return NextResponse.json(errorData, { status: 500 });
      } catch (err) {
        console.error('Failed to parse error response:', err);
        // Continue with normal error handling
      }
      
      return NextResponse.json({ 
        success: false, 
        message: `Failed to fetch slots: ${response.status} ${response.statusText}` 
      }, { status: response.status });
    }

    const responseData = await response.json();
    console.log('OptimoRoute Success Response:', responseData);

    if (!responseData.success) {
      // Handle multiple geocoding results even when HTTP status is 200
      if (responseData.code === 'ERR_LOC_GEOCODING_MULTIPLE' && responseData.geocodingResults && responseData.geocodingResults.length > 0) {
        console.log('Multiple geocoding results (HTTP 200) - using first result with coordinates');
        const firstResult = responseData.geocodingResults[0];
        const [address, latitude, longitude] = firstResult;
        
        // Create a new order with the address AND coordinates from first result
        // This prevents OptimoRoute from trying to geocode again
        const modifiedOrder = {...body.order};
        modifiedOrder.location = {
          ...modifiedOrder.location,
          address,
          latitude,
          longitude
        };
        
        console.log('Retrying with address and coordinates from first result:', {
          address,
          latitude,
          longitude
        });
        
        const retryResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...body,
            order: modifiedOrder
          })
        });
        
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          console.log('Retry response:', retryData);
          return NextResponse.json(retryData);
        }
      }
      
      return NextResponse.json({ 
        success: false, 
        message: responseData.message || 'Failed to fetch slots'
      });
    }

    return NextResponse.json({
      success: true,
      slots: responseData.slots,
      // Include original orderNo if we stored it
      ...(body._originalOrderNo && { orderNo: body._originalOrderNo })
    });

  } catch (error) {
    console.error('Error in recommendSlots:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 