# JWT Authentication in Aether.ai

This document describes the JWT-based authentication system implemented in the Aether.ai application.

## Overview

The authentication system uses JSON Web Tokens (JWTs) with the `jose` package for edge runtime compatibility. It includes:

- Access tokens (short-lived)
- Refresh tokens (longer-lived)
- Edge runtime compatible implementation
- Secure cookie-based storage

## Features

1. **Edge Runtime Compatibility**: All authentication-related code uses the `jose` library instead of `jsonwebtoken` for compatibility with Next.js Edge Runtime.

2. **Token-based Session Management**: Uses access tokens with a short expiry (1 hour) for active sessions and refresh tokens with a longer expiry (1 week) for seamless re-authentication.

3. **HTTP-only Cookies**: Both tokens are stored as HTTP-only cookies for security.

4. **Protected Routes**: Middleware automatically redirects unauthenticated users to the login page.

## Files

- `lib/session.ts`: Core session management functions
- `lib/client-auth.ts`: Client-side authentication utilities
- `middleware.ts`: Route protection implementation
- `app/api/auth/*`: Authentication API endpoints

## Environment Variables

Two secret keys are required:

```env
# For access tokens
JWT_SECRET=your_secure_jwt_secret_key_must_be_at_least_32_chars_long

# For refresh tokens
REFRESH_SECRET=refresh_secret_key_must_be_different_and_secure_32chars_min
```

## Generating Secure Secrets

Use the included utility to generate secure secrets:

```bash
npx ts-node -e "require('./lib/generate-secret').printSecrets()"
```

## Authentication Flow

1. **Login**: User provides credentials and receives both an access token and a refresh token.

2. **Session Validation**: On protected routes, middleware checks for a valid access token.

3. **Token Refresh**: When the access token expires, the refresh token is used to issue a new access token automatically.

4. **Logout**: Both tokens are cleared from cookies.

## Security Considerations

- JWT secrets should be at least 32 characters long and randomly generated
- Different secrets are used for access and refresh tokens
- Tokens are stored in HTTP-only cookies to prevent JavaScript access
- Access tokens expire quickly to minimize the risk of token theft
- Edge runtime compatibility ensures authentication works in all Next.js deployment environments

## Usage Examples

### Server-side Authentication Check

```typescript
import { validateSession } from "@/lib/session";

const session = await validateSession();
if (!session) {
  // User is not authenticated
}
```

### Client-side Authentication Check

```typescript
import { useAuth } from "@/lib/client-auth";

function MyProtectedComponent() {
  const { isLoading, isAuthenticated, user, logout } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;
  
  return (
    <div>
      Welcome {user?.full_name}!
      <button onClick={logout}>Sign out</button>
    </div>
  );
}
```
