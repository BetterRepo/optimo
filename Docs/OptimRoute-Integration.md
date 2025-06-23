# OptimoRoute Integration Documentation

## Overview

This document provides a comprehensive overview of how our application integrates with OptimoRoute for survey booking and scheduling management. The integration enables customers to schedule surveys based on available time slots, and ensures proper geocoding of addresses for pinpoint accuracy on the map.

## Key Components

### 1. API Integration

We communicate with OptimoRoute through their REST API using the following endpoints:

- **Booking Slots API**: `https://api.optimoroute.com/v1/booking_slots`
  - Used to fetch available time slots for a given date and location
  
- **Booking Reserve API**: `https://api.optimoroute.com/v1/booking_reserve`
  - Used to reserve a specific time slot for a customer
  
- **Create/Update Orders API**: `https://api.optimoroute.com/v1/create_or_update_orders`
  - Used to create or update order information after booking

All API calls use the API key stored in our server-side code.

### 2. Address Handling and Geocoding

Address formatting is critical for proper geocoding. Our application:

1. Collects address information through the `AddressForm` component
2. Formats addresses consistently in the format: `123 Main St, City, STATE ZIPCODE, USA`
3. Uses standardized abbreviations (e.g., "St" instead of "Street") to improve geocoding accuracy
4. Attaches coordinates based on warehouse when available to prevent geocoding errors

For example, we format addresses like:
```
1420 Redwood St, Vallejo, CA 94589, USA
```

### 3. Booking Flow

The booking process follows these steps:

1. **Date Selection**: Customer selects a date for the survey
2. **Slot Fetching**: System queries OptimoRoute for available time slots
3. **Slot Selection**: Customer selects a preferred time slot
4. **Reservation**: System reserves the selected slot using the booking_reserve API
5. **Order Creation**: System creates an order in OptimoRoute with customer details

### 4. Order Management

Orders in OptimoRoute are managed with these key attributes:

- `orderNo`: Unique identifier for the order (format: `BE{timestamp}{random}`)
- `location`: Contains address, coordinates, and location name
- `timeWindows`: Specified time windows for the survey
- `type`: Set to "D" for delivery/service orders
- `tags`: Used to categorize orders (e.g., "Survey", "Sacramento_CA")

### 5. Temporary Orders

In some scenarios, the system creates temporary orders with prefix "TEMP" to:

- Test geocoding functionality before committing to final orders
- Handle cases where an order number already exists
- Ensure bookings work correctly for CRM integrations
- Provide fallbacks when conflicts arise

These temporary orders are typically cleaned up after successful booking.

### 6. Error Handling

The integration includes comprehensive error handling for:

- Geocoding failures (using fallback coordinates)
- Multiple geocoding results (selecting first result)
- Booking conflicts (generating new order numbers)
- API communication failures (with retry mechanisms)

### 7. Warehouse-based Routing

The system maps customers to the nearest warehouse based on postal code:

- Cerritos, CA: Coordinates 33.8583, -118.0515
- Sacramento, CA: Coordinates 38.5816, -121.4944
- Fresno, CA: Coordinates 36.7378, -119.7871
- Phoenix, AZ: Coordinates 33.4484, -112.0740
- Dallas, TX: Coordinates 32.7767, -96.7970
- Lakeland, FL: Coordinates 28.0395, -81.9498

Special cases are handled, such as Concord area (945xx) postal codes mapping to Sacramento.

## Implementation Details

### Key Files

- `app/features/survey-booking/components/home/hooks/useBookingForm.ts`: Manages the booking form state and API interactions
- `app/api/fetchSlots/route.ts`: Server API endpoint to fetch available slots from OptimoRoute
- `app/api/MakeReservation/route.ts`: Server API endpoint to reserve slots in OptimoRoute
- `app/features/common-components/AddressForm.tsx`: Handles address input and validation
- `app/features/survey-booking/hooks/useRecommendedSlots.ts`: Logic for recommended time slots

### Code Example: Address Formatting

```typescript
// From useBookingForm.ts
const formattedAddress = `${streetAddress ? streetAddress.replace(/Street/i, "St") : ""}, ${city}, ${state} ${postalCode}, USA`;
```

### Code Example: Slot Fetching Payload

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
      address: formattedAddress,
      latitude: warehouseCoordinates.latitude,
      longitude: warehouseCoordinates.longitude
    },
    date: formattedDate,
  },
  slots: {
    dates: [formattedDate],
    timeWindows: [
      { twFrom: "08:00", twTo: "10:00" },
      { twFrom: "10:00", twTo: "12:00" },
      { twFrom: "12:00", twTo: "14:00" },
      { twFrom: "14:00", twTo: "16:00" },
      { twFrom: "16:00", twTo: "18:00" },
    ],
  },
  planning: {
    ...(drivers.length > 0 && { useDrivers: drivers }),
    clustering: false,
    lockType: "RESOURCES"
  }
};
```

## Troubleshooting

### Common Issues

1. **Incorrect Pin Locations**
   - Problem: Survey locations appear in incorrect locations on the map
   - Solution: Ensure address formatting uses "USA" instead of "United States" and standardized abbreviations

2. **No Available Slots**
   - Problem: No time slots are returned for certain dates
   - Solution: Check warehouse assignment and verify that drivers are properly mapped

3. **Booking Failures**
   - Problem: Unable to reserve a slot
   - Solution: Check for duplicate order numbers and verify address geocoding

### Logs and Debugging

The application includes extensive logging for each step of the integration. Check server logs for:
- "FETCH SLOTS API CALLED" for slot fetching operations
- "MakeReservation API called" for reservation operations
- "Direct order creation result" for order creation status

## Future Improvements

Planned enhancements to the OptimoRoute integration:

1. Improve address validation to catch formatting issues earlier
2. Add fallback geocoding services for more reliable location mapping
3. Implement real-time booking updates via webhooks
4. Create a dashboard for managing and troubleshooting OptimoRoute orders 