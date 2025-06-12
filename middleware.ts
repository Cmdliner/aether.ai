import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';


const getJwtSecret = () => {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || 'your_jwt_secret_key_must_be_at_least_32_chars_long'
  );
};

// Define the algorithm to use
const ALGORITHM = 'HS256';

// Array of protected routes that need authentication
const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Only check authentication for protected routes
    if (protectedRoutes.some(route => path.startsWith(route))) {
        const authToken = req.cookies.get('auth_token')?.value;

        if (!authToken) {
            // No access token, redirect to login
            const url = new URL('/login', req.url);
            url.searchParams.set('from', path);
            return NextResponse.redirect(url);
        }
        
        try {
            // Verify the token with jose
            await jose.jwtVerify(authToken, getJwtSecret(), {
                algorithms: [ALGORITHM]
            });
            // Token is valid, continue
            return NextResponse.next();
        } catch (error) {
            // Token validation failed - could be expired
            // The API routes will handle refresh token automatically
            // Redirect to login for simplicity in the middleware
            console.error("Token validation error:", error);
            const url = new URL('/login', req.url);
            url.searchParams.set('from', path);
            return NextResponse.redirect(url);
        }
    }

    // For public routes, continue normally
    return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/settings/:path*',
    ],
}