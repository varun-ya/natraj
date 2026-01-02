'use client'

import { HabitWithLogs } from '@/types/habit'
import { CheckboxCell } from './CheckboxCell'

interface HabitRowProps {
  habit: HabitWithLogs
  dates: string[]
  onToggle: (habitId: string, date: string) => void
  getLogForDate: (habitId: string, date: string) => any
  disabled?: boolean
}

export function HabitRow({ habit, dates, onToggle, getLogForDate, disabled }: HabitRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 px-3 text-sm font-medium text-gray-900 sticky left-0 bg-white">
        {habit.habitName}
      </td>
      {dates.map((date) => (
        <CheckboxCell
          key={date}
          habitId={habit.id}
          date={date}
          log={getLogForDate(habit.id, date)}
          onToggle={onToggle}
          disabled={disabled}
        />
      ))}
    </tr>
  )
}