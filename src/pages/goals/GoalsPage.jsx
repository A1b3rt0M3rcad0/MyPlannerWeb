import { useEffect, useMemo, useState } from "react";
import BasePage from "../../components/layout/BasePage";
import { usePlanner } from "../../hooks/usePlanner";
import { usePlannerColor } from "../../hooks/usePlannerColor";
import { dashboardAPI } from "../../services/api/dashboard";
import { userAccountsApi } from "../../services/api/accounts";
import { userGoalDepositApi, userGoalsApi } from "../../services/api/goals";
import { Loader2, Target, Plus, Banknote, Wallet, X } from "lucide-react";

export default function GoalsPage() {
  const { selectedPlanner } = usePlanner();
  const colors = usePlannerColor();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]);

  const [accountOptions, setAccountOptions] = useState([]); // [{id,label,balance}]
  const [depositForGoal, setDepositForGoal] = useState(null); // goal_id
  const [depositAmount, setDepositAmount] = useState("");
  const [depositAccountId, setDepositAccountId] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    target_amount: "",
    target_date: "",
    color: colors.primary,
    priority: "MEDIUM",
  });

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

  const refresh = async () => {
    if (!selectedPlanner?.id) return;
    try {
      setLoading(true);
      setError(null);
      // Usa stats do dashboard para metas
      const now = new Date();
      const initialDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
      const finalDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .slice(0, 10);
      const stats = await dashboardAPI.getUserStats({
        plannerId: selectedPlanner.id,
        initialDate,
        finalDate,
      });
      const list = Array.isArray(stats?.goal_progress)
        ? stats.goal_progress
        : [];
      setGoals(list);
    } catch (e) {
      setError("Não foi possível carregar as metas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
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

  return (
    <BasePage pageTitle="Metas" showPlannerSelector={true}>
      <div className="space-y-6">
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
                    priority: createForm.priority,
                  });
                  setShowCreate(false);
                  setCreateForm({
                    name: "",
                    target_amount: "",
                    target_date: "",
                    color: colors.primary,
                    priority: "MEDIUM",
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
            <div className="space-y-4">
              {goals.map((g) => {
                const progress = Math.round(g.progress_percentage || 0);
                return (
                  <div
                    key={g.goal_id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${colors.primary}33` }}
                        >
                          <Target
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold truncate">
                            {g.goal_name || "Meta"}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {currency.format(g.current_amount || 0)} /{" "}
                            {currency.format(g.target_amount || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-semibold">
                          {progress}%
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDepositForGoal(g.goal_id);
                            setDepositAmount("");
                            setDepositError(null);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary-900"
                          style={accentBg}
                        >
                          <Plus className="w-4 h-4" /> Depositar
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(0, progress))}%`,
                          backgroundColor: colors.primary,
                        }}
                      />
                    </div>
                    {depositForGoal === g.goal_id ? (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Valor
                          </label>
                          <div className="relative">
                            <Banknote className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="number"
                              step="0.01"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              placeholder="0,00"
                              className="w-full pl-9 px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </BasePage>
  );
}
