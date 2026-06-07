// src/app/invoices/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string | null;
}

interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  });
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(0);

  const [items, setItems] = useState<LineItem[]>([
    { id: "1", name: "", description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then(setClients)
      .catch(console.error);
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: "", description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "rate") {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      })
    );
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent, status: "DRAFT" | "SENT" = "DRAFT") => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          dueDate,
          notes,
          taxRate,
          items: items.map(({ name, description, quantity, rate, amount }) => ({
            name,
            description,
            quantity,
            rate,
            amount,
          })),
          status,
        }),
      });

      if (response.ok) {
        const invoice = await response.json();
        router.push(`/invoices/${invoice.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create invoice");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-light/30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/invoices" className="text-sky-dark hover:underline">
              ← Back to Invoices
            </Link>
            <h1 className="text-2xl font-serif text-sky-dark">New Invoice</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={(e) => handleSubmit(e, "DRAFT")}>
          <div className="card mb-6">
            <h2 className="text-xl font-serif text-sky-dark mb-6">Client & Details</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company ? `(${client.company})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-serif text-sky-dark mb-6">Line Items</h2>

            {items.map((item, index) => (
              <div key={item.id} className="mb-4 p-4 bg-sky-light/10 rounded-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Item {index + 1}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                    step="0.01"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                    step="0.01"
                    required
                  />
                  <div className="input-field flex items-center justify-end font-medium">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.amount)}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="btn-secondary w-full"
            >
              + Add Item
            </button>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-serif text-sky-dark mb-6">Summary</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field min-h-[100px]"
                  placeholder="Payment terms, thank you note, etc."
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2 pt-4 border-t border-sky-light/30">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({taxRate}%)</span>
                    <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif text-sky-dark pt-2 border-t border-sky-light/30">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link href="/invoices" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-secondary"
              onClick={(e) => handleSubmit(e, "DRAFT")}
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={loading}
              className="btn-primary"
              onClick={(e) => handleSubmit(e as any, "SENT")}
            >
              Save & Send
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
