import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromRequest, requireRole } from '@/lib/auth';

export async function GET() {
  const items = await prisma.donation.findMany({ orderBy: { receivedAt: 'desc' } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!requireRole(token, ['ADMIN','HOSPITAL'])) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { appointmentId, bloodGroup, units } = await req.json();
  let donation;
  if (appointmentId) {
    donation = await prisma.donation.create({ data: { appointmentId, bloodGroup: bloodGroup || 'O_POS', units: Number(units||1) } });
  } else {
    donation = await prisma.donation.create({ data: { bloodGroup, units: Number(units||1) } });
  }
  // increase inventory
  const bank = await prisma.bloodBank.findFirst();
  if (bank) {
    await prisma.inventory.upsert({
      where: { bloodBankId_bloodGroup: { bloodBankId: bank.id, bloodGroup: donation.bloodGroup } },
      update: { units: { increment: donation.units } },
      create: { bloodBankId: bank.id, bloodGroup: donation.bloodGroup, units: donation.units }
    });
  }
  return NextResponse.json({ item: donation });
}
