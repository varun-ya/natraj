'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  lastCompleted: string | null;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('habits');
    if (saved) {
      setHabits(JSON.parse(saved));
    }
  }, []);

  const saveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.trim(),
      streak: 0,
      completedToday: false,
      lastCompleted: null
    };
    
    saveHabits([...habits, habit]);
    setNewHabit('');
    setIsAdding(false);
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toDateString();
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        const wasCompletedToday = habit.lastCompleted === today;
        return {
          ...habit,
          completedToday: !wasCompletedToday,
          lastCompleted: wasCompletedToday ? null : today,
          streak: wasCompletedToday ? Math.max(0, habit.streak - 1) : habit.streak + 1
        };
      }
      return habit;
    });
    saveHabits(updatedHabits);
  };

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter(habit => habit.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} />
          Add Habit
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-lg shadow mb-6 border">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Enter habit name..."
            className="w-full p-2 border rounded mb-3"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={addHabit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewHabit('');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {habits.map(habit => (
          <div key={habit.id} className="bg-white p-4 rounded-lg shadow border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleHabit(habit.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  habit.lastCompleted === new Date().toDateString()
                    ? 'bg-green-500 text-white'
                    : 'border-2 border-gray-300 hover:border-green-500'
                }`}
              >
                {habit.lastCompleted === new Date().toDateString() && <Check size={16} />}
              </button>
              <div>
                <h3 className="font-semibold">{habit.name}</h3>
                <p className="text-sm text-gray-600">Streak: {habit.streak} days</p>
              </div>
            </div>
            <button
              onClick={() => deleteHabit(habit.id)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      {habits.length === 0 && !isAdding && (
        <div className="text-center py-12 text-gray-500">
          <p>No habits yet. Add your first habit to get started!</p>
        </div>
      )}
    </div>
  );
}