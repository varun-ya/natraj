import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { habitId, date } = await request.json();
    
    const log = await prisma.habitLog.create({
      data: {
        habitId,
        date: new Date(date),
        completed: true,
      },
    });
    
    return NextResponse.json(log);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log habit' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('habitId');
    
    if (!habitId) {
      return NextResponse.json({ error: 'Habit ID required' }, { status: 400 });
    }
    
    const logs = await prisma.habitLog.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
    });
    
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}