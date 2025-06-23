# Pin Placement and Geocoding Guide

## Overview

This document explains how our system handles address geocoding and pin placement on maps in the OptimoRoute integration. Proper pin placement is critical for route optimization and ensuring surveyors can find the correct locations.

## How Geocoding Works

Geocoding is the process of converting a text address into geographic coordinates (latitude and longitude). In our system:

1. Addresses are collected through the `AddressForm` component
2. These addresses are formatted in a standardized way
3. OptimoRoute's geocoding service converts these addresses to coordinates
4. The resulting coordinates are used to place pins on the map

## Address Formatting Best Practices

For optimal geocoding results, addresses should be formatted as follows:

```
StreetNumber StreetName, City, STATE ZIPCODE, USA
```

For example:
```
1420 Redwood St, Vallejo, CA 94589, USA
```

### Key Formatting Rules

1. **Use "USA" instead of "United States"**
   - ✅ `100 Main St, Los Angeles, CA 90001, USA`
   - ❌ `100 Main St, Los Angeles, CA 90001, United States`

2. **Use standard abbreviations for street types**
   - ✅ `100 Main St`
   - ❌ `100 Main Street`

3. **Include comma separators** between address components
   - ✅ `100 Main St, Los Angeles, CA 90001`
   - ❌ `100 Main St Los Angeles CA 90001`

4. **Use two-letter state codes**
   - ✅ `CA` for California
   - ❌ `California`

5. **Ensure ZIP code is in the correct format**
   - ✅ `90001` or `90001-1234`
   - ❌ `900 01`

## Fallback Mechanisms

When geocoding fails, our system employs several fallback mechanisms:

1. **Warehouse-based Coordinates**: If an address can't be geocoded, the system uses the coordinates of the associated warehouse

2. **First Result Selection**: If multiple geocoding results are returned, the system automatically selects the first result

3. **Manual Coordinate Override**: For problematic addresses, coordinates can be manually specified in the code

## Common Issues and Solutions

### Issue: Pins Appearing in the Same Location

**Causes:**
- Incorrect address formatting (using "United States" instead of "USA")
- Missing or improperly formatted address components
- Geocoding service unable to recognize the address

**Solutions:**
- Update address formatting in the code
- Provide explicit coordinates for problem areas
- Add more address validation at the input stage

### Issue: Pins in Wrong Locations

**Causes:**
- Ambiguous addresses (e.g., common street names)
- New developments not yet in mapping databases
- Incorrect postal codes

**Solutions:**
- Use more specific address details
- Add building/unit numbers when available
- Verify postal codes match the city/state

### Issue: Missing Pins

**Causes:**
- Geocoding failures
- API communication errors
- Rate limiting from geocoding services

**Solutions:**
- Check API logs for specific error messages
- Implement retry logic for failed geocoding attempts
- Ensure all required address components are provided

## Implementation Details

### Code Example: Address Formatting

```typescript
// From useBookingForm.ts
address: `${streetAddress ? streetAddress.replace(/Street/i, "St") : ""}, ${city}, ${state} ${postalCode}, USA`,
```

### Code Example: Warehouse Fallback Coordinates

```typescript
latitude: warehouse === "Cerritos, CA" ? 33.8583 :
         warehouse === "Sacramento, CA" ? 38.5816 :
         warehouse === "Fresno, CA" ? 36.7378 :
         warehouse === "Phoenix, AZ" ? 33.4484 :
         warehouse === "Dallas, TX" ? 32.7767 :
         warehouse === "Lakeland, FL" ? 28.0395 :
         26.972335, // Default fallback
```

### Code Example: Handling Multiple Geocoding Results

```typescript
// From fetchSlots/route.ts
if (errorData.code === 'ERR_LOC_GEOCODING_MULTIPLE' && errorData.geocodingResults && errorData.geocodingResults.length > 0) {
  console.log('Multiple geocoding results found - using first result:', errorData.geocodingResults[0]);
  
  // Extract the first geocoding result
  const firstResult = errorData.geocodingResults[0];
  const [address, latitude, longitude] = firstResult;
  
  // Create a modified order with the exact coordinates from the first result
  modifiedOrder.location.latitude = latitude;
  modifiedOrder.location.longitude = longitude;
  modifiedOrder.location.address = address;
  
  // Try again with these coordinates
  // ...
}
```

## Monitoring and Troubleshooting

### How to Monitor Pin Placement

1. **OptimoRoute Dashboard**: View all orders on the map to identify any obvious placement issues
2. **Log Analysis**: Check server logs for geocoding errors and warnings
3. **Test Bookings**: Create test bookings with problematic addresses to verify proper pin placement

### Debug Tools

Add these URL parameters to enable debug outputs:
- `?debug=true`: Shows detailed information about the geocoding process
- `?showCoords=true`: Displays the exact coordinates used for each pin

## Best Practices for Developers

1. Always validate addresses before attempting to geocode them
2. Use standardized formatting throughout the codebase
3. Implement proper error handling for geocoding failures
4. Consider using multiple geocoding services for redundancy
5. Cache successful geocoding results to reduce API calls

## Future Improvements

1. Add client-side address validation to catch formatting issues early
2. Implement address autocomplete to reduce input errors
3. Create a geocoding verification step in the booking process
4. Build a dashboard to monitor and correct pin placement issues 