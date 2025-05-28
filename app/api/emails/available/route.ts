import dbConnect from "@/lib/config/db.config";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { email }: { email: string } = await req.json();

        //  !todo => Perform email validation

        const is_available = !(await User.exists({ email }));
        return NextResponse.json({ success: true, is_available }, { status: 200 })
    } catch (error) {
        console.error
        return NextResponse.json({
            error: true,
            message: 'Oops!C We could not determine email availability for this email',
            is_available: false
        }, { status: 500 })

    }
}