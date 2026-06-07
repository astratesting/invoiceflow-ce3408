import { PrismaClient } from "@prisma/client";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-calm-white">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">InvoiceFlow</h1>
          <nav className="flex gap-6 items-center">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/invoices" className="text-gray-900 font-medium">Invoices</Link>
            <Link href="/clients" className="text-gray-600 hover:text-gray-900">Clients</Link>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="text-gray-600 hover:text-gray-900">Sign out</button>
            </form>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold">Invoices</h2>
          <Link href="/invoices/new" className="btn-primary">
            + New Invoice
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className="card text-center py-16">
            <h3 className="text-xl font-medium mb-2">No invoices yet</h3>
            <p className="text-gray-600 mb-6">Create your first invoice to get started.</p>
            <Link href="/invoices/new" className="btn-primary">
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-sm font-medium text-gray-600">Number</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Client</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Issue Date</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Due Date</th>
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
                    <td className="py-4 text-gray-600">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-600">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
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
      </main>
    </div>
  );
}
