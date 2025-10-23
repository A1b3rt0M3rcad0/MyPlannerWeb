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

export default function Header({ pageTitle, showPlannerSelector = false }) {
  const navigate = useNavigate();

  // Tenta usar o hook usePlanner, mas não falha se não estiver disponível
  let selectedPlanner = null;
  try {
    const plannerContext = usePlanner();
    selectedPlanner = plannerContext?.selectedPlanner;
  } catch (error) {
    // Se não estiver dentro do PlannerProvider, selectedPlanner será null
    selectedPlanner = null;
  }

  const handleBackToPlannerSelection = () => {
    navigate("/planner/selection");
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
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Título da página */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FP</span>
            </div>

            {showPlannerSelector && selectedPlanner ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToPlannerSelection}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 hover:from-primary-100 hover:to-primary-200 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white">
                      {getPlannerIcon(selectedPlanner.type)}
                    </div>
                    <div className="text-left">
                      <h2 className="text-sm font-semibold text-gray-800 group-hover:text-primary-700">
                        {selectedPlanner.name}
                      </h2>
                      <p className="text-xs text-gray-500 group-hover:text-primary-600">
                        {getPlannerTypeLabel(selectedPlanner.type)} •{" "}
                        {selectedPlanner.members_count} membro
                        {selectedPlanner.members_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </button>
              </div>
            ) : (
              <h1 className="text-xl font-semibold text-gray-800">
                {pageTitle || "FinPlanner V2"}
              </h1>
            )}
          </div>

          {/* Ações do usuário */}
          <div className="flex items-center gap-4">
            {/* Notificações */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Menu do usuário */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">
                    João Silva
                  </p>
                  <p className="text-xs text-gray-500">joao@email.com</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <LogOut className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
