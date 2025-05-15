import dbConnect from "@/lib/config/db.config";
import { handleMongoUniqueError } from "@/lib/utils";
import { User } from "@/models/user.model";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { username, email, password } = await req.json();

        await dbConnect();

        const hashedPassword = await hash(password, 10);
        await User.create({ username, email, password: hashedPassword });
        return NextResponse.json({ success: true, message: 'User registered successfully' }, { status: 201 })
    } catch (error: any) {
        handleMongoUniqueError(error);
        return NextResponse.json({ error: true, message: 'Error creating user' }, { status: 500 });
    }
}