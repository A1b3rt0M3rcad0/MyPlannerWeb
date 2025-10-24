import {
  Bell,
  User,
  Settings,
  LogOut,
  ArrowLeft,
  ChevronDown,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlanner } from "../hooks/usePlanner.jsx";
import { usePlannerColor } from "../hooks/usePlannerColor.js";
import { useAuth } from "../hooks/useAuth";

export default function Header({ pageTitle, showPlannerSelector = false }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Tenta usar o hook usePlanner, mas não falha se não estiver disponível
  let selectedPlanner = null;
  let colors = null;
  try {
    const plannerContext = usePlanner();
    selectedPlanner = plannerContext?.selectedPlanner;
    colors = usePlannerColor();
  } catch (error) {
    // Se não estiver dentro do PlannerProvider, selectedPlanner será null
    selectedPlanner = null;
    colors = null;
  }

  const handleBackToPlannerSelection = () => {
    navigate("/planner/selection");
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      logout();
    }
  };

  const getPlannerIcon = (type) => {
    switch (type) {
      case "personal":
        return <DollarSign className="w-4 h-4" />;
      case "family":
        return <Users className="w-4 h-4" />;
      case "project":
        return <Calendar className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPlannerTypeLabel = (type) => {
    switch (type) {
      case "personal":
        return "Pessoal";
      case "family":
        return "Família";
      case "project":
        return "Projeto";
      default:
        return "Outro";
    }
  };

  return (
    <header className="bg-secondary-900/50 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Título da página */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors?.primary || "#f59e0b" }}
            >
              <span className="text-secondary-900 font-bold text-sm">FP</span>
            </div>

            {showPlannerSelector && selectedPlanner ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToPlannerSelection}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-900"
                      style={{ backgroundColor: colors?.primary || "#f59e0b" }}
                    >
                      {getPlannerIcon(selectedPlanner.type)}
                    </div>
                    <div className="text-left">
                      <h2 className="text-sm font-semibold text-white group-hover:text-primary-400">
                        {selectedPlanner.name}
                      </h2>
                      <p className="text-xs text-gray-300 group-hover:text-primary-300">
                        {getPlannerTypeLabel(selectedPlanner.type)} •{" "}
                        {selectedPlanner.members_count} membro
                        {selectedPlanner.members_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
                </button>
              </div>
            ) : (
              <h1 className="text-xl font-semibold text-white">
                {pageTitle || "FinPlanner V2"}
              </h1>
            )}
          </div>

          {/* Ações do usuário */}
          <div className="flex items-center gap-4">
            {/* Notificações */}
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Menu do usuário */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors?.primary || "#f59e0b" }}
                >
                  <User className="w-4 h-4 text-secondary-900" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">
                    {user?.name || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-300">
                    {user?.email || "email@exemplo.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Configurações"
                >
                  <Settings className="w-4 h-4 text-gray-300" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
