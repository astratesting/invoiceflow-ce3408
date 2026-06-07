import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ClientsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
    include: {
      invoices: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return (
    <div className="min-h-screen bg-calm-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
          <Link
            href="/clients/new"
            className="btn-primary bg-calm-sky text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
          >
            Add Client
          </Link>
        </div>

        {clients.length === 0 ? (
          <div className="card bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">No clients yet.</p>
            <Link
              href="/clients/new"
              className="text-calm-sky hover:underline"
            >
              Add your first client
            </Link>
          </div>
        ) : (
          <div className="card bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoices
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.map((client: any) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {client.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {client.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.invoices.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/invoices/new?clientId=${client.id}`}
                        className="text-calm-sky hover:underline text-sm"
                      >
                        Create Invoice
                      </Link>
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
