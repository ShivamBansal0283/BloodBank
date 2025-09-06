import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signToken, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  const token = signToken({ sub: user.id, email: user.email, role: user.role as any, name: user.name });

  const res = NextResponse.json({ id: user.id, email: user.email, role: user.role, name: user.name });
  res.headers.set('Cache-Control', 'no-store');
  res.cookies.set({
    name: 'bb_token',
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
