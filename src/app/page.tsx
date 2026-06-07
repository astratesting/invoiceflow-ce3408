// src/app/page.tsx - Landing Page
import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen calm-gradient">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sky rounded-soft flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-2xl font-serif text-sky-dark">InvoiceFlow</span>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-sky-dark hover:underline">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-serif text-sky-dark mb-6 leading-tight">
          Invoicing, <span className="text-mint-dark">simplified</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          Send professional invoices, track payments, and get paid faster. Built for small businesses who value their peace of mind.
        </p>
        <div className="flex items-center justify-center gap-4">
          {session ? (
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/sign-up" className="btn-primary text-lg px-8 py-4">
                Start Free Trial
              </Link>
              <Link href="#features" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </Link>
            </>
          )}
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-20 card p-2 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-sky-light to-mint-light rounded-soft h-96 flex items-center justify-center">
            <div className="text-white text-2xl font-serif">Invoice Dashboard Preview</div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-serif text-center text-sky-dark mb-4">
          Everything you need to get paid
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Focus on your business, not on chasing payments. InvoiceFlow handles the rest.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "document",
              title: "Beautiful Invoices",
              description: "Create professional invoices in minutes with customizable templates and automatic calculations.",
            },
            {
              icon: "clock",
              title: "Payment Tracking",
              description: "Know exactly who's paid and who hasn't. Automated reminders help you get paid faster.",
            },
            {
              icon: "users",
              title: "Client Management",
              description: "Keep all your client information organized in one place. Import, export, and manage with ease.",
            },
          ].map((feature, i) => (
            <div key={i} className="card text-center">
              <div className="w-16 h-16 bg-sky/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-sky-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {feature.icon === "document" && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  )}
                  {feature.icon === "clock" && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                  {feature.icon === "users" && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  )}
                </svg>
              </div>
              <h3 className="text-xl font-serif text-sky-dark mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="card max-w-3xl mx-auto">
          <h2 className="text-4xl font-serif text-sky-dark mb-4">
            Ready to simplify your invoicing?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of small businesses who trust InvoiceFlow for their invoicing needs.
          </p>
          {!session && (
            <Link href="/sign-up" className="btn-primary text-lg px-8 py-4">
              Get Started for Free
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sky-light/30">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky rounded-soft flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-serif text-sky-dark">InvoiceFlow</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 InvoiceFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
