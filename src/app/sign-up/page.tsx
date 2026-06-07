// src/app/sign-up/page.tsx - Bold Frontier Design
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/sign-in?registered=true");
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
          <h2 className="text-3xl font-archivo text-white mb-2">CREATE ACCOUNT</h2>
          <p className="text-[#4A4A4A] mb-8">Start your free trial</p>

          {error && (
            <div className="bg-[#D63384]/20 border-2 border-[#D63384] text-[#D63384] px-4 py-3 mb-6 text-sm font-bold uppercase">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-[#4A4A4A] mb-2 uppercase tracking-wide">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Jane Doe"
                required
              />
            </div>

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
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-[#4A4A4A] mb-2 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <p className="text-center text-[#4A4A4A] mt-8">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-[#FF6B35] hover:text-white transition-colors font-bold uppercase text-sm tracking-wide">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
