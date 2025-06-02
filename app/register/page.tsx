"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TypingAnimation from "@/components/TypingAnimation";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BloodGroupEnum, GenotypeEnum, GenderEnum } from "@/lib/enums";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { accountFormSchema, medicalFormSchema, personalFormSchema, professionalFormSchema } from "@/lib/validations";
import AccountForm from "@/components/register/AccountForm";
import MedicalForm from "@/components/register/MedicalForm";
import PersonalForm from "@/components/register/PersonalForm";
import ProfessionalForm from "@/components/register/ProfessionalForm";

// Convert enums to proper format for form validation
const bloodGroups = Object.values(BloodGroupEnum).filter(value => typeof value === 'string');
const genotypes = Object.values(GenotypeEnum).filter(value => typeof value === 'string');

// function AccountForm({ form, onNext, isTransitioning }: AccountFormProps) {
// 	return (
// 		<div className="space-y-6">
// 			<div className="space-y-4">
				 
// 				<FormField
// 					control={form.control}
// 					name="email"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Email</FormLabel>
// 							<FormControl>
// 								<Input placeholder="example@aether.ai" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="password"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Password</FormLabel>
// 							<FormControl>
// 								<Input type="password" placeholder="********" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="confirm_password"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Confirm Password</FormLabel>
// 							<FormControl>
// 								<Input type="password" placeholder="********" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 			</div>
// 			<Button
// 				type="button"
// 				onClick={onNext}
// 				className="w-full"
// 				disabled={isTransitioning}
// 			>
// 				{isTransitioning ? "Processing..." : "Continue"}
// 			</Button>
// 			<div className="text-center text-sm mt-2">
// 				Already have an account?{" "}
// 				<Link href="/login" className="underline underline-offset-4">
// 					Login
// 				</Link>
// 			</div>
// 		</div>
// 	);
// }

// function PersonalForm({ form, onPrevious, onNext, isTransitioning }: PersonalFormProps & { isTransitioning?: boolean }) {
// 	return (
// 		<div className="space-y-6">
// 			<div className="space-y-4">
// 				<FormField
// 					control={form.control}
// 					name="full_name"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Full Name</FormLabel>
// 							<FormControl>
// 								<Input placeholder="John Doe" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="gender"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Gender</FormLabel>
// 							<FormControl>
// 								<RadioGroup
// 									onValueChange={field.onChange}
// 									defaultValue={field.value}
// 									className="flex space-x-8 mt-2"
// 								>
// 									<div className="flex items-center space-x-2">
// 										<RadioGroupItem value="M" id="male" />
// 										<label htmlFor="male">Male</label>
// 									</div>
// 									<div className="flex items-center space-x-2">
// 										<RadioGroupItem value="F" id="female" />
// 										<label htmlFor="female">Female</label>
// 									</div>
// 								</RadioGroup>
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="dob"
// 					render={({ field }) => (
// 						<FormItem className="flex flex-col">
// 							<FormLabel>Date of birth</FormLabel>
// 							<FormControl>
// 								<DatePicker
// 									value={field.value}
// 									onChange={field.onChange}
// 								/>
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="nationality"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Nationality</FormLabel>
// 							<FormControl>
// 								<Input placeholder="Nigerian" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="current_residence"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Current Residence</FormLabel>
// 							<FormControl>
// 								<Input placeholder="Lagos, Nigeria" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 			</div>
// 			<div className="flex space-x-4">
// 				<Button
// 					type="button"
// 					variant="outline"
// 					onClick={onPrevious}
// 					className="w-full"
// 					disabled={isTransitioning}
// 				>
// 					Previous
// 				</Button>
// 				<Button
// 					type="button"
// 					onClick={onNext}
// 					className="w-full"
// 					disabled={isTransitioning}
// 				>
// 					{isTransitioning ? "Processing..." : "Continue"}
// 				</Button>
// 			</div>
// 		</div>
// 	);
// }

