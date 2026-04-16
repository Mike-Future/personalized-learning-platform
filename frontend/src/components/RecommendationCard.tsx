import React from 'react'
import { motion } from 'framer-motion'
import { Star, TrendingUp, Brain } from 'lucide-react'
import { useUserStore } from '../store/userStore'

interface Props {
  recommendation: {
    courseId: number
    title: string
    description: string
    category: string
    difficulty: string
    confidenceScore: number
    reasoning: string
  }
  index: number
}

export const RecommendationCard: React.FC<Props> = ({ recommendation, index }) => {
  const { user } = useUserStore()

  const getDifficultyColor = (diff: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    }
    return colors[diff] || 'bg-gray-100'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recommendation.difficulty)}`}>
            {recommendation.difficulty}
          </span>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">
              {(recommendation.confidenceScore * 100).toFixed(0)}% match
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {recommendation.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {recommendation.description}
        </p>

        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-start">
            <Brain className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Why this course: </span>
              {recommendation.reasoning}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {recommendation.category}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Start Learning
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1" />
    </motion.div>
  )
}
