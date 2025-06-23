import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const bodyData = await req.json();
    
    // Debug what we're receiving
    console.log('⚡️ Received webhook-proxy request:', JSON.stringify(bodyData, null, 2));

    // Get the target URL from the request body or use the default survey booking webhook
    const defaultUrl = 'https://hooks.zapier.com/hooks/catch/16426358/2l4it7a/';
    const targetUrl = bodyData.targetUrl || defaultUrl;
    const payload = bodyData.payload || bodyData;
    const targetWebhook = req.headers.get('X-Target-Webhook') || 'default';
    
    // If this is a survey booking webhook, make sure we use the correct URL
    const surveyBookingUrl = 'https://hooks.zapier.com/hooks/catch/16426358/2l4it7a/';
    
    // Use the survey booking URL for all survey booking requests
    const finalUrl = targetWebhook === 'zapier-survey-booking' ? surveyBookingUrl : targetUrl;
    
    console.log(`⚡️ Forwarding to ${targetWebhook} webhook at URL:`, finalUrl);
    console.log('⚡️ Sending payload:', JSON.stringify(payload, null, 2));

    // Process the payload to ensure compatibility with Zapier
    // Convert all values to strings as Zapier sometimes has issues with non-string values
    const processedPayload: Record<string, string> = {};
    
    // First extract any feedback fields to ensure they're included at the top level
    if (typeof payload === 'object' && payload !== null) {
      // Always prioritize these fields by processing them first
      const priorityFields = [
        'feedbackRating', 
        'feedbackComments', 
        'firstName', 
        'lastName', 
        'email', 
        'phone', 
        'customerName',
        'surveyDate',
        'orderNumber',
        'reservationId'
      ];
      
      // Process priority fields first
      priorityFields.forEach(field => {
        if (field in payload) {
          const value = payload[field];
          if (value === undefined || value === null) {
            processedPayload[field] = '';
          } else if (typeof value === 'object') {
            processedPayload[field] = JSON.stringify(value);
          } else {
            processedPayload[field] = String(value);
          }
        }
      });
      
      // Then process all other fields
      Object.keys(payload).forEach(key => {
        if (!priorityFields.includes(key)) {
          const value = payload[key];
          if (value === undefined || value === null) {
            processedPayload[key] = '';
          } else if (typeof value === 'object') {
            processedPayload[key] = JSON.stringify(value);
          } else {
            processedPayload[key] = String(value);
          }
        }
      });
    } else {
      // If payload is not an object, use it as is
      processedPayload['data'] = typeof payload === 'string' ? payload : JSON.stringify(payload);
    }
    
    // Ensure feedback data is always included in the payload
    if (!('feedbackRating' in processedPayload) && typeof payload === 'object' && payload !== null) {
      // Look for feedback fields in nested objects
      if (payload.formData && typeof payload.formData === 'object') {
        processedPayload['feedbackRating'] = String(payload.formData.feedbackRating || '');
        processedPayload['feedbackComments'] = String(payload.formData.feedbackComments || '');
      }
    }
    
    console.log('⚡️ Processed payload for Zapier:', JSON.stringify(processedPayload, null, 2));

    // Send to the target webhook
    const response = await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(processedPayload)
    });

    const responseStatus = response.status;
    const responseText = await response.text();
    console.log(`⚡️ Response from ${targetWebhook}:`, responseStatus, responseText);

    return NextResponse.json({ 
      success: response.ok,
      status: responseStatus,
      response: responseText
    });
  } catch (error) {
    console.error('❌ Webhook proxy error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 