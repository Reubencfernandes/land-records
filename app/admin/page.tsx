'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

export default function Component() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@test.com' && password === '123456') {
      // Successful login
      localStorage.setItem('isAdmin', 'true');
      router.push('/'); // Redirect to admin dashboard
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="hidden w-1/2 lg:flex lg:items-center lg:justify-center">
        <img
          src="https://cdn.midjourney.com/65fa1044-e48a-4243-af43-213a6b02661d/0_0.png"
          alt="Admin"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex w-full flex-col justify-center bg-white px-4 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-8">Welcome back!</h2>
          <p className="mb-8 text-sm text-gray-600">Please enter your details</p>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="Enter your email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">Log In</Button>
          </form>
        </div>
      </div>
    </div>
  );
}