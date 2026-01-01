import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createHabitSchema } from '@/lib/validations/habit';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }

    const habits = await prisma.habit.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(habits);
  } catch (error) {
    return errorResponse('Failed to fetch habits', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const validatedData = createHabitSchema.parse(body);

    const habit = await prisma.habit.create({
      data: {
        ...validatedData,
        userId: session.user.id
      }
    });

    return successResponse(habit, 'Habit created successfully');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(error.errors[0].message);
    }
    return errorResponse('Failed to create habit', 500);
  }
}