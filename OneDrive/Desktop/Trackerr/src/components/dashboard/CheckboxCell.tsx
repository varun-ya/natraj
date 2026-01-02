'use client'

import { HabitLog } from '@/types/habit'

interface CheckboxCellProps {
  habitId: string
  date: string
  log?: HabitLog
  onToggle: (habitId: string, date: string) => void
  disabled?: boolean
}

export function CheckboxCell({ habitId, date, log, onToggle, disabled }: CheckboxCellProps) {
  const isCompleted = log?.completed || false

  return (
    <td className="py-3 px-3 text-center">
      <button
        onClick={() => onToggle(habitId, date)}
        disabled={disabled}
        className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
          isCompleted
            ? 'bg-green-500 border-green-500 hover:bg-green-600'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label={`Mark ${isCompleted ? 'incomplete' : 'complete'} for ${date}`}
      >
        {isCompleted && (
          <svg className="w-3 h-3 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </td>
  )
}