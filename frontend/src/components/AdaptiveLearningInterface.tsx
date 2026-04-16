import React, { useEffect, useRef, useState } from 'react'
import { useUserStore } from '../store/userStore'
import { AlertCircle, Lightbulb, RotateCcw, SkipForward } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Intervention {
  type: string
  action: string
  message: string
}

export const AdaptiveLearningInterface: React.FC<{ moduleId: number }> = ({ moduleId }) => {
  const ws = useRef<WebSocket | null>(null)
  const [intervention, setIntervention] = useState<Intervention | null>(null)
  const [engagement, setEngagement] = useState(100)
  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false)

  useEffect(() => {
    const userId = useUserStore.getState().user?.id
    if (!userId) return

    ws.current = new WebSocket(`ws://localhost:8000/api/v1/learning/ws/${userId}`)

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'intervention':
          setIntervention(data.data)
          break
        case 'engagement_alert':
          setShowBreakSuggestion(true)
          setEngagement(30)
          break
        case 'next_review':
          break
      }
    }

    return () => ws.current?.close()
  }, [moduleId])

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg">
        <div className={`w-3 h-3 rounded-full ${
          engagement > 70 ? 'bg-green-500' : engagement > 40 ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        <span className="text-sm font-medium">Focus Level</span>
      </div>

      <AnimatePresence>
        {intervention && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center text-orange-500 mb-4">
                <AlertCircle className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold">Having trouble?</h3>
              </div>

              <p className="text-gray-600 mb-6">{intervention.message}</p>

              <div className="space-y-3">
                <button
                  onClick={() => setIntervention(null)}
                  className="w-full flex items-center justify-center p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Show me a simpler explanation
                </button>

                <button
                  onClick={() => setIntervention(null)}
                  className="w-full flex items-center justify-center p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Review previous material
                </button>

                <button
                  onClick={() => setIntervention(null)}
                  className="w-full flex items-center justify-center p-3 text-gray-500 hover:text-gray-700"
                >
                  <SkipForward className="w-5 h-5 mr-2" />
                  Skip for now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBreakSuggestion && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            <div>
              <p className="font-medium">Time for a break?</p>
              <p className="text-sm">Your focus level seems low. A 5-minute break might help!</p>
            </div>
            <button
              onClick={() => setShowBreakSuggestion(false)}
              className="ml-4 text-yellow-600 hover:text-yellow-800"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
