import { google } from 'googleapis';
import { checkEnvVariable, fixMultilineEnvVar } from '@/lib/vercel-helpers';
import { Readable } from 'stream';

// Convert Buffer to a Readable Stream that googleapis can use
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable.push(buffer);   // Add the buffer content to the stream
  readable.push(null);     // Signal the end of the stream
  return readable;
}

// Initialize Google Drive API client
export const getDriveService = () => {
  try {
    const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const PRIVATE_KEY_RAW = process.env.GOOGLE_PRIVATE_KEY;
    const PRIVATE_KEY = fixMultilineEnvVar(PRIVATE_KEY_RAW);
    const SCOPE = ['https://www.googleapis.com/auth/drive'];

    if (!CLIENT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Google Drive API credentials not found in environment variables');
    }

    const auth = new google.auth.JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY,
      scopes: SCOPE,
    });

    // Set connection pooling options
    const drive = google.drive({ 
      version: 'v3', 
      auth,
      // Enable higher timeout for large files
      timeout: 120000 // 2 minutes
    });

    return drive;
  } catch (error: any) {
    throw error;
  }
};

// Upload a file to Google Drive
export const uploadFileToDrive = async (
  fileName: string,
  mimeType: string,
  fileBuffer: Buffer
): Promise<{ fileId: string; webViewLink: string }> => {
  try {
    const drive = getDriveService();
    const folderId = process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID;

    if (!folderId) {
      throw new Error('Google Drive folder ID not found in environment variables');
    }

    const fileStream = bufferToStream(fileBuffer);
    
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: mimeType,
        parents: [folderId],
      },
      media: {
        mimeType: mimeType,
        body: fileStream,
      },
      fields: 'id, webViewLink',
    });

    if (!response.data.id) {
      throw new Error('Failed to upload file to Google Drive: No file ID returned');
    }

    // Make the file viewable by anyone with the link
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Share with specified email if provided
    const shareWithEmail = process.env.GOOGLE_SHARE_WITH_EMAIL;
    if (shareWithEmail) {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: shareWithEmail
        },
        fields: 'id',
      });
    }

    const webViewLink = response.data.webViewLink || 
      `https://drive.google.com/file/d/${response.data.id}/view`;
    
    return {
      fileId: response.data.id,
      webViewLink
    };
  } catch (error: any) {
    throw error;
  }
};

// Simulate a Drive upload for development
function simulateDriveUpload(fileName: string) {
  const fileId = `fake-file-id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const webViewLink = `https://drive.google.com/file/d/${fileId}/view`;
  console.log(`⚠️ SIMULATED UPLOAD - File ID: ${fileId}, File Name: ${fileName}`);
  console.log(`⚠️ SIMULATED VIEW LINK: ${webViewLink}`);
  return {
    fileId,
    webViewLink
  };
} 