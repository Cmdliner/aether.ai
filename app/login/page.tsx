"use client";

import TypingAnimation from "@/components/TypingAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLAttributes } from "react";

export default function Login({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <section className="min-h-screen flex">
            <div className="hidden md:flex flex-col flex-1/2 items-center justify-center text-2xl bg-black text-background">
                <TypingAnimation />
            </div>

            <div className={`flex-1/2 items-center justify-center ${cn("flex flex-col gap-6", className)} `}{...props}>
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
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="yemi@example.com"
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