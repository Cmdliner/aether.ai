"use client";

import AccountForm from "@/components/register/AccountForm";
import MedicalForm from "@/components/register/MedicalForm";
import PersonalForm from "@/components/register/PersonalForm";
import ProfessionalForm from "@/components/register/ProfessionalForm";
import TypingAnimation from "@/components/TypingAnimation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Stepper } from "@/components/ui/stepper";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { accountFormSchema, medicalFormSchema, personalFormSchema, professionalFormSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Register() {
	const [step, setStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [formData, setFormData] = useState<
		Partial<AccountFormValues & PersonalFormValues & ProfessionalFormValues & MedicalFormValues>
	>({});

	const steps = [
		{ title: "Account", description: "Create your account" },
		{ title: "Personal", description: "Personal information" },
		{ title: "Professional", description: "Job details" },
		{ title: "Medical", description: "Optional medical information" },
	];

	// Account form
	const accountForm = useForm({
		resolver: zodResolver(accountFormSchema),
		defaultValues: {
 			email: "",
			password: "",
			confirm_password: "",
		},
	});

	// Personal form
	const personalForm = useForm({
		resolver: zodResolver(personalFormSchema),
		defaultValues: {
			full_name: "",
			gender: undefined,
			dob: undefined,
			nationality: "",
			current_residence: "",
		},
	});

	// Professional form
	const professionalForm = useForm({
		resolver: zodResolver(professionalFormSchema),
		defaultValues: {
			job_title: "",
			job_description: "",
		},
	});

	// Medical form
	const medicalForm = useForm({
		resolver: zodResolver(medicalFormSchema),
		defaultValues: {
			allergies: "",
			blood_group: "",
			genotype: "",
			known_conditions: "",
		},
	});  
	// Form handlers for each step with transition animations
	function onAccountSubmit(data: AccountFormValues) {
		setIsTransitioning(true);
		setFormData(prev => ({ ...prev, ...data }));

		setTimeout(() => {
			setStep(1);
			setIsTransitioning(false);
		}, 300);
	}

	function onPersonalSubmit(data: PersonalFormValues) {
		setIsTransitioning(true);
		setFormData(prev => ({ ...prev, ...data }));

		setTimeout(() => {
			setStep(2);
			setIsTransitioning(false);
		}, 300);
	}

	function onProfessionalSubmit(data: ProfessionalFormValues) {
		setIsTransitioning(true);
		setFormData(prev => ({ ...prev, ...data }));

		setTimeout(() => {
			setStep(3);
			setIsTransitioning(false);
		}, 300);
	}
	async function onMedicalSubmit(data: MedicalFormValues) {
		setIsLoading(true);

		try {
			const finalData = {
				...formData,
				...data,
				medical_history: {
					allergies: data.allergies ? data.allergies.split(',').map(a => a.trim()) : [],
					blood_group: data.blood_group,
					genotype: data.genotype,
					known_conditions: data.known_conditions,
				}
			};

			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(finalData),
			});

			const responseData = await response.json(); if (!response.ok) {
				throw new Error(responseData.message || 'Registration failed. Please try again.');
			}

			// Show success message
			toast({
				title: "Registration Successful",
				description: "Your account has been created. You can now login.",
				variant: "default",
			});

			setTimeout(() => {
				window.location.href = "/login?registered=true";
			}, 1500);
		} catch (error) {
			console.error("Registration error:", error);
			toast({
				title: "Registration Failed",
				description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<section className="min-h-screen flex">
			<div className="hidden md:flex flex-col flex-1/2 items-center justify-center text-2xl bg-black text-background">
				<TypingAnimation />
			</div>

			<div className="flex flex-1/2 items-center justify-center p-6 md:p-8">
				<div className="w-full max-w-md">
					<Card className="border-none shadow-lg">
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-center">
								Register | Æther
							</CardTitle>
							<CardDescription className="text-center mb-2">
								Create your account to get started
							</CardDescription>

							<div className="px-4 py-2 bg-muted/50 rounded-lg">
								<Stepper steps={steps} currentStep={step} loading={isLoading} className="my-4" />
							</div>
						</CardHeader>            <CardContent className={cn("transition-opacity duration-300",
							isTransitioning ? "opacity-0" : "opacity-100")}>
							{step === 0 && (
								<Form {...accountForm}>
									<form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-4">
										<AccountForm
											form={accountForm}
											onNext={accountForm.handleSubmit(onAccountSubmit)}
											isTransitioning={isTransitioning}
										/>
									</form>
								</Form>
							)}

							{step === 1 && (
								<Form {...personalForm}>
									<form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-4">
										<PersonalForm
											form={personalForm}
											onPrevious={() => {
												setIsTransitioning(true);
												setTimeout(() => {
													setStep(0);
													setIsTransitioning(false);
												}, 300);
											}}
											onNext={personalForm.handleSubmit(onPersonalSubmit)}
											isTransitioning={isTransitioning}
										/>
									</form>
								</Form>
							)}

							{step === 2 && (
								<Form {...professionalForm}>
									<form onSubmit={professionalForm.handleSubmit(onProfessionalSubmit)} className="space-y-4">
										<ProfessionalForm
											form={professionalForm}
											onPrevious={() => {
												setIsTransitioning(true);
												setTimeout(() => {
													setStep(1);
													setIsTransitioning(false);
												}, 300);
											}}
											onNext={professionalForm.handleSubmit(onProfessionalSubmit)}
											isTransitioning={isTransitioning}
										/>
									</form>
								</Form>
							)}

							{step === 3 && (
								<Form {...medicalForm}>
									<form onSubmit={medicalForm.handleSubmit(onMedicalSubmit)} className="space-y-4">
										<MedicalForm
											form={medicalForm}
											onPrevious={() => {
												setIsTransitioning(true);
												setTimeout(() => {
													setStep(2);
													setIsTransitioning(false);
												}, 300);
											}}
											onSubmit={medicalForm.handleSubmit(onMedicalSubmit)}
											isTransitioning={isTransitioning}
											isLoading={isLoading}
										/>
									</form>
								</Form>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}