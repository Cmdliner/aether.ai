"use client";

import TypingAnimation from "@/components/TypingAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormEvent, HTMLAttributes, useState } from "react";

export default function Login({ className, ...props }: HTMLAttributes<HTMLDivElement>) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: FormEvent) {

        e.preventDefault();

        try {
            const body = JSON.stringify({ email, password });
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body
            });
            const responseData = await res.json(); if (!res.ok) {
                throw new Error(responseData.message || 'Registration failed. Please try again.');
            }            // Show success message
            toast({
                title: "Login Successful",
                description: "You will now be redirected to your dashboard",
                variant: "default",
            });
            
            // No need to manually set the JWT token here as it's handled by the API
            
            // Redirect to dashboard page after a short delay
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);

        } catch (error) {
            console.error("Login error: ", error);
            toast({
                title: "Login Failed",
                description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    }
    return (
        <section className="min-h-screen flex">
            <div className="hidden md:flex flex-col flex-1/2 items-center justify-center text-2xl bg-black text-background text-center">
                <TypingAnimation />
            </div>

            <div className={`flex-1/2 items-center justify-center bg-foreground md:bg-background ${cn("flex flex-col gap-6", className)} `}{...props}>
                <Card className="min-w-sm">
                    <CardHeader>
                        <CardTitle className="mb-4 text-2xl text-bold text-center">
                            Æther | Login
                        </CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="yemi@example.com"
                                        onInput={(e) => setEmail(e.currentTarget.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="/forgot-password"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        onInput={(e) => setPassword(e.currentTarget.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="underline underline-offset-4">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}