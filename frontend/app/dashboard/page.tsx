import { PrismaClient } from "@prisma/client";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [invoices, clients, invoiceStats] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId: session.user.id },
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.client.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
    prisma.invoice.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: { status: true },
      _sum: { total: true },
    }),
  ]);

  const stats = {
    total: invoiceStats.reduce((acc, s) => acc + (s._sum.total || 0), 0),
    draft: invoiceStats.find((s) => s.status === "DRAFT")?._count.status || 0,
    sent: invoiceStats.find((s) => s.status === "SENT")?._count.status || 0,
    paid: invoiceStats.find((s) => s.status === "PAID")?._count.status || 0,
    overdue: invoiceStats.find((s) => s.status === "OVERDUE")?._count.status || 0,
    clientCount: clients.length,
  };

  return (
    <div className="min-h-screen bg-calm-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">InvoiceFlow</h1>
          <nav className="flex gap-6 items-center">
            <Link href="/dashboard" className="text-gray-900 font-medium">
              Dashboard
            </Link>
            <Link href="/invoices" className="text-gray-600 hover:text-gray-900">
              Invoices
            </Link>
            <Link href="/clients" className="text-gray-600 hover:text-gray-900">
              Clients
            </Link>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="text-gray-600 hover:text-gray-900">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Welcome back, {session.user.name || "User"}!
          </h2>
          <p className="mt-2 text-gray-600">
            Here&apos;s an overview of your invoicing activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="card bg-gradient-to-br from-calm-sky/10 to-calm-sky/5">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold mt-2">${stats.total.toFixed(2)}</p>
          </div>
          <div className="card bg-gradient-to-br from-calm-mint/10 to-calm-mint/5">
            <p className="text-sm text-gray-600">Paid Invoices</p>
            <p className="text-3xl font-bold mt-2">{stats.paid}</p>
          </div>
          <div className="card bg-gradient-to-br from-calm-sand/10 to-calm-sand/5">
            <p className="text-sm text-gray-600">Outstanding</p>
            <p className="text-3xl font-bold mt-2">{stats.sent + stats.overdue}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Clients</p>
            <p className="text-3xl font-bold mt-2">{stats.clientCount}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-10">
          <Link href="/invoices/new" className="btn-primary">
            + New Invoice
          </Link>
          <Link href="/clients/new" className="btn-secondary">
            + New Client
          </Link>
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Recent Invoices</h3>
            <Link href="/invoices" className="text-calm-sky hover:underline text-sm">
              View all
            </Link>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No invoices yet</p>
              <Link href="/invoices/new" className="btn-primary">
                Create your first invoice
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-sm font-medium text-gray-600">Number</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Client</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="pb-3 text-sm font-medium text-gray-600 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-4">
                        <Link href={`/invoices/${invoice.id}`} className="text-calm-sky hover:underline font-medium">
                          {invoice.number}
                        </Link>
                      </td>
                      <td className="py-4 text-gray-700">{invoice.client.name}</td>
                      <td className="py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium status-${invoice.status.toLowerCase()}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 text-right font-medium">${invoice.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
