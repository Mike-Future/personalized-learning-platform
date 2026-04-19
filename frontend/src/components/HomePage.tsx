import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/userStore'
import { LearningDashboard } from './LearningDashboard'
import { Zap, Brain, TrendingUp, Award } from 'lucide-react'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">LearnAI</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-gray-900 font-medium hover:text-blue-600 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Your AI-Powered <span className="text-blue-600">Learning Companion</span>
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Learn at your own pace with personalized courses, intelligent recommendations, and adaptive difficulty that grows with you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Start Learning for Free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Sign In to Continue
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose LearnAI?
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-gray-600">
                Machine learning algorithms personalize your learning path
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Adaptive Difficulty</h4>
              <p className="text-gray-600">
                Courses adjust to match your skill level in real-time
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h4>
              <p className="text-gray-600">
                Visualize your learning journey with detailed analytics
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Earn Badges</h4>
              <p className="text-gray-600">
                Unlock achievements and celebrate your milestones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-600">10K+</p>
            <p className="text-gray-600 mt-2">Active Learners</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">500+</p>
            <p className="text-gray-600 mt-2">Courses Available</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">95%</p>
            <p className="text-gray-600 mt-2">Completion Rate</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h3>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of learners who are already benefiting from AI-powered personalized education.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Free Trial Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 LearnAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export const HomePage: React.FC = () => {
  const { user } = useUserStore()

  // If user is logged in, show the dashboard
  if (user) {
    return <LearningDashboard />
  }

  // Otherwise show the landing page
  return <LandingPage />
}
