"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Validates the user's session on the client side
 * @returns An object containing session data and user data if valid
 */
export async function validateClientSession() {
    try {
        const res = await fetch("/api/auth/validate-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!res.ok) {
            return { session: null, user: null };
        }

        return await res.json();
    } catch (error) {
        console.error("Client session validation error:", error);
        return { session: null, user: null };
    }
}

/**
 * Refreshes the access token using the refresh token
 * @returns An object with the new session if successful
 */
export async function refreshToken() {
    try {
        const res = await fetch("/api/auth/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!res.ok) {
            return { success: false, session: null };
        }

        const data = await res.json();
        return { success: true, session: data.session };
    } catch (error) {
        console.error("Token refresh error:", error);
        return { success: false, session: null };
    }
}

/**
 * Logs out the user by calling the logout API and clearing the session
 * @returns A promise that resolves to true if logout was successful
 */
export async function logoutClient(): Promise<boolean> {
    try {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });

        return res.ok;
    } catch (error) {
        console.error("Logout error:", error);
        return false;
    }
}

/**
 * Custom React hook for authentication state
 * @returns An object containing authentication state and functions
 */
export function useAuth() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            // First try with the regular session
            let { session, user } = await validateClientSession();

            // If no session but might have a refresh token, try refreshing
            if (!session) {
                const refreshResult = await refreshToken();
                if (refreshResult.success) {
                    // Re-validate session after refresh
                    ({ session, user } = await validateClientSession());
                }
            }

            setIsAuthenticated(!!session);
            setUser(user);
            setIsLoading(false);
        }

        checkAuth();
    }, []);

    const logout = async () => {
        const success = await logoutClient();
        if (success) {
            setIsAuthenticated(false);
            setUser(null);
            router.push('/login');
        }
    };

    return {
        isLoading,
        isAuthenticated,
        user,
        logout
    };
}



