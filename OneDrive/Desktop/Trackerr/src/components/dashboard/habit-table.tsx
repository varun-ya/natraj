'use client'

import { HabitWithLogs } from '@/types/habit'
import { HabitRow } from './HabitRow'
import { useHabitLogs } from './useHabitLogs'

interface HabitChecklistTableProps {
  habits: HabitWithLogs[]
}

export default function HabitChecklistTable({ habits }: HabitChecklistTableProps) {
  const { habits: habitsWithLogs, toggleHabitLog, getLogForDate, isUpdating } = useHabitLogs(habits)
  
  // Generate last 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })
  
  const dayLabels = dates.map(date => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { weekday: 'short' })
  })
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-600 sticky left-0 bg-white">
                Habit
              </th>
              {dayLabels.map((day, index) => (
                <th key={dates[index]} className="text-center py-2 px-3 text-sm font-medium text-gray-600">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {habitsWithLogs.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                dates={dates}
                onToggle={toggleHabitLog}
                getLogForDate={getLogForDate}
                disabled={isUpdating}
              />
            ))}
          </tbody>
        </table>
      </div>
      {habitsWithLogs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No habits yet. Create your first habit to get started!
        </div>
      )}
    </div>
  )
}