// src/app/sign-in/page.tsx - Bold Frontier Design
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#FF6B35] flex items-center justify-center mx-auto mb-6 transform -rotate-12">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-archivo text-white">INVOICEFLOW</h1>
        </div>

        <div className="bg-[#2D2D2D] border-2 border-[#4A4A4A] p-8">
          <h2 className="text-3xl font-archivo text-white mb-2">SIGN IN</h2>
          <p className="text-[#4A4A4A] mb-8">Welcome back</p>

          {registered && (
            <div className="bg-[#A8E000]/20 border-2 border-[#A8E000] text-[#A8E000] px-4 py-3 mb-6 text-sm font-bold uppercase">
              Account created! Sign in below.
            </div>
          )}

          {error && (
            <div className="bg-[#D63384]/20 border-2 border-[#D63384] text-[#D63384] px-4 py-3 mb-6 text-sm font-bold uppercase">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#4A4A4A] mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@business.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-[#4A4A4A] mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center block"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <p className="text-center text-[#4A4A4A] mt-8">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-[#FF6B35] hover:text-white transition-colors font-bold uppercase text-sm tracking-wide">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
