import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PlannerProvider } from "./contexts/PlannerContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import PlannerSelectionPage from "./pages/planner/PlannerSelectionPage";
import CreatePlannerPage from "./pages/planner/CreatePlannerPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AdminRoutes from "./pages/admin/AdminRoutes";
import { ROUTES } from "./config/constants";

function App() {
  return (
    <AuthProvider>
      <PlannerProvider>
        <Routes>
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
          <Route
            path="/planner/selection"
            element={
              <ProtectedRoute>
                <PlannerSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planner/create"
            element={
              <ProtectedRoute>
                <CreatePlannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </PlannerProvider>
    </AuthProvider>
  );
}

export default App;
