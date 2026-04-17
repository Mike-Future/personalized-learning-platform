import React from 'react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { BookOpen, Target, TrendingUp, Award } from 'lucide-react'
import { RecommendationCard } from './RecommendationCard'
import { useUserStore } from '../store/userStore'

const skillData = [
  { subject: 'Math', A: 120, fullMark: 150 },
  { subject: 'Science', A: 98, fullMark: 150 },
  { subject: 'Programming', A: 86, fullMark: 150 },
  { subject: 'Design', A: 99, fullMark: 150 },
  { subject: 'Communication', A: 85, fullMark: 150 },
  { subject: 'Leadership', A: 65, fullMark: 150 },
]

const mockRecommendations = [
  {
    courseId: 1,
    title: 'Advanced Machine Learning',
    description: 'Deep dive into neural networks, reinforcement learning, and generative models.',
    category: 'AI/ML',
    difficulty: 'advanced',
    confidenceScore: 0.92,
    reasoning: 'Based on your strong performance in Python and Data Structures'
  },
  {
    courseId: 2,
    title: 'System Design Fundamentals',
    description: 'Learn to design scalable distributed systems and architectures.',
    category: 'Software Engineering',
    difficulty: 'intermediate',
    confidenceScore: 0.87,
    reasoning: 'Complements your current learning path in backend development'
  },
  {
    courseId: 3,
    title: 'Data Visualization Mastery',
    description: 'Create compelling visualizations with D3.js and modern tools.',
    category: 'Data Science',
    difficulty: 'intermediate',
    confidenceScore: 0.84,
    reasoning: 'Visual learners like you excel in this type of content'
  }
]

export const LearningDashboard: React.FC = () => {
  const { user } = useUserStore()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName || 'Student'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Your AI-powered learning journey continues. Here's what's personalized for you today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            label="Learning Hours"
            value="42"
            trend="+12%"
            color="blue"
          />
          <StatCard
            icon={Target}
            label="Goals Completed"
            value="8"
            trend="+5%"
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Current Streak"
            value="12 days"
            trend="Best!"
            color="purple"
          />
          <StatCard
            icon={Award}
            label="Skill Level"
            value={user?.currentLevel || 'Intermediate'}
            trend="Advancing"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recommended for You
            </h2>
            <div className="grid gap-4">
              {mockRecommendations.map((rec, idx) => (
                <RecommendationCard
                  key={rec.courseId}
                  recommendation={rec}
                  index={idx}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skill Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Your Skills"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4 text-center">
              AI analysis of your learning patterns
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Learning Path</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200" />
            <div className="space-y-8">
              <PathItem
                title="Python Fundamentals"
                status="completed"
                progress={100}
              />
              <PathItem
                title="Data Structures & Algorithms"
                status="in_progress"
                progress={65}
              />
              <PathItem
                title="Machine Learning Basics"
                status="locked"
                progress={0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard: React.FC<{
  icon: React.ElementType
  label: string
  value: string | number
  trend: string
  color: string
}> = ({ icon: Icon, label, value, trend, color }) => {
  const colorStyles: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600' },
  }

  const style = colorStyles[color] ?? colorStyles.gray

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className={`${style.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`${style.text} w-6 h-6`} />
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
      <div className="flex items-end justify-between mt-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className={`${style.text} text-sm font-medium`}>{trend}</span>
      </div>
    </div>
  )
}

const PathItem: React.FC<{
  title: string
  status: 'completed' | 'in_progress' | 'locked'
  progress: number
}> = ({ title, status, progress }) => (
  <div className="flex items-center ml-4">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
      status === 'completed' ? 'bg-green-500' :
      status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
    }`}>
      {status === 'completed' ? '✓' : status === 'in_progress' ? '●' : '○'}
    </div>
    <div className="ml-6 flex-1">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      {status === 'in_progress' && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{progress}% complete</span>
        </div>
      )}
    </div>
  </div>
)
