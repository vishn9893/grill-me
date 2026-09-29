import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
const schema = z.object({ username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/), email: z.string().email(), password: z.string().min(8) });
export async function POST(req: Request) { try { const data = schema.parse(await req.json()); const email = data.email.toLowerCase(); const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username: data.username }] } }); if (exists) return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 }); const user = await prisma.user.create({ data: { username: data.username, email, passwordHash: await bcrypt.hash(data.password, 12), name: data.username } }); return NextResponse.json({ user: { id: user.id, username: user.username } }, { status: 201 }); } catch (e) { return NextResponse.json({ error: e instanceof z.ZodError ? e.issues[0].message : 'Invalid request' }, { status: 400 }); } }
