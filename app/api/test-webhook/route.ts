import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint for verifying Zapier webhook connectivity
 */
export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const bodyData = await req.json();
    
    console.log('🧪 TEST WEBHOOK: Received data:', JSON.stringify(bodyData, null, 2));

    // The correct Zapier webhook URL
    const webhookUrl = "https://hooks.zapier.com/hooks/catch/16426358/2l4it7a/";
    
    // Create a test payload with timestamp to verify it's working
    const testPayload = {
      testId: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: "This is a test webhook payload",
      originalData: bodyData,
    };
    
    console.log('🧪 TEST WEBHOOK: Sending to Zapier:', JSON.stringify(testPayload, null, 2));

    // Method 1: Direct fetch to Zapier
    const directResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    const directStatus = directResponse.status;
    const directText = await directResponse.text();
    
    console.log('🧪 TEST WEBHOOK: Direct Zapier response:', directStatus, directText);

    // Method 2: Using our webhook proxy
    const proxyResponse = await fetch('/api/webhook-proxy', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Target-Webhook': 'zapier-test'
      },
      body: JSON.stringify({
        targetUrl: webhookUrl,
        payload: testPayload
      }),
      next: { revalidate: 0 }
    });

    const proxyStatus = proxyResponse.status;
    let proxyResult;
    
    try {
      proxyResult = await proxyResponse.json();
    } catch (e) {
      proxyResult = await proxyResponse.text();
    }
    
    console.log('🧪 TEST WEBHOOK: Proxy response:', proxyStatus, proxyResult);

    // Method 3: Using XMLHttpRequest (browser only)
    const xhrResult = "XMLHttpRequest not available in server component";

    return NextResponse.json({
      success: true,
      directResponse: {
        status: directStatus,
        body: directText
      },
      proxyResponse: {
        status: proxyStatus,
        body: proxyResult
      },
      xhrResponse: xhrResult,
      testPayload
    });
  } catch (error) {
    console.error('🧪 TEST WEBHOOK ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 