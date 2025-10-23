import BasePage from "../../components/layout/BasePage";
import { usePlanner } from "../../hooks/usePlanner.jsx";
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
  const { selectedPlanner } = usePlanner();

  return (
    <BasePage 
      pageTitle={selectedPlanner ? selectedPlanner.name : "Dashboard"}
      showPlannerSelector={true}
    >
      <div className="space-y-6">
        {/* Informações do Planner */}
        {selectedPlanner && (
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedPlanner.name}</h2>
                  <p className="text-primary-100">
                    {selectedPlanner.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-100">Membros</p>
                <p className="text-2xl font-bold">
                  {selectedPlanner.members_count}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600">Saldo Total</p>
                <p className="text-2xl font-bold text-gray-800">R$ 12.450,00</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-semibold">+5.2%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600">Receitas</p>
                <p className="text-2xl font-bold text-gray-800">R$ 8.500,00</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-success">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-semibold">+12.3%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600">Despesas</p>
                <p className="text-2xl font-bold text-gray-800">R$ 3.200,00</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-danger">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-red-600 font-semibold">-2.1%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600">Investimentos</p>
                <p className="text-2xl font-bold text-gray-800">R$ 7.150,00</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-info">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-semibold">+8.7%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>
        </div>

        {/* Gráficos e Análises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Gastos por Categoria */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Gastos por Categoria
              </h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-primary-500"></div>
                  <span className="text-sm text-gray-600">Alimentação</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  R$ 1.200,00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-danger"></div>
                  <span className="text-sm text-gray-600">Transporte</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  R$ 800,00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-info"></div>
                  <span className="text-sm text-gray-600">Entretenimento</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  R$ 600,00
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-warning"></div>
                  <span className="text-sm text-gray-600">Outros</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  R$ 600,00
                </span>
              </div>
            </div>
          </div>

          {/* Metas Financeiras */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Metas Financeiras
              </h3>
              <Target className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Reserva de Emergência
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    75%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  R$ 7.500 de R$ 10.000
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Viagem para Europa
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    45%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: "45%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  R$ 4.500 de R$ 10.000
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Carro Novo</span>
                  <span className="text-sm font-semibold text-gray-800">
                    20%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: "20%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  R$ 6.000 de R$ 30.000
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transações Recentes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Transações Recentes
            </h3>
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Supermercado
                  </p>
                  <p className="text-xs text-gray-500">Hoje, 14:30</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-red-600">
                -R$ 120,00
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Salário</p>
                  <p className="text-xs text-gray-500">Ontem, 09:00</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600">
                +R$ 5.000,00
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-info/20">
                  <BarChart3 className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Investimento
                  </p>
                  <p className="text-xs text-gray-500">2 dias atrás</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-info">
                +R$ 500,00
              </span>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
}
