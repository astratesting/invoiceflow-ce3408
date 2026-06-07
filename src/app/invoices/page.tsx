// src/app/invoices/page.tsx
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string };
}) {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = (session.user as any).id;

  const where: any = { userId };
  if (searchParams.status) {
    where.status = searchParams.status;
  }
  if (searchParams.search) {
    where.OR = [
      { number: { contains: searchParams.search, mode: "insensitive" } },
      { client: { name: { contains: searchParams.search, mode: "insensitive" } } },
    ];
  }

  const invoices = await prisma.invoice.findMany({
    where,
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  const counts = await prisma.invoice.groupBy({
    by: ["status"],
    where: { userId },
    _count: { status: true },
  });

  const statusCounts = counts.reduce((acc, c) => {
    acc[c.status] = c._count.status;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-light/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sky-dark hover:underline">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-serif text-sky-dark">Invoices</h1>
          </div>
          <Link href="/invoices/new" className="btn-primary">
            New Invoice
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/invoices"
              className="px-4 py-2 rounded-soft text-sm hover:bg-sky-light/30 transition-all"
            >
              All ({invoices.length})
            </Link>
            {["DRAFT", "SENT", "PAID", "OVERDUE"].map((status) => (
              <Link
                key={status}
                href={`/invoices?status=${status}`}
                className="px-4 py-2 rounded-soft text-sm hover:bg-sky-light/30 transition-all"
              >
                {status} ({statusCounts[status] || 0})
              </Link>
            ))}
          </div>
        </div>

        {/* Invoices Table */}
        {invoices.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-gray-500 mb-4">No invoices found</p>
            <Link href="/invoices/new" className="btn-primary">
              Create Your First Invoice
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sky-light/30">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Invoice</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Due Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-sky-light/20 hover:bg-sky-light/10 transition-all">
                    <td className="py-4 px-4">
                      <Link href={`/invoices/${invoice.id}`} className="font-medium text-sky-dark hover:underline">
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{invoice.client.name}</td>
                    <td className="py-4 px-4 text-gray-500">{formatDate(invoice.issueDate)}</td>
                    <td className="py-4 px-4 text-gray-500">{formatDate(invoice.dueDate)}</td>
                    <td className="py-4 px-4 text-right font-medium text-gray-800">
                      {formatCurrency(invoice.total)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`status-badge ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
