import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import AdminLogin from './pages/auth/AdminLogin'
import DashboardPage from './pages/dashboard/DashboardPage'
import { ROUTES } from './config/constants'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<DashboardPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
