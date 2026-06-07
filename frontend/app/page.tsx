import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-calm-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-calm-sky to-calm-mint py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6 font-serif">
            InvoiceFlow
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Professional invoicing made simple. Create, send, and track invoices
            with ease. Built for small businesses and freelancers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-calm-sky px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="bg-calm-sand text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Everything you need to manage invoices
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">Create Invoices</h3>
              <p className="text-gray-600">
                Build professional invoices in minutes with customizable line items
                and automatic calculations.
              </p>
            </div>
            <div className="card bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Manage Clients</h3>
              <p className="text-gray-600">
                Keep all your client information organized and easily accessible
                for quick invoicing.
              </p>
            </div>
            <div className="card bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Payments</h3>
              <p className="text-gray-600">
                Monitor invoice status, track payments, and get paid faster with
                clear payment tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-calm-sand py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your invoicing?
          </h2>
          <p className="text-xl text-white mb-8">
            Join thousands of small businesses using InvoiceFlow
          </p>
          <Link
            href="/register"
            className="bg-white text-calm-sand px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 InvoiceFlow. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
