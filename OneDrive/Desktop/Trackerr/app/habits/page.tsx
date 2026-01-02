'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, Calendar } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  createdAt: string;
}

interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [newHabit, setNewHabit] = useState({ name: '', description: '', frequency: 'daily' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchHabits();
    fetchLogs();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/habit-logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const createHabit = async () => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabit),
      });
      
      if (response.ok) {
        setNewHabit({ name: '', description: '', frequency: 'daily' });
        setShowForm(false);
        fetchHabits();
      }
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  const logHabit = async (habitId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch('/api/habit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, date: today }),
      });
      
      if (response.ok) {
        fetchLogs();
      }
    } catch (error) {
      console.error('Failed to log habit:', error);
    }
  };

  const isCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return logs.some(log => 
      log.habitId === habitId && 
      log.date.split('T')[0] === today && 
      log.completed
    );
  };

  const getStreak = (habitId: string) => {
    const habitLogs = logs
      .filter(log => log.habitId === habitId && log.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < habitLogs.length; i++) {
      const logDate = new Date(habitLogs[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (logDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Habit
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Habit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Habit name"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={newHabit.description}
              onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded"
              value={newHabit.frequency}
              onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <div className="flex gap-2">
              <Button onClick={createHabit}>Create</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <Card key={habit.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {habit.name}
                <Badge variant={isCompletedToday(habit.id) ? "default" : "secondary"}>
                  {habit.frequency}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{habit.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Streak: {getStreak(habit.id)} days</span>
                </div>
              </div>

              <Button
                onClick={() => logHabit(habit.id)}
                disabled={isCompletedToday(habit.id)}
                className="w-full"
                variant={isCompletedToday(habit.id) ? "secondary" : "default"}
              >
                {isCompletedToday(habit.id) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed Today
                  </>
                ) : (
                  'Mark Complete'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No habits yet. Create your first habit to get started!</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Habit
          </Button>
        </div>
      )}
    </div>
  );
}