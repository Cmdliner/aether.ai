/**
 * A utility to generate a secure random string suitable for JWT secrets
 * This file should only be used by developers during setup
 * The generated secrets should be added to the environment variables
 */

import crypto from 'crypto';

/**
 * Generates a cryptographically secure random string
 * @param length The length of the string to generate (default: 64)
 * @returns A secure random string
 */
export function generateSecureSecret(length: number = 64): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Command line tool to generate secrets
 * Run with: npx ts-node -e "require('./lib/generate-secret').printSecrets()"
 */
export function printSecrets(): void {
  console.log('Generated JWT_SECRET (for access tokens):');
  console.log(generateSecureSecret());
  console.log('\nGenerated REFRESH_SECRET (for refresh tokens):');
  console.log(generateSecureSecret());
  console.log('\nAdd these to your .env.local file');
}

// If this script is run directly
if (require.main === module) {
  printSecrets();
}
