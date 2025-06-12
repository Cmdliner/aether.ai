import { cookies } from 'next/headers';
import * as jose from 'jose';
import 'server-only';
import { User } from '@/models/user.model';
import dbConnect from './config/db.config';

// Secret key for JWT signing (in a real app, use a secure env variable)

const getJwtSecret = () => {
    return new TextEncoder().encode(
        process.env.JWT_SECRET || 'your_jwt_secret_key_must_be_at_least_32_chars_long'
    );
};

// Secret for refresh tokens should be different from the main JWT secret
const getRefreshSecret = () => {
    return new TextEncoder().encode(process.env.REFRESH_SECRET);
};

// Token expiry times
const ACCESS_TOKEN_EXPIRY = 60 * 60; // 1 hour in seconds
const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 1 week in seconds

// Define the algorithm to use
const ALGORITHM = 'HS256';

/**
 * Create a new session by setting a JWT token in a cookie
 */
export async function createSession(data: SessionData): Promise<string> {
    // Create JWT payload - only include the required fields
    const payload: Record<string, any> = {
        sub: data.sub
    };

    // Add optional fields if they exist
    if (data.email) {
        payload.email = data.email;
    }

    // Create access token with jose
    const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: ALGORITHM })
        .setIssuedAt()
        .setExpirationTime(`${ACCESS_TOKEN_EXPIRY}s`)
        .sign(getJwtSecret());

    // Create refresh token with jose (longer expiry)
    const refreshToken = await new jose.SignJWT({
        sub: data.sub,
        type: 'refresh'
    })
        .setProtectedHeader({ alg: ALGORITHM })
        .setIssuedAt()
        .setExpirationTime(`${REFRESH_TOKEN_EXPIRY}s`)
        .sign(getRefreshSecret());

    const cookieStore = await cookies();

    // Set access token cookie
    cookieStore.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: ACCESS_TOKEN_EXPIRY
    });

    // Set refresh token cookie
    cookieStore.set({
        name: 'refresh_token',
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: REFRESH_TOKEN_EXPIRY
    });

    return token;
}

/**
 * Validate the session by verifying the JWT token in the cookie
 * Returns the decoded session data or null if invalid
 */
export async function validateSession(): Promise<SessionData | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            // Try to use refresh token to generate a new access token
            return await refreshAccessToken();
        }

        // Verify and decode the token with jose
        const { payload } = await jose.jwtVerify(token, getJwtSecret(), {
            algorithms: [ALGORITHM]
        });

        return payload as SessionData;

    } catch (error) {
        console.error('Session validation error:', error);
        // Try refreshing the token if validation fails (could be expired)
        return await refreshAccessToken();
    }
}

/**
 * Refresh the access token using the refresh token
 * Returns the new session data or null if invalid/not available
 */
export async function refreshAccessToken(): Promise<SessionData | null> {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;

        if (!refreshToken) return null;

        // Verify the refresh token
        const { payload } = await jose.jwtVerify(refreshToken, getRefreshSecret(), {
            algorithms: [ALGORITHM]
        });

        // Check if it's actually a refresh token
        if (payload.type !== 'refresh') return null;

        // Create a new access token
        const user = await User.findById(payload.sub).lean();
        if (!user) return null;

        // Generate new access token
        const newAccessToken = await new jose.SignJWT({
            sub: payload.sub,
            email: user.email
        })
            .setProtectedHeader({ alg: ALGORITHM })
            .setIssuedAt()
            .setExpirationTime(`${ACCESS_TOKEN_EXPIRY}s`)
            .sign(getJwtSecret());

        // Set the new access token
        cookieStore.set({
            name: 'auth_token',
            value: newAccessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: ACCESS_TOKEN_EXPIRY
        });

        // Return the new session data
        return {
            sub: payload.sub as string,
            email: user.email
        };
    } catch (error) {
        console.error('Refresh token error:', error);
        return null;
    }
}

/**
 * Delete the session by removing the auth cookies
 */
export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    cookieStore.delete('refresh_token');
}

/**
 * Get the current user ID from the session
 */
export async function getCurrentUser(): Promise<any | null> {
    const session = await validateSession();

    if (!session?.sub) return null;

    try {
        const user = await User.findById(session.sub).lean();
        if (!user) return null;

        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}