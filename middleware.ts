import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';


const getJwtSecret = () => {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || 'your_jwt_secret_key_must_be_at_least_32_chars_long'
  );
};

const ALGORITHM = 'HS256';

const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    if (protectedRoutes.some(route => path.startsWith(route))) {
        const authToken = req.cookies.get('auth_token')?.value;

        if (!authToken) {
            const url = new URL('/login', req.url);
            url.searchParams.set('from', path);
            return NextResponse.redirect(url);
        }
        
        try {
            await jose.jwtVerify(authToken, getJwtSecret(), {
                algorithms: [ALGORITHM]
            });
            return NextResponse.next();
        } catch (error) {
            console.error("Token validation error:", error);
            const url = new URL('/login', req.url);
            url.searchParams.set('from', path);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/settings/:path*',
    ],
}