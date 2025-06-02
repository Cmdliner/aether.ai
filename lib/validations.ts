import { z } from "zod";

export const RegisterBodyValidtion = z.object({
     email: z.string().email("Invalid email address"),
    gender: z.enum(['M', 'F'], {
        required_error: "Gender is required",
        invalid_type_error: "Gender must be a string",
        // errorMap: (issue, ctx) => {
        //     if (issue.code === "invalid_enum_value") {
        //         return { message: `Gender must be either 'M' (Male) or 'F' (Female)` };
        //     }
        //     return { message: ctx.defaultError };
        // }
    }),
    password: z.string().min(8, "Password must be at least 8 characters long").max(50, "Password must not exceed 50 characters"),
    full_name: z.string().min(3, "Full name must be at least 3 characters long").max(50, "Full name must not exceed 50 characters"),
    nationality: z.string().min(2, "Nationality must be at least 2 characters long").max(20, "Nationality must not exceed 20 characters"),
    dob: z.string()
        .nonempty("Date of birth is required")
        .refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, {
            message: "Please provide a valid date format"
        })
        .refine((date) => {
            const parsedDate = new Date(date);
            return parsedDate <= new Date();
        }, {
            message: "Date of birth cannot be in the future"
        }),
    medical_history: z.object({
        allergies: z.array(z.string()).optional(),
        blood_group: z.enum(['A_POSITIVE', 'B_POSITIVE', 'O_POSITIVE', 'A_NEGATIVE', 'B_NEGATIVE', 'O_NEGATIVE'], {
            errorMap: (issue, ctx) => {
                if (issue.code === "invalid_enum_value") {
                    return { message: "Invalid blood group. Please select a valid option." };
                }
                return { message: ctx.defaultError };
            }
        }).optional(),
        genotype: z.enum(['AA', 'AS', 'SS', 'AC', 'SC'], {
            errorMap: (issue, ctx) => {
                if (issue.code === "invalid_enum_value") {
                    return { message: "Invalid genotype. Please select from AA, AS, SS, AC, or SC." };
                }
                return { message: ctx.defaultError };
            }
        }).optional(),
        known_conditions: z.string().optional()
    }).optional(),
    job_title: z.string().min(3, "Job title must be at least 3 characters long").max(50, "Job title must not exceed 50 characters").optional(),
    job_description: z.string().min(10, "Job description must be at least 10 characters long").max(200, "Job description must not exceed 200 characters").optional(),
    current_residence: z.string().min(3, "Current residence must be at least 3 characters long").max(100, "Current residence must not exceed 100 characters").optional(),
});

// Client-side vslidtions for reister

// Form validation schemas for each step
export const accountFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long")
        .max(50, "Password must not exceed 50 characters"),
    confirm_password: z.string(),
 
}).refine(data => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export const personalFormSchema = z.object({
    full_name: z.string().min(3, "Full name must be at least 3 characters long")
        .max(50, "Full name must not exceed 50 characters"),
    gender: z.enum(["M", "F"], {
        required_error: "Please select your gender",
    }),
    dob: z.date({
        required_error: "Please select your date of birth",
    }),
    nationality: z.string().min(2, "Nationality must be at least 2 characters long")
        .max(20, "Nationality must not exceed 20 characters"),
    current_residence: z.string().min(3, "Current residence must be at least 3 characters long")
        .max(100, "Current residence must not exceed 100 characters"),
});

export const professionalFormSchema = z.object({
    job_title: z.string().min(3, "Job title must be at least 3 characters long")
        .max(50, "Job title must not exceed 50 characters")
        .optional(),
    job_description: z.string().min(10, "Job description must be at least 10 characters long")
        .max(200, "Job description must not exceed 200 characters")
        .optional(),
});

export const medicalFormSchema = z.object({
    allergies: z.string().optional(),
    blood_group: z.string().optional(),
    genotype: z.string().optional(),
    known_conditions: z.string().optional(),
});