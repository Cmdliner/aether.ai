import { deleteSession } from "@/lib/session";
import { NextResponse } from "next/server";



export async function POST() {
  try {
    // Delete the session
    await deleteSession();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    
    // Return error response
    return NextResponse.json({
      error: true,
      message: "Error during logout"
    }, { status: 500 });
  }
}
