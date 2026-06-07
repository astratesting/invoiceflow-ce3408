import { PrismaClient } from "@prisma/client";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

async function updateInvoiceStatus(invoiceId: string, newStatus: string) {
  "use server";
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: newStatus,
      paidDate: newStatus === "PAID" ? new Date() : null,
    },
  });
  revalidatePath(`/invoices/${invoiceId}`);
}

export default async function InvoiceDetailPage({ params }: InvoicePageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: id,
      userId: session.user.id,
    },
    include: {
      client: true,
      items: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!invoice) {
    redirect("/invoices");
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-calm-mint/30 text-green-700";
      case "SENT": return "bg-blue-100 text-blue-700";
      case "OVERDUE": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <Link href="/invoices" className="text-calm-sky hover:underline text-sm">
              ← Back to Invoices
            </Link>
            <h2 className="text-3xl font-serif font-bold mt-2">{invoice.number}</h2>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Info */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Client Information</h3>
              <div className="space-y-2">
                <p className="font-medium text-lg">{invoice.client.name}</p>
                {invoice.client.company && (
                  <p className="text-gray-600">{invoice.client.company}</p>
                )}
                <p className="text-gray-600">{invoice.client.email}</p>
                {invoice.client.phone && (
                  <p className="text-gray-600">{invoice.client.phone}</p>
                )}
                {invoice.client.address && (
                  <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Items</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 text-sm font-medium text-gray-600">Item</th>
                    <th className="pb-2 text-sm font-medium text-gray-600 text-right">Qty</th>
                    <th className="pb-2 text-sm font-medium text-gray-600 text-right">Rate</th>
                    <th className="pb-2 text-sm font-medium text-gray-600 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50">
                      <td className="py-3">
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600">{item.description}</p>
                        )}
                      </td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">${item.rate.toFixed(2)}</td>
                      <td className="py-3 text-right font-medium">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="card">
                <h3 className="text-lg font-bold mb-2">Notes</h3>
                <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Invoice Summary */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Issue Date:</span>
                  <span className="font-medium">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
                {invoice.paidDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid Date:</span>
                    <span className="font-medium text-green-700">
                      {new Date(invoice.paidDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span>${invoice.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Actions</h3>
              <div className="space-y-3">
                {invoice.status === "DRAFT" && (
                  <form
                    action={async () => {
                      "use server";
                      await updateInvoiceStatus(id, "SENT");
                    }}
                  >
                    <button type="submit" className="btn-primary w-full">
                      Mark as Sent
                    </button>
                  </form>
                )}
                {invoice.status === "SENT" && (
                  <form
                    action={async () => {
                      "use server";
                      await updateInvoiceStatus(id, "PAID");
                    }}
                  >
                    <button type="submit" className="btn-primary w-full bg-calm-mint hover:bg-calm-mint/90">
                      Mark as Paid
                    </button>
                  </form>
                )}
                <button
                  onClick={() => {
                    const doc = new jsPDF();
                    doc.setFontSize(20);
                    doc.text("Invoice", 20, 30);
                    doc.setFontSize(12);
                    doc.text(`Invoice #: ${invoice.number}`, 20, 50);
                    doc.text(`Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 20, 60);
                    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 68);
                    doc.text(`Client: ${invoice.client.name}`, 20, 80);
                    (doc as any).autoTable({
                      startY: 110,
                      head: [["Item", "Qty", "Rate", "Amount"]],
                      body: invoice.items.map((item) => [
                        item.name,
                        item.quantity,
                        `${item.rate.toFixed(2)}`,
                        `${item.amount.toFixed(2)}`,
                      ]),
                    });
                    doc.save(`${invoice.number}.pdf`);
                  }}
                  className="btn-secondary w-full"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
