import dbConnect from "@/lib/config/db.config";
import { createSession } from "@/lib/session";
import { User } from "@/models/user.model";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ error: true, message: 'Invalid email or password' }, {
            status: 403
        });

        const passwordsMatch = await compare(password, user.password);
        if (!passwordsMatch) return NextResponse.json({ error: true, message: 'Invalid email or password' }, {
            status: 403
        });

        // Create JWT session
        await createSession({
            sub: user._id.toString()
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Login successful!',
            user: {
                _id: user._id,
                full_name: user.full_name
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ 
            error: true, 
            message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }, { status: 500 });
    }
}