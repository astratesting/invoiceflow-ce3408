'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export default function InvoiceForm({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, price: 0, total: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), description: '', quantity: 1, price: 0, total: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'price') {
            updated.total = Number(updated.quantity) * Number(updated.price);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!clientId) {
      setError('Please select a client');
      setLoading(false);
      return;
    }

    const validItems = items.filter(
      (item) => item.description && item.quantity > 0 && item.price >= 0
    );

    if (validItems.length === 0) {
      setError('Please add at least one valid line item');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          issueDate,
          dueDate,
          notes,
          items: validItems.map(({ description, quantity, price, total }) => ({
            description,
            quantity,
            price,
            total,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create invoice');
      }

      router.push('/invoices');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-white p-6 rounded-lg shadow-md space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Client Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client
        </label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-calm-sky"
          required
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Date
          </label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-calm-sky"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-calm-sky"
            required
          />
        </div>
      </div>

      {/* Line Items */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Line Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="text-calm-sky hover:underline"
          >
            + Add Item
          </button>
        </div>

        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 mb-4 items-end">
            <div className="col-span-5">
              <label className="block text-xs text-gray-600 mb-1">
                Description
              </label>
              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, 'description', e.target.value)
                }
                className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-calm-sky"
                placeholder="Item description"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                Qty
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(
                    item.id,
                    'quantity',
                    parseFloat(e.target.value) || 0
                  )
                }
                className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-calm-sky"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                Price
              </label>
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  updateItem(
                    item.id,
                    'price',
                    parseFloat(e.target.value) || 0
                  )
                }
                className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-calm-sky"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                Total
              </label>
              <input
                type="text"
                value={`$${item.total.toFixed(2)}`}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div className="col-span-1">
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
                disabled={items.length === 1}
              >
                ×
              </button>
            </div>
          </div>
        ))}

        <div className="text-right text-xl font-bold mt-4">
          Total: ${calculateTotal().toFixed(2)}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-calm-sky"
          rows={3}
          placeholder="Optional notes..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full bg-calm-sky text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
    </form>
  );
}
