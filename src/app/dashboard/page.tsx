// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = (session.user as any).id;

  const [invoices, clients, invoiceStats] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.invoice.groupBy({
      by: ["status"],
      where: { userId },
      _sum: { total: true },
      _count: { status: true },
    }),
  ]);

  const stats = {
    total: invoiceStats.reduce((acc, s) => acc + (s._sum.total || 0), 0),
    paid: invoiceStats.find((s) => s.status === "PAID")?._sum.total || 0,
    pending: invoiceStats.find((s) => s.status === "SENT")?._sum.total || 0,
    overdue: invoiceStats.find((s) => s.status === "OVERDUE")?._sum.total || 0,
    draft: invoiceStats.find((s) => s.status === "DRAFT")?._sum.total || 0,
    counts: {
      total: invoiceStats.reduce((acc, s) => acc + s._count.status, 0),
      paid: invoiceStats.find((s) => s.status === "PAID")?._count.status || 0,
      pending: invoiceStats.find((s) => s.status === "SENT")?._count.status || 0,
      overdue: invoiceStats.find((s) => s.status === "OVERDUE")?._count.status || 0,
    },
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-light/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-serif text-sky-dark">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/invoices/new" className="btn-primary">
              New Invoice
            </Link>
            <div className="w-10 h-10 bg-sky/20 rounded-full flex items-center justify-center">
              <span className="text-sky-dark font-medium">
                {session.user.name?.[0] || "U"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Revenue", value: formatCurrency(stats.total), color: "sky" },
            { label: "Paid", value: formatCurrency(stats.paid), color: "mint" },
            { label: "Pending", value: formatCurrency(stats.pending), color: "sand" },
            { label: "Overdue", value: formatCurrency(stats.overdue), color: "red" },
          ].map((stat, i) => (
            <div key={i} className="card">
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-serif text-${stat.color}-dark`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Invoices */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-sky-dark">Recent Invoices</h2>
              <Link href="/invoices" className="text-sm text-sky-dark hover:underline">
                View All
              </Link>
            </div>
            {invoices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No invoices yet</p>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/invoices/${invoice.id}`}
                    className="flex items-center justify-between p-4 bg-sky-light/20 rounded-soft hover:bg-sky-light/30 transition-all"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{invoice.number}</p>
                      <p className="text-sm text-gray-500">{invoice.client.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">
                        {formatCurrency(invoice.total)}
                      </p>
                      <span className={`status-badge ${
                        invoice.status === "PAID" ? "bg-mint-100 text-mint-700" :
                        invoice.status === "OVERDUE" ? "bg-red-100 text-red-700" :
                        invoice.status === "SENT" ? "bg-sky-100 text-sky-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Clients */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-sky-dark">Recent Clients</h2>
              <Link href="/clients" className="text-sm text-sky-dark hover:underline">
                View All
              </Link>
            </div>
            {clients.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No clients yet</p>
            ) : (
              <div className="space-y-4">
                {clients.map((client) => (
                  <Link
                    key={client.id}
                    href={`/clients/${client.id}`}
                    className="flex items-center justify-between p-4 bg-mint-light/20 rounded-soft hover:bg-mint-light/30 transition-all"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.company || client.email}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(client.createdAt)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
