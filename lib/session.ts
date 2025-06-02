import { cookies } from 'next/headers';
import { sign, verify } from 'jsonwebtoken';
import 'server-only';
import { User } from '@/models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const EXPIRY_TIME = 60 * 60 * 24 * 7; // in seconds



/**
 * Create a new session by setting a JWT token in a cookie
 */
export async function createSession(data: SessionData) {
    const token = sign(data, JWT_SECRET, { expiresIn: EXPIRY_TIME });

    (await cookies()).set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: EXPIRY_TIME
    });

    return token;
}

/**
 * Validate the session by verifying the JWT token in the cookie
 * Returns the decoded session data or null if invalid
 */
export async function validateSession(): Promise<SessionData | null> {
    try {
        const token = (await cookies()).get('auth_token')?.value;

        if (!token) return null;

        const decoded = verify(token, JWT_SECRET) as SessionData;
        return decoded;

    } catch (error) {
        console.error('Session validation error:', error);
        return null;
    }
}

/**
 * Delete the session by removing the auth cookie
 */
export async function deleteSession() {
    (await cookies()).delete('auth_token');
}

/**
 * Get the current user ID from the session
 */
export async function getCurrentUser(): Promise<IUser | null> {
    const session = await validateSession();

    const user = await User.findById(session?.sub).lean();
    if(!user) return null;

    return user;
}