import dbConnect from "@/lib/config/db.config";
import { validateSession } from "@/lib/session";
import { UpdateProfileValidationSchema } from "@/lib/validations";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const session = await validateSession();
        if (!session?.sub) return NextResponse.json({ error: true, message: "INVALID_SESSION" }, { status: 403 });

        const user = await User.findById(session.sub).lean();
        if (!user) return NextResponse.json({ success: true, message: "User not found" }, { status: 404 });

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: true, message: "Error finding user profile" }, { status: 500 });
    }
}


export async function PATCH(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();

        const session = await validateSession();
        if (!session?.sub) {
            return NextResponse.json({ error: true, message: "INVALID_SESSION" }, { status: 403 })
        }

        const { success, error, ...parsedBody } = await UpdateProfileValidationSchema.safeParseAsync(body);

        if (!success || !parsedBody.data) {
            return NextResponse.json({ error: true, message: error?.message || 'Invalid input' }, { status: 422 })
        }

        const updatedUser = await User.findByIdAndUpdate(session.sub, parsedBody.data, { new: true }).lean();

        return NextResponse.json({ success: true, user: updatedUser, message: "Profile update successful" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: true, message: "Error updatin user profile" }, { status: 500 });
    }
}