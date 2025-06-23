import { NextRequest, NextResponse } from "next/server";
import { uploadFileToDrive } from "@/app/utils/googleDrive";

/**
 * Test endpoint to verify Google Drive uploads are working
 * Access this at /api/test-file-upload to create a simple test file
 */
export async function GET(req: NextRequest) {
  console.log('🧪 TEST: Starting test file upload');
  
  // Only allow in development with debug parameter
  const isDev = process.env.NODE_ENV === 'development';
  const debugParam = req.nextUrl.searchParams.get('debug') === 'true';
  
  if (!isDev && !debugParam) {
    return NextResponse.json({ 
      success: false, 
      message: "This endpoint is only available in development mode or with debug parameter" 
    }, { status: 403 });
  }
  
  // Log environment variables for debugging (without exposing sensitive values)
  console.log('🧪 TEST: Environment configuration:');
  console.log('🧪 TEST: NODE_ENV:', process.env.NODE_ENV);
  console.log('🧪 TEST: GOOGLE_CLIENT_EMAIL is set:', !!process.env.GOOGLE_CLIENT_EMAIL);
  console.log('🧪 TEST: GOOGLE_PRIVATE_KEY is set:', !!process.env.GOOGLE_PRIVATE_KEY);
  console.log('🧪 TEST: GOOGLE_PRIVATE_KEY first 30 chars:', process.env.GOOGLE_PRIVATE_KEY?.substring(0, 30));
  console.log('🧪 TEST: GOOGLE_PRIVATE_KEY contains escaped newlines:', process.env.GOOGLE_PRIVATE_KEY?.includes('\\n'));
  console.log('🧪 TEST: GOOGLE_DRIVE_UPLOAD_FOLDER_ID is set:', !!process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID);
  console.log('🧪 TEST: FORCE_PRODUCTION_UPLOADS is set to:', process.env.FORCE_PRODUCTION_UPLOADS);
  
  try {
    // Create a simple text file to upload
    const timestamp = new Date().toISOString();
    const textContent = `Test file created at ${timestamp}\n\nThis is a test file uploaded to Google Drive.\n\nEnvironment: ${process.env.NODE_ENV}\nServer: ${process.version}`;
    const buffer = Buffer.from(textContent, 'utf-8');
    
    console.log('🧪 TEST: Created test file buffer:', buffer.length, 'bytes');
    
    // Upload to Google Drive
    console.log('🧪 TEST: Uploading to Google Drive...');
    try {
      const result = await uploadFileToDrive(
        `test-file-${Date.now()}.txt`, 
        'text/plain', 
        buffer
      );
      
      console.log('🧪 TEST: Upload successful!');
      console.log('🧪 TEST: File ID:', result.fileId);
      console.log('🧪 TEST: Access URL:', result.webViewLink);
      
      return NextResponse.json({
        success: true,
        message: "Test file uploaded successfully",
        fileId: result.fileId,
        accessUrl: result.webViewLink,
        isSimulated: result.fileId.includes('fake-file-id'),
        content: textContent
      });
    } catch (uploadError: any) {
      console.error('🧪 TEST: Upload error details:', {
        name: uploadError.name,
        message: uploadError.message,
        code: uploadError.code,
        opensslError: uploadError.opensslErrorStack || 'N/A'
      });
      
      if (uploadError.message?.includes('bignum')) {
        console.error('🧪 TEST: This appears to be an OpenSSL error with the private key format');
      }
      
      throw uploadError; // re-throw to be caught by outer try/catch
    }
  } catch (error: any) {
    console.error('🧪 TEST ERROR:', error);
    
    // Provide more detailed error info
    const errorInfo = {
      success: false,
      message: "Failed to upload test file",
      error: error.message || "Unknown error",
      code: error.code,
      errorType: error.name,
      stack: error.stack?.split('\n').slice(0, 5),
      // Special info for OpenSSL errors
      opensslError: error.code === 'ERR_OSSL_BN_NO_INVERSE' ? {
        reason: 'OpenSSL private key validation failed',
        suggestion: 'This usually means the private key is not in the correct format. Make sure it has proper newlines.'
      } : undefined
    };
    
    return NextResponse.json(errorInfo, { status: 500 });
  }
} 