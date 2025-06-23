import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToDrive } from "@/app/utils/googleDrive";

// Maximum number of concurrent uploads
const MAX_CONCURRENT_UPLOADS = 3;

/**
 * Handles file uploads and stores them in Google Drive
 */
export async function POST(req: NextRequest) {
  try {
    console.log('📄 Starting file upload API request');
    
    if (!req.body) {
      return NextResponse.json({ 
        success: false, 
        message: "No file data provided" 
      }, { status: 400 });
    }

    const formData = await req.formData();
    
    // Log all field names for debugging
    console.log('📄 Form fields:', Array.from(formData.keys()));
    
    // Try different field names for files
    let files: File[] = [];
    const possibleFieldNames = ['files', 'file', 'ubillFiles', 'documents'];
    
    for (const fieldName of possibleFieldNames) {
      const fieldFiles = formData.getAll(fieldName) as File[];
      if (fieldFiles && fieldFiles.length > 0 && fieldFiles[0] instanceof File) {
        files = fieldFiles;
        console.log(`📄 Found ${fieldFiles.length} files in field: ${fieldName}`);
        break;
      }
    }
    
    if (files.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "No files found in request. Please ensure files are being sent with one of these field names: " + possibleFieldNames.join(', ')
      }, { status: 400 });
    }

    // Get customer name from form data
    const firstName = formData.get('firstName') as string || '';
    const lastName = formData.get('lastName') as string || '';
    const customerName = `${firstName}_${lastName}`.trim().replace(/\s+/g, '_');
    
    // Get current date in YYYYMMDD format
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

    const token = formData.get('token') as string || uuidv4().substring(0, 8);
    console.log(`📄 Processing ${files.length} file(s)`);
    
    // Prepare files for upload with custom filenames
    const preparedFiles = files.map((file, index) => {
      // Create a custom file name with customer name, date, and sequence number
      const fileExt = file.name.split('.').pop() || '';
      const sequenceNum = (index + 1).toString().padStart(2, '0'); // 01, 02, etc.
      const customFileName = customerName 
        ? `${customerName}_${dateStr}_${sequenceNum}.${fileExt}`
        : `upload_${dateStr}_${sequenceNum}_${token}.${fileExt}`;
      
      return {
        file,
        customFileName,
        fileType: file.type || 'application/octet-stream',
      };
    });
    
    // Process files in batches to limit concurrent uploads
    const results = [];
    
    // Use a throttled approach for multiple files
    for (let i = 0; i < preparedFiles.length; i += MAX_CONCURRENT_UPLOADS) {
      const batch = preparedFiles.slice(i, i + MAX_CONCURRENT_UPLOADS);
      
      // Upload batch in parallel
      const batchResults = await Promise.all(
        batch.map(async ({ file, customFileName, fileType }) => {
          try {
            console.log(`📄 Starting upload for file: ${customFileName} (${file.size} bytes)`);
            const startTime = Date.now();
            
            // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

            // Upload to Google Drive
      const { fileId, webViewLink } = await uploadFileToDrive(
              customFileName,
              fileType,
        buffer
      );

            const endTime = Date.now();
            console.log(`📄 Successfully uploaded file: ${customFileName} (ID: ${fileId}) in ${(endTime - startTime)/1000}s`);
            
            return {
        success: true, 
        fileName: customFileName,
        originalName: file.name,
              fileType,
        fileSize: file.size,
              fileId,
              fileUrl: webViewLink,
              isSimulation: fileId.includes('fake-file-id'),
              uploadTime: `${((endTime - startTime)/1000).toFixed(2)}s`
            };
          } catch (error: any) {
            console.error(`📄 Error uploading file ${file.name}:`, error);
            return {
              success: false,
              fileName: file.name,
              error: error.message || 'Upload failed'
            };
          }
        })
      );
      
      results.push(...batchResults);
    }

    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);

    if (successfulUploads.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "All file uploads failed",
        errors: failedUploads.map(f => `${f.fileName}: ${f.error}`)
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully uploaded ${successfulUploads.length} file(s)${failedUploads.length > 0 ? `, ${failedUploads.length} failed` : ''}`,
      files: successfulUploads,
      failedFiles: failedUploads
    });
  } catch (error: any) {
    console.error('📄 File upload error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error during file upload",
      error: error.toString()
    }, { status: 500 });
  }
}

// Helper function for simulated uploads in development
function simulatedUploadResponse(file: File, customFileName: string) {
  const fileId = uuidv4();
  const simulatedId = `fake-file-id-${Date.now()}-${fileId.substring(0, 8)}`;
  const fileUrl = `https://drive.google.com/file/d/${simulatedId}/view`; // Always use the view URL format
  const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${simulatedId}`;
  
  console.log('📄 Returning simulated upload response:', fileUrl);
  
  return NextResponse.json({ 
    success: true, 
    message: "File processed (simulation mode - not actually uploaded)",
    fileUrl: fileUrl,
    directUrl: directDownloadUrl,
    fileId: simulatedId,
    fileName: customFileName,
    originalName: file.name,
    fileType: file.type,
    fileSize: file.size,
    isSimulation: true,
    note: "Using simulation mode - Google Drive upload was not attempted"
  });
} 