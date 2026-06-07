import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { client: true },
  });

  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { clientId, issueDate, dueDate, notes, items } = body;

    if (!clientId || !issueDate || !dueDate || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate invoice number
    const invoiceCount = await prisma.invoice.count({
      where: { userId: session.user.id },
    });
    const number = `INV-${String(invoiceCount + 1).padStart(4, '0')}`;

    const total = items.reduce(
      (sum: number, item: any) => sum + item.total,
      0
    );

    const invoice = await prisma.invoice.create({
      data: {
        userId: session.user.id,
        clientId,
        number,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        notes,
        total,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        },
      },
      include: { items: true, client: true },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
