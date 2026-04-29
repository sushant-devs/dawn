"use client";

import Image from 'next/image';
import Link from 'next/link';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { register } from '@/lib/authApi';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(255),
    email: z.email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Password and confirm password must match',
      });
    }
  });

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const validation = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    setIsLoading(true);
    try {
      const authResponse = await register({ full_name: fullName, email, password });
      localStorage.setItem('dawn_user', JSON.stringify(authResponse.user));
      router.push('/login');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to register right now');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef2ff,_#dde3f2_42%,_#d3daec)]">
      <section className="flex min-h-screen w-full overflow-hidden bg-white/90 md:p-0">
        <div className="flex w-full items-center justify-center bg-[#f8f9fc] px-6 py-10 sm:px-10 md:w-1/2 md:px-12 lg:px-16">
          <div className="w-full max-w-sm">


            <h1 className="text-3xl font-bold tracking-tight text-[#10153a]">Create your account</h1>
            <p className="mt-1.5 text-sm text-slate-500">Get started with DAWN and organize your workspace in minutes.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-semibold text-[#1a2147]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-[#1a2147]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your mail address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-[#1a2147]">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1a2147]">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-[#2f5cff] to-[#4b6fff] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(47,92,255,0.3)] transition hover:-translate-y-0.5 hover:from-[#2851e6] hover:to-[#4265ea] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-10 text-center text-sm text-slate-600">
              Already have an account ?{' '}
              <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Log in
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden md:block md:w-1/2">
          <Image src="/bg-image-ai.jpg" alt="Register illustration" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/15 via-transparent to-indigo-900/20" />
        </div>
      </section>
    </main>
  );
}
