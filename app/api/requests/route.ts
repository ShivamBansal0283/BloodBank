import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromRequest, requireRole } from '@/lib/auth';

export async function GET() {
  const items = await prisma.request.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!requireRole(token, ['ADMIN','HOSPITAL','PATIENT'])) return NextResponse.json({ message: 'Login required' }, { status: 401 });
  const body = await req.json();
  const item = await prisma.request.create({ data: { requester: body.requester, hospital: body.hospital, bloodGroup: body.bloodGroup, units: Number(body.units||1) } });
  return NextResponse.json({ item });
}

export async function PATCH(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!requireRole(token, ['ADMIN','HOSPITAL'])) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { id, action } = await req.json();
  let data: any = {};
  if (action === 'FULFIL') { data = { status: 'FULFILLED' as any, fulfilledAt: new Date() }; }
  if (action === 'REJECT') { data = { status: 'REJECTED' as any }; }
  const item = await prisma.request.update({ where: { id }, data });
  if (action === 'FULFIL') {
    const bank = await prisma.bloodBank.findFirst();
    if (bank) {
      await prisma.inventory.upsert({
        where: { bloodBankId_bloodGroup: { bloodBankId: bank.id, bloodGroup: item.bloodGroup } },
        update: { units: { decrement: item.units } },
        create: { bloodBankId: bank.id, bloodGroup: item.bloodGroup, units: 0 }
      });
    }
  }
  return NextResponse.json({ item });
}
