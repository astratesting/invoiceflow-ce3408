// src/components/PDFButton.tsx
"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PDFButtonProps {
  invoiceId: string;
}

export default function PDFButton({ invoiceId }: PDFButtonProps) {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      const invoice = await response.json();

      const { PDFDocument, rgb } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]);
      const { height } = page.getSize();
      const font = await pdfDoc.embedFont("Helvetica");
      const boldFont = await pdfDoc.embedFont("Helvetica-Bold");

      let y = height - 50;

      // Header
      page.drawText("INVOICE", { x: 50, y, size: 28, font: boldFont, color: rgb(0.53, 0.81, 0.92) });
      y -= 40;

      // Invoice details
      page.drawText(`Invoice #: ${invoice.number}`, { x: 50, y, size: 12, font: boldFont });
      page.drawText(`Date: ${formatDate(invoice.issueDate)}`, { x: 300, y, size: 10, font });
      y -= 20;
      page.drawText(`Due Date: ${formatDate(invoice.dueDate)}`, { x: 300, y, size: 10, font });
      y -= 40;

      // Client info
      page.drawText("Bill To:", { x: 50, y, size: 12, font: boldFont });
      y -= 20;
      page.drawText(invoice.client.name, { x: 50, y, size: 10, font });
      y -= 15;
      if (invoice.client.company) {
        page.drawText(invoice.client.company, { x: 50, y, size: 10, font });
        y -= 15;
      }
      page.drawText(invoice.client.email, { x: 50, y, size: 10, font });
      y -= 40;

      // Table header
      page.drawRectangle({ x: 50, y: y - 5, width: 495, height: 25, color: rgb(0.69, 0.88, 0.9) });
      y -= 20;
      page.drawText("Item", { x: 60, y, size: 10, font: boldFont, color: rgb(1, 1, 1) });
      page.drawText("Qty", { x: 300, y, size: 10, font: boldFont, color: rgb(1, 1, 1) });
      page.drawText("Rate", { x: 380, y, size: 10, font: boldFont, color: rgb(1, 1, 1) });
      page.drawText("Amount", { x: 460, y, size: 10, font: boldFont, color: rgb(1, 1, 1) });
      y -= 20;

      // Items
      for (const item of invoice.items) {
        page.drawText(item.name, { x: 60, y, size: 10, font });
        page.drawText(String(item.quantity), { x: 300, y, size: 10, font });
        page.drawText(formatCurrency(item.rate), { x: 380, y, size: 10, font });
        page.drawText(formatCurrency(item.amount), { x: 460, y, size: 10, font });
        y -= 20;
      }

      y -= 20;

      // Totals
      page.drawText("Subtotal:", { x: 380, y, size: 10, font });
      page.drawText(formatCurrency(invoice.subtotal), { x: 460, y, size: 10, font });
      y -= 15;

      if (invoice.taxRate > 0) {
        page.drawText(`Tax (${invoice.taxRate}%):`, { x: 380, y, size: 10, font });
        page.drawText(formatCurrency(invoice.taxAmount), { x: 460, y, size: 10, font });
        y -= 15;
      }

      page.drawText("Total:", { x: 380, y, size: 12, font: boldFont });
      page.drawText(formatCurrency(invoice.total), { x: 460, y, size: 12, font: boldFont });

      // Notes
      if (invoice.notes) {
        y -= 40;
        page.drawText("Notes:", { x: 50, y, size: 12, font: boldFont });
        y -= 20;
        page.drawText(invoice.notes, { x: 50, y, size: 10, font, maxWidth: 495 });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={loading}
      className="btn-secondary"
    >
      {loading ? "Generating..." : "Download PDF"}
    </button>
  );
}
