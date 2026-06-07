// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function generateInvoiceNumber(userId: string, count: number): string {
  const year = new Date().getFullYear();
  const paddedCount = String(count + 1).padStart(4, "0");
  return `INV-${year}-${paddedCount}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    SENT: "bg-sky-100 text-sky-700",
    PAID: "bg-mint-100 text-mint-700",
    OVERDUE: "bg-red-100 text-red-700",
    CANCELLED: "bg-sand-100 text-sand-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}
