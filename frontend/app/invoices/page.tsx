import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { client: true },
  });

  return (
    <div className="min-h-screen bg-calm-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
          <Link
            href="/invoices/new"
            className="btn-primary bg-calm-sky text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
          >
            New Invoice
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className="card bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">No invoices yet.</p>
            <Link
              href="/invoices/new"
              className="text-calm-sky hover:underline"
            >
              Create your first invoice
            </Link>
          </div>
        ) : (
          <div className="card bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="text-calm-sky hover:underline font-medium"
                      >
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          invoice.status === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'SENT'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${invoice.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
