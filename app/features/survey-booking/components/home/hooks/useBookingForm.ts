import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SurveyFormData } from "../../../types/FormData";
import { Warehouse } from "../../../types/Warehouse";
import { driverMapping } from "../../../data/DriverLookupTable";
import { generateLocationId } from "../../../../../utils/locationHelper";
import { createOrderLocation } from "../../../../../utils/optimoLocationHelper";
import { format } from "date-fns";

// Function to get warehouse-specific time windows
const getWarehouseTimeWindows = (warehouse: string) => {
  switch (warehouse) {
    case "Phoenix, AZ":
      // Arizona gets custom time windows: 7am-11am and 10am-2pm only
      return [
        { twFrom: "07:00", twTo: "11:00" }, // 7am-11am slot
        { twFrom: "10:00", twTo: "14:00" }, // 10am-2pm slot
      ];
    default:
      // All other territories get the standard 3 time windows
      return [
        { twFrom: "07:30", twTo: "11:00" }, // 7:30am-11am slot
        { twFrom: "10:00", twTo: "14:00" }, // 10am-2pm slot
        { twFrom: "13:00", twTo: "17:00" }, // 1pm-5pm slot
      ];
  }
};

export const useBookingForm = () => {
  const searchParams = useSearchParams();
  const isAdditionalSurvey =
    searchParams.get("additionalSurveyBooking") === "true";
  const isSurveyBooking = searchParams.get("surveyBooking") === "true";

  // Form state
  const [formData, setFormData] = useState<SurveyFormData>({
    // Add these at the top of the form data
    isAdditionalSurvey,
    isSurveyBooking,
    internal: isAdditionalSurvey || isSurveyBooking,
    quickbaseRecordId: searchParams.get("quickbaseRecordId") || "",
    projectName: searchParams.get("projectName") || "",
    customerEmail: searchParams.get("customerEmail") || "",
    customerPhone: searchParams.get("customerPhone") || "",
    token: searchParams.get("token") || "",

    // Basic contact info
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    language:
      searchParams.get("language") === "Spanish" ? "Spanish" : "English",
    phone: searchParams.get("phone") || searchParams.get("customerPhone") || "",
    email: searchParams.get("email") || searchParams.get("customerEmail") || "",

    // Add feedback rating field
    feedbackRating: undefined,
    feedbackComments: "",

    // Address info
    streetAddress: searchParams.get("streetAddress") || "",
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    postalCode: searchParams.get("postalCode") || "",
    warehouse: (searchParams.get("warehouse") as Warehouse) || "Out of Region",
    texasProximity: undefined,

    // Secondary contact info
    hasSecondaryContact: false,
    secondaryContactName: "",
    secondaryContactRelationship: "",
    secondaryContactPhone: "",
    secondaryContactEmail: "",
    secondaryContactLanguage: "en",

    // Legacy secondary contact fields
    secondaryFirstName: "",
    secondaryLastName: "",
    secondaryPhone: "",
    secondaryEmail: "",
    secondaryLanguage: "en",

    // Tenant info
    hasTenants: false,
    tenantName: "",
    tenantPhone: "",
    tenantEmail: "",
    tenantLanguage: "en",

    // Contact preferences
    preferredContactMethod: "phone",
    preferredContactTime: "morning",

    // Property info
    propertyType: "single_family",
    propertyOwnership: "own",
    propertyAccess: "no_restrictions",
    parkingAvailable: true,
    specialInstructions: "",
    pets: false,
    petDetails: "",
    petsText: "",
    gateCode: "",

    // Survey Questions
    hasBatteries: undefined,
    hasBatteriesText: "",
    includeStorage: undefined,
    includeStorageText: "",
    designPreference: "",
    designPreferenceText: "",
    isSharedRoof: undefined,
    isSharedRoofText: "",
    hasRecentConstruction: undefined,
    hasRecentConstructionText: "",
    constructionDetails: "",
    roofAge: "",
    roofMaterial: "",
    roofLayers: "",
    hasHOA: undefined,
    hasHOAText: "",
    hoaName: "",
    hoaPhone: "",
    hoaEmail: "",
    hasHOAContact: undefined,
    hasHOAContactText: "",
    hasVaultedCeilings: undefined,
    hasVaultedCeilingsText: "",
    numberOfStories: "",
    stories: "",
    hasOngoingConstruction: undefined,
    hasOngoingConstructionText: "",
    ongoingConstructionDetails: "",
    hasExistingSolar: undefined,
    hasExistingSolarText: "",
    existingSolarDetails: "",
    hasSkylights: undefined,
    hasSkylightsText: "",
    skylightCount: "",
    roofVentType: "",
    hasOutsidePanel: undefined,
    hasOutsidePanelText: "",
    hasSubPanels: undefined,
    hasSubPanelsText: "",
    hasBlockedAccess: undefined,
    hasBlockedAccessText: "",
    gateAccessType: "",
    gateAccessTypeText: "",
    mainPanelLocation: "",
    mainPanelLocationText: "",
    mainPanelOtherLocation: "",

    // Time slot fields
    selectedDate: "",
    selectedTimeSlot: "",
  });

  // Booking states
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSlots, setShowSlots] = useState(false);
  const [slotErrorMessage, setSlotErrorMessage] = useState("");
  const [orderErrorMessage, setOrderErrorMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<{
    value: string;
    reservationId: string;
    orderNo?: string;
  } | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Add success message state
  const [successMessage, setSuccessMessage] = useState("");

  // Add a function to test the webhook directly
  const testWebhook = async () => {
    try {
      // Create a simple test payload
      const testPayload = {
        test: true,
        timestamp: new Date().toISOString(),
        message: "This is a test message from OptimRoute",
        formData: {
          firstName: formData.firstName || "Test",
          lastName: formData.lastName || "User",
          email: formData.email || formData.customerEmail || "test@example.com",
          phone: formData.phone || formData.customerPhone || "123-456-7890",
          projectName: formData.projectName || "Test Project",
          quickbaseRecordId: formData.quickbaseRecordId || "TEST123",
          surveyBooking: "Yes",
        },
      };

      console.log(
        "🧪 SENDING TEST WEBHOOK PAYLOAD:",
        JSON.stringify(testPayload, null, 2)
      );

      const webhookUrl =
        "https://hooks.zapier.com/hooks/catch/16426358/2l4it7a/";

      // Try both direct fetch and the proxy
      const directResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload),
      });

      console.log(
        "🧪 DIRECT TEST RESPONSE:",
        directResponse.status,
        await directResponse.text()
      );

      // Also try via proxy
      const proxyResponse = await fetch("/api/webhook-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Target-Webhook": "zapier-survey-booking-test",
        },
        body: JSON.stringify({
          targetUrl: webhookUrl,
          payload: testPayload,
        }),
      });

      console.log(
        "🧪 PROXY TEST RESPONSE:",
        proxyResponse.status,
        await proxyResponse.text()
      );

      return "Test webhook sent. Check console for results.";
    } catch (error) {
      console.error("🧪 TEST WEBHOOK ERROR:", error);
      return `Test webhook failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    setOrderErrorMessage("");
    setIsSubmitting(true);
    try {
      console.log("💾 Starting booking submission...");

      // Skip all field validation for surveyBooking=true URLs
      if (formData.isSurveyBooking) {
        // Still check if time slot is selected regardless of surveyBooking
        if (!selectedSlot?.reservationId || !selectedSlot?.orderNo) {
          setOrderErrorMessage("Please select a time slot before submitting.");
          setIsSubmitting(false);
          return;
        }
        // Proceed directly to submission logic below
      } else {
        // Validate required fields before submission
        const requiredFields = [
          { field: "firstName", label: "First Name" },
          { field: "lastName", label: "Last Name" },
          { field: "streetAddress", label: "Street Address" },
          { field: "city", label: "City" },
          { field: "state", label: "State" },
          { field: "postalCode", label: "Postal Code" },
          { field: "warehouse", label: "Warehouse" },
        ];
        // Check for missing required fields
        const missingFields = requiredFields.filter((field) => {
          const value = formData[field.field as keyof typeof formData];
          return !value;
        });
        // If any required fields are missing
        if (missingFields.length > 0) {
          const missingFieldNames = missingFields
            .map((field) => field.label)
            .join(", ");
          setOrderErrorMessage(
            `Please fill in all required fields: ${missingFieldNames}`
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Only run survey question validations if not surveyBooking
      if (!formData.isSurveyBooking) {
        // Check if battery installation question has been answered
        if (formData.hasBatteries === undefined) {
          setOrderErrorMessage(
            "Please answer if batteries are being installed as part of this project."
          );
          setIsSubmitting(false);
          return;
        }
        // Check if design preference has been selected
        if (!formData.designPreference) {
          setOrderErrorMessage(
            "Please select your preferred design option for panel placement."
          );
          setIsSubmitting(false);
          return;
        }
        // Check if shared roof question has been answered
        if (formData.isSharedRoof === undefined) {
          setOrderErrorMessage(
            "Please indicate if this property has a shared roof with other units."
          );
          setIsSubmitting(false);
          return;
        }
        // Check if recent construction question has been answered
        if (formData.hasRecentConstruction === undefined) {
          setOrderErrorMessage(
            "Please indicate if there has been recent construction affecting the roof."
          );
          setIsSubmitting(false);
          return;
        }
        // Check if vaulted ceilings question has been answered
        if (formData.hasVaultedCeilings === undefined) {
          setOrderErrorMessage(
            "Please indicate if there are vaulted ceilings in the home."
          );
          setIsSubmitting(false);
          return;
        }
        // Check if stories has been selected
        if (!formData.stories) {
          setOrderErrorMessage(
            "Please select the number of stories in the home."
          );
          setIsSubmitting(false);
          return;
        }
        // Check if ongoing construction question has been answered
        if (formData.hasOngoingConstruction === undefined) {
          setOrderErrorMessage(
            "Please indicate if there is any ongoing construction, open permits or un-permitted structures on the property."
          );
          setIsSubmitting(false);
          return;
        }
        // Check if existing solar question has been answered
        if (formData.hasExistingSolar === undefined) {
          setOrderErrorMessage(
            "Please indicate if there is an existing solar system on the property."
          );
          setIsSubmitting(false);
          return;
        }
        // Check if HOA question has been answered
        if (formData.hasHOA === undefined) {
          setOrderErrorMessage(
            "Please indicate if there is an HOA associated with this property."
          );
          setIsSubmitting(false);
          return;
        }
        // Check if main panel location has been selected
        if (!formData.mainPanelLocation) {
          setOrderErrorMessage(
            "Please indicate where your main electrical panel is located."
          );
          setIsSubmitting(false);
          return;
        }
        // If "other" is selected for mainPanelLocation, check if details are provided
        if (
          formData.mainPanelLocation === "other" &&
          !formData.mainPanelOtherLocation
        ) {
          setOrderErrorMessage(
            "Please specify the location of your main electrical panel."
          );
          setIsSubmitting(false);
          return;
        }
        // Check if sub-panels question has been answered
        if (formData.hasSubPanels === undefined) {
          setOrderErrorMessage("Please indicate if there are any sub-panels.");
          setIsSubmitting(false);
          return;
        }
        // Check if access blocked question has been answered
        if (formData.hasBlockedAccess === undefined) {
          setOrderErrorMessage(
            "Please indicate if access to the home or electrical panel is blocked."
          );
          setIsSubmitting(false);
          return;
        }
        // Check if gate access type has been selected
        if (!formData.gateAccessType) {
          setOrderErrorMessage(
            "Please indicate if you have an access code for the neighborhood/property."
          );
          setIsSubmitting(false);
          return;
        }
        // If "code" is selected for gateAccessType, check if code is provided
        if (formData.gateAccessType === "code" && !formData.gateCode) {
          setOrderErrorMessage(
            "Please enter the access code for the neighborhood/property."
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Still check if time slot is selected regardless of surveyBooking
      if (!selectedSlot?.reservationId || !selectedSlot?.orderNo) {
        setOrderErrorMessage("Please select a time slot before submitting.");
        setIsSubmitting(false);
        return;
      }

      // Continue with form submission if all validations pass
      // Step 1: Send data to the webhook
      const updatedFormData = {
        ...formData,
        // Set default names if missing for survey booking
        firstName:
          formData.firstName || (formData.isSurveyBooking ? "Survey" : ""),
        lastName:
          formData.lastName || (formData.isSurveyBooking ? "Customer" : ""),
        // Set default address if missing for survey booking
        streetAddress:
          formData.streetAddress ||
          (formData.isSurveyBooking ? "123 Main St" : ""),
        city: formData.city || (formData.isSurveyBooking ? "Los Angeles" : ""),
        state: formData.state || (formData.isSurveyBooking ? "CA" : ""),
        postalCode:
          formData.postalCode || (formData.isSurveyBooking ? "90001" : ""),
        warehouse:
          formData.warehouse ||
          (formData.isSurveyBooking ? "Cerritos, CA" : ""),
        // Ensure feedback data is included
        feedbackRating: formData.feedbackRating || "",
        feedbackComments: formData.feedbackComments || "",
        // Set text fields for all boolean options
        hasBatteriesText:
          formData.hasBatteriesText ||
          (formData.hasBatteries === true
            ? "Yes"
            : formData.hasBatteries === false
            ? "No"
            : ""),
        includeStorageText:
          formData.includeStorageText ||
          (formData.includeStorage === true
            ? "Yes"
            : formData.includeStorage === false
            ? "No"
            : ""),
        designPreferenceText:
          formData.designPreferenceText ||
          (formData.designPreference === "bestSunlight"
            ? "Design the system for maximum efficiency"
            : formData.designPreference === "matchProposed"
            ? "Design the system to match the proposal design as closely as possible"
            : ""),
        isSharedRoofText:
          formData.isSharedRoofText ||
          (formData.isSharedRoof === true
            ? "Yes, please place the design system exactly as specified"
            : formData.isSharedRoof === false
            ? "No"
            : ""),
        hasRecentConstructionText:
          formData.hasRecentConstructionText ||
          (formData.hasRecentConstruction === true
            ? "Yes"
            : formData.hasRecentConstruction === false
            ? "No"
            : ""),
        hasHOAText:
          formData.hasHOAText ||
          (formData.hasHOA === true
            ? "Yes"
            : formData.hasHOA === false
            ? "No"
            : ""),
        hasHOAContactText:
          formData.hasHOAContactText ||
          (formData.hasHOAContact === true
            ? "Yes"
            : formData.hasHOAContact === false
            ? "No"
            : ""),
        hasVaultedCeilingsText:
          formData.hasVaultedCeilingsText ||
          (formData.hasVaultedCeilings === true
            ? "Yes"
            : formData.hasVaultedCeilings === false
            ? "No"
            : ""),
        hasOngoingConstructionText:
          formData.hasOngoingConstructionText ||
          (formData.hasOngoingConstruction === true
            ? "Yes"
            : formData.hasOngoingConstruction === false
            ? "No"
            : ""),
        hasExistingSolarText:
          formData.hasExistingSolarText ||
          (formData.hasExistingSolar === true
            ? "Yes"
            : formData.hasExistingSolar === false
            ? "No"
            : ""),
        hasSkylightsText:
          formData.hasSkylightsText ||
          (formData.hasSkylights === true
            ? "Yes"
            : formData.hasSkylights === false
            ? "No"
            : ""),
        hasOutsidePanelText:
          formData.hasOutsidePanelText ||
          (formData.hasOutsidePanel === true
            ? "Yes"
            : formData.hasOutsidePanel === false
            ? "No"
            : ""),
        hasSubPanelsText:
          formData.hasSubPanelsText ||
          (formData.hasSubPanels === true
            ? "Yes"
            : formData.hasSubPanels === false
            ? "No"
            : ""),
        hasBlockedAccessText:
          formData.hasBlockedAccessText ||
          (formData.hasBlockedAccess === true
            ? "Yes"
            : formData.hasBlockedAccess === false
            ? "No"
            : ""),
        gateAccessTypeText:
          formData.gateAccessTypeText ||
          (formData.gateAccessType === "yes"
            ? "Yes, I'll be there to provide access"
            : formData.gateAccessType === "code"
            ? "Yes, I have a code"
            : formData.gateAccessType === "no"
            ? "No"
            : ""),
        mainPanelLocationText:
          formData.mainPanelLocationText ||
          (formData.mainPanelLocation === "inside"
            ? "Inside the home"
            : formData.mainPanelLocation === "outside"
            ? "Outside the home"
            : formData.mainPanelLocation === "garage"
            ? "In the garage"
            : formData.mainPanelLocation === "other"
            ? "Other location"
            : ""),
        petsText:
          formData.petsText ||
          (formData.pets === true
            ? "Yes"
            : formData.pets === false
            ? "No"
            : ""),
      };

      // This is the SINGLE source of truth for the actual survey date
      // IMPORTANT: Use local date without timezone conversion to prevent date shifting
      let actualSurveyDate = selectedDate; // Use the selected date directly without timezone conversion

      // Add debugging to see the actual values
      console.log("🔍 DATE HANDLING:");
      console.log(
        "   selectedDate:",
        selectedDate ? selectedDate.toISOString() : null
      );
      console.log(
        "   Actual survey date (no timezone conversion):",
        actualSurveyDate ? actualSurveyDate.toISOString() : null
      );

      // Format as YYYY-MM-DD using local date components to avoid timezone issues
      const actualSurveyDateStr = actualSurveyDate
        ? `${actualSurveyDate.getFullYear()}-${String(
            actualSurveyDate.getMonth() + 1
          ).padStart(2, "0")}-${String(actualSurveyDate.getDate()).padStart(
            2,
            "0"
          )}`
        : null;

      console.log(
        "   Formatted survey date string (local time):",
        actualSurveyDateStr
      );

      // Skip Workato webhook - it's no longer used

      // ALWAYS send webhook to Zapier for ALL submissions (not just survey booking)
      // CRITICAL: DO NOT ADD ANY CONDITIONAL CHECKS HERE. THIS WEBHOOK MUST ALWAYS BE CALLED.
      // CRITICAL: THE WEBHOOK URL MUST ALWAYS BE: https://hooks.zapier.com/hooks/catch/16426358/2l4it7a/
      // CRITICAL: DO NOT USE THE OLD URL: https://hooks.zapier.com/hooks/catch/16426358/2cxry1b/
      try {
        // Extract the slot time details for the webhook
        const slotParts = selectedSlot.value.split(" - ");
        const slotDate = slotParts[0]?.split("T")[0] || "";
        const slotTime = selectedSlot.value || "";

        // Get a proper customer name for the webhook
        // Always use a valid customer name from multiple sources
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        const customerName =
          fullName ||
          formData.projectName ||
          formData.customerEmail ||
          formData.customerPhone ||
          formData.quickbaseRecordId ||
          "Customer";

        // Create a comprehensive webhook payload with ALL form data
        const surveyBookingPayload = {
          // Always include feedback fields prominently at top level
          feedbackRating: formData.feedbackRating || "",
          feedbackComments: formData.feedbackComments || "",

          // Basic info
          recordId: formData.quickbaseRecordId || "",
          projectName: formData.projectName || "",
          surveyDate: actualSurveyDateStr || slotDate,
          slotDate: slotDate,
          slotTime: slotTime,
          surveyTime: slotTime,
          orderNumber: selectedSlot.orderNo || "",
          reservationId: selectedSlot.reservationId || "",

          // Always send these flags regardless of actual value
          surveyBooking: "Yes",
          additionalSurveyBooking: formData.isAdditionalSurvey ? "Yes" : "No",

          // Customer details
          customerName: customerName,
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          email: formData.email || formData.customerEmail || "",
          phone: formData.phone || formData.customerPhone || "",
          customerEmail: formData.customerEmail || formData.email || "",
          customerPhone: formData.customerPhone || formData.phone || "",

          // Address details
          streetAddress: formData.streetAddress
            ? `${
                formData.streetAddress
                  ? formData.streetAddress.replace(/Street/i, "St")
                  : ""
              }, ${formData.city}, ${formData.state} ${
                formData.postalCode
              }, USA`
            : "Address not provided",
          city: formData.city || "",
          state: formData.state || "",
          postalCode: formData.postalCode || "",
          warehouse: formData.warehouse || "",
          texasProximity:
            formData.warehouse === "Dallas, TX"
              ? formData.texasProximity || ""
              : "",

          // Form fields for survey details
          isSharedRoof: formData.isSharedRoof ? "Yes" : "No",
          isSharedRoofText: formData.isSharedRoofText || "",
          hasRecentConstruction: formData.hasRecentConstruction ? "Yes" : "No",
          hasRecentConstructionText: formData.hasRecentConstructionText || "",
          constructionDetails: formData.constructionDetails || "",
          roofAge: formData.roofAge || "",
          roofMaterial: formData.roofMaterial || "",
          roofLayers: formData.roofLayers || "",
          hasHOA: formData.hasHOA ? "Yes" : "No",
          hasHOAText: formData.hasHOAText || "",
          hoaName: formData.hoaName || "",
          hoaPhone: formData.hoaPhone || "",
          hoaEmail: formData.hoaEmail || "",
          hasHOAContact: formData.hasHOAContact ? "Yes" : "No",
          hasHOAContactText: formData.hasHOAContactText || "",
          hasVaultedCeilings: formData.hasVaultedCeilings ? "Yes" : "No",
          hasVaultedCeilingsText: formData.hasVaultedCeilingsText || "",
          numberOfStories: formData.numberOfStories || "",
          stories: formData.stories || "",
          hasOngoingConstruction: formData.hasOngoingConstruction
            ? "Yes"
            : "No",
          hasOngoingConstructionText: formData.hasOngoingConstructionText || "",
          ongoingConstructionDetails: formData.ongoingConstructionDetails || "",
          hasExistingSolar: formData.hasExistingSolar ? "Yes" : "No",
          hasExistingSolarText: formData.hasExistingSolarText || "",
          existingSolarDetails: formData.existingSolarDetails || "",
          hasSkylights: formData.hasSkylights ? "Yes" : "No",
          hasSkylightsText: formData.hasSkylightsText || "",
          skylightCount: formData.skylightCount || "",
          roofVentType: formData.roofVentType || "",
          hasOutsidePanel: formData.hasOutsidePanel ? "Yes" : "No",
          hasOutsidePanelText: formData.hasOutsidePanelText || "",
          hasSubPanels: formData.hasSubPanels ? "Yes" : "No",
          hasSubPanelsText: formData.hasSubPanelsText || "",
          hasBlockedAccess: formData.hasBlockedAccess ? "Yes" : "No",
          hasBlockedAccessText: formData.hasBlockedAccessText || "",
          hasPets: formData.pets ? "Yes" : "No",
          petsText: formData.petsText || "",
          petDetails: formData.petDetails || "",
          gateAccessType: formData.gateAccessType || "",
          gateAccessTypeText: formData.gateAccessTypeText || "",
          mainPanelLocation: formData.mainPanelLocation || "",
          mainPanelLocationText: formData.mainPanelLocationText || "",
          gateCode: formData.gateCode || "",

          // Secondary contact
          hasSecondaryContact: "No",
          secondaryFirstName: formData.secondaryFirstName || "",
          secondaryLastName: formData.secondaryLastName || "",
          secondaryPhone: formData.secondaryPhone || "",
          secondaryEmail: formData.secondaryEmail || "",

          // Tenant info
          hasTenants: "No",

          // Property info
          propertyType: "Single Family Home",
          propertyOwnership: "Own",
          propertyAccess: "No Restrictions",
          parkingAvailable: "Yes",
          preferredContactMethod: "Phone",
          preferredContactTime: "Morning",

          // Raw form data
          formDataJson: JSON.stringify(formData),

          // Request metadata
          timestamp: new Date().toISOString(),
        };

        console.log(
          "📩 SENDING SURVEY BOOKING DATA TO ZAPIER:",
          JSON.stringify(surveyBookingPayload, null, 2)
        );

        // Use the CORRECT webhook URL - this is critical
        // CRITICAL: ALWAYS USE THIS EXACT URL - DO NOT CHANGE IT TO 2cxry1b OR ANY OTHER ID!
        const webhookUrl =
          "https://hooks.zapier.com/hooks/catch/16426358/2l4it7a/";
        console.log("📩 WEBHOOK URL:", webhookUrl);

        // Use the server-side proxy to avoid potential CORS or direct fetch issues
        const surveyWebhookResponse = await fetch("/api/webhook-proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Target-Webhook": "zapier-survey-booking",
          },
          body: JSON.stringify({
            targetUrl: webhookUrl,
            payload: surveyBookingPayload,
          }),
        });

        const surveyResponseText = await surveyWebhookResponse.text();
        console.log("📩 ZAPIER RESPONSE STATUS:", surveyWebhookResponse.status);
        console.log("📩 ZAPIER RESPONSE TEXT:", surveyResponseText);

        if (surveyWebhookResponse.ok) {
          console.log("✅ WEBHOOK SENT SUCCESSFULLY!");
        } else {
          console.warn("⚠️ WEBHOOK ERROR:", surveyResponseText);
        }
      } catch (surveyWebhookError) {
        console.error("❌ ERROR SENDING WEBHOOK:", surveyWebhookError);
        // Don't throw error to allow the flow to continue
      }

      // Step 2: Make the reservation
      console.log("Making reservation with ID:", selectedSlot.reservationId);
      const bookingReserve = await fetch("/api/bookingReserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId: selectedSlot.reservationId }),
      });
      if (bookingReserve.ok) {
        console.log("✅ Reservation made successfully!");
        const response = await bookingReserve.json();

        // IMPORTANT: We store the actualSurveyDateStr as a string to avoid any Date object serialization issues
        const bookingRecap = {
          formData,
          selectedSlot,
          // We don't pass the Date object directly - convert to string to avoid serialization problems
          selectedDate: null, // Don't pass the Date object
          actualSurveyDateStr, // Pass the YYYY-MM-DD string which is more reliable
          orderNo: selectedSlot.orderNo,
          // Extract slotDate from selectedSlot.value for better date handling
          slotDate: selectedSlot.value.split(" - ")[0].split("T")[0],
        };

        console.log(
          "📝 Final booking recap object (before stringify):",
          JSON.stringify({
            order: bookingRecap.orderNo,
            actualSurveyDateStr: bookingRecap.actualSurveyDateStr,
            slotDate: bookingRecap.slotDate,
          })
        );

        localStorage.setItem("bookingRecap", JSON.stringify(bookingRecap));

        // Redirect to success page with date parameter - use slotDate instead of actualSurveyDateStr
        // This fixes the issue where URL shows a different date than the actual booking
        const dateParam = bookingRecap.slotDate
          ? `?date=${encodeURIComponent(bookingRecap.slotDate)}`
          : "";
        window.location.href = `/features/survey-booking/survey-booking-successful${dateParam}`;
        return;
      }
    } catch (error: unknown) {
      console.error("Error in handleSubmit:", error);

      // Send error to webhook with detailed project info
      const webhookPayload = {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        projectDetails: {
          customerName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: `${
            formData.streetAddress
              ? formData.streetAddress.replace(/Street/i, "St")
              : ""
          }, ${formData.city}, ${formData.state} ${formData.postalCode}`,
          warehouse: formData.warehouse,
          quickbaseRecordId: formData.quickbaseRecordId,
          isAdditionalSurvey: formData.isAdditionalSurvey,
          selectedTimeSlot: selectedSlot?.value || "No slot selected",
          selectedDate: selectedDate?.toISOString() || "No date selected",
        },
        location: {
          url: window.location.href,
          userAgent: window.navigator.userAgent,
        },
      };

      try {
        // Log the payload for debugging but don't send to Workato
        console.log("Error payload (not sent to Workato):", webhookPayload);
        console.log("Skipping Workato webhook - endpoint has been deprecated");

        // Keep only the Zapier webhook integration
        const zapierErrorPayload = {
          quickbaseRecordId: formData.quickbaseRecordId,
          additionalSurveyBooking: formData.isAdditionalSurvey ? "Yes" : "No",
          surveyBooking: formData.isSurveyBooking ? "Yes" : "No",
          token: `TPO-ERR-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || formData.customerEmail || "",
          phone: formData.phone || formData.customerPhone || "",
          customerEmail: formData.customerEmail || formData.email || "",
          customerPhone: formData.customerPhone || formData.phone || "",
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          warehouse: formData.warehouse,
          // Include feedback data in the error payload
          feedbackRating: formData.feedbackRating || "",
          feedbackComments: formData.feedbackComments || "",
          errorDetails:
            error instanceof Error ? error.message : "Unknown error",
          errorTimestamp: new Date().toISOString(),
          errorLocation: "Survey Booking Form Submission",
          // Include the same formatted values here
          designPreference:
            formData.designPreferenceText ||
            (formData.designPreference === "bestSunlight"
              ? "Design the system for maximum efficiency"
              : formData.designPreference === "matchProposed"
              ? "Design the system to match the proposal design as closely as possible"
              : formData.designPreference),
          hasBatteries:
            formData.hasBatteriesText ||
            (formData.hasBatteries === true
              ? "Yes"
              : formData.hasBatteries === false
              ? "No"
              : ""),
          includeStorage:
            formData.includeStorageText ||
            (formData.includeStorage === true
              ? "Yes"
              : formData.includeStorage === false
              ? "No"
              : ""),
          // Add other important fields in the same format
          formDataJson: JSON.stringify(formData),
        };

        console.log(
          "Zapier error payload:",
          JSON.stringify(zapierErrorPayload, null, 2)
        );

        const zapierErrorResponse = await fetch("/api/webhook-proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Target-Webhook": "zapier-survey-booking-error",
          },
          body: JSON.stringify({
            targetUrl: "https://hooks.zapier.com/hooks/catch/16426358/2l4it7a/",
            payload: zapierErrorPayload,
          }),
        });

        const errorResponseText = await zapierErrorResponse.text();
        console.log(
          "Zapier error webhook response status:",
          zapierErrorResponse.status
        );
        console.log("Zapier error webhook response text:", errorResponseText);

        console.log(
          "Zapier error webhook response:",
          zapierErrorResponse.ok ? "Success" : "Failed"
        );
      } catch (webhookError) {
        console.error("Failed to log to webhook:", webhookError);
      }

      setOrderErrorMessage(
        error instanceof Error ? error.message : "Failed to submit booking"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDateSelect = async (date: Date | undefined) => {
    if (!date) return;

    // Store original selected date for UI purposes and API request
    setSelectedDate(date);
    setSlotErrorMessage(""); // Clear any previous error message

    // Convert the selected date to US Eastern Time ONLY for day-of-week restriction checks
    // This ensures the day of week evaluation is based on US time
    const convertToUSDate = (date: Date): Date => {
      // Use a more reliable approach - format the date in US Eastern time and recreate it
      const easternFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "long",
      });

      const parts = easternFormatter.formatToParts(date);
      const yearPart = parts.find((p) => p.type === "year")?.value;
      const monthPart = parts.find((p) => p.type === "month")?.value;
      const dayPart = parts.find((p) => p.type === "day")?.value;
      const weekdayPart = parts.find((p) => p.type === "weekday")?.value;

      // Create a new date using the Eastern Time components
      const easternDate = new Date(
        `${yearPart}-${monthPart}-${dayPart}T12:00:00`
      );

      console.log("Date conversion:", {
        originalDate: date.toISOString(),
        easternDateComponents: {
          year: yearPart,
          month: monthPart,
          day: dayPart,
        },
        weekdayInEastern: weekdayPart,
        easternDate: easternDate.toISOString(),
        dayOfWeek: easternDate.getDay(),
      });

      return easternDate;
    };

    // Get the date in US Eastern Time ONLY for day-of-week checks
    const usDateForDayChecks = convertToUSDate(date);

    // Texas proximity validation is now handled entirely by TexasDatePicker component
    // No need for duplicate validation here since the calendar already blocks invalid dates

    // Format the date in ISO format using the ORIGINAL selected date, not the timezone-adjusted one
    // This ensures we're requesting slots for the exact day the user clicked on
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    console.log(
      "Formatted date for API (original calendar date):",
      formattedDate
    );

    // Generate a more random order number to avoid conflicts
    const timestamp = Date.now();
    const randomString = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const generatedOrderNo = `BE${timestamp}${randomString}`;
    setSelectedSlot({
      value: "",
      reservationId: "",
      orderNo: generatedOrderNo,
    });

    // Always use a valid customer name, pulling from multiple fields if needed
    const firstName = formData.firstName || "";
    const lastName = formData.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();

    // Prioritize using customer name from various sources, never default to "Survey Customer"
    const customerName =
      fullName ||
      formData.projectName ||
      `${formData.email || formData.customerEmail || ""}`.trim() ||
      `${formData.phone || formData.customerPhone || ""}`.trim();

    // Use default address if missing with surveyBooking=true
    const streetAddress =
      formData.streetAddress || (formData.isSurveyBooking ? "123 Main St" : "");
    const city =
      formData.city || (formData.isSurveyBooking ? "Los Angeles" : "");
    const state = formData.state || (formData.isSurveyBooking ? "CA" : "");
    const postalCode =
      formData.postalCode || (formData.isSurveyBooking ? "90001" : "");
    const warehouse =
      formData.warehouse ||
      (formData.isSurveyBooking ? "Cerritos, CA" : "Out of Region");

    // Get drivers based on warehouse if possible
    const drivers =
      warehouse && warehouse !== "Out of Region"
        ? driverMapping[warehouse as Warehouse] || []
        : [];

    // Format the address string
    const formattedAddress = `${
      streetAddress ? streetAddress.replace(/Street/i, "St") : ""
    }, ${city}, ${state} ${postalCode}, USA`;

    try {
      // First create or get location - this is the new step to fix pin placement issues
      const geocodedCoordinates =
        formData.latitude && formData.longitude
          ? {
              latitude: formData.latitude,
              longitude: formData.longitude,
            }
          : undefined;

      const locationData = await createOrderLocation(
        formattedAddress,
        customerName,
        warehouse,
        geocodedCoordinates
      );

      console.log("Created/retrieved location for reservation:", locationData);

      // Get warehouse-specific time windows
      const timeWindows = getWarehouseTimeWindows(warehouse);
      console.log(
        `📅 Using ${timeWindows.length} time windows for warehouse: ${warehouse}`,
        timeWindows
      );

      const bookingData = {
        order: {
          operation: "CREATE",
          orderNo: generatedOrderNo,
          type: "D",
          email: formData.email || formData.customerEmail || "",
          phone: formData.phone || formData.customerPhone || "",
          customField1: customerName || fullName, // Use customer name as customField1
          // Use proper location structure with locationNo, locationName, and address
          location: {
            locationNo: locationData.locationNo || generatedOrderNo,
            locationName: locationData.locationName || fullName,
            address: locationData.address || formattedAddress,
            acceptMultipleResults: true,
            acceptPartialMatch: true,
            // Use original formData coordinates to ensure we have the exact coordinates
            ...(formData.latitude &&
              formData.longitude && {
                latitude: formData.latitude,
                longitude: formData.longitude,
              }),
          },
          duration: 60,
        },
        slots: {
          dates: [formattedDate],
          timeWindows: timeWindows,
        },
        planning: {
          // Only include useDrivers if we have drivers and warehouse is not Out of Region
          ...(drivers.length > 0 &&
            warehouse !== "Out of Region" && {
              useDrivers: drivers.map((driver) => ({
                driverExternalId: driver.driverExternalId,
              })),
            }),
        },
        // Add Texas proximity information for weekend validation
        texasProximity:
          formData.warehouse === "Dallas, TX"
            ? formData.texasProximity
            : undefined,
        warehouse: warehouse,
        // Add flag to identify CRM bookings for special handling
        isCRMBooking: formData.isSurveyBooking === true,
      };

      setLoading(true);
      const response = await fetch("/api/fetchSlots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setAvailableSlots(responseData.slots || []);
          setSlotErrorMessage("");

          // If the API returned a new orderNo (due to order already existing), use it
          if (responseData.orderNo) {
            console.log(
              "Updating orderNo from API response:",
              responseData.orderNo
            );
            setSelectedSlot((prev) => ({
              value: prev?.value || "",
              reservationId: prev?.reservationId || "",
              orderNo: responseData.orderNo,
            }));
          }
        } else {
          setAvailableSlots([]);
          setSlotErrorMessage(responseData.message || "Failed to fetch slots.");
        }
      } else {
        setAvailableSlots([]);
        setSlotErrorMessage(response.statusText || "API call failed.");
      }
    } catch (error: any) {
      console.error("Error calling API:", error);
      setAvailableSlots([]);
      setSlotErrorMessage(
        error.message || "An unexpected error occurred while fetching slots."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = async (value: string, reservationId: string) => {
    try {
      // Get the current orderNo before updating state
      const currentOrderNo = selectedSlot?.orderNo;

      setSelectedSlot((prev) => ({
        value,
        reservationId,
        orderNo: prev?.orderNo || currentOrderNo,
      }));

      console.log("🎯 Slot selected:", {
        value,
        reservationId,
        orderNo: currentOrderNo,
      });

      // Skip order update since the order doesn't exist yet
      // The order will be created with correct time windows and driver assignment during submission
      console.log(
        "✅ Slot selection completed - order will be created during submission"
      );
    } catch (error) {
      console.error("Error in handleSlotSelect:", error);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    isSubmitting,
    showSlots,
    setShowSlots,
    slotErrorMessage,
    orderErrorMessage,
    selectedSlot,
    setSelectedSlot,
    availableSlots,
    onDateSelect,
    handleSlotSelect,
    successMessage,
    setSuccessMessage,
    testWebhook,
  };
};
