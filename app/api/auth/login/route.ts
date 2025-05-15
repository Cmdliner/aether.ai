import dbConnect from "@/lib/config/db.config";
import { User } from "@/models/user.model";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function login(req: NextRequest) {
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

        // ! todo => create session

        return NextResponse.json({ success: true, message: 'Login successful!' }, { status: 200 });
    } catch (error) {

    }
}