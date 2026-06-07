// src/app/clients/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ClientsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = (session.user as any).id;

  const clients = await prisma.client.findMany({
    where: { userId },
    include: { invoices: { select: { id: true, status: true, total: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-light/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sky-dark hover:underline">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-serif text-sky-dark">Clients</h1>
          </div>
          <Link href="/clients/new" className="btn-primary">
            Add Client
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {clients.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-gray-500 mb-4">No clients yet</p>
            <Link href="/clients/new" className="btn-primary">
              Add Your First Client
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => {
              const totalInvoiced = client.invoices.reduce((sum, inv) => sum + inv.total, 0);
              const paidAmount = client.invoices
                .filter((inv) => inv.status === "PAID")
                .reduce((sum, inv) => sum + inv.total, 0);

              return (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="card hover:shadow-soft-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-serif text-sky-dark">{client.name}</h3>
                      {client.company && (
                        <p className="text-sm text-gray-500">{client.company}</p>
                      )}
                    </div>
                    <div className="w-10 h-10 bg-mint/30 rounded-full flex items-center justify-center">
                      <span className="text-mint-dark font-medium">
                        {client.name[0]}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">{client.email}</p>
                    {client.phone && (
                      <p className="text-gray-600">{client.phone}</p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-sky-light/30 flex justify-between text-sm">
                    <div>
                      <p className="text-gray-500">Invoices</p>
                      <p className="font-medium text-gray-800">{client.invoices.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Total Billed</p>
                      <p className="font-medium text-gray-800">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(totalInvoiced)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Paid</p>
                      <p className="font-medium text-mint-dark">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(paidAmount)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
