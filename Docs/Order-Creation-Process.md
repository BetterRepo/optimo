# Order Creation Process in useBookingForm

## Overview

The `useBookingForm` hook is responsible for managing the entire survey booking process, including creating and updating orders in OptimoRoute. This document explains the specific order creation flow implemented in this hook.

## Order Creation Flow

The order creation process in `useBookingForm` happens in two main stages:

1. **Initial Order Creation** (in `onDateSelect` function)
2. **Order Finalization** (in `handleSubmit` function)

### Stage 1: Initial Order Creation (`onDateSelect`)

When a user selects a date from the calendar, the `onDateSelect` function:

1. **Generates a unique order number**:
   ```typescript
   const timestamp = Date.now();
   const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
   const generatedOrderNo = `BE${timestamp}${randomString}`;
   ```

2. **Prepares the customer information**:
   - Collects name information from multiple possible sources
   - Ensures a valid customer name is used by checking various fields
   - Falls back to default values if survey booking mode is enabled

3. **Creates an order payload**:
   ```typescript
   const bookingData = {
     order: {
       operation: "CREATE",
       orderNo: generatedOrderNo,
       type: "D",
       email: formData.email || formData.customerEmail || "",
       phone: formData.phone || formData.customerPhone || "",
       customField1: customerName || fullName,
       location: {
         locationName: customerName || fullName,
         address: `${streetAddress ? streetAddress.replace(/Street/i, "St") : ""}, ${city}, ${state} ${postalCode}, USA`,
         latitude: warehouse === "Cerritos, CA" ? 33.8583 : /* other warehouses... */,
         longitude: warehouse === "Cerritos, CA" ? -118.0515 : /* other warehouses... */
       },
       date: formattedDate
     },
     slots: {
       dates: [formattedDate],
       timeWindows: [
         { twFrom: "08:00", twTo: "10:00" },
         { twFrom: "10:00", twTo: "12:00" },
         /* other time windows... */
       ]
     },
     planning: {
       ...(drivers.length > 0 && { useDrivers: drivers }),
       clustering: false,
       lockType: "RESOURCES"
     },
     isCRMBooking: formData.isSurveyBooking === true
   };
   ```

4. **Sends the payload to the server-side API**:
   ```typescript
   const response = await fetch("/api/fetchSlots", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(bookingData),
   });
   ```

5. **Processes the response**:
   - Stores available time slots
   - Updates the order number if a new one was provided by the API (in case of conflicts)

### Behind the Scenes: What `/api/fetchSlots` Does

When `/api/fetchSlots` receives the request:

1. It first validates the order data
2. For CRM bookings, it creates the order directly in OptimoRoute
3. It handles geocoding issues by:
   - Adding coordinates based on warehouse
   - Using fallback coordinates when needed
   - Handling multiple geocoding results
4. It sends the data to OptimoRoute's booking_slots API
5. It returns available slots to the client

### Stage 2: Order Finalization (`handleSubmit`)

When the user selects a time slot and submits the form, the `handleSubmit` function:

1. **Validates form data**:
   - Checks required fields
   - Ensures a time slot was selected

2. **Prepares updated form data**:
   - Adds default values for missing fields (if in survey booking mode)
   - Formats boolean values as text
   - Creates text representations of all form selections

3. **Calculates the actual survey date**:
   ```typescript
   // Adding 24 hours to selected date
   const actualSurveyDate = selectedDate 
     ? new Date(selectedDate.getTime() + (24 * 60 * 60 * 1000))
     : null;
   ```

4. **Sends data to Zapier webhook**:
   - Creates a comprehensive payload with all form fields
   - Ensures proper formatting of address data
   - Sends the data to the Zapier webhook

5. **Reserves the selected time slot**:
   ```typescript
   const reservationResponse = await fetch("/api/MakeReservation", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       reservationId: selectedSlot.reservationId,
       createOrderIfBookingFails: formData.isSurveyBooking === true,
       orderData: {
         // Order data with updated details
       }
     }),
   });
   ```

6. **Updates the time windows**:
   ```typescript
   const updateResponse = await fetch("/api/updateOrder", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       orders: [{
         operation: "UPDATE",
         orderNo: selectedSlot.orderNo,
         timeWindows: [{
           twFrom: fromTime,
           twTo: toTime
         }],
         // Other updated fields
       }]
     })
   });
   ```

7. **Stores booking information and redirects**:
   ```typescript
   const bookingRecap = {
     formData,
     selectedSlot,
     selectedDate: null,
     actualSurveyDateStr,
     orderNo: selectedSlot.orderNo
   };
   
   localStorage.setItem('bookingRecap', JSON.stringify(bookingRecap));
   window.location.href = '/features/survey-booking/survey-booking-successful';
   ```

## Order Data Structure

The order data structure includes:

- **Basic Information**:
  - `orderNo`: Unique identifier 
  - `type`: Set to "D" for delivery/service
  - `date`: Date of the survey in YYYY-MM-DD format
  - `email` and `phone`: Contact information

- **Customer Information**:
  - `customField1`: Customer name
  - Personal details from form data

- **Location Information**:
  - `locationName`: Name for the location (usually customer name)
  - `address`: Formatted address string
  - `latitude` and `longitude`: Coordinates (based on warehouse or geocoding)

- **Time Information**:
  - `timeWindows`: Array of time windows with `twFrom` and `twTo`

## Special Handling for Survey Bookings

For survey bookings (`formData.isSurveyBooking === true`):

1. Default values are provided for required fields
2. The flag `createOrderIfBookingFails: true` is set when making reservations
3. The system is more lenient with validation
4. An `isCRMBooking: true` flag is added to the booking data

## Error Handling

The order creation process includes extensive error handling:

1. Validation errors are displayed to the user
2. API communication errors are caught and displayed
3. Webhook failures are logged but don't prevent order creation
4. Address formatting issues are fixed automatically

## Key Functions in Order Creation

- `onDateSelect`: Initial order creation when a date is selected
- `handleSlotSelect`: Updates the order when a time slot is selected
- `handleSubmit`: Finalizes the order when the form is submitted 