import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromRequest, requireRole, hashPassword } from '@/lib/auth';

export async function GET() {
  const items = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: { id:true, email:true, name:true, role:true, createdAt:true } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!requireRole(token, ['ADMIN'])) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { email, name, role, password } = await req.json();
  const user = await prisma.user.create({ data: { email, name, role, passwordHash: await hashPassword(password||'changeme') } });
  return NextResponse.json({ item: { id:user.id, email:user.email, name:user.name, role:user.role } });
}
