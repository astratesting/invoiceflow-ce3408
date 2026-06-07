import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      number,
      clientId,
      dueDate,
      notes,
      taxRate,
      subtotal,
      taxAmount,
      total,
      items,
      status,
    } = body;

    if (!clientId || !dueDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.create({
      data: {
        number,
        status: status || "DRAFT",
        issueDate: new Date(),
        dueDate: new Date(dueDate),
        subtotal: parseFloat(subtotal),
        taxRate: parseFloat(taxRate) || 0,
        taxAmount: parseFloat(taxAmount) || 0,
        total: parseFloat(total),
        notes,
        userId: session.user.id,
        clientId,
        items: {
          create: items.map((item: any, index: number) => ({
            name: item.name,
            description: item.description || null,
            quantity: parseFloat(item.quantity),
            rate: parseFloat(item.rate),
            amount: parseFloat(item.amount),
            order: index,
          })),
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
