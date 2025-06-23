import { NextRequest, NextResponse } from "next/server";
import { getDriveService } from "@/app/utils/googleDrive";
import { fixMultilineEnvVar } from "@/lib/vercel-helpers";

/**
 * Diagnostic endpoint to check Google Drive connectivity
 * This will NOT be exposed in production, only for debugging purposes
 */
export async function GET(req: NextRequest) {
  // Only allow in development or with a special debug parameter
  const isDev = process.env.NODE_ENV === 'development';
  const debugMode = process.env.GOOGLE_DRIVE_DEBUG === 'true';
  const debugParam = req.nextUrl.searchParams.get('debug') === 'true';
  
  if (!isDev && !debugMode && !debugParam) {
    return NextResponse.json({ 
      success: false, 
      message: "This endpoint is only available in development mode or with debug enabled" 
    }, { status: 403 });
  }

  try {
    // Create a diagnostic result object
    const diagnostics: Record<string, any> = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      forceProduction: process.env.FORCE_PRODUCTION_UPLOADS === 'true',
      credentials: {
        clientEmail: {
          present: !!process.env.GOOGLE_CLIENT_EMAIL,
          value: process.env.GOOGLE_CLIENT_EMAIL ? 
            `${process.env.GOOGLE_CLIENT_EMAIL.substring(0, 5)}...${process.env.GOOGLE_CLIENT_EMAIL.split('@')[1]}` : 
            'NOT SET'
        },
        privateKey: {
          present: !!process.env.GOOGLE_PRIVATE_KEY_FILE,
          format: process.env.GOOGLE_PRIVATE_KEY_FILE?.includes('\\n') ? 'Has \\n characters' : 'No \\n characters',
          length: process.env.GOOGLE_PRIVATE_KEY_FILE?.length || 0
        },
        folderId: {
          present: !!process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID,
          value: process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID || 'NOT SET'
        }
      }
    };

    // Test fixing the private key format
    if (process.env.GOOGLE_PRIVATE_KEY_FILE) {
      const fixedKey = fixMultilineEnvVar(process.env.GOOGLE_PRIVATE_KEY_FILE);
      diagnostics.credentials.privateKey.fixedLength = fixedKey?.length || 0;
      diagnostics.credentials.privateKey.startsWithHeader = fixedKey?.startsWith('-----BEGIN PRIVATE KEY-----') || false;
      diagnostics.credentials.privateKey.endsWithFooter = fixedKey?.endsWith('-----END PRIVATE KEY-----') || false;
    }

    // Try to initialize the Drive service
    try {
      console.log('🔍 Testing Google Drive service initialization...');
      const drive = getDriveService();
      diagnostics.driveService = 'Successfully initialized';
      
      // Try to list files to verify access
      console.log('🔍 Testing API access by listing files...');
      const folderId = process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID;
      
      if (folderId) {
        try {
          const response = await drive.files.list({
            q: `'${folderId}' in parents`,
            pageSize: 5,
            fields: 'files(id, name, mimeType, webViewLink)'
          });
          
          diagnostics.folderAccess = {
            success: true,
            fileCount: response.data.files?.length || 0,
            files: response.data.files?.map(file => ({
              id: file.id,
              name: file.name,
              type: file.mimeType
            })) || []
          };
        } catch (folderError: any) {
          diagnostics.folderAccess = {
            success: false,
            error: folderError.message,
            details: folderError.response?.data || {}
          };
        }
      }
    } catch (driveError: any) {
      diagnostics.driveService = {
        error: driveError.message,
        stack: driveError.stack?.split('\n').slice(0, 3)
      };
    }

    return NextResponse.json({ 
      success: true, 
      diagnostics 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Error checking Google Drive configuration",
      error: error.toString(),
      stack: error.stack?.split('\n').slice(0, 3)
    }, { status: 500 });
  }
} 