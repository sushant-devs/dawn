"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { register } from '@/lib/authApi';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(255),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Password and confirm password must match',
      });
    }
    if (!data.agreeToTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['agreeToTerms'],
        message: 'Please accept the terms and privacy policy',
      });
    }
  });

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const validation = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
      agreeToTerms,
    });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    setIsLoading(true);
    try {
      const authResponse = await register({ full_name: fullName, email, password });
      localStorage.setItem('dawn_user', JSON.stringify(authResponse.user));
      router.push('/chat');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to register right now');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#dfe2f0] p-4 md:p-8">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/60 bg-white shadow-[0_30px_80px_rgba(29,44,89,0.25)] md:min-h-[680px] md:p-0">
        <div className="flex w-full items-center justify-center bg-[#f8f9fc] px-6 py-10 sm:px-10 md:w-1/2 md:px-12 lg:px-16">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold tracking-tight text-[#10153a]">Create account</h1>
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
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
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
          <Image src="/home-bg.jpg" alt="Register illustration" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/15 via-transparent to-indigo-900/20" />
        </div>
      </section>
    </main>
  );
}
