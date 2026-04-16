import { Routes, Route } from 'react-router-dom'
import { LearningDashboard } from './components/LearningDashboard'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LearningDashboard />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
