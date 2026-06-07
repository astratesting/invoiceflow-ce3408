import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const [invoiceCount, clientCount, recentInvoices] = await Promise.all([
    prisma.invoice.count({
      where: { userId: session.user.id },
    }),
    prisma.client.count({
      where: { userId: session.user.id },
    }),
    prisma.invoice.findMany({
      where: { userId: session.user.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { client: true },
    }),
  ]);

  const totalRevenue = await prisma.invoice.aggregate({
    where: {
      userId: session.user.id,
      status: 'PAID',
    },
    _sum: { total: true },
  });

  return (
    <div className="min-h-screen bg-calm-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Welcome, {session.user.name || 'User'}
        </h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-medium">Total Invoices</h3>
            <p className="text-3xl font-bold text-calm-sky mt-2">
              {invoiceCount}
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-medium">
              Total Clients
            </h3>
            <p className="text-3xl font-bold text-calm-mint mt-2">
              {clientCount}
            </p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-medium">
              Revenue (Paid)
            </h3>
            <p className="text-3xl font-bold text-calm-sand mt-2">
              ${totalRevenue._sum.total?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/invoices/new"
            className="btn-primary bg-calm-sky text-white p-4 rounded-lg text-center hover:bg-opacity-90 transition"
          >
            Create New Invoice
          </Link>
          <Link
            href="/clients/new"
            className="btn-secondary bg-calm-mint text-gray-800 p-4 rounded-lg text-center hover:bg-opacity-90 transition"
          >
            Add New Client
          </Link>
        </div>

        {/* Recent Invoices */}
        <div className="card bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
          {recentInvoices.length === 0 ? (
            <p className="text-gray-600">
              No invoices yet.{' '}
              <Link href="/invoices/new" className="text-calm-sky hover:underline">
                Create your first invoice
              </Link>
            </p>
          ) : (
            <div className="space-y-4">
              {recentInvoices.map((invoice: any) => (
                <div
                  key={invoice.id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <p className="font-semibold">{invoice.number}</p>
                    <p className="text-sm text-gray-600">
                      {invoice.client.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${invoice.total.toFixed(2)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        invoice.status === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'SENT'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
