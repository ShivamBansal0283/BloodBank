import { NextResponse } from 'next/server';
export async function POST(){
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: 'bb_token', value: '', maxAge: 0, path: '/' });
  return res;
}
