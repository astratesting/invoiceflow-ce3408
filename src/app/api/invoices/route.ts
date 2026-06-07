// src/app/api/invoices/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: any = { userId };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { number: { contains: search, mode: "insensitive" } },
      { client: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const invoices = await prisma.invoice.findMany({
    where,
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const body = await request.json();
    const { clientId, dueDate, notes, taxRate, items, status } = body;

    const invoiceCount = await prisma.invoice.count({ where: { userId } });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, "0")}`;

    const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
    const taxAmount = subtotal * ((taxRate || 0) / 100);
    const total = subtotal + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        userId,
        clientId,
        status: status || "DRAFT",
        dueDate: new Date(dueDate),
        subtotal,
        taxRate: taxRate || 0,
        taxAmount,
        total,
        notes,
        items: {
          create: items.map((item: any, index: number) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
            order: index,
          })),
        },
      },
      include: { client: true, items: true },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
