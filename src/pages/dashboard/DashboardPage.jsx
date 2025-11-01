import BasePage from "../../components/layout/BasePage";
import { usePlanner } from "../../hooks/usePlanner.jsx";
import { usePlannerColor } from "../../hooks/usePlannerColor.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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
  Tag,
  FolderOpen,
} from "lucide-react";
import { dashboardAPI } from "../../services/api/dashboard";
import NoActivePlanPage from "../NoActivePlan";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { selectedPlanner } = usePlanner();
  const colors = usePlannerColor();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasActivePlan, setHasActivePlan] = useState(true);
  const [stats, setStats] = useState({
    total_balance: 0,
    total_income: 0,
    total_expenses: 0,
    total_goals: 0,
    expense_by_category: [],
    goal_progress: [],
    recent_transactions: [],
  });

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
    []
  );

  // Filtro de mês: default = mês atual (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  });

  // Converte selectedMonth para initial_date/final_date (YYYY-MM-DD)
  const { initialDate, finalDate } = useMemo(() => {
    const [yearStr, monthStr] = (selectedMonth || "").split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    const start =
      isNaN(year) || isNaN(month) ? new Date() : new Date(year, month - 1, 1);
    const end =
      isNaN(year) || isNaN(month) ? new Date() : new Date(year, month, 0);
    const toISODate = (d) => d.toISOString().slice(0, 10);
    return { initialDate: toISODate(start), finalDate: toISODate(end) };
  }, [selectedMonth]);

  // Opções de meses (últimos 24 meses) para seleção rápida
  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 24; i += 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const label = d.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      options.push({ value, label });
    }
    return options;
  }, []);

  const currentMonthValue = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const changeMonthBy = (delta) => {
    const [yStr, mStr] = (selectedMonth || currentMonthValue).split("-");
    const y = Number(yStr);
    const m = Number(mStr);
    const d = new Date(y, m - 1 + delta, 1);
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    setSelectedMonth(next);
  };

  const isNextDisabled = useMemo(
    () => selectedMonth >= currentMonthValue,
    [selectedMonth, currentMonthValue]
  );

  // Verifica se há planner selecionado, se não, redireciona para seleção
  useEffect(() => {
    const storedPlanner = localStorage.getItem(
      "finplanner_v2_selected_planner"
    );

    if (!storedPlanner && !selectedPlanner) {
      navigate("/planner/selection");
    }
  }, [selectedPlanner, navigate]);

  // Buscar estatísticas do dashboard do usuário
  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedPlanner?.id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardAPI.getUserStats({
          plannerId: selectedPlanner.id,
          initialDate,
          finalDate,
        });

        // Pequeno delay para melhorar a percepção da animação
        await new Promise((resolve) => setTimeout(resolve, 200));

        setStats({
          total_balance: data?.total_balance ?? 0,
          total_income: data?.total_income ?? 0,
          total_expenses: data?.total_expenses ?? 0,
          total_goals: data?.total_goals ?? 0,
          expense_by_category: Array.isArray(data?.expense_by_category)
            ? data.expense_by_category
            : [],
          goal_progress: Array.isArray(data?.goal_progress)
            ? data.goal_progress
            : [],
          recent_transactions: Array.isArray(data?.recent_transactions)
            ? data.recent_transactions
            : [],
        });
      } catch (e) {
        // Verificar se o erro é de assinatura necessária (403)
        if (e?.response?.status === 403 || e?.response?.data?.error === 'Subscription required') {
          setHasActivePlan(false);
          return;
        }
        setError("Não foi possível carregar os dados do dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedPlanner, initialDate, finalDate]);

  // Se não tem plano ativo, mostrar página de aviso
  if (!hasActivePlan) {
    return <NoActivePlanPage />;
  }

  return (
    <BasePage
      pageTitle={selectedPlanner ? selectedPlanner.name : "Dashboard"}
      showPlannerSelector={true}
    >
      <div
        className={`space-y-6 transition-opacity duration-300 ${
          loading ? "opacity-50" : "opacity-100"
        }`}
      >
        {/* Filtro de período (mês) - controles mais atrativos */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => changeMonthBy(-1)}
            className="px-2 py-1 text-sm rounded border border-white/10 text-gray-200 bg-secondary-800/50 hover:bg-secondary-700/50"
            aria-label="Mês anterior"
            title="Mês anterior"
          >
            ◀
          </button>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-secondary-800/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20"
            aria-label="Selecionar mês"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label.charAt(0).toUpperCase() + opt.label.slice(1)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => changeMonthBy(1)}
            disabled={isNextDisabled}
            className={`px-2 py-1 text-sm rounded border border-white/10 ${
              isNextDisabled
                ? "text-gray-500 bg-secondary-800/30"
                : "text-gray-200 bg-secondary-800/50 hover:bg-secondary-700/50"
            }`}
            aria-label="Próximo mês"
            title="Próximo mês"
          >
            ▶
          </button>
        </div>
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

        {/* Mensagens de estado */}
        {error && (
          <div className="rounded-lg p-3 text-sm bg-red-500/10 border border-red-500/30 text-red-300">
            {error}
          </div>
        )}

        {/* Cards de Resumo */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${
            !loading ? "dashboard-stagger" : ""
          }`}
        >
          {loading ? (
            // Skeleton loading para os 4 cards
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-white/10 rounded mb-3"></div>
                      <div className="h-8 w-32 bg-white/10 rounded"></div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/10"></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.primary }}
                    >
                      Saldo Total
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {currency.format(stats.total_balance || 0)}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-400">Receitas</p>
                    <p className="text-2xl font-bold text-white">
                      {currency.format(stats.total_income || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-400">Despesas</p>
                    <p className="text-2xl font-bold text-white">
                      {currency.format(stats.total_expenses || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-500">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-400">Metas</p>
                    <p className="text-2xl font-bold text-white">
                      {currency.format(stats.total_goals || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Gráficos e Análises */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${
            !loading ? "dashboard-stagger" : ""
          }`}
        >
          {/* Gastos por Categoria */}
          {loading ? (
            <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg animate-pulse">
              <div className="h-6 w-40 bg-white/10 rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10"></div>
                      <div className="h-4 w-24 bg-white/10 rounded"></div>
                    </div>
                    <div className="h-4 w-20 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Gastos por Categoria
                </h3>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {stats.expense_by_category.length === 0 && !loading ? (
                  <p className="text-sm text-gray-400">
                    Sem dados neste período.
                  </p>
                ) : null}
                {stats.expense_by_category.map((c) => {
                  const categoryColor = c.category_color || colors.primary;
                  return (
                    <div
                      key={c.category_id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center border"
                          style={{
                            backgroundColor: `${categoryColor}20`,
                            borderColor: `${categoryColor}50`,
                          }}
                        >
                          <Tag
                            className="w-5 h-5"
                            style={{ color: categoryColor }}
                          />
                        </div>
                        <span className="text-sm text-gray-300">
                          {c.category_name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {currency.format(c.total_expenses || 0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metas Financeiras */}
          {loading ? (
            <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg animate-pulse">
              <div className="h-6 w-40 bg-white/10 rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-32 bg-white/10 rounded"></div>
                      <div className="h-4 w-12 bg-white/10 rounded"></div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full"></div>
                    <div className="h-3 w-48 bg-white/10 rounded mt-2"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Metas Financeiras
                </h3>
                <Target className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {stats.goal_progress.length === 0 && !loading ? (
                  <p className="text-sm text-gray-400">
                    Nenhuma meta encontrada.
                  </p>
                ) : null}
                {stats.goal_progress.map((g) => (
                  <div key={g.goal_id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">
                        {g.goal_name}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {Math.round(g.progress_percentage || 0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, g.progress_percentage || 0)
                          )}%`,
                          backgroundColor: colors.primary,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {currency.format(g.current_amount || 0)} de{" "}
                      {currency.format(g.target_amount || 0)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Transações Recentes */}
        {loading ? (
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg animate-pulse">
            <div className="h-6 w-48 bg-white/10 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10"></div>
                    <div>
                      <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-white/10 rounded"></div>
                    </div>
                  </div>
                  <div className="h-4 w-20 bg-white/10 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg dashboard-stagger transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Transações Recentes
              </h3>
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats.recent_transactions.length === 0 && !loading ? (
                <p className="text-sm text-gray-400">
                  Sem transações recentes.
                </p>
              ) : null}
              {stats.recent_transactions.map((t) => {
                const isIncome = !!t.is_income;
                const categoryColor =
                  t.category_color || (isIncome ? "#10b981" : "#ef4444");
                const amount = currency.format(
                  Math.abs(t.transaction_amount || 0)
                );
                const sign = isIncome ? "+" : "-";
                const date = t.transaction_date
                  ? new Date(t.transaction_date)
                  : null;
                const dateStr = date
                  ? date.toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : "";
                return (
                  <div
                    key={t.transaction_id}
                    className="flex items-center justify-between py-3 border-b border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{
                          backgroundColor: `${categoryColor}20`,
                          borderColor: `${categoryColor}50`,
                        }}
                      >
                        {isIncome ? (
                          <TrendingUp
                            className="w-5 h-5"
                            style={{ color: categoryColor }}
                          />
                        ) : (
                          <TrendingDown
                            className="w-5 h-5"
                            style={{ color: categoryColor }}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {t.transaction_category ||
                            t.transaction_description ||
                            "Transação"}
                        </p>
                        <p className="text-xs text-gray-400">{dateStr}</p>
                      </div>
                    </div>
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: isIncome ? "#10b981" : "#ef4444",
                      }}
                    >
                      {sign}
                      {amount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </BasePage>
  );
}
