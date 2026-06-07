// src/app/clients/[id]/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = (session.user as any).id;

  const client = await prisma.client.findFirst({
    where: { id, userId },
    include: {
      invoices: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) {
    notFound();
  }

  const totalInvoiced = client.invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = client.invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = client.invoices
    .filter((inv) => inv.status === "SENT")
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-light/30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/clients" className="text-sky-dark hover:underline">
              ← Back to Clients
            </Link>
            <h1 className="text-2xl font-serif text-sky-dark">{client.name}</h1>
          </div>
          <Link href={`/invoices/new?clientId=${client.id}`} className="btn-primary">
            New Invoice for {client.name}
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Client Info Card */}
        <div className="card mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-serif text-sky-dark mb-4">Client Information</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {client.email}
                </p>
                {client.company && (
                  <p className="text-gray-600">
                    <span className="font-medium">Company:</span> {client.company}
                  </p>
                )}
                {client.phone && (
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {client.phone}
                  </p>
                )}
                {client.address && (
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span> {client.address}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Invoiced</span>
                  <span className="font-medium">{formatCurrency(totalInvoiced)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Paid</span>
                  <span className="font-medium text-green-600">{formatCurrency(paidAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-600">Pending</span>
                  <span className="font-medium text-sky-600">{formatCurrency(pendingAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Invoices */}
        <div className="card">
          <h2 className="text-xl font-serif text-sky-dark mb-6">Invoices</h2>

          {client.invoices.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No invoices yet</p>
          ) : (
            <div className="space-y-3">
              {client.invoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/invoices/${invoice.id}`}
                  className="flex items-center justify-between p-4 bg-sky-light/10 rounded-soft hover:bg-sky-light/20 transition-all"
                >
                  <div>
                    <p className="font-medium text-gray-800">{invoice.number}</p>
                    <p className="text-sm text-gray-500">{formatDate(invoice.issueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{formatCurrency(invoice.total)}</p>
                    <span className={`status-badge ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
