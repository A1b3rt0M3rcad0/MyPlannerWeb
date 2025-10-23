import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Loader2,
  UserPlus,
  Zap,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { dashboardAPI } from "../../services/api/dashboard";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar dados do dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getStats();
        // A API retorna os dados diretamente, mas precisamos mapear de snake_case para camelCase
        setStats({
          totalUsers: response.total_users,
          activeSubscriptions: response.active_subscriptions,
          recentUsers: response.recent_users,
        });
        setError(null); // Limpar erro se houver
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setError("Erro ao carregar dados do dashboard");
        // Em caso de erro, usar dados mockados como fallback
        setStats({
          totalUsers: 10,
          activeSubscriptions: 3,
          recentUsers: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

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

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header mais compacto */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  Dashboard Administrativo
                </h1>
                <p className="text-sm text-gray-600">
                  Bem-vindo de volta, {user?.first_name || "Administrador"}! 👋
                </p>
                {error && (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ {error} (exibindo dados de exemplo)
                  </p>
                )}
              </div>
              <div className="hidden lg:block">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de estatísticas compactos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total de usuários */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Total de Usuários
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                    ) : (
                      stats.totalUsers?.toLocaleString() || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Planos ativos */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Planos Ativos
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                    ) : (
                      stats.activeSubscriptions || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usuários recentes */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Novos (7 dias)
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                    ) : (
                      stats.recentUsers?.length || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Taxa de crescimento */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Crescimento
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">+12%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de usuários recentes compacta */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Usuários Recentes
                  </h3>
                  <p className="text-sm text-gray-500">
                    Criados nos últimos 7 dias
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : stats.recentUsers?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            user.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.is_active ? "Ativo" : "Inativo"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(user.created_at).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Nenhum usuário recente
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ações rápidas compactas */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ações Rápidas
                </h3>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                  onClick={() => navigate("/admin/users")}
                  className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Usuários
                  </span>
                </button>

                <button
                  onClick={() => navigate("/admin/subscription-plans")}
                  className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <CreditCard className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Planos
                  </span>
                </button>

                <button
                  onClick={() => navigate("/admin/planners")}
                  className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Planners
                  </span>
                </button>

                <button
                  onClick={() => navigate("/admin/categories")}
                  className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                    <Tag className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Categorias
                  </span>
                </button>

                <button
                  onClick={() => navigate("/admin/accounts")}
                  className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                    <Wallet className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Contas
                  </span>
                </button>

                <button
                  onClick={() => navigate("/admin/transactions")}
                  className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mb-2">
                    <Receipt className="w-4 h-4 text-pink-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Transações
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
