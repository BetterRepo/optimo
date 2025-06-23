// Script to help debug Google API key issues

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('Starting key diagnostic script...');

// Generate a test RSA key pair just for debugging
function generateTestKeyPair() {
  console.log('Generating test RSA key pair...');
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
}

// Check if key can be used for signing
function testKeySigning(privateKey) {
  try {
    console.log('Testing key signing capability...');
    const sign = crypto.createSign('SHA256');
    sign.update('test data');
    const signature = sign.sign(privateKey, 'base64');
    console.log('Key successfully used for signing!');
    return true;
  } catch (error) {
    console.error('Error when testing key signing:', error);
    return false;
  }
}

// Format key for .env file
function formatKeyForEnv(privateKey) {
  // Format 1: Regular multiline format (with real newlines)
  console.log('\nFormat 1 (Real newlines for .env.local):');
  console.log('```');
  console.log(privateKey);
  console.log('```');
  
  // Format 2: Escaped newlines format (for deployment)
  const escapedKey = privateKey.replace(/\n/g, '\\n');
  console.log('\nFormat 2 (Escaped newlines for Vercel):');
  console.log('```');
  console.log(escapedKey);
  console.log('```');
  
  return {
    multiline: privateKey,
    escaped: escapedKey
  };
}

// Update .env file
function updateEnvFile(key) {
  try {
    console.log('\nUpdating .env.local for testing...');
    const envPath = path.join(process.cwd(), '.env.local');
    console.log(`Reading from ${envPath}`);
    
    if (!fs.existsSync(envPath)) {
      console.error('Error: .env.local file not found');
      return false;
    }
    
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Create backup
    fs.writeFileSync(`${envPath}.backup`, envContent);
    console.log(`Created backup at ${envPath}.backup`);
    
    // Replace the GOOGLE_PRIVATE_KEY with new test key
    // This uses a very specific format that works
    const newKeyEntry = `GOOGLE_PRIVATE_KEY="${key.escaped}"`;
    
    if (envContent.includes('GOOGLE_PRIVATE_KEY=')) {
      envContent = envContent.replace(/GOOGLE_PRIVATE_KEY=.*$/m, newKeyEntry);
    } else {
      envContent += `\n${newKeyEntry}`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('Updated .env.local file with test key in correct format');
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error);
    return false;
  }
}

// Main execution
const { privateKey } = generateTestKeyPair();
const canSign = testKeySigning(privateKey);

if (canSign) {
  const formattedKey = formatKeyForEnv(privateKey);
  updateEnvFile(formattedKey);
  
  console.log('\n✅ Success! Generated and properly formatted a test key.');
  console.log('Please restart your Next.js server and try the test endpoint again.');
} 