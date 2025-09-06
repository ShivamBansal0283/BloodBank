import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(){
  const inv = await prisma.inventory.findMany();
  const totalUnits = inv.reduce((a,b)=>a+b.units,0);
  const pendingAppointments = await prisma.appointment.count({ where: { status: 'PENDING' as any } });
  const pendingRequests = await prisma.request.count({ where: { status: 'PENDING' as any } });
  return NextResponse.json({ totalUnits, pendingAppointments, pendingRequests });
}
