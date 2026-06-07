import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import InvoiceForm from './InvoiceForm';

export default async function NewInvoicePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-calm-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">New Invoice</h1>
          <a
            href="/invoices"
            className="btn-secondary px-4 py-2 rounded-md"
          >
            Cancel
          </a>
        </div>

        <InvoiceForm clients={clients.map((c: any) => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  );
}
