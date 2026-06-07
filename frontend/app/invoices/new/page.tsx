"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string | null;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(0);

  const [items, setItems] = useState([
    { id: "1", name: "", description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Failed to load clients:", err));
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: "",
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: string, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.amount = Number(updated.quantity) * Number(updated.rate);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `INV-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceNumber = generateInvoiceNumber();

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: invoiceNumber,
          clientId,
          dueDate,
          notes,
          taxRate,
          subtotal,
          taxAmount,
          total,
          items: items.map(({ id, ...item }) => ({
            ...item,
            quantity: Number(item.quantity),
            rate: Number(item.rate),
            amount: Number(item.amount),
          })),
        }),
      });

      if (res.ok) {
        const invoice = await res.json();
        router.push(`/invoices/${invoice.id}`);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create invoice");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
        <div className="mb-8">
          <Link href="/invoices" className="text-calm-sky hover:underline text-sm">
            ← Back to Invoices
          </Link>
          <h2 className="text-3xl font-serif font-bold mt-2">Create New Invoice</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Selection */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Client *
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="">Choose a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Line Items</h3>
              <button type="button" onClick={addItem} className="btn-secondary text-sm">
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-start border-b border-gray-100 pb-4">
                  <div className="col-span-12 sm:col-span-4">
                    <label className="block text-xs text-gray-600 mb-1">Item Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Web Development"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      required
                      className="input-field"
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-3">
                    <label className="block text-xs text-gray-600 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={item.description || ""}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Qty</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                      required
                      className="input-field"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Rate ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                      required
                      className="input-field"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">Amount</label>
                    <p className="py-2 font-medium">${item.amount.toFixed(2)}</p>
                  </div>
                  <div className="col-span-1 flex items-end">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 pb-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Tax */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Payment terms, thank you note, etc."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="input-field"
                />

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax ({taxRate}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 justify-end">
            <Link href="/invoices" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
              {loading ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
