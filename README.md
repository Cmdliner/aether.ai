# Aether.ai

Aether.ai is a Next.js-based healthcare platform featuring secure authentication and AI-powered medical test recommendations. It uses JWT for session management and integrates Google Generative AI for personalized lab test suggestions.

---

## Features

- **JWT Authentication**: Secure login, registration, session validation, password reset, and logout using HTTP-only cookies and edge-compatible JWTs.
- **AI Test Recommendation**: Suggests relevant medical lab tests based on user symptoms and demographics using Google GenAI.
- **Profile Management**: Users can view and update their health profile.
- **Email Availability**: Check if an email is available during registration.

---

## Directory Structure

- `app/` — Next.js app directory (pages, layouts, API routes)
- `components/` — Reusable UI and feature components
  - `dashboard/` — Dashboard widgets and cards
  - `register/` — Multi-step registration forms
  - `test-recommendation/` — AI-powered test recommendation form
  - `ui/` — Custom UI library (form, button, card, calendar, toast, etc.)
- `hooks/` — Custom React hooks (form field, toast)
- `lib/` — Core logic, utilities, validation, session, AI, and types
  - `config/` — Database and AI configuration
  - `types/` — Shared TypeScript types
- `models/` — Mongoose models for database entities (User, OTP)
- `public/` — Static assets

---

## How It Works

- **User Registration**: Multi-step form collects account, personal, medical, and professional data, validates, and creates a user in the database.
- **Authentication**: JWT-based, edge-compatible, secure cookies, refresh logic, and session validation. Protected routes enforced by middleware.
- **Dashboard**: Personalized dashboard displays health info, upcoming appointments, recent activity, pending test results, and quick actions.
- **Appointments**: Users can view, schedule, and manage appointments from the dashboard.
- **History**: Users can access historical medical data and previous appointments.
- **Test Recommendation**: AI analyzes symptoms and demographics, returns lab test suggestions, and explains reasoning. Fallback logic provides safe, generic recommendations if AI is unavailable.
- **Profile Management**: Users can view and update their health and personal info.
- **Security**: All sensitive routes are protected by middleware and session checks. Tokens are stored in HTTP-only cookies and expire quickly for safety.

---

## API Endpoints

### Auth Endpoints (`/api/auth/*`)
- `POST /api/auth/login` — Login with email and password.
- `POST /api/auth/register` — Register a new user (name, email, password, DOB, gender, nationality, job info, residence).
- `POST /api/auth/forgot-password` — Request password reset (sends email/OTP).
- `POST /api/auth/confirm-otp` — Confirm OTP for password reset.
- `POST /api/auth/reset-password` — Reset password (requires valid OTP).
- `POST /api/auth/validate-session` — Validate current session and get user info.
- `POST /api/auth/logout` — Logout and clear session cookies.
- `POST /api/auth/refresh-token` — Refresh access token using refresh token.

### Profile Endpoints
- `GET /api/profile` — Get current user profile (requires valid session).
- `PATCH /api/profile` — Update user profile (requires valid session).

### Email Endpoints
- `GET /api/emails/available` — Check if an email is available for registration.

### AI Test Recommendation
- `POST /api/tests/recommend` — Get recommended medical lab tests based on symptoms and demographics. Uses Google GenAI. Returns JSON with recommended tests, reasons, notes, and disclaimer. Fallbacks to generic tests if AI is unavailable.

---

## AI Test Recommendation Flow
- User submits symptoms (and optionally age, gender, race, location).
- API generates a prompt for Google GenAI to suggest lab tests.
- Response includes:
  - `recommended_tests`: Array of tests with reasons and notes.
  - `disclaimer`: AI-generated suggestions are informational only.
  - `fallback`: True if generic fallback is used due to AI issues.

---

## Authentication System

Aether.ai uses JSON Web Tokens (JWTs) with the `jose` package for edge runtime compatibility. It includes:
- Access tokens (short-lived)
- Refresh tokens (longer-lived)
- Secure cookie-based storage

### Features
1. **Edge Runtime Compatibility**: All authentication-related code uses the `jose` library instead of `jsonwebtoken` for compatibility with Next.js Edge Runtime.
2. **Token-based Session Management**: Uses access tokens with a short expiry (1 hour) for active sessions and refresh tokens with a longer expiry (1 week) for seamless re-authentication.
3. **HTTP-only Cookies**: Both tokens are stored as HTTP-only cookies for security.
4. **Protected Routes**: Middleware automatically redirects unauthenticated users to the login page.

### Core Files
- `lib/session.ts`: Core session management functions
- `lib/client-auth.ts`: Client-side authentication utilities
- `middleware.ts`: Route protection implementation
- `app/api/auth/*`: Authentication API endpoints

### Authentication Flow
1. **Login**: User provides credentials and receives both an access token and a refresh token.
2. **Session Validation**: On protected routes, middleware checks for a valid access token.
3. **Token Refresh**: When the access token expires, the refresh token is used to issue a new access token automatically.
4. **Logout**: Both tokens are cleared from cookies.

### Security Considerations
- JWT secrets should be at least 32 characters long and randomly generated
- Different secrets are used for access and refresh tokens
- Tokens are stored in HTTP-only cookies to prevent JavaScript access
- Access tokens expire quickly to minimize the risk of token theft
- Edge runtime compatibility ensures authentication works in all Next.js deployment environments

### Usage Examples

#### Server-side Authentication Check
```typescript
import { validateSession } from "@/lib/session";

const session = await validateSession();
if (!session) {
  // User is not authenticated
}
```

#### Client-side Authentication Check
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

---

## Environment Variables

Set these in your `.env` file:
```env
JWT_SECRET=your_secure_jwt_secret_key_must_be_at_least_32_chars_long
REFRESH_SECRET=refresh_secret_key_must_be_different_and_secure_32chars_min
GOOGLE_AI_API_KEY=your_google_genai_api_key
```

To generate secure secrets:
```bash
npx ts-node -e "require('./lib/generate-secret').printSecrets()"
```

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Google GenAI](https://ai.google.dev/)

---

## Disclaimer

AI-generated test recommendations are for informational purposes only. Always consult a certified healthcare provider for medical advice or diagnosis.