import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        userId: session.user.id,
        name,
        email,
        phone,
        address,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
