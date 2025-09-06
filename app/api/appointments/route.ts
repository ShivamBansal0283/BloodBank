import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromRequest, requireRole } from '@/lib/auth';

export async function GET() {
  const items = await prisma.appointment.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!requireRole(token, ['ADMIN','HOSPITAL','PATIENT'])) return NextResponse.json({ message: 'Login required' }, { status: 401 });
  const body = await req.json();
  const appt = await prisma.appointment.create({
    data: { donorName: body.donorName, donorEmail: body.donorEmail, bloodGroup: body.bloodGroup, units: Number(body.units||1), scheduledAt: new Date(body.scheduledAt), status: 'PENDING' as any }
  });
  return NextResponse.json({ item: appt });
}

export async function PATCH(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!requireRole(token, ['ADMIN','HOSPITAL'])) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { id, status } = await req.json();
  const appt = await prisma.appointment.update({ where: { id }, data: { status } });
  return NextResponse.json({ item: appt });
}
