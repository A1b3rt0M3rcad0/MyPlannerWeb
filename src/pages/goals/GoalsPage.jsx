import { useEffect, useMemo, useState } from "react";
import BasePage from "../../components/layout/BasePage";
import { usePlanner } from "../../hooks/usePlanner";
import { usePlannerColor } from "../../hooks/usePlannerColor";
import { userAccountsApi } from "../../services/api/accounts";
import { userGoalDepositApi, userGoalsApi } from "../../services/api/goals";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  Loader2,
  Target,
  Plus,
  Banknote,
  Wallet,
  X,
  Trash2,
  Pencil,
  CheckCircle2,
  Power,
  PowerOff,
  Settings,
} from "lucide-react";
import SmartList from "../../components/SmartList";

export default function GoalsPage() {
  const { selectedPlanner } = usePlanner();
  const colors = usePlannerColor();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deleteAccountId, setDeleteAccountId] = useState("");

  // Modal de desativação com seleção de conta quando há saldo na meta
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deactivateLoadingId, setDeactivateLoadingId] = useState(null);
  const [deactivateAccountId, setDeactivateAccountId] = useState("");

  const [accountOptions, setAccountOptions] = useState([]); // [{id,label,balance}]
  const [depositForGoal, setDepositForGoal] = useState(null); // goal_id
  const [depositAmount, setDepositAmount] = useState("");
  const [depositAccountId, setDepositAccountId] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState(null);

  const [withdrawForGoal, setWithdrawForGoal] = useState(null); // goal_id
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAccountId, setWithdrawAccountId] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    target_amount: "",
    target_date: "",
    color: colors.primary,
    priority: "medium",
  });

  const [editingId, setEditingId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    target_amount: "",
    color: "",
  });

  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const accentBg = useMemo(
    () => ({ backgroundColor: colors.primary }),
    [colors.primary]
  );

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
    []
  );

  const accountsById = useMemo(() => {
    const map = {};
    for (const a of accountOptions) map[a.id] = a;
    return map;
  }, [accountOptions]);

  const refresh = async (opts = {}) => {
    if (!selectedPlanner?.id) return;
    try {
      setLoading(true);
      setError(null);
      // Usa endpoints próprios de metas (não o dashboard)
      const nextPage = opts.page ?? page;
      const data = await userGoalsApi.getGoalsByPlannerId(
        selectedPlanner.id,
        nextPage,
        pageSize,
        ""
      );
      // Normaliza possíveis formatos de retorno (API retorna { goals, pagination })
      const items = Array.isArray(data?.goals)
        ? data.goals
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data?.items)
        ? data.data.items
        : Array.isArray(data)
        ? data
        : [];
      const pagination = data?.pagination || data?.data?.pagination;
      if (pagination && typeof pagination?.total === "number") {
        const totalPages = Math.max(1, Math.ceil(pagination.total / pageSize));
        setHasNextPage(nextPage < totalPages);
      } else if (typeof data?.total === "number") {
        const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
        setHasNextPage(nextPage < totalPages);
      } else {
        setHasNextPage(items.length === pageSize);
      }
      setPage(nextPage);
      // Helpers de normalização
      const normalizeBool = (v, fallbackFalse = false) => {
        if (v === undefined || v === null) return fallbackFalse;
        if (typeof v === "boolean") return v;
        if (typeof v === "number") return v === 1;
        if (typeof v === "string") {
          const s = v.trim().toLowerCase();
          return s === "true" || s === "1" || s === "yes" || s === "sim";
        }
        return fallbackFalse;
      };

      // Mapeia para o formato esperado na UI atual
      const list = items.map((g) => ({
        goal_id: Number(g.id ?? g.goal_id),
        goal_name: g.name ?? g.goal_name,
        target_amount: Number(g.target_amount ?? 0),
        current_amount: Number(g.current_amount ?? 0),
        progress_percentage:
          typeof g.progress_percentage === "number"
            ? g.progress_percentage
            : (Number(g.current_amount || 0) /
                Math.max(1, Number(g.target_amount || 0))) *
              100,
        priority:
          typeof g.priority === "string" ? g.priority.toLowerCase() : "medium",
        color: g.color,
        is_achieved: normalizeBool(g.is_achieved, false),
        is_active: normalizeBool(g.is_active, true),
      }));
      setGoals(list);
    } catch (e) {
      setError("Não foi possível carregar as metas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanner?.id]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await userAccountsApi.getAccounts(1, 50, "");
        const list = Array.isArray(data?.data?.accounts)
          ? data.data.accounts
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : [];
        const opts = list
          .map((a) => ({
            id: Number(a.id ?? a.account_id),
            label: a.description || a.name || "Conta",
            balance: Number(a.current_balance ?? 0),
          }))
          .filter((o) => Number.isFinite(o.id));
        setAccountOptions(opts);
      } catch {}
    };
    fetchAccounts();
  }, []);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpenId && !event.target.closest("[data-menu-container]")) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenId]);

  return (
    <BasePage pageTitle="Metas" showPlannerSelector={true}>
      <div className="space-y-6 animate-dashboard-enter-slow">
        {/* Ações */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            aria-expanded={showCreate}
            className={
              showCreate
                ? "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-white/10 text-gray-300 bg-white/5"
                : "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-secondary-900"
            }
            style={showCreate ? undefined : accentBg}
          >
            {showCreate ? (
              <>
                <X className="w-4 h-4" /> Cancelar
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Nova meta
              </>
            )}
          </button>
        </div>

        {/* Criar meta */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showCreate
              ? "max-h-[600px] opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2"
          }`}
        >
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!createForm.name.trim()) {
                  setCreateError("Informe o nome da meta.");
                  return;
                }
                if (
                  !createForm.target_amount ||
                  Number.isNaN(Number(createForm.target_amount))
                ) {
                  setCreateError("Informe o valor alvo (numérico).");
                  return;
                }
                try {
                  setCreateLoading(true);
                  setCreateError(null);
                  await userGoalsApi.createGoal({
                    plannerId: selectedPlanner?.id,
                    name: createForm.name.trim(),
                    targetAmount: Number(createForm.target_amount),
                    targetDate: createForm.target_date || undefined,
                    color: createForm.color,
                    priority: (createForm.priority || "medium").toLowerCase(),
                  });
                  setShowCreate(false);
                  setCreateForm({
                    name: "",
                    target_amount: "",
                    target_date: "",
                    color: colors.primary,
                    priority: "medium",
                  });
                  await refresh();
                } catch (err) {
                  setCreateError("Não foi possível criar a meta.");
                } finally {
                  setCreateLoading(false);
                }
              }}
              className="space-y-4"
            >
              {createError ? (
                <div className="rounded-lg p-3 text-sm bg-red-500/10 border border-red-500/30 text-red-300">
                  {createError}
                </div>
              ) : null}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    placeholder="Ex.: Reserva de Emergência"
                    className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Valor alvo
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={createForm.target_amount}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        target_amount: e.target.value,
                      })
                    }
                    placeholder="0,00"
                    className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Data alvo
                  </label>
                  <input
                    type="date"
                    value={createForm.target_date}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        target_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Cor
                  </label>
                  <input
                    type="color"
                    value={createForm.color}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, color: e.target.value })
                    }
                    className="h-10 w-full rounded cursor-pointer bg-transparent border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={createForm.priority}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setCreateError(null);
                  }}
                  className="px-4 py-2 rounded-lg text-sm text-gray-300 border border-white/10 bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-secondary-900 disabled:opacity-50"
                  style={accentBg}
                >
                  {createLoading ? "Criando..." : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </div>
          ) : error ? (
            <div className="rounded-lg p-3 text-sm bg-red-500/10 border border-red-500/30 text-red-300">
              {error}
            </div>
          ) : goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={accentBg}
              >
                <Target className="w-6 h-6 text-secondary-900" />
              </div>
              <p className="text-white font-semibold mb-1">
                Nenhuma meta cadastrada
              </p>
              <p className="text-gray-400 text-sm">
                Crie metas no backend ou entre em contato com o suporte.
              </p>
            </div>
          ) : (
            <div className="space-y-4 dashboard-stagger-slow">
              {goals.map((g) => {
                const progress = Math.round(g.progress_percentage || 0);
                const isExceeded = progress > 100;
                const p = (g.priority || "medium").toLowerCase();
                const priorityMap = {
                  low: {
                    bg: "bg-green-500/15",
                    text: "text-green-300",
                    ring: "ring-green-500/20",
                    label: "Baixa",
                  },
                  medium: {
                    bg: "bg-yellow-500/15",
                    text: "text-yellow-300",
                    ring: "ring-yellow-500/20",
                    label: "Média",
                  },
                  high: {
                    bg: "bg-red-500/15",
                    text: "text-red-300",
                    ring: "ring-red-500/20",
                    label: "Alta",
                  },
                };
                const priorityCfg = priorityMap[p] || priorityMap.medium;

                // Determina o badge baseado nos status
                let statusBadge = null;
                if (g.is_achieved) {
                  statusBadge = {
                    label: "✓ Finalizada",
                    bgClass: "bg-emerald-500/20",
                    textClass: "text-emerald-300",
                    ringClass: "ring-1 ring-emerald-500/30",
                  };
                } else if (!g.is_active) {
                  statusBadge = {
                    label: "⏸ Desativada",
                    bgClass: "bg-gray-500/20",
                    textClass: "text-gray-300",
                    ringClass: "ring-1 ring-gray-500/30",
                  };
                } else if (isExceeded) {
                  statusBadge = {
                    label: "🎉 Excedida",
                    bgClass: "bg-amber-500/20",
                    textClass: "text-amber-300",
                    ringClass: "ring-1 ring-amber-500/30",
                  };
                }

                return (
                  <div
                    key={g.goal_id}
                    className={`relative ${
                      menuOpenId === g.goal_id ? "z-[100]" : ""
                    }`}
                    data-menu-container
                  >
                    {(() => {
                      const actions = [];
                      if (!g.is_achieved && g.is_active) {
                        actions.push(
                          {
                            key: "deposit",
                            title: "Depositar",
                            icon: <Plus className="w-4 h-4 text-white" />,
                            onClick: () => {
                              setDepositForGoal(Number(g.goal_id));
                              setDepositAmount("");
                              setDepositError(null);
                              setWithdrawForGoal(null);
                            },
                            className:
                              "p-2 rounded-lg border border-white/10 hover:brightness-110",
                            style: {
                              backgroundColor: g.color || colors.primary,
                            },
                          },
                          {
                            key: "withdraw",
                            title: "Sacar",
                            icon: (
                              <Banknote className="w-4 h-4 text-gray-300" />
                            ),
                            onClick: () => {
                              setWithdrawForGoal(Number(g.goal_id));
                              setWithdrawAmount("");
                              setWithdrawError(null);
                              setDepositForGoal(null);
                            },
                            className:
                              "p-2 rounded-lg border border-white/10 bg-secondary-700 hover:bg-secondary-600",
                          }
                        );
                      }
                      actions.push({
                        key: "menu",
                        title: "Menu",
                        icon: <Settings className="w-4 h-4 text-gray-300" />,
                        onClick: () => {
                          setMenuOpenId(
                            menuOpenId === g.goal_id ? null : g.goal_id
                          );
                        },
                        className:
                          "p-2 rounded-lg border border-white/10 bg-secondary-700 hover:bg-secondary-600 relative",
                      });

                      return (
                        <SmartList
                          items={[
                            {
                              id: g.goal_id,
                              title: g.goal_name || "Meta",
                              subtitle: `${currency.format(
                                g.current_amount || 0
                              )} / ${currency.format(g.target_amount || 0)}`,
                              leftColor: g.color || colors.primary,
                              leftIcon: (
                                <Target
                                  className="w-5 h-5"
                                  style={{ color: g.color || colors.primary }}
                                />
                              ),
                              badge: statusBadge || {
                                label: priorityCfg.label,
                                bgClass: priorityCfg.bg,
                                textClass: priorityCfg.text,
                                ringClass: `ring-1 ${priorityCfg.ring}`,
                              },
                              rightValue: `${progress}%`,
                              actions,
                            },
                          ]}
                          className="mb-2"
                        />
                      );
                    })()}
                    {/* Menu dropdown */}
                    {menuOpenId === g.goal_id && (
                      <div
                        className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-2xl z-50 overflow-hidden"
                        style={{
                          backgroundColor: "#1e293b",
                          border: "2px solid #475569",
                        }}
                      >
                        <div className="py-1">
                          {/* Editar */}
                          <button
                            onClick={() => {
                              setEditingId(g.goal_id);
                              setEditForm({
                                name: g.goal_name,
                                target_amount: String(g.target_amount || 0),
                                color: g.color || colors.primary,
                              });
                              setEditError(null);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-white flex items-center gap-3 transition-colors"
                            style={{ backgroundColor: "#1e293b" }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#334155")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#1e293b")
                            }
                          >
                            <Pencil className="w-4 h-4" />
                            <span>Editar</span>
                          </button>

                          {/* Status: Ativar */}
                          {!g.is_achieved && !g.is_active && (
                            <button
                              onClick={async () => {
                                try {
                                  setStatusLoadingId(g.goal_id);
                                  await userGoalsApi.activateGoal(g.goal_id);
                                  setMenuOpenId(null);
                                  await refresh();
                                } catch (err) {
                                  console.error("Erro ao ativar meta:", err);
                                } finally {
                                  setStatusLoadingId(null);
                                }
                              }}
                              disabled={statusLoadingId === g.goal_id}
                              className="w-full px-4 py-2 text-left text-sm text-green-400 flex items-center gap-3 transition-colors disabled:opacity-50"
                              style={{ backgroundColor: "#1e293b" }}
                              onMouseEnter={(e) =>
                                !e.target.disabled &&
                                (e.target.style.backgroundColor = "#334155")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "#1e293b")
                              }
                            >
                              {statusLoadingId === g.goal_id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Power className="w-4 h-4" />
                              )}
                              <span>Ativar</span>
                            </button>
                          )}

                          {/* Status: Desativar */}
                          {!g.is_achieved && g.is_active && (
                            <button
                              onClick={async () => {
                                // Abre modal de desativação para escolher conta (se necessário)
                                setDeactivateTarget({
                                  id: g.goal_id,
                                  name: g.name,
                                  current_amount: g.current_amount,
                                });
                                setDeactivateAccountId("");
                                setDeactivateModalOpen(true);
                              }}
                              disabled={statusLoadingId === g.goal_id}
                              className="w-full px-4 py-2 text-left text-sm text-orange-400 flex items-center gap-3 transition-colors disabled:opacity-50"
                              style={{ backgroundColor: "#1e293b" }}
                              onMouseEnter={(e) =>
                                !e.target.disabled &&
                                (e.target.style.backgroundColor = "#334155")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "#1e293b")
                              }
                            >
                              {statusLoadingId === g.goal_id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <PowerOff className="w-4 h-4" />
                              )}
                              <span>Desativar</span>
                            </button>
                          )}

                          {/* Status: Marcar como Finalizada */}
                          {!g.is_achieved && g.is_active && (
                            <button
                              onClick={async () => {
                                try {
                                  setStatusLoadingId(g.goal_id);
                                  await userGoalsApi.markAsAchieved(g.goal_id);
                                  setMenuOpenId(null);
                                  await refresh();
                                } catch (err) {
                                  console.error(
                                    "Erro ao marcar meta como finalizada:",
                                    err
                                  );
                                } finally {
                                  setStatusLoadingId(null);
                                }
                              }}
                              disabled={statusLoadingId === g.goal_id}
                              className="w-full px-4 py-2 text-left text-sm text-blue-400 flex items-center gap-3 transition-colors disabled:opacity-50"
                              style={{ backgroundColor: "#1e293b" }}
                              onMouseEnter={(e) =>
                                !e.target.disabled &&
                                (e.target.style.backgroundColor = "#334155")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "#1e293b")
                              }
                            >
                              {statusLoadingId === g.goal_id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                              <span>Marcar como Finalizada</span>
                            </button>
                          )}

                          {/* Divisor */}
                          <div
                            className="border-t my-1"
                            style={{ borderColor: "#475569" }}
                          />

                          {/* Excluir */}
                          <button
                            onClick={() => {
                              setDeleteTarget({
                                id: g.goal_id,
                                name: g.goal_name,
                                current_amount: g.current_amount || 0,
                              });
                              setDeleteAccountId("");
                              setMenuOpenId(null);
                              setDeleteModalOpen(true);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 flex items-center gap-3 transition-colors"
                            style={{ backgroundColor: "#1e293b" }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#334155")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#1e293b")
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4 relative overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(0, progress))}%`,
                          backgroundColor: isExceeded
                            ? "#10b981"
                            : g.color || colors.primary,
                        }}
                      />
                      {isExceeded && (
                        <div className="absolute inset-0">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </div>
                      )}
                    </div>
                    {editingId === g.goal_id ? (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Nome
                          </label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            placeholder="Nome da meta"
                            className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Valor alvo
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.target_amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                target_amount: e.target.value,
                              })
                            }
                            placeholder="0,00"
                            className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Cor
                          </label>
                          <input
                            type="color"
                            value={editForm.color}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                color: e.target.value,
                              })
                            }
                            className="h-10 w-full rounded cursor-pointer bg-transparent border border-white/10"
                          />
                        </div>
                        <div className="flex items-end justify-end gap-2">
                          <button
                            type="button"
                            disabled={editLoading}
                            onClick={async () => {
                              if (!editForm.name.trim()) {
                                setEditError("Informe o nome da meta.");
                                return;
                              }
                              if (
                                !editForm.target_amount ||
                                Number.isNaN(Number(editForm.target_amount))
                              ) {
                                setEditError("Informe o valor alvo.");
                                return;
                              }
                              try {
                                setEditLoading(true);
                                setEditError(null);
                                await userGoalsApi.updateGoal(g.goal_id, {
                                  name: editForm.name.trim(),
                                  targetAmount: Number(editForm.target_amount),
                                  color: editForm.color,
                                });
                                setEditingId(null);
                                await refresh();
                              } catch (err) {
                                setEditError("Não foi possível editar a meta.");
                              } finally {
                                setEditLoading(false);
                              }
                            }}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-secondary-900 disabled:opacity-50"
                            style={accentBg}
                          >
                            {editLoading ? "Salvando..." : "Salvar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditError(null);
                            }}
                            className="px-3 py-2 rounded-lg text-sm text-gray-300 border border-white/10 bg-white/5"
                          >
                            Cancelar
                          </button>
                        </div>
                        {editError ? (
                          <div className="md:col-span-4 -mt-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded p-2">
                            {editError}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {depositForGoal === g.goal_id ? (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Valor
                          </label>
                          <div className="relative">
                            <Banknote className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="number"
                              step="0.01"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              placeholder="0,00"
                              className="w-full pl-10 pr-3 h-10 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Conta
                          </label>
                          <div className="relative">
                            <Wallet className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <select
                              value={depositAccountId}
                              onChange={(e) =>
                                setDepositAccountId(e.target.value)
                              }
                              className="w-full pl-9 px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                            >
                              <option value="">Selecione uma conta</option>
                              {accountOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {depositAccountId ? (
                            <p className="mt-1 text-xs text-gray-400">
                              Saldo disponível:{" "}
                              {currency.format(
                                accountsById[Number(depositAccountId)]
                                  ?.balance || 0
                              )}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex items-end justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setDepositForGoal(null);
                              setDepositError(null);
                            }}
                            className="px-3 py-2 rounded-lg text-sm text-gray-300 border border-white/10 bg-white/5"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            disabled={
                              depositLoading ||
                              !depositAmount ||
                              !depositAccountId ||
                              Number(depositAmount) >
                                (accountsById[Number(depositAccountId)]
                                  ?.balance || 0)
                            }
                            onClick={async () => {
                              if (
                                !depositAmount ||
                                Number.isNaN(Number(depositAmount))
                              ) {
                                setDepositError("Informe um valor válido");
                                return;
                              }
                              const selected =
                                accountsById[Number(depositAccountId)];
                              if (
                                selected &&
                                Number(depositAmount) > (selected.balance || 0)
                              ) {
                                setDepositError(
                                  `Saldo insuficiente. Disponível: ${currency.format(
                                    selected.balance || 0
                                  )}.`
                                );
                                return;
                              }
                              try {
                                setDepositLoading(true);
                                setDepositError(null);
                                await userGoalDepositApi.deposit({
                                  goalId: g.goal_id,
                                  accountId: depositAccountId,
                                  amount: Number(depositAmount),
                                });
                                setDepositForGoal(null);
                                setDepositAmount("");
                                setDepositAccountId("");
                                await refresh();
                              } catch (e) {
                                const apiMsg = e?.response?.data?.message;
                                const details =
                                  e?.response?.data?.details || "";
                                if (
                                  e?.response?.status === 400 &&
                                  (e?.response?.data?.error_code ===
                                    "BUSINESS_INSUFFICIENT_BALANCE" ||
                                    (apiMsg || "")
                                      .toLowerCase()
                                      .includes("saldo insuficiente") ||
                                    (details || "")
                                      .toLowerCase()
                                      .includes("insufficient"))
                                ) {
                                  const selected2 =
                                    accountsById[Number(depositAccountId)];
                                  const hint = selected2
                                    ? ` Saldo disponível: ${currency.format(
                                        selected2.balance || 0
                                      )}.`
                                    : "";
                                  setDepositError(
                                    `Saldo insuficiente para realizar o depósito.${hint}`
                                  );
                                } else {
                                  setDepositError(
                                    details ||
                                      apiMsg ||
                                      "Não foi possível depositar."
                                  );
                                }
                              } finally {
                                setDepositLoading(false);
                              }
                            }}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-secondary-900 disabled:opacity-50"
                            style={accentBg}
                          >
                            {depositLoading ? "Depositando..." : "Depositar"}
                          </button>
                        </div>
                        {depositError ? (
                          <div className="md:col-span-3 -mt-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded p-2">
                            {depositError}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {withdrawForGoal === g.goal_id ? (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Valor
                          </label>
                          <div className="relative">
                            <Banknote className="w-4 h-4 text-gray-400 absolute left-3 inset-y-0 my-auto pointer-events-none" />
                            <input
                              type="number"
                              step="0.01"
                              value={withdrawAmount}
                              onChange={(e) =>
                                setWithdrawAmount(e.target.value)
                              }
                              placeholder="0,00"
                              className="w-full pl-10 pr-3 h-10 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                            />
                            <p className="mt-1 text-xs text-gray-400">
                              Disponível na meta:{" "}
                              {currency.format(Number(g.current_amount || 0))}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Conta de destino
                          </label>
                          <div className="relative">
                            <Wallet className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <select
                              value={withdrawAccountId}
                              onChange={(e) =>
                                setWithdrawAccountId(e.target.value)
                              }
                              className="w-full pl-9 px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                            >
                              <option value="">Selecione uma conta</option>
                              {accountOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-end justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setWithdrawForGoal(null);
                              setWithdrawError(null);
                            }}
                            className="px-3 py-2 rounded-lg text-sm text-gray-300 border border-white/10 bg-white/5"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            disabled={
                              withdrawLoading ||
                              !withdrawAmount ||
                              !withdrawAccountId ||
                              Number(withdrawAmount) >
                                Number(g.current_amount || 0)
                            }
                            onClick={async () => {
                              if (
                                !withdrawAmount ||
                                Number.isNaN(Number(withdrawAmount))
                              ) {
                                setWithdrawError("Informe um valor válido");
                                return;
                              }
                              if (
                                Number(withdrawAmount) >
                                Number(g.current_amount || 0)
                              ) {
                                setWithdrawError(
                                  `Valor excede o disponível na meta (${currency.format(
                                    Number(g.current_amount || 0)
                                  )}).`
                                );
                                return;
                              }
                              try {
                                setWithdrawLoading(true);
                                setWithdrawError(null);
                                await userGoalDepositApi.withdraw({
                                  goalId: g.goal_id,
                                  accountId: withdrawAccountId,
                                  amount: Number(withdrawAmount),
                                });
                                setWithdrawForGoal(null);
                                setWithdrawAmount("");
                                setWithdrawAccountId("");
                                await refresh();
                              } catch (e) {
                                const apiMsg = e?.response?.data?.message;
                                const details =
                                  e?.response?.data?.details || "";
                                if (
                                  e?.response?.status === 400 &&
                                  ((apiMsg || "")
                                    .toLowerCase()
                                    .includes("insuf") ||
                                    (details || "")
                                      .toLowerCase()
                                      .includes("insufficient"))
                                ) {
                                  setWithdrawError(
                                    "Saldo insuficiente na meta para realizar o saque."
                                  );
                                } else {
                                  setWithdrawError(
                                    details ||
                                      apiMsg ||
                                      "Não foi possível sacar da meta."
                                  );
                                }
                              } finally {
                                setWithdrawLoading(false);
                              }
                            }}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-secondary-900 disabled:opacity-50"
                            style={accentBg}
                          >
                            {withdrawLoading ? "Sacando..." : "Sacar"}
                          </button>
                        </div>
                        {withdrawError ? (
                          <div className="md:col-span-3 -mt-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded p-2">
                            {withdrawError}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Paginação */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => refresh({ page: Math.max(1, page - 1) })}
          disabled={loading || page <= 1}
          className="px-3 py-2 text-sm rounded-lg border border-white/10 text-gray-300 bg-white/5 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-400">Página {page}</span>
        <button
          type="button"
          onClick={() => refresh({ page: page + 1 })}
          disabled={loading || !hasNextPage}
          className="px-3 py-2 text-sm rounded-lg text-secondary-900 disabled:opacity-50"
          style={accentBg}
        >
          Próxima
        </button>
      </div>
      {/* Modal de exclusão com seleção de conta quando há saldo na meta */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-secondary-800/90 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10 shadow-2xl">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                Excluir meta
              </h3>
              <p className="text-gray-300">
                Tem certeza que deseja excluir "{deleteTarget?.name || "Meta"}"?
              </p>
            </div>
            {Number(deleteTarget?.current_amount || 0) > 0 ? (
              <div className="mb-4 text-left">
                <p className="text-sm text-gray-300 mb-2">
                  Esta meta possui saldo de
                  <span className="font-semibold text-white">
                    {" "}
                    {currency.format(Number(deleteTarget.current_amount || 0))}
                  </span>
                  . Selecione a conta para onde o valor será transferido:
                </p>
                <div className="relative">
                  <select
                    value={deleteAccountId}
                    onChange={(e) => setDeleteAccountId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                  >
                    <option value="">Selecione uma conta</option>
                    {accountOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (deleteLoadingId) return;
                  setDeleteModalOpen(false);
                  setDeleteTarget(null);
                  setDeleteAccountId("");
                }}
                disabled={!!deleteLoadingId}
                className="flex-1 px-6 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!deleteTarget?.id) return;
                  const needsAccount =
                    Number(deleteTarget?.current_amount || 0) > 0;
                  if (needsAccount && !deleteAccountId) return;
                  try {
                    setDeleteLoadingId(deleteTarget.id);
                    await userGoalsApi.deleteGoal(
                      deleteTarget.id,
                      needsAccount ? deleteAccountId : undefined
                    );
                    setDeleteModalOpen(false);
                    setDeleteTarget(null);
                    setDeleteAccountId("");
                    await refresh({ page: 1 });
                  } finally {
                    setDeleteLoadingId(null);
                  }
                }}
                disabled={
                  !!deleteLoadingId ||
                  (Number(deleteTarget?.current_amount || 0) > 0 &&
                    !deleteAccountId)
                }
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoadingId ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Excluindo...
                  </>
                ) : (
                  "Excluir"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de desativação com seleção de conta quando há saldo na meta */}
      {deactivateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-secondary-800/90 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10 shadow-2xl">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PowerOff className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                Desativar meta
              </h3>
              <p className="text-gray-300">
                Tem certeza que deseja desativar "
                {deactivateTarget?.name || "Meta"}"?
              </p>
            </div>
            {Number(deactivateTarget?.current_amount || 0) > 0 ? (
              <div className="mb-4 text-left">
                <p className="text-sm text-gray-300 mb-2">
                  Esta meta possui saldo de
                  <span className="font-semibold text-white">
                    {" "}
                    {currency.format(
                      Number(deactivateTarget.current_amount || 0)
                    )}
                  </span>
                  . Selecione a conta para onde o valor será transferido:
                </p>
                <div className="relative">
                  <select
                    value={deactivateAccountId}
                    onChange={(e) => setDeactivateAccountId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                  >
                    <option value="">Selecione uma conta</option>
                    {accountOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (deactivateLoadingId) return;
                  setDeactivateModalOpen(false);
                  setDeactivateTarget(null);
                  setDeactivateAccountId("");
                }}
                disabled={!!deactivateLoadingId}
                className="flex-1 px-6 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!deactivateTarget?.id) return;
                  const needsAccount =
                    Number(deactivateTarget?.current_amount || 0) > 0;
                  if (needsAccount && !deactivateAccountId) return;
                  try {
                    setDeactivateLoadingId(deactivateTarget.id);
                    await userGoalsApi.deactivateGoal(
                      deactivateTarget.id,
                      needsAccount ? deactivateAccountId : undefined
                    );
                    setDeactivateModalOpen(false);
                    setDeactivateTarget(null);
                    setDeactivateAccountId("");
                    setMenuOpenId(null);
                    await refresh({ page: 1 });
                  } finally {
                    setDeactivateLoadingId(null);
                  }
                }}
                disabled={
                  !!deactivateLoadingId ||
                  (Number(deactivateTarget?.current_amount || 0) > 0 &&
                    !deactivateAccountId)
                }
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deactivateLoadingId ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Desativando...
                  </>
                ) : (
                  "Desativar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </BasePage>
  );
}
