import dbConnect from "@/lib/config/db.config";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { email } = await req.json();

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ error: true, message: "User not found" }, { status: 404 });

        // ! todo => Send email with otp or reset link

        return NextResponse.json({ success: true, message: "An email with details to reset your otp has been sent to you" }, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: true, message: "Internal server error" }, {status: 500});
    }
}