// function ProfessionalForm({ form, onPrevious, onNext, isTransitioning }: ProfessionalFormProps) {
// 	return (
// 		<div className="space-y-6">
// 			<div className="space-y-4">
// 				<FormField
// 					control={form.control}
// 					name="job_title"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Job Title (Optional)</FormLabel>
// 							<FormControl>
// 								<Input placeholder="Software Engineer" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="job_description"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Job Description (Optional)</FormLabel>
// 							<FormControl>
// 								<Input placeholder="Develop and maintain software applications" {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 			</div>
// 			<div className="flex space-x-4">        <Button
// 				type="button"
// 				variant="outline"
// 				onClick={onPrevious}
// 				className="w-full"
// 				disabled={isTransitioning}
// 			>
// 				Previous
// 			</Button>
// 				<Button
// 					type="button"
// 					onClick={onNext}
// 					className="w-full"
// 					disabled={isTransitioning}
// 				>
// 					{isTransitioning ? "Processing..." : "Continue"}
// 				</Button>
// 			</div>
// 		</div>
// 	);
// }

// function MedicalForm({ form, onPrevious, onSubmit, isTransitioning, isLoading }: MedicalFormProps) {
// 	return (
// 		<div className="space-y-6">
// 			<div className="space-y-4">
// 				<FormField
// 					control={form.control}
// 					name="allergies"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Allergies (Optional)</FormLabel>
// 							<FormControl>
// 								<Input placeholder="Peanuts, Seafood, etc." {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="blood_group"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Blood Group (Optional)</FormLabel>
// 							<Select onValueChange={field.onChange} defaultValue={field.value}>
// 								<FormControl>
// 									<SelectTrigger>
// 										<SelectValue placeholder="Select blood group" />
// 									</SelectTrigger>
// 								</FormControl>
// 								<SelectContent>
// 									{bloodGroups.map((group) => (
// 										<SelectItem key={group} value={group}>
// 											{group.replace('_', ' ')}
// 										</SelectItem>
// 									))}
// 								</SelectContent>
// 							</Select>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="genotype"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Genotype (Optional)</FormLabel>
// 							<Select onValueChange={field.onChange} defaultValue={field.value}>
// 								<FormControl>
// 									<SelectTrigger>
// 										<SelectValue placeholder="Select genotype" />
// 									</SelectTrigger>
// 								</FormControl>
// 								<SelectContent>
// 									{genotypes.map((genotype) => (
// 										<SelectItem key={genotype} value={genotype}>
// 											{genotype}
// 										</SelectItem>
// 									))}
// 								</SelectContent>
// 							</Select>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 				<FormField
// 					control={form.control}
// 					name="known_conditions"
// 					render={({ field }) => (
// 						<FormItem>
// 							<FormLabel>Known Medical Conditions (Optional)</FormLabel>
// 							<FormControl>
// 								<Input placeholder="Asthma, Diabetes, etc." {...field} />
// 							</FormControl>
// 							<FormMessage />
// 						</FormItem>
// 					)}
// 				/>
// 			</div>
// 			<div className="flex space-x-4">        <Button
// 				type="button"
// 				variant="outline"
// 				onClick={onPrevious}
// 				className="w-full"
// 				disabled={isTransitioning || isLoading}
// 			>
// 				Previous
// 			</Button><Button
// 				onClick={onSubmit}
// 				className="w-full"
// 				disabled={isTransitioning || isLoading}
// 			>
// 					{isLoading ? "Creating Account..." : "Create Account"}
// 				</Button>
// 			</div>
// 		</div>
// 	);
// }

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
	});  // Form handlers for each step with transition animations
	function onAccountSubmit(data: AccountFormValues) {
		setIsTransitioning(true);
		setFormData(prev => ({ ...prev, ...data }));

		// Short delay for smooth transition
		setTimeout(() => {
			setStep(1);
			setIsTransitioning(false);
		}, 300);
	}

	function onPersonalSubmit(data: PersonalFormValues) {
		setIsTransitioning(true);
		setFormData(prev => ({ ...prev, ...data }));

		// Short delay for smooth transition
		setTimeout(() => {
			setStep(2);
			setIsTransitioning(false);
		}, 300);
	}

	function onProfessionalSubmit(data: ProfessionalFormValues) {
		setIsTransitioning(true);
		setFormData(prev => ({ ...prev, ...data }));

		// Short delay for smooth transition
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

			// Redirect to login page after a short delay
			setTimeout(() => {
				window.location.href = "/login?registered=true";
			}, 1500);
		} catch (error) {
			console.error("Registration error:", error);
			// Show error message to the user
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