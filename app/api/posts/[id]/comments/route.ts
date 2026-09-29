import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
const schema = z.object({ body: z.string().min(1).max(5000), parentId: z.string().optional() });
export async function POST(req: Request, { params }: { params: { id: string } }) { const session = await getSession(); if (!session?.user?.id) return NextResponse.json({ error: 'Sign in required' }, { status: 401 }); try { const data = schema.parse(await req.json()); const comment = await prisma.$transaction(async tx => { const c = await tx.comment.create({ data: { body: data.body, parentId: data.parentId, postId: params.id, authorId: session.user.id }, include: { author: { select: { username: true } } } }); await tx.post.update({ where: { id: params.id }, data: { commentCount: { increment: 1 } } }); return c; }); return NextResponse.json(comment, { status: 201 }); } catch (e) { return NextResponse.json({ error: e instanceof z.ZodError ? e.issues[0].message : 'Could not add comment' }, { status: 400 }); } }
