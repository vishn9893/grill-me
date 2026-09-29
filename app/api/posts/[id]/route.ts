import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(_: Request, { params }: { params: { id: string } }) { const post = await prisma.post.findUnique({ where: { id: params.id }, include: { author: { select: { username: true, karma: true } }, category: true, comments: { where: { deletedAt: null }, include: { author: { select: { username: true } } }, orderBy: { createdAt: 'asc' } } } }); if (!post || post.deletedAt) return NextResponse.json({ error: 'Not found' }, { status: 404 }); return NextResponse.json(post); }
