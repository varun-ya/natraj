export default function AnalyticsPanel() {
  const stats = [
    { label: 'Streak', value: '7 days', color: 'text-green-600' },
    { label: 'Completion', value: '85%', color: 'text-blue-600' },
    { label: 'Best Habit', value: 'Exercise', color: 'text-purple-600' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h2>
      
      <div className="space-y-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{stat.label}</span>
            <span className={`text-lg font-semibold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Weekly Progress</h3>
        <div className="space-y-2">
          {['Morning Exercise', 'Read 30 min', 'Drink Water'].map((habit, index) => (
            <div key={habit}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{habit}</span>
                <span>{85 - index * 10}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${85 - index * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}