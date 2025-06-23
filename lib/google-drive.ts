import { google } from 'googleapis';

interface UploadParams {
  file: File;
  fileName: string;
  mimeType: string;
  folderId: string;
}

export async function uploadToGoogleDrive({ file, fileName, mimeType, folderId }: UploadParams) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType,
    body: file,
  };

  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    return { success: true, fileId: response.data.id };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    return { success: false, error };
  }
} 