"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Lock, User } from "lucide-react";

type Inputs = {
    email: string;
    password: string;
    name?: string;
};

export default function Authentication({ isSignIn }: { isSignIn: boolean }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (isSignIn) {
            try {
                const res = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: true,
                });
            } catch (error) {
                console.error("Error signing in:", error);
                toast.error("Error signing in. Please try again later.");
            }
            return;
        }


        // signup logic
        const { name, email, password } = data;
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });
        if (res.status === 201) {
            toast.success("User created successfully");
            redirect("/auth/signin");
        } else if (res.status === 409) {
            toast.error("User already exists");
        } else if (res.status === 500) {
            toast.error("User creation failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        {isSignIn ? "Sign in to your account" : "Create a new account"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        {isSignIn
                            ? "Enter your credentials to access your account"
                            : "Fill in your details to get started"}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {!isSignIn && (
                            <div>
                                <label htmlFor="name" className="sr-only">
                                    Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register("name", { required: true })}
                                        id="name"
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Full name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">Name is required</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register("email", {
                                        required: true,
                                        pattern: /^\S+@\S+$/i,
                                    })}
                                    id="email"
                                    type="email"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Email address"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    Valid email is required
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register("password", { required: true, minLength: 6 })}
                                    id="password"
                                    type="password"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Password"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    Password is required (min 6 characters)
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            {isSignIn ? "Sign In" : "Create Account"}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-400">
                            {isSignIn ? "Don't have an account? " : "Already have an account? "}
                            <a href={isSignIn ? "/auth/signup" : "/auth/signin"} className="font-medium text-indigo-400 hover:text-indigo-300">
                                {isSignIn ? "Sign up" : "Sign in"}
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}