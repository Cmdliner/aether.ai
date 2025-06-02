import { validateSession } from "@/lib/session";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await validateSession();
        if (!session) return NextResponse.json({ session }, { status: 403 });

        const { sub } = session;
        const user = await User.findById(sub).lean();
        if (!user) return NextResponse.json({ session: null, user }, { status: 403 })

        return NextResponse.json({ session, user }, { status: 200 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: true, session: null }, { status: 403 })
    }
}