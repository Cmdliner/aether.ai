import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { validateSession } from "./lib/session";

// JWT secret key - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

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
        console.log({ authToken });

        if (!authToken) {
            console.log("Auth absent")
            const url = new URL('/login', req.url);
            url.searchParams.set('from', path);
            return NextResponse.redirect(url);
        }

        try {
            const authToken = req.cookies.get("auth_token")?.value;
            if(!authToken) throw new Error("Invalid session")
            return NextResponse.next();
        } catch (error) {
            // Token is invalid, redirect to login
            console.error(error)
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