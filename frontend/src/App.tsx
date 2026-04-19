import { Routes, Route } from 'react-router-dom'
import { HomePage } from './components/HomePage'
import { LoginPage } from './components/LoginPage'
import { SignupPage } from './components/SignupPage'
import { LearningDashboard } from './components/LearningDashboard'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<LearningDashboard />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
