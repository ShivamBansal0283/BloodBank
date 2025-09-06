import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
export type JwtPayload = { sub: string; email: string; role: 'ADMIN'|'HOSPITAL'|'PATIENT'; name: string; };
export function signToken(payload: JwtPayload) { return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); }
export function verifyToken(token: string): JwtPayload | null { try { return jwt.verify(token, JWT_SECRET) as JwtPayload; } catch { return null; } }
export function getTokenFromRequest(req: NextRequest): JwtPayload | null { const cookie = req.cookies.get('bb_token')?.value; if (!cookie) return null; return verifyToken(cookie); }
export async function hashPassword(plain: string) { return bcrypt.hash(plain, 10); }
export async function verifyPassword(plain: string, hash: string) { return bcrypt.compare(plain, hash); }
export function requireRole(token: JwtPayload | null, roles: Array<JwtPayload['role']>) { return !!(token && roles.includes(token.role)); }
