import BasePage from "../../components/layout/BasePage";
import { usePlanner } from "../../hooks/usePlanner.jsx";
import { usePlannerColor } from "../../hooks/usePlannerColor.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  BarChart3,
  Target,
  AlertCircle,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { selectedPlanner } = usePlanner();
  const colors = usePlannerColor();

  // Verifica se há planner selecionado, se não, redireciona para seleção
  useEffect(() => {
    const storedPlanner = localStorage.getItem(
      "finplanner_v2_selected_planner"
    );
    
    if (!storedPlanner && !selectedPlanner) {
      navigate("/planner/selection");
    }
  }, [selectedPlanner, navigate]);

  return (
    <BasePage
      pageTitle={selectedPlanner ? selectedPlanner.name : "Dashboard"}
      showPlannerSelector={true}
    >
      <div className="space-y-6">
        {/* Informações do Planner */}
        {selectedPlanner && (
          <div
            className="rounded-xl p-6 text-white"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedPlanner.name}</h2>
                  <p className="text-white/80">{selectedPlanner.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80">Membros</p>
                <p className="text-2xl font-bold">
                  {selectedPlanner.members_count}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  Saldo Total
                </p>
                <p className="text-2xl font-bold text-white">R$ 12.450,00</p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 font-semibold">+5.2%</span>
              <span className="text-gray-300 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400">Receitas</p>
                <p className="text-2xl font-bold text-white">R$ 8.500,00</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 font-semibold">+12.3%</span>
              <span className="text-gray-300 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400">Despesas</p>
                <p className="text-2xl font-bold text-white">R$ 3.200,00</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-500">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
              <span className="text-red-400 font-semibold">-2.1%</span>
              <span className="text-gray-300 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400">Investimentos</p>
                <p className="text-2xl font-bold text-white">R$ 7.150,00</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 font-semibold">+8.7%</span>
              <span className="text-gray-300 ml-1">vs mês anterior</span>
            </div>
          </div>
        </div>

        {/* Gráficos e Análises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Gastos por Categoria */}
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Gastos por Categoria
              </h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded shadow-sm"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  <span className="text-sm text-gray-300">Alimentação</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  R$ 1.200,00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-sm text-gray-300">Transporte</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  R$ 800,00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-blue-500"></div>
                  <span className="text-sm text-gray-300">Entretenimento</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  R$ 600,00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-sm text-gray-300">Outros</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  R$ 600,00
                </span>
              </div>
            </div>
          </div>

          {/* Metas Financeiras */}
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Metas Financeiras
              </h3>
              <Target className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">
                    Reserva de Emergência
                  </span>
                  <span className="text-sm font-semibold text-white">75%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: "75%",
                      backgroundColor: colors.primary,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  R$ 7.500 de R$ 10.000
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">
                    Viagem para Europa
                  </span>
                  <span className="text-sm font-semibold text-white">45%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: "45%",
                      backgroundColor: colors.primary,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  R$ 4.500 de R$ 10.000
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Carro Novo</span>
                  <span className="text-sm font-semibold text-white">20%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: "20%",
                      backgroundColor: colors.primary,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  R$ 6.000 de R$ 30.000
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transações Recentes */}
        <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Transações Recentes
            </h3>
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Supermercado
                  </p>
                  <p className="text-xs text-gray-400">Hoje, 14:30</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-red-400">
                -R$ 120,00
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Salário</p>
                  <p className="text-xs text-gray-400">Ontem, 09:00</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-400">
                +R$ 5.000,00
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/20 border border-blue-500/30">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Investimento
                  </p>
                  <p className="text-xs text-gray-400">2 dias atrás</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-blue-400">
                +R$ 500,00
              </span>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
}
