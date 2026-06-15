"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#F3E8FF,_#E8DFF7_42%,_#DCD3F0)]">
      <section className="flex min-h-screen w-full items-center justify-center bg-white/90">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold text-[#1E1B3D]">Registration Disabled</h1>
          <p className="mt-2 text-sm text-slate-500">Please use pre-configured credentials to log in.</p>
          <Link href="/login" className="mt-4 inline-block font-semibold text-indigo-600 hover:text-indigo-700">
            Go to Login
          </Link>
        </div>
      </section>
    </main>
  );
}
