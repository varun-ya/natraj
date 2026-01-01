import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

interface RouteParams {
  params: {
    id: string;
    date: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }

    const { id: habitId, date } = params;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return errorResponse('Invalid date format. Use YYYY-MM-DD');
    }

    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id }
    });

    if (!habit) {
      return errorResponse('Habit not found', 404);
    }

    const logDate = new Date(date);

    // Toggle completion using upsert for idempotency
    const existingLog = await prisma.habitLog.findUnique({
      where: { habitId_date: { habitId, date: logDate } }
    });

    const habitLog = await prisma.habitLog.upsert({
      where: { habitId_date: { habitId, date: logDate } },
      update: { completed: !existingLog?.completed },
      create: { habitId, date: logDate, completed: true }
    });

    return successResponse(habitLog, `Habit ${habitLog.completed ? 'completed' : 'uncompleted'}`);
  } catch (error) {
    return errorResponse('Failed to toggle habit completion', 500);
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }

    const { id: habitId, date } = params;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return errorResponse('Invalid date format. Use YYYY-MM-DD');
    }

    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id }
    });

    if (!habit) {
      return errorResponse('Habit not found', 404);
    }

    const logDate = new Date(date);
    const habitLog = await prisma.habitLog.findUnique({
      where: { habitId_date: { habitId, date: logDate } }
    });

    return successResponse(habitLog || { habitId, date: logDate, completed: false });
  } catch (error) {
    return errorResponse('Failed to fetch habit log', 500);
  }
}