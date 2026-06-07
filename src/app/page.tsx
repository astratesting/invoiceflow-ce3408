// src/app/page.tsx - Bold Frontier Landing Page
import Link from "next/link";
import { auth } from "@/auth";
import InvoicePreview from "@/components/InvoicePreview";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#1A1A1A] overflow-hidden">
      {/* Beam motif background */}
      <div className="beam" />

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FF6B35] flex items-center justify-center transform -rotate-12">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-3xl font-archivo text-white tracking-tight">INVOICEFLOW</span>
        </div>
        <div className="flex items-center gap-6">
          {session ? (
            <Link href="/dashboard" className="btn-primary text-sm px-6 py-3">
              DASHBOARD
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-[#FF6B35] hover:text-white transition-colors font-bold uppercase text-sm tracking-wide">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary text-sm px-6 py-3">
                Start Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="font-archivo text-white mb-6 leading-[0.85]">
              GET PAID.
              <br />
              <span className="text-[#FF6B35]">FAST.</span>
            </h1>
            <p className="text-xl text-[#4A4A4A] mb-12 max-w-lg leading-relaxed">
              The boldest invoicing platform for solo founders.
              Create professional invoices in minutes, track payments,
              and get paid faster.
            </p>
            <div className="flex flex-wrap gap-4">
              {session ? (
                <Link href="/dashboard" className="btn-primary text-lg px-10 py-5">
                  GO TO DASHBOARD
                </Link>
              ) : (
                <>
                  <Link href="/sign-up" className="btn-primary text-lg px-10 py-5">
                    START FREE TRIAL
                  </Link>
                  <Link href="#features" className="btn-secondary text-lg px-10 py-5">
                    LEARN MORE
                  </Link>
                </>
              )}
            </div>

            {/* Social proof */}
            <div className="mt-16 flex items-center gap-8">
              <div>
                <p className="text-4xl font-archivo text-[#A8E000]">40M+</p>
                <p className="text-sm text-[#4A4A4A] uppercase tracking-wide">Freelancers Worldwide</p>
              </div>
              <div className="w-px h-12 bg-[#4A4A4A]" />
              <div>
                <p className="text-4xl font-archivo text-[#D63384]">$3.2B</p>
                <p className="text-sm text-[#4A4A4A] uppercase tracking-wide">Total Addressable Market</p>
              </div>
            </div>
          </div>

          {/* Invoice Preview Mockup */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6B35]/20 to-[#D63384]/20 blur-3xl" />
            <div className="relative bg-[#2D2D2D] border-2 border-[#4A4A4A] p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <InvoicePreview />
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t-2 border-[#4A4A4A]">
        <h2 className="font-archivo text-white text-center mb-4">
          EVERYTHING YOU NEED
        </h2>
        <p className="text-center text-[#4A4A4A] mb-20 text-lg">
          Focus on your business, not on chasing payments
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "document",
              title: "BEAUTIFUL INVOICES",
              description: "Create professional invoices in minutes with customizable templates and automatic calculations.",
              color: "orange",
            },
            {
              icon: "lightning",
              title: "INSTANT PAYMENTS",
              description: "Get paid faster with integrated Stripe payments. Send invoices and receive money in the same workflow.",
              color: "magenta",
            },
            {
              icon: "chart",
              title: "SMART TRACKING",
              description: "Know exactly who's paid and who hasn't. Automated reminders help you get paid faster.",
              color: "green",
            },
          ].map((feature, i) => (
            <div key={i} className="card group hover:border-[#FF6B35] transition-all duration-300">
              <div className={`w-16 h-16 mb-6 flex items-center justify-center ${
                feature.color === "orange" ? "bg-[#FF6B35]/20" :
                feature.color === "magenta" ? "bg-[#D63384]/20" :
                "bg-[#A8E000]/20"
              }`}>
                <svg className={`w-8 h-8 ${
                  feature.color === "orange" ? "text-[#FF6B35]" :
                  feature.color === "magenta" ? "text-[#D63384]" :
                  "text-[#A8E000]"
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {feature.icon === "document" && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 6.414a1 1 0 010 .707L14.414 20.414a1 1 0 01-.707.293H7z" />
                  )}
                  {feature.icon === "lightning" && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  )}
                  {feature.icon === "chart" && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  )}
                </svg>
              </div>
              <h3 className="text-xl font-archivo text-white mb-3">{feature.title}</h3>
              <p className="text-[#4A4A4A] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t-2 border-[#4A4A4A]">
        <h2 className="font-archivo text-white text-center mb-4">
          SIMPLE PRICING
        </h2>
        <p className="text-center text-[#4A4A4A] mb-20 text-lg">
          Start free, upgrade when you're ready to scale
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "FREE",
              price: "$0",
              period: "forever",
              features: ["3 invoices/month", "InvoiceFlow subdomain", "Basic templates", "Email support"],
              cta: "START FREE",
              highlight: false,
            },
            {
              name: "PRO",
              price: "$15",
              period: "per month",
              features: ["Unlimited invoices", "Custom domain", "Stripe integration", "Priority support", "PDF exports"],
              cta: "GO PRO",
              highlight: true,
            },
            {
              name: "BUSINESS",
              price: "$29",
              period: "per month",
              features: ["Everything in Pro", "Team collaboration", "Advanced analytics", "API access", "Custom branding"],
              cta: "GO BUSINESS",
              highlight: false,
            },
          ].map((plan, i) => (
            <div key={i} className={`card ${plan.highlight ? 'border-[#FF6B35] bg-[#FF6B35]/5' : 'border-[#4A4A4A]'}`}>
              {plan.name === "PRO" && (
                <div className="bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 uppercase tracking-wide inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-archivo text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-archivo text-[#FF6B35]">{plan.price}</span>
                <span className="text-[#4A4A4A]">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-[#A8E000] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className={plan.highlight ? "btn-primary w-full text-center block" : "btn-secondary w-full text-center block"}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t-2 border-[#4A4A4A] text-center">
        <h2 className="font-archivo text-white mb-6">
          READY TO GET PAID?
        </h2>
        <p className="text-xl text-[#4A4A4A] mb-12 max-w-2xl mx-auto">
          Join thousands of freelancers who trust InvoiceFlow for their invoicing needs.
        </p>
        {!session && (
          <Link href="/sign-up" className="btn-primary text-lg px-12 py-6 inline-block">
            START YOUR FREE TRIAL
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-[#4A4A4A]">
        <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6B35] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-archivo text-white">INVOICEFLOW</span>
          </div>
          <p className="text-sm text-[#4A4A4A]">
            © 2024 InvoiceFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
