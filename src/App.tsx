import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppProvider } from './context/AppContext'
import Account from './pages/Account'
import CreateJob from './pages/CreateJob'
import Home from './pages/Home'
import HouseProfile from './pages/HouseProfile'
import JobDetail from './pages/JobDetail'
import Login from './pages/Login'
import MyApplications from './pages/MyApplications'
import Onboarding from './pages/Onboarding'
import QuizPage from './pages/Quiz'
import Register from './pages/Register'
import Splash from './pages/Splash'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/crewbar">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vaga/:id"
            element={
              <ProtectedRoute>
                <JobDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute role="bartender">
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/minhas-candidaturas"
            element={
              <ProtectedRoute role="bartender">
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/casa"
            element={
              <ProtectedRoute role="employer">
                <HouseProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nova-vaga"
            element={
              <ProtectedRoute role="employer">
                <CreateJob />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
