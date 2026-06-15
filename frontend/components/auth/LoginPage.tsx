"use client";

import Image from 'next/image';
import { SyntheticEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';

import { login } from '@/lib/authApi';

const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next')?.trim() || '/chat';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    setIsLoading(true);

    try {
      const authResponse = await login({ email, password });
      localStorage.setItem('dawn_user', JSON.stringify(authResponse.user));
      router.replace(nextPath.startsWith('/') ? nextPath : '/chat');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to login right now');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#F3E8FF,_#E8DFF7_42%,_#DCD3F0)]">
      <section className="flex min-h-screen w-full overflow-hidden bg-white/90 md:p-0">
        <div className="flex w-full items-center justify-center bg-[#f8f9fc] px-6 py-10 sm:px-10 md:w-1/2 md:px-12 lg:px-16">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold tracking-tight text-[#1E1B3D]">Sign in to your account</h1>
            <p className="mt-1.5 text-sm text-slate-500">Continue to DAWN and manage your workspace insights.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-[#2A2657]">
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
                <label htmlFor="password" className="block text-sm font-semibold text-[#2A2657]">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {password && (
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  )}
                </div>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-[#8624FF] to-[#B47CFF] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(134,36,255,0.30)] transition hover:-translate-y-0.5 hover:from-[#7C1FE6] hover:to-[#A463F0] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>

        <div className="relative hidden md:block md:w-1/2">
          <Image src="/bg-image-ai.jpg" alt="Login illustration" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/15 via-transparent to-indigo-900/20" />
        </div>
      </section>
    </main>
  );
}
 