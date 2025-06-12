import dbConnect from "@/lib/config/db.config";
import { handleMongoUniqueError } from "@/lib/utils";
import { RegisterBodyValidation } from "@/lib/validations";
import { User } from "@/models/user.model";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {
              email, password, full_name,
            dob, gender, nationality, job_title, job_description,
            current_residence
        } = await req.json();

        await dbConnect();

        const { success, error, ...parsedBody} = await RegisterBodyValidation.safeParseAsync({
               email, password, full_name,
            dob, gender, nationality, job_title, job_description,
            current_residence
        });

        if( !success || !parsedBody.data ) {
            console.error('Validation error:', error); 
            return NextResponse.json({ error: true, message: error?.message || 'Invalid input' }, { status: 400 });
        }   
         parsedBody.data.password  = await hash(parsedBody.data.password, 10);
         console.table(parsedBody.data);
        await User.create(parsedBody.data);
        return NextResponse.json({ success: true, message: 'User registered successfully' }, { status: 201 })
    } catch (error: any) {
        console.error(error);
        handleMongoUniqueError(error);
        return NextResponse.json({ error: true, message: 'Error creating user' }, { status: 500 });
    }
}