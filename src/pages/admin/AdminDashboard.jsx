import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Plus,
  Receipt,
  BarChart3,
  Activity,
  FolderOpen,
  Tag,
  DollarSign,
  Calendar,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dados mockados para demonstração
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalPlanners: 156,
    totalCategories: 48,
    totalAccounts: 312,
    totalTransactions: 2847,
    totalPlans: 5,
  };

  // Dados de transações recentes
  const recentTransactions = [
    {
      id: 1,
      description: "Salário mensal",
      amount: 5000.0,
      is_income: true,
      date: "2024-01-15",
      category: "Salário",
    },
    {
      id: 2,
      description: "Supermercado",
      amount: 320.5,
      is_income: false,
      date: "2024-01-14",
      category: "Alimentação",
    },
    {
      id: 3,
      description: "Conta de luz",
      amount: 180.0,
      is_income: false,
      date: "2024-01-13",
      category: "Utilidades",
    },
    {
      id: 4,
      description: "Freelance design",
      amount: 1200.0,
      is_income: true,
      date: "2024-01-12",
      category: "Freelance",
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600 mt-1">
                Bem-vindo de volta, {user?.first_name || "Administrador"}! 👋
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/plans")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Novo Plano
              </button>
            </div>
          </div>
        </div>

        {/* Cards de estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total de Usuários
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <TrendingUp size={12} className="mr-1" />
                    +12.5%
                  </span>
                  <span className="text-sm text-gray-500">vs mês anterior</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Usuários Ativos
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.activeUsers.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <TrendingUp size={12} className="mr-1" />
                    +8.3%
                  </span>
                  <span className="text-sm text-gray-500">vs mês anterior</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Planners Criados
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.totalPlanners.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <TrendingUp size={12} className="mr-1" />
                    +15.2%
                  </span>
                  <span className="text-sm text-gray-500">vs mês anterior</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Transações
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.totalTransactions.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    <TrendingUp size={12} className="mr-1" />
                    +22.1%
                  </span>
                  <span className="text-sm text-gray-500">vs mês anterior</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Receipt className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Cards secundários */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Categorias
              </h3>
              <Tag className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCategories}
                </p>
                <p className="text-sm text-gray-500">categorias ativas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contas</h3>
              <Wallet className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalAccounts}
                </p>
                <p className="text-sm text-gray-500">contas cadastradas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Planos</h3>
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPlans}
                </p>
                <p className="text-sm text-gray-500">planos disponíveis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de transações recentes e ações rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transações recentes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Transações Recentes
              </h3>
              <button
                onClick={() => navigate("/admin/transactions")}
                className="text-yellow-600 hover:text-yellow-700 font-medium text-sm flex items-center gap-1"
              >
                Ver todas
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.is_income ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.is_income ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.is_income
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.is_income ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Ações Rápidas
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/admin/users")}
                className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors">
                  <Users className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    Gerenciar Usuários
                  </p>
                  <p className="text-sm text-gray-500">
                    Visualizar e editar usuários do sistema
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors ml-auto" />
              </button>

              <button
                onClick={() => navigate("/admin/plans")}
                className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all group"
              >
                <div className="w-12 h-12 bg-green-100 group-hover:bg-green-500 rounded-xl flex items-center justify-center transition-colors">
                  <CreditCard className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    Planos de Assinatura
                  </p>
                  <p className="text-sm text-gray-500">
                    Criar e gerenciar planos premium
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors ml-auto" />
              </button>

              <button
                onClick={() => navigate("/admin/transactions")}
                className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-500 rounded-xl flex items-center justify-center transition-colors">
                  <Receipt className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Ver Transações</p>
                  <p className="text-sm text-gray-500">
                    Acompanhar todas as transações
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors ml-auto" />
              </button>

              <button
                onClick={() => navigate("/admin/planners")}
                className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all group"
              >
                <div className="w-12 h-12 bg-orange-100 group-hover:bg-orange-500 rounded-xl flex items-center justify-center transition-colors">
                  <FolderOpen className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Planners</p>
                  <p className="text-sm text-gray-500">
                    Gerenciar planners financeiros
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors ml-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
