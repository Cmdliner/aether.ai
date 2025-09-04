"use client";

import TypingAnimation from "@/components/TypingAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Login() {

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
        <section className="min-h-screen w-full flex flex-col md:flex-row">
            {/* Left side: black background, only visible on desktop */}
            <div className="hidden md:flex w-1/2 min-h-screen items-center justify-center bg-black text-background">
                <TypingAnimation />
            </div>

            {/* Right side: light background, full width on mobile, half on desktop */}
            <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center bg-background p-4 md:p-8">
                <Card className="w-full max-w-md shadow-lg border-none">
                    <CardHeader>
                        <CardTitle className="mb-2 text-2xl font-bold text-center">
                            Æther | Login
                        </CardTitle>
                        <CardDescription className="text-center text-base">
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="yemi@example.com"
                                        onInput={(e) => setEmail(e.currentTarget.value)}
                                        required
                                        className="text-base px-3 py-2"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="/forgot-password"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        onInput={(e) => setPassword(e.currentTarget.value)}
                                        required
                                        className="text-base px-3 py-2"
                                    />
                                </div>
                                <Button type="submit" className="w-full py-2 text-base font-semibold">
                                    Login
                                </Button>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Don&apos;t have an account?{' '}
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