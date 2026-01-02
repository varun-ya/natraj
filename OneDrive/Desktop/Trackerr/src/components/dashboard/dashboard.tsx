'use client'

import { useState, useEffect } from 'react'
import HabitList from './habit-list'
import HabitTable from './habit-table'
import AnalyticsPanel from './analytics-panel'
import { HabitWithLogs } from '@/types/habit'

export default function Dashboard() {
  const [habits, setHabits] = useState<HabitWithLogs[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits')
      if (response.ok) {
        const data = await response.json()
        setHabits(data)
      }
    } catch (error) {
      console.error('Failed to fetch habits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3 h-64 bg-gray-200 rounded"></div>
              <div className="lg:col-span-6 h-64 bg-gray-200 rounded"></div>
              <div className="lg:col-span-3 h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
          <p className="text-gray-600">Track your daily habits and build better routines</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Habit List */}
          <div className="lg:col-span-3">
            <HabitList />
          </div>
          
          {/* Center: Habit Table */}
          <div className="lg:col-span-6">
            <HabitTable habits={habits} />
          </div>
          
          {/* Right: Analytics Panel */}
          <div className="lg:col-span-3">
            <AnalyticsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}