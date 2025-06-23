This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google Drive Integration for File Uploads

The application now supports uploading files to Google Drive. To set this up:

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the Google Drive API for this project

2. **Create Service Account Credentials**:
   - In your Google Cloud Project, go to "IAM & Admin" > "Service accounts"
   - Create a new service account
   - Give it a name and description
   - Grant it the "Drive API > Drive File Creator" role
   - Create a JSON key for this service account
   - Download the JSON key file

3. **Create a Shared Google Drive Folder**:
   - Create a folder in Google Drive where files will be uploaded
   - Share this folder with the service account email (found in the JSON key file)
   - Give the service account "Editor" permissions to the folder
   - Copy the folder ID from the folder's URL (the ID is the part after `/folders/` in the URL)

4. **Set Environment Variables**:
   - Open the `.env.local` file
   - Set `GOOGLE_CLIENT_EMAIL` to the service account email from the JSON key
   - Set `GOOGLE_PRIVATE_KEY_FILE` to the private key from the JSON key (including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts)
   - Set `GOOGLE_DRIVE_UPLOAD_FOLDER_ID` to the ID of the shared folder

5. **Testing**:
   - In development mode, if credentials are not set properly, the app will use simulated URLs
   - Once credentials are set, files will be uploaded to Google Drive and the app will use the real Google Drive links
