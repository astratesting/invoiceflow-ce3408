import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-calm-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-calm-sky/20 to-calm-mint/20 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            InvoiceFlow
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Stress-free invoicing for small businesses and freelancers. Get paid faster with AI-powered follow-ups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-calm-sky hover:bg-calm-sky/90 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="bg-calm-white border border-calm-sky text-calm-sky px-8 py-3 rounded-lg font-medium text-lg hover:bg-calm-sky/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16">
          Everything you need to manage invoices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-calm-sky/20 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-calm-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Create Invoices Fast</h3>
            <p className="text-gray-600">
              Add line items, select clients, and generate professional PDF invoices in seconds.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-calm-mint/20 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-calm-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Client Management</h3>
            <p className="text-gray-600">
              Store all your client details in one place, with easy access when creating invoices.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-calm-sand/20 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-calm-sand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Payment Tracking</h3>
            <p className="text-gray-600">
              Track payment status, send automated follow-ups, and get paid 2x faster.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-calm-sky/10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Ready to simplify your invoicing?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of small businesses using InvoiceFlow to get paid on time.
          </p>
          <Link
            href="/signup"
            className="bg-calm-sand hover:bg-calm-sand/90 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 InvoiceFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
