  // Skip Workato webhook - it's no longer used
  
  // Always send to Zapier webhook - remove conditional check to ensure data is always sent
  try {
    // Extract the slot time details for the webhook
    const slotParts = selectedSlot.value.split(" - ");
    const slotDate = slotParts[0]?.split("T")[0] || "";
    const slotTime = selectedSlot.value || "";
  
    // Get a proper customer name for the webhook
    // Always use a valid customer name from multiple sources
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const customerName = fullName || formData.projectName || formData.customerEmail || formData.customerPhone || formData.quickbaseRecordId || "Customer";
  
    const surveyBookingPayload = {
      recordId: formData.quickbaseRecordId || "",
      projectName: formData.projectName || "",
      surveyDate: actualSurveyDateStr || slotDate,
      slotDate: slotDate, 
      slotTime: slotTime,
      orderNumber: selectedSlot.orderNo || "",
      reservationId: selectedSlot.reservationId || "",
      customerName: customerName, // Never default to "Survey Customer"
      address: formData.streetAddress ? 
              `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.postalCode}` : 
              "Address not provided",
      warehouse: formData.warehouse || "",
      texasProximity: formData.warehouse === "Dallas, TX" ? formData.texasProximity || "" : "",
      timestamp: new Date().toISOString()
    };
    
    console.log("Survey booking webhook payload:", JSON.stringify(surveyBookingPayload, null, 2));
    
    // Use the correct webhook URL
    const webhookUrl = "https://hooks.zapier.com/hooks/catch/16426358/2l4it7a/";
    
    const surveyWebhookResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(surveyBookingPayload)
    });
    
    const surveyResponseText = await surveyWebhookResponse.text();
    console.log("Survey webhook response status:", surveyWebhookResponse.status);
    console.log("Survey webhook response text:", surveyResponseText);
    
    if (surveyWebhookResponse.ok) {
      console.log("Successfully sent survey booking data to webhook");
  } else {
      console.warn("Failed to send data to survey webhook:", surveyResponseText);
    }
  } catch (surveyWebhookError) {
    console.error("Error sending data to survey webhook:", surveyWebhookError);
    // Don't throw error to allow the flow to continue
  }

  // Step 2: Make the reservation 