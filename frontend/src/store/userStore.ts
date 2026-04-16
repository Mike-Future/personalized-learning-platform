import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: User | null
  learningProfile: LearningProfile | null
  recommendations: Recommendation[]
  setUser: (user: User) => void
  updateLearningProfile: (profile: Partial<LearningProfile>) => void
  setRecommendations: (recs: Recommendation[]) => void
}

interface User {
  id: number
  email: string
  fullName: string
  role: 'student' | 'instructor' | 'admin'
  currentLevel: string
  learningStyle: string
}

interface LearningProfile {
  interests: string[]
  weakAreas: string[]
  strongAreas: string[]
  totalLearningTime: number
  preferredContentTypes: string[]
}

interface Recommendation {
  courseId: number
  title: string
  confidenceScore: number
  reasoning: string
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      learningProfile: null,
      recommendations: [],
      setUser: (user) => set({ user }),
      updateLearningProfile: (profile) =>
        set((state) => ({
          learningProfile: { ...state.learningProfile, ...profile },
        })),
      setRecommendations: (recommendations) => set({ recommendations }),
    }),
    {
      name: 'user-storage',
    }
  )
)
