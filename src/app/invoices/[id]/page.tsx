// src/app/invoices/[id]/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import PDFButton from "@/components/PDFButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = (session.user as any).id;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId },
    include: { client: true, items: { orderBy: { order: "asc" } } },
  });

  if (!invoice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-light/30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/invoices" className="text-sky-dark hover:underline">
              ← Back to Invoices
            </Link>
            <h1 className="text-2xl font-serif text-sky-dark">{invoice.number}</h1>
            <span className={`status-badge ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <PDFButton invoiceId={invoice.id} />
            {invoice.status === "SENT" && (
              <form
                action={async () => {
                  "use server";
                  await prisma.invoice.update({
                    where: { id: invoice.id },
                    data: { status: "PAID", paidDate: new Date() },
                  });
                }}
              >
                <button type="submit" className="btn-primary">
                  Mark as Paid
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="card">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-sky-light/30">
            <div>
              <h2 className="text-3xl font-serif text-sky-dark mb-2">Invoice</h2>
              <p className="text-gray-500">{invoice.number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Issue Date</p>
              <p className="font-medium">{formatDate(invoice.issueDate)}</p>
              <p className="text-sm text-gray-500 mt-2">Due Date</p>
              <p className="font-medium">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          {/* Client Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">From</h3>
              <p className="font-medium text-gray-800">{session.user.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Bill To</h3>
              <p className="font-medium text-gray-800">{invoice.client.name}</p>
              {invoice.client.company && (
                <p className="text-gray-600">{invoice.client.company}</p>
              )}
              <p className="text-gray-600">{invoice.client.email}</p>
              {invoice.client.address && (
                <p className="text-gray-600">{invoice.client.address}</p>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sky-light/30">
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Item</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">Qty</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">Rate</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-sky-light/20">
                    <td className="py-4">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500">{item.description}</p>
                      )}
                    </td>
                    <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-600">
                      {formatCurrency(item.rate)}
                    </td>
                    <td className="py-4 text-right font-medium text-gray-800">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
                  <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t border-sky-light/30 text-xl font-serif text-sky-dark">
                <span>Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="pt-6 border-t border-sky-light/30">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
