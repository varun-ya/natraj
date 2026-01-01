import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateHabitSchema } from '@/lib/validations/habit';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const validatedData = updateHabitSchema.parse(body);

    const habit = await prisma.habit.findFirst({
      where: { 
        id: params.id,
        userId: session.user.id 
      }
    });

    if (!habit) {
      return errorResponse('Habit not found', 404);
    }

    const updatedHabit = await prisma.habit.update({
      where: { id: params.id },
      data: validatedData
    });

    return successResponse(updatedHabit, 'Habit updated successfully');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(error.errors[0].message);
    }
    return errorResponse('Failed to update habit', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }

    const habit = await prisma.habit.findFirst({
      where: { 
        id: params.id,
        userId: session.user.id 
      }
    });

    if (!habit) {
      return errorResponse('Habit not found', 404);
    }

    await prisma.habit.delete({
      where: { id: params.id }
    });

    return successResponse(null, 'Habit deleted successfully');
  } catch (error) {
    return errorResponse('Failed to delete habit', 500);
  }
}