import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }

    const { id: habitId } = params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id }
    });

    if (!habit) {
      return errorResponse('Habit not found', 404);
    }

    const whereClause: any = { habitId };

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const habitLogs = await prisma.habitLog.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    });

    return successResponse(habitLogs);
  } catch (error) {
    return errorResponse('Failed to fetch habit logs', 500);
  }
}