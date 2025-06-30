import { NextRequest, NextResponse } from "next/server";
import { generateUUID } from "../../lib/utils";
import { saveForm } from "../../features/project-creation/actions";
export async function POST(req: NextRequest) {
  try {
    // Check if the request has the correct content type
    const contentType = req.headers.get("content-type");
    if (contentType !== "application/json") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content type. Expected application/json.",
        },
        { status: 400 }
      );
    }

    // Parse request body
    let formData;
    try {
      formData = await req.json();
    } catch (parseError) {
      console.error("📝 Failed to parse request body:", parseError);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    // Enhanced logging to check form data structure
    console.log(
      "📝 Project submit API called with data:",
      JSON.stringify(formData, null, 2)
    );

    // Log specific fields of interest
    console.log("📝 Finance Type:", formData.financeType);
    console.log("📝 Finance Company:", formData.financeCompany);
    console.log("📝 lgcyCanvassId:", formData.lgcyCanvassId);
    console.log("📝 salesCompany:", formData.salesCompany);

    // Log secondary contact information
    if (
      formData.hasSecondaryContact ||
      formData.secondaryFirstName ||
      formData.secondaryLastName
    ) {
      console.log("📝 Secondary Contact Information:");
      console.log("  - First Name:", formData.secondaryFirstName);
      console.log("  - Last Name:", formData.secondaryLastName);
      console.log("  - Email:", formData.secondaryEmail);
      console.log("  - Phone:", formData.secondaryPhone);
      console.log("  - Relationship:", formData.secondaryRelationship);
    } else {
      console.log("📝 No Secondary Contact Information Provided");
    }

    // Log tenant information
    if (
      formData.hasTenants ||
      formData.tenantFirstName ||
      formData.tenantLastName
    ) {
      console.log("📝 Tenant Information:");
      console.log("  - First Name:", formData.tenantFirstName);
      console.log("  - Last Name:", formData.tenantLastName);
      console.log("  - Email:", formData.tenantEmail);
      console.log("  - Phone:", formData.tenantPhone);
    } else {
      console.log("📝 No Tenant Information Provided");
    }

    // Log file attachments
    if (formData.ubillFiles && formData.ubillFiles.length > 0) {
      console.log("📝 File Attachments:", formData.ubillFiles.length);
    }

    // Remove strict validation of customerInfo, projectDetails, address structure
    // Instead, validate the essential fields directly
    if (!formData.firstName || !formData.lastName || !formData.customerEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: firstName, lastName, or customerEmail",
        },
        { status: 400 }
      );
    }

    if (
      !formData.streetAddress ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required address fields",
        },
        { status: 400 }
      );
    }

    // Ensure leadType is included directly in the submitted data
    if (formData.leadType) {
      console.log("📝 LeadType found in form data:", formData.leadType);
    } else {
      console.log("📝 Warning: LeadType not found in form data");
    }

    // Log ubillFiles specifically if they exist
    if (formData.ubillFiles) {
      console.log(
        "📝 Received ubillFiles:",
        JSON.stringify(formData.ubillFiles, null, 2)
      );
      console.log("📝 Number of files received:", formData.ubillFiles.length);
    } else {
      console.log("📝 No ubillFiles found in payload");
    }

    // Forward to Zapier
    try {
      const zapierUrl =
        "https://hooks.zapier.com/hooks/catch/16426358/2wogpdo/";
      console.log(`📝 Sending data to Zapier webhook: ${zapierUrl}`);

      // Create a modified copy of formData with leadType at the top level if it's nested
      let payloadToSend = { ...formData };

      // Ensure leadType is present at the top level of the payload
      if (!payloadToSend.leadType && formData.projectDetails?.leadType) {
        payloadToSend.leadType = formData.projectDetails.leadType;
        console.log(
          "📝 Extracted leadType from projectDetails:",
          payloadToSend.leadType
        );
      }

      // In case financeType isn't included, add it to the payload if available in formData
      if (!payloadToSend.financeType) {
        console.log(
          "📝 Warning: financeType not found at top level of payload"
        );
      }

      // Add Google Drive information to the payload
      const googleDriveInfo = {
        googleDriveCredentials: {
          clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
          driveUploadFolderId: process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID,
          shareWithEmail: process.env.GOOGLE_SHARE_WITH_EMAIL,
        },
      };

      console.log("📝 Adding Google Drive information to payload");

      // If this is a flat structure, reshape it to match the expected nested structure
      if (!payloadToSend.projectDetails) {
        console.log("📝 Creating nested structure for Zapier payload");
        payloadToSend = {
          leadType: payloadToSend.leadType || "",
          customerInfo: {
            firstName: payloadToSend.firstName,
            lastName: payloadToSend.lastName,
            salesRepEmail: payloadToSend.salesRepEmail,
            salesRepEmail2: payloadToSend.salesRepEmail2,
            dialerEmail: payloadToSend.dialerEmail,
            customerEmail: payloadToSend.customerEmail,
            customerPhone: payloadToSend.customerPhone,
            preferredLanguage: payloadToSend.preferredLanguage,
            internalToken: payloadToSend.internalToken,
          },
          projectDetails: {
            financeCompany: payloadToSend.financeCompany,
            financeType: payloadToSend.financeType,
            escalator: payloadToSend.escalator,
            term: payloadToSend.term,
            leadType: payloadToSend.leadType,
            moduleCount: payloadToSend.moduleCount,
            moduleType: payloadToSend.moduleType,
            storage: payloadToSend.storage,
            storageOption: payloadToSend.storageOption,
            adders: Array.isArray(payloadToSend.adders)
              ? payloadToSend.adders.join(";")
              : payloadToSend.adders,
            ubillFile: payloadToSend.ubillFile,
            ubillFiles: payloadToSend.ubillFiles,
            u_bill_upload: "",
            // Include lgcyCanvassId and salesCompany in projectDetails
            lgcyCanvassId: payloadToSend.lgcyCanvassId || "",
            salesCompany: payloadToSend.salesCompany || "",
          },
          address: {
            street: payloadToSend.streetAddress,
            city: payloadToSend.city,
            state: payloadToSend.state,
            postalCode: payloadToSend.postalCode,
            warehouse: payloadToSend.warehouse,
          },
          // Include secondary contact information
          hasSecondaryContact:
            !!payloadToSend.secondaryFirstName ||
            !!payloadToSend.secondaryLastName,
          secondaryContact:
            payloadToSend.secondaryFirstName || payloadToSend.secondaryLastName
              ? {
                  firstName: payloadToSend.secondaryFirstName || "",
                  lastName: payloadToSend.secondaryLastName || "",
                  email: payloadToSend.secondaryEmail || "",
                  phone: payloadToSend.secondaryPhone || "",
                  relationship: payloadToSend.secondaryRelationship || "",
                }
              : undefined,
          // Include secondary fields at top level for compatibility
          secondaryFirstName: payloadToSend.secondaryFirstName || "",
          secondaryLastName: payloadToSend.secondaryLastName || "",
          secondaryEmail: payloadToSend.secondaryEmail || "",
          secondaryPhone: payloadToSend.secondaryPhone || "",
          secondaryRelationship: payloadToSend.secondaryRelationship || "",
          // Include tenant information
          hasTenants:
            !!payloadToSend.tenantFirstName ||
            !!payloadToSend.tenantLastName ||
            !!payloadToSend.hasTenants,
          tenant:
            payloadToSend.tenantFirstName ||
            payloadToSend.tenantLastName ||
            payloadToSend.hasTenants
              ? {
                  firstName: payloadToSend.tenantFirstName || "",
                  lastName: payloadToSend.tenantLastName || "",
                  email: payloadToSend.tenantEmail || "",
                  phone: payloadToSend.tenantPhone || "",
                }
              : undefined,
          // Include tenant fields at top level for compatibility
          tenantFirstName: payloadToSend.tenantFirstName || "",
          tenantLastName: payloadToSend.tenantLastName || "",
          tenantEmail: payloadToSend.tenantEmail || "",
          tenantPhone: payloadToSend.tenantPhone || "",
          // Also include ubillFiles at the top level for Zapier to easily access
          ubillFiles: payloadToSend.ubillFiles,
          ubillFilesUrls:
            Array.isArray(payloadToSend.ubillFiles) &&
            payloadToSend.ubillFiles.length > 0
              ? payloadToSend.ubillFiles.map((file: any) => file.url).join(";")
              : "",
          ubillFilesNames:
            Array.isArray(payloadToSend.ubillFiles) &&
            payloadToSend.ubillFiles.length > 0
              ? payloadToSend.ubillFiles.map((file: any) => file.name).join(";")
              : "",
          // Include Google Drive viewer URLs (not direct download URLs)
          ubillFilesDirectUrls:
            Array.isArray(payloadToSend.ubillFiles) &&
            payloadToSend.ubillFiles.length > 0
              ? payloadToSend.ubillFiles
                  .map((file: any) => {
                    // Convert any direct download URLs to view URLs
                    const url = file.url;
                    if (url && url.includes("drive.google.com")) {
                      // Check if it's a direct download URL
                      if (url.includes("export=download")) {
                        const fileIdMatch = url.match(/id=([^&]+)/);
                        if (fileIdMatch && fileIdMatch[1]) {
                          return `https://drive.google.com/file/d/${fileIdMatch[1]}/view`;
                        }
                      }
                    }
                    return url;
                  })
                  .join(";")
              : "",
          // Add lgcyCanvassId and salesCompany at the top level
          lgcyCanvassId: payloadToSend.lgcyCanvassId || "",
          salesCompany: payloadToSend.salesCompany || "",
          // Add Google Drive info at the top level
          ...googleDriveInfo,
        };
      } else {
        // If already in nested structure, add Google Drive info at the top level
        // and ensure ubillFiles info is also at the top level

        // Extract ubillFiles data from the nested structure if it exists
        const ubillFiles = payloadToSend.projectDetails?.ubillFiles || [];

        // Make sure secondary contact info is present in the top level
        const hasSecondaryContact =
          !!payloadToSend.secondaryFirstName ||
          !!payloadToSend.secondaryLastName ||
          !!payloadToSend.secondaryContact?.firstName ||
          !!payloadToSend.secondaryContact?.lastName;

        // Make sure tenant info is present in the top level
        const hasTenants =
          !!payloadToSend.tenantFirstName ||
          !!payloadToSend.tenantLastName ||
          !!payloadToSend.tenant?.firstName ||
          !!payloadToSend.tenant?.lastName ||
          !!payloadToSend.hasTenants;

        payloadToSend = {
          ...payloadToSend,
          // Ensure secondary contact info is present at top level
          hasSecondaryContact,
          secondaryFirstName:
            payloadToSend.secondaryFirstName ||
            payloadToSend.secondaryContact?.firstName ||
            "",
          secondaryLastName:
            payloadToSend.secondaryLastName ||
            payloadToSend.secondaryContact?.lastName ||
            "",
          secondaryEmail:
            payloadToSend.secondaryEmail ||
            payloadToSend.secondaryContact?.email ||
            "",
          secondaryPhone:
            payloadToSend.secondaryPhone ||
            payloadToSend.secondaryContact?.phone ||
            "",
          secondaryRelationship:
            payloadToSend.secondaryRelationship ||
            payloadToSend.secondaryContact?.relationship ||
            "",
          // Ensure tenant info is present at top level
          hasTenants,
          tenantFirstName:
            payloadToSend.tenantFirstName ||
            payloadToSend.tenant?.firstName ||
            "",
          tenantLastName:
            payloadToSend.tenantLastName ||
            payloadToSend.tenant?.lastName ||
            "",
          tenantEmail:
            payloadToSend.tenantEmail || payloadToSend.tenant?.email || "",
          tenantPhone:
            payloadToSend.tenantPhone || payloadToSend.tenant?.phone || "",
          // Add ubillFiles at the top level for Zapier to easily access
          ubillFiles: ubillFiles,
          ubillFilesUrls:
            Array.isArray(ubillFiles) && ubillFiles.length > 0
              ? ubillFiles.map((file: any) => file.url).join(";")
              : "",
          ubillFilesNames:
            Array.isArray(ubillFiles) && ubillFiles.length > 0
              ? ubillFiles.map((file: any) => file.name).join(";")
              : "",
          // Include Google Drive viewer URLs (not direct download URLs)
          ubillFilesDirectUrls:
            Array.isArray(ubillFiles) && ubillFiles.length > 0
              ? ubillFiles
                  .map((file: any) => {
                    // Convert any direct download URLs to view URLs
                    const url = file.url;
                    if (url && url.includes("drive.google.com")) {
                      // Check if it's a direct download URL
                      if (url.includes("export=download")) {
                        const fileIdMatch = url.match(/id=([^&]+)/);
                        if (fileIdMatch && fileIdMatch[1]) {
                          return `https://drive.google.com/file/d/${fileIdMatch[1]}/view`;
                        }
                      }
                    }
                    return url;
                  })
                  .join(";")
              : "",
          // Add lgcyCanvassId and salesCompany at the top level
          lgcyCanvassId: payloadToSend.lgcyCanvassId || "",
          salesCompany: payloadToSend.salesCompany || "",
          ...googleDriveInfo,
        };
      }
      //Save in database
      const id = formData.form_id;
      await saveForm(id, payloadToSend);
      console.log("Submission ID saved:", id);
      // Log the final payload being sent to Zapier
      console.log(
        "📝 Final Zapier payload:",
        JSON.stringify(payloadToSend, null, 2)
      );

      const zapierResponse = await fetch(zapierUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadToSend),
      });

      const zapierStatus = zapierResponse.status;
      let zapierText;

      try {
        zapierText = await zapierResponse.text();
      } catch (textError) {
        zapierText = "Unable to read response text";
      }

      console.log(`📝 Zapier response: ${zapierStatus} - ${zapierText}`);

      if (zapierStatus < 200 || zapierStatus >= 300) {
        return NextResponse.json(
          {
            success: false,
            message: `Zapier integration error: ${zapierStatus} ${zapierText}`,
            zapierStatus,
            zapierResponse: zapierText,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Project submitted successfully",
        zapierStatus,
        zapierResponse: zapierText,
        id,
      });
    } catch (zapierError) {
      console.error("📝 Failed to send to Zapier:", zapierError);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to submit project to external integration",
          error:
            zapierError instanceof Error
              ? zapierError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("📝 Project submit API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process project submission",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
