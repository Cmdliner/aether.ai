import { refreshAccessToken } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        // Attempt to refresh the access token using the refresh token
        const session = await refreshAccessToken();

        if (!session) {
            return NextResponse.json({
                error: true,
                message: "Invalid or expired refresh token"
            }, { status: 401 });
        }

        // Return success response with new session data
        return NextResponse.json({
            success: true,
            message: "Token refreshed successfully",
            session
        });
    } catch (error) {
        console.error("Token refresh error:", error);

        // Return error response
        return NextResponse.json({
            error: true,
            message: "Error refreshing token"
        }, { status: 500 });
    }
}
