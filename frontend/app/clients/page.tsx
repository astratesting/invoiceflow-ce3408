import { PrismaClient } from "@prisma/client";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function ClientsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    include: {
      invoices: {
        select: { id: true, total: true, status: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-calm-white">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">InvoiceFlow</h1>
          <nav className="flex gap-6 items-center">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/invoices" className="text-gray-600 hover:text-gray-900">Invoices</Link>
            <Link href="/clients" className="text-gray-900 font-medium">Clients</Link>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="text-gray-600 hover:text-gray-900">Sign out</button>
            </form>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold">Clients</h2>
          <Link href="/clients/new" className="btn-primary">
            + New Client
          </Link>
        </div>

        {clients.length === 0 ? (
          <div className="card text-center py-16">
            <h3 className="text-xl font-medium mb-2">No clients yet</h3>
            <p className="text-gray-600 mb-6">Add your first client to start creating invoices.</p>
            <Link href="/clients/new" className="btn-primary">
              Add Client
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => {
              const totalBilled = client.invoices.reduce((sum, inv) => sum + inv.total, 0);
              const paidInvoices = client.invoices.filter((inv) => inv.status === "PAID").length;

              return (
                <div key={client.id} className="card hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold mb-1">{client.name}</h3>
                  {client.company && (
                    <p className="text-gray-600 text-sm mb-2">{client.company}</p>
                  )}
                  <p className="text-gray-600 text-sm mb-1">{client.email}</p>
                  {client.phone && (
                    <p className="text-gray-600 text-sm mb-4">{client.phone}</p>
                  )}

                  <div className="border-t pt-4 flex justify-between text-sm">
                    <div>
                      <p className="text-gray-600">Invoices</p>
                      <p className="font-bold text-lg">{client.invoices.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Total Billed</p>
                      <p className="font-bold text-lg">${totalBilled.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/invoices/new?clientId=${client.id}`}
                      className="btn-primary text-sm flex-1 text-center"
                    >
                      New Invoice
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
