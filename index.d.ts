import { Document } from 'mongoose';

declare global {
    interface IUser extends Document {
        email: string;
        password: string;
        full_name: string;
        nationality: string;
        gender: 'M' | 'F';
        dob: Date;
        job_title?: string;
        job_description?: string;
        current_residence?: string;
        medical_history?: {
            allergies: string;
            blood_group: string;
            genotype: string;
            known_conditions: string;
        }
    }

    type SessionPayload = {
        sub: string;
        expiresAt: Date;
    }

    // Form Types
    type AccountFormValues = {
        email: string;
        password: string;
        confirm_password: string;
        username: string;
    };

    type PersonalFormValues = {
        full_name: string;
        gender: "M" | "F";
        dob: Date;
        nationality: string;
        current_residence: string;
    };

    type ProfessionalFormValues = {
        job_title?: string;
        job_description?: string;
    };

    type MedicalFormValues = {
        allergies?: string;
        blood_group?: string;
        genotype?: string;
        known_conditions?: string;
    };

    type AccountFormProps = {
        form: ReturnType<typeof useForm<AccountFormValues>>;
        onNext: () => void;
        isTransitioning?: boolean;
    };

    type PersonalFormProps = {
        form: ReturnType<typeof useForm<PersonalFormValues>>;
        onPrevious: () => void;
        onNext: () => void;
    };

    type ProfessionalFormProps = {
        form: ReturnType<typeof useForm<ProfessionalFormValues>>;
        onPrevious: () => void;
        onNext: () => void;
        isTransitioning?: boolean;
    };


    type MedicalFormProps = {
        form: ReturnType<typeof useForm<MedicalFormValues>>;
        onPrevious: () => void;
        onSubmit: () => void;
        isTransitioning?: boolean;
        isLoading?: boolean;
    };
}

// This export {} is needed to make TypeScript treat this file as a module
export { }