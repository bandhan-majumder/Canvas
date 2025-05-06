
"use client";

import { HTTP_BACKEND_URL } from '@/config';
import axios from 'axios';
import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useRouter } from 'next/navigation';

function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const authHanlder = async () => {
    let data;
    setIsLoading(true);

    try {
      if (isSignIn) {
        data = {
          email,
          password,
        }

        const response = await axios.post(`${HTTP_BACKEND_URL}/signin`, data);
        if (response.data.success) {
          localStorage.setItem('authToken', response.data.token);
          router.push('/canvas'); // push to create a new canvas
        } else {
          alert('Sign in failed');
        }
      } else {
        data = {
          email,
          password,
          name
        }
        const response = await axios.post(`${HTTP_BACKEND_URL}/signup`, data);
        if (response.data.success) {
          router.push('/signin');
        } else {
          alert('Sign up failed');
        }
      }
    } catch (error) {
      alert('Authentication error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl mx-4 sm:mx-auto transition-all duration-300 hover:shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg mb-5">
            {isSignIn ? (
              <LogIn className="w-10 h-10 text-white" strokeWidth={1.5} />
            ) : (
              <UserPlus className="w-10 h-10 text-white" strokeWidth={1.5} />
            )}
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            {isSignIn ? "Welcome back" : "Create account"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isSignIn
              ? "Sign in to access your account"
              : "Fill in your details to get started"}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignIn ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {!isSignIn && (
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Full name</label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              onClick={authHanlder}
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isSignIn ? (
                <>
                  <LogIn className="w-5 h-5 mr-2" /> Sign in
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" /> Create account
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500" onClick={() => router.push(isSignIn ? "/signup" : "/signin")}>
              {isSignIn ? "Sign up" : "Sign in"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;