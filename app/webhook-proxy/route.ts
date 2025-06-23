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

    // Send to the target webhook
    const response = await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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