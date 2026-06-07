// src/app/api/invoices/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId },
    include: { client: true, items: { orderBy: { order: "asc" } } },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json(invoice);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const body = await request.json();
    const { status, paidDate } = body;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paidDate && { paidDate: new Date(paidDate) }),
      },
      include: { client: true, items: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update invoice error:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  await prisma.invoice.delete({ where: { id } });

  return NextResponse.json({ message: "Invoice deleted" });
}
