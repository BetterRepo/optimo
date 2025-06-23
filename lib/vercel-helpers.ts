/**
 * Helper functions for Vercel deployment
 */

/**
 * Checks if a given environment variable is set and logs warnings if not
 * @param variable Environment variable name
 * @returns True if the variable is set, false otherwise
 */
export function checkEnvVariable(variable: string): boolean {
  const value = process.env[variable];
  if (!value) {
    console.warn(`⚠️ Environment variable ${variable} is not set`);
    return false;
  }
  return true;
}

/**
 * Fix multiline environment variables by converting escaped newlines to actual newlines.
 * This is crucial for private keys which must have proper line breaks.
 * 
 * @param envVar The environment variable containing escaped newlines
 * @returns The fixed string with proper newlines
 */
export function fixMultilineEnvVar(envVar: string | undefined): string | undefined {
  if (!envVar) return undefined;
  
  // Log without exposing the actual value
  console.log(`🔧 Fixing multiline env var: length=${envVar.length}, contains \\n=${envVar.includes('\\n')}`);
  
  // Check if the string contains escaped newlines that need replacing
  if (envVar.includes('\\n')) {
    console.log('🔧 Converting escaped newlines to actual newlines');
    // Replace all escaped newlines with actual newlines
    const fixed = envVar.replace(/\\n/g, '\n');
    console.log(`🔧 After fixing: length=${fixed.length}, contains actual newlines=${fixed.includes('\n')}`);
    return fixed;
  }
  
  // If it already contains real newlines, or none at all, return as is
  return envVar;
}

/**
 * Verifies if a private key is in the correct format for OpenSSL
 * @param privateKey The private key string to validate
 * @returns Object with validation results
 */
export function validatePrivateKey(privateKey: string | undefined): { 
  valid: boolean; 
  issues: string[];
} {
  const issues: string[] = [];
  
  if (!privateKey) {
    issues.push('Private key is undefined');
    return { valid: false, issues };
  }
  
  // Check for correct header and footer
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    issues.push('Missing header: -----BEGIN PRIVATE KEY-----');
  }
  
  if (!privateKey.includes('-----END PRIVATE KEY-----')) {
    issues.push('Missing footer: -----END PRIVATE KEY-----');
  }
  
  // Check for actual newlines between header and content
  if (!privateKey.includes('\n')) {
    issues.push('No actual newlines found in private key');
  }
  
  // Private keys are typically 1500+ characters long
  if (privateKey.length < 1000) {
    issues.push(`Private key seems too short: ${privateKey.length} chars`);
  }
  
  return { 
    valid: issues.length === 0,
    issues
  };
}

/**
 * Check if all required Google Drive API environment variables are set
 */
export function checkGoogleDriveConfig(): boolean {
  console.log('🔧 Checking Google Drive configuration...');
  
  const hasClientEmail = checkEnvVariable('GOOGLE_CLIENT_EMAIL');
  const hasPrivateKey = checkEnvVariable('GOOGLE_PRIVATE_KEY');
  const hasFolderId = checkEnvVariable('GOOGLE_DRIVE_UPLOAD_FOLDER_ID');
  
  if (hasPrivateKey) {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const validation = validatePrivateKey(privateKey);
    
    if (!validation.valid) {
      console.warn('⚠️ Private key validation issues:', validation.issues);
      
      // If using escaped newlines, try to fix them
      if (privateKey?.includes('\\n')) {
        const fixed = fixMultilineEnvVar(privateKey);
        const fixedValidation = validatePrivateKey(fixed);
        console.log(`🔧 After fixing: Valid=${fixedValidation.valid}`);
        
        if (!fixedValidation.valid) {
          console.warn('⚠️ Private key still invalid after fixing:', fixedValidation.issues);
        }
      }
    } else {
      console.log('✅ Private key format is valid');
    }
  }
  
  return hasClientEmail && hasPrivateKey && hasFolderId;
} 