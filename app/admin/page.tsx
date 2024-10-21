'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Component() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="hidden w-1/2 lg:flex lg:items-center lg:justify-center py-8">
        <img
          src="https://cdn.midjourney.com/65fa1044-e48a-4243-af43-213a6b02661d/0_0.png"
          alt="Admin"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex w-full flex-col justify-center bg-white px-4 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-4xl font-bold font-inter">Welcome back!</h2>
          </div>
          <p className="mb-8 text-base text-gray-600 font-inter">Please enter your details</p>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg font-inter">Email</Label>
              <Input id="email" placeholder="Enter your email" type="email" className="text-base font-inter" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg font-inter">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  className="text-base font-inter"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <Button className="w-full text-lg font-inter">Log In</Button>
          </form>
        </div>
      </div>
    </div>
  );
}