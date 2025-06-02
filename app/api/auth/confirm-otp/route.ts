import dbConnect from "@/lib/config/db.config";
import { OTP } from "@/models/otp.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { otp } = await req.json();

        const otpInDb = await OTP.findOne({ code: otp });
        if (!otpInDb) {
            return NextResponse.json({ error: true, message: "Invalid otp!" }, { status: 400 });
        }
        if (Number(otpInDb.expiresAt) > Date.now()) {
            return NextResponse.json({ error: true, message: "Otp expired!" }, { status: 400 });
        }
        if (otpInDb.code !== otp) {
            return NextResponse.json({ error: true, message: "Invalid otp!" }, { status: 400 });
        }

        // todo => set jwt at this point so it cna be used for reset
        // const access_token = await jwt.sign({sub: otpInDb.user_id})

        return NextResponse.json({ success: true, message: "Otp matched" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: true, message: "Internal server error" }, { status: 500 })
    }
}