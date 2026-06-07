// src/app/layout.tsx
import type { Metadata } from "next";
import { Satoshi, Archivo_Black } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const satoshi = Satoshi({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-satoshi",
});

const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "InvoiceFlow - Bold Invoicing for Freelancers",
  description: "Get paid faster. The boldest invoicing platform for solo founders. Create, send, and track invoices with style.",
  keywords: ["invoice", "freelancer", "billing", "payments", "SaaS"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${satoshi.variable} ${archivo.variable}`}>
      <body className="bg-[#1A1A1A] text-[#FFF9F0] font-satoshi">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
