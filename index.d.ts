import { Document, Types } from 'mongoose';
import { actionTypes } from './lib/constants';

declare global {
    interface IUser extends Document {
        _id: Types.ObjectId;
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
        };
        createdAt: Date;
        updatedAt: Date;
    }

    interface IOTP extends Document {
        _id: Types.ObjectId;
        user_id: Types.ObjectId;
        code: string;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
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
    };    // Session
    type SessionData = {
        sub: string;
        email?: string;
        iat?: number; // Issued at timestamp
        exp?: number; // Expiration timestamp
    };

    // use-toast types
    type ToastActionElement = React.ReactElement

    type ToastType = {
        id: string
        title?: React.ReactNode
        description?: React.ReactNode
        action?: ToastActionElement
        variant?: "default" | "destructive"
    }

    type ToasterToast = ToastType & {
        open: boolean
    }


    type ActionType = typeof actionTypes

    type Action =
        | {
            type: ActionType["ADD_TOAST"]
            toast: ToasterToast
        }
        | {
            type: ActionType["UPDATE_TOAST"]
            toast: Partial<ToasterToast> & { id: string }
        }
        | {
            type: ActionType["DISMISS_TOAST"]
            toastId?: string
        }
        | {
            type: ActionType["REMOVE_TOAST"]
            toastId?: string
        }

    interface State {
        toasts: ToasterToast[]
    }

}

// This export {} is needed to make TypeScript treat this file as a module
export { }