/**
 * Simple function to get coordinates from an address
 * Just prints longitude and latitude to terminal
 */
export async function getCoordinatesFromAddress(address: string) {
  console.log('🚀 GEOCODING FUNCTION CALLED!');
  console.log('🔍 Getting coordinates for:', address);
  
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key first 10 chars:', apiKey ? apiKey.substring(0, 10) + '...' : 'NONE');
    
    if (!apiKey) {
      console.log('❌ No Google Maps API key found');
      console.log('❌ Environment variables available:', Object.keys(process.env).filter(k => k.includes('GOOGLE')));
      return;
    }

    console.log('📡 Making fetch request to Google Geocoding API...');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    console.log('🌐 Request URL (without key):', url.replace(apiKey, 'HIDDEN_KEY'));

    const response = await fetch(url);
    console.log('📡 Response status:', response.status);

    const data = await response.json();
    console.log('📡 Response data:', JSON.stringify(data, null, 2));

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      
      console.log('🎉 SUCCESS! COORDINATES FOUND:');
      console.log('   📍 Latitude:', location.lat);
      console.log('   📍 Longitude:', location.lng);
      console.log('   📍 Address:', data.results[0].formatted_address);
      
      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: data.results[0].formatted_address
      };
    } else {
      console.log('❌ No coordinates found for:', address);
      console.log('   Google API Status:', data.status);
      console.log('   Google API Error:', data.error_message || 'No error message');
    }
  } catch (error) {
    console.log('❌ Error getting coordinates:', error);
    console.log('❌ Error details:', JSON.stringify(error, null, 2));
  }
} 