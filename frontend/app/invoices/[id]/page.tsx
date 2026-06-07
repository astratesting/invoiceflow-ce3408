import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: InvoicePageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect('/login');
  }

  const invoice = await prisma.invoice.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
    include: {
      client: true,
      items: true,
    },
  });

  if (!invoice) {
    redirect('/invoices');
  }

  return (
    <div className="min-h-screen bg-calm-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Invoice {invoice.number}
          </h1>
          <Link
            href="/invoices"
            className="btn-secondary px-4 py-2 rounded-md"
          >
            Back to Invoices
          </Link>
        </div>

        <div className="card bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* Invoice Header */}
          <div className="flex justify-between border-b pb-4">
            <div>
              <h2 className="text-xl font-semibold">Invoice Details</h2>
              <p className="text-gray-600">Status: {invoice.status}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Client Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Client</h3>
            <p className="font-medium">{invoice.client.name}</p>
            {invoice.client.email && (
              <p className="text-gray-600">{invoice.client.email}</p>
            )}
            {invoice.client.phone && (
              <p className="text-gray-600">{invoice.client.phone}</p>
            )}
          </div>

          {/* Line Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Items</h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Qty</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item: any) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t font-bold">
                  <td colSpan={3} className="px-4 py-2 text-right">
                    Total:
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${invoice.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-600">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
