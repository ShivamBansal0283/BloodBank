import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromRequest, requireRole } from '@/lib/auth';

export async function GET() {
  const items = await prisma.inventory.findMany({ orderBy: { bloodGroup: 'asc' } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!requireRole(token, ['ADMIN','HOSPITAL'])) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { bloodGroup, units } = await req.json();
  const bank = await prisma.bloodBank.findFirst();
  if (!bank) return NextResponse.json({ message: 'No blood bank' }, { status: 400 });
  const item = await prisma.inventory.upsert({
    where: { bloodBankId_bloodGroup: { bloodBankId: bank.id, bloodGroup } },
    update: { units: { increment: Number(units||0) } },
    create: { bloodBankId: bank.id, bloodGroup, units: Number(units||0) }
  });
  return NextResponse.json({ item });
}
