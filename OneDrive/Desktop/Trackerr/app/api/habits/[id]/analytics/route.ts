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

    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id }
    });

    if (!habit) {
      return errorResponse('Habit not found', 404);
    }

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Get all logs for the last 30 days
    const logs = await prisma.habitLog.findMany({
      where: {
        habitId,
        date: {
          gte: thirtyDaysAgo,
          lte: today
        }
      },
      orderBy: { date: 'desc' }
    });

    // Calculate analytics
    const analytics = calculateAnalytics(logs, habit.frequency);

    return successResponse(analytics);
  } catch (error) {
    return errorResponse('Failed to fetch analytics', 500);
  }
}

function calculateAnalytics(logs: any[], frequency: string) {
  const today = new Date();
  const completedLogs = logs.filter(log => log.completed);
  
  // Daily completion (today)
  const todayLog = logs.find(log => 
    new Date(log.date).toDateString() === today.toDateString()
  );
  const dailyCompletion = todayLog?.completed || false;

  // Completion percentage (last 30 days)
  const totalDays = Math.min(30, getDaysSinceCreation(logs));
  const completionPercentage = totalDays > 0 ? 
    Math.round((completedLogs.length / totalDays) * 100) : 0;

  // Current streak calculation
  const currentStreak = calculateCurrentStreak(logs, frequency);

  // Weekly aggregation (last 4 weeks)
  const weeklyStats = calculateWeeklyStats(logs);

  // Monthly aggregation (current month)
  const monthlyStats = calculateMonthlyStats(logs);

  return {
    dailyCompletion,
    completionPercentage,
    currentStreak,
    weeklyStats,
    monthlyStats,
    totalCompletions: completedLogs.length,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Streak Logic:
 * - For daily habits: consecutive days with completed logs
 * - For weekly habits: consecutive weeks with at least one completion
 * - For monthly habits: consecutive months with at least one completion
 * - Streak breaks if there's a gap in the expected frequency
 */
function calculateCurrentStreak(logs: any[], frequency: string): number {
  if (logs.length === 0) return 0;

  const sortedLogs = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  
  switch (frequency) {
    case 'daily':
      return calculateDailyStreak(sortedLogs, today);
    case 'weekly':
      return calculateWeeklyStreak(sortedLogs, today);
    case 'monthly':
      return calculateMonthlyStreak(sortedLogs, today);
    default:
      return 0;
  }
}

function calculateDailyStreak(logs: any[], today: Date): number {
  let streak = 0;
  let currentDate = new Date(today);
  
  // Check if today is completed (streak can continue)
  const todayLog = logs.find(log => 
    new Date(log.date).toDateString() === currentDate.toDateString()
  );
  
  // If today is not completed, check yesterday
  if (!todayLog?.completed) {
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  // Count consecutive completed days backwards
  for (let i = 0; i < logs.length; i++) {
    const log = logs.find(l => 
      new Date(l.date).toDateString() === currentDate.toDateString()
    );
    
    if (log?.completed) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateWeeklyStreak(logs: any[], today: Date): number {
  const weeklyCompletions = new Map<string, boolean>();
  
  logs.forEach(log => {
    if (log.completed) {
      const weekKey = getWeekKey(new Date(log.date));
      weeklyCompletions.set(weekKey, true);
    }
  });
  
  let streak = 0;
  let currentWeek = getWeekKey(today);
  
  while (weeklyCompletions.has(currentWeek)) {
    streak++;
    const weekDate = new Date(currentWeek);
    weekDate.setDate(weekDate.getDate() - 7);
    currentWeek = getWeekKey(weekDate);
  }
  
  return streak;
}

function calculateMonthlyStreak(logs: any[], today: Date): number {
  const monthlyCompletions = new Map<string, boolean>();
  
  logs.forEach(log => {
    if (log.completed) {
      const monthKey = getMonthKey(new Date(log.date));
      monthlyCompletions.set(monthKey, true);
    }
  });
  
  let streak = 0;
  let currentMonth = getMonthKey(today);
  
  while (monthlyCompletions.has(currentMonth)) {
    streak++;
    const monthDate = new Date(currentMonth + '-01');
    monthDate.setMonth(monthDate.getMonth() - 1);
    currentMonth = getMonthKey(monthDate);
  }
  
  return streak;
}

function calculateWeeklyStats(logs: any[]) {
  const weeks = [];
  const today = new Date();
  
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (today.getDay() + 7 * i));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= weekStart && logDate <= weekEnd;
    });
    
    const completions = weekLogs.filter(log => log.completed).length;
    
    weeks.unshift({
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      completions,
      totalDays: weekLogs.length,
      percentage: weekLogs.length > 0 ? Math.round((completions / weekLogs.length) * 100) : 0
    });
  }
  
  return weeks;
}

function calculateMonthlyStats(logs: any[]) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const monthLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
  });
  
  const completions = monthLogs.filter(log => log.completed).length;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  return {
    month: today.toLocaleString('default', { month: 'long', year: 'numeric' }),
    completions,
    totalDays: monthLogs.length,
    daysInMonth,
    percentage: monthLogs.length > 0 ? Math.round((completions / monthLogs.length) * 100) : 0
  };
}

function getDaysSinceCreation(logs: any[]): number {
  if (logs.length === 0) return 0;
  
  const oldestLog = logs.reduce((oldest, log) => 
    new Date(log.date) < new Date(oldest.date) ? log : oldest
  );
  
  const today = new Date();
  const creationDate = new Date(oldestLog.date);
  const diffTime = Math.abs(today.getTime() - creationDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function getWeekKey(date: Date): string {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  return weekStart.toISOString().split('T')[0];
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}