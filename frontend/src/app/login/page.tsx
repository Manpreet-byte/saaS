'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Use auth context to login
    const success = await login(email, password);
    setLoading(false);
    
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary-900 px-4 py-14 sm:px-8">
      <div className="mx-auto w-full max-w-md animate-fade-in">
        <div className="rounded-2xl border border-primary-700 bg-primary-900/80 p-8 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="display-font mb-2 text-3xl font-bold text-white">
              Welcome Back
            </h1>
            <p className="text-primary-100">
              Sign in to access your dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-rose-900/30 p-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-primary-100">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-primary-700 bg-primary-900/60 py-3 pl-10 pr-4 text-white placeholder-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-primary-100">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-primary-700 bg-primary-900/60 py-3 pl-10 pr-12 text-white placeholder-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-300 hover:text-primary-100"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary-500 py-3 font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-primary-200">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary-100 hover:text-white">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
