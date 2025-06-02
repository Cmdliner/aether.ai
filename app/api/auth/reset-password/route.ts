import dbConnect from "@/lib/config/db.config";
import { OTP } from "@/models/otp.model";
import { User } from "@/models/user.model";
import { hash } from "bcryptjs";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const userId = (await headers()).get("x-user");
        const { password } = await req.json();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: true, message: "User not found" }, { status: 404 });
        }
        user.password = await hash(password, 10);
        await user.save();

        return NextResponse.json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: true, message: "Internal server error" }, { status: 500 })
    }
}