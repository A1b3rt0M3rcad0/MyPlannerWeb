import { useEffect, useMemo, useState } from "react";
import BasePage from "../../components/layout/BasePage";
import { usePlanner } from "../../hooks/usePlanner";
import { usePlannerColor } from "../../hooks/usePlannerColor";
import { userAccountsApi } from "../../services/api/accounts";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  Search,
  Plus,
  Loader2,
  Wallet,
  Banknote,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

export default function AccountsPage() {
  const colors = usePlannerColor();
  const { selectedPlanner } = usePlanner();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    bank: "",
    initial_balance: "",
    color: "#6b7280",
  });

  const [editingId, setEditingId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    bank: "",
    initial_balance: "",
    color: "#6b7280",
  });

  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const accentBg = useMemo(
    () => ({ backgroundColor: colors.primary }),
    [colors.primary]
  );

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
    []
  );

  const load = async (opts = {}) => {
    const nextPage = opts.page ?? page;
    const term = opts.search ?? search;
    try {
      setLoading(true);
      setError(null);
      const data = await userAccountsApi.getAccounts(nextPage, pageSize, term);
      // Normaliza possíveis formatos: { items: [...] } ou { data: { accounts: [...], pagination: {...} } } ou array direto
      const list = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data?.accounts)
        ? data.data.accounts
        : Array.isArray(data)
        ? data
        : [];
      setItems(list);
      const pagination = data?.data?.pagination;
      if (pagination && typeof pagination?.total === "number") {
        const totalPages = Math.max(1, Math.ceil(pagination.total / pageSize));
        setHasNextPage(nextPage < totalPages);
      } else if (typeof data?.total === "number") {
        const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
        setHasNextPage(nextPage < totalPages);
      } else {
        setHasNextPage(list.length === pageSize);
      }
      setPage(nextPage);
      setSearch(term);
    } catch (e) {
      setError("Não foi possível carregar as contas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ page: 1, search: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    load({ page: 1, search: searchInput.trim() });
  };

  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setCreateError("Informe um nome para a conta.");
      return;
    }
    if (!selectedPlanner?.id) {
      setCreateError("Selecione um planner para criar contas.");
      return;
    }
    try {
      setCreateLoading(true);
      setCreateError(null);
      const payload = {
        planner_id: selectedPlanner.id,
        description: form.name.trim(),
        bank: form.bank || undefined,
        initial_balance: form.initial_balance
          ? Number(form.initial_balance)
          : 0,
        current_balance: form.initial_balance
          ? Number(form.initial_balance)
          : 0,
        color: form.color || undefined,
      };
      await userAccountsApi.createAccount(payload);
      setShowCreate(false);
      setForm({ name: "", bank: "", initial_balance: "", color: "#6b7280" });
      await load({ page: 1, search });
    } catch (err) {
      setCreateError("Não foi possível criar a conta.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <BasePage pageTitle="Contas" showPlannerSelector={true}>
      <div className="space-y-6 animate-dashboard-enter-slow">
        {/* Barra de ações */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <form onSubmit={onSubmitSearch} className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar contas..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-secondary-800/50 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>
          </form>
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
                <Plus className="w-4 h-4" /> Nova conta
              </>
            )}
          </button>
        </div>

        {/* Seção de criação */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showCreate
              ? "max-h-[600px] opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2"
          }`}
        >
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg">
            <form onSubmit={onCreate} className="space-y-4">
              {createError && (
                <div className="rounded-lg p-3 text-sm bg-red-500/10 border border-red-500/30 text-red-300">
                  {createError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex.: Conta corrente Nubank"
                    className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Banco
                  </label>
                  <input
                    type="text"
                    value={form.bank}
                    onChange={(e) => setForm({ ...form, bank: e.target.value })}
                    placeholder="Ex.: Nubank"
                    className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Saldo inicial
                  </label>
                  <div className="relative">
                    <Banknote className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="0.01"
                      value={form.initial_balance}
                      onChange={(e) =>
                        setForm({ ...form, initial_balance: e.target.value })
                      }
                      placeholder="0,00"
                      className="w-full pl-9 px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Cor
                  </label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
                    }
                    className="h-10 w-full rounded cursor-pointer bg-transparent border border-white/10"
                    title="Escolher cor"
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

        {/* Lista */}
        <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg">
          {error && (
            <div className="mb-3 rounded-lg p-3 text-sm bg-red-500/10 border border-red-500/30 text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={accentBg}
              >
                <Wallet className="w-6 h-6 text-secondary-900" />
              </div>
              <p className="text-white font-semibold mb-1">
                Nenhuma conta encontrada
              </p>
              <p className="text-gray-400 text-sm">
                Tente ajustar a busca ou criar uma nova conta.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10 dashboard-stagger-slow">
              {items.map((acc) => {
                const id = Number(acc.id ?? acc.account_id);
                const isEditing = editingId === id;
                const name = acc.description || acc.name || "Conta";
                const color = acc.color || colors.primary;
                const current = acc.current_balance ?? acc.initial_balance ?? 0;
                return (
                  <div key={id} className="py-3">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-1">
                            Nome
                          </label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                            placeholder="Nome da conta"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Banco
                          </label>
                          <input
                            type="text"
                            value={editForm.bank}
                            onChange={(e) =>
                              setEditForm({ ...editForm, bank: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Saldo inicial
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.initial_balance}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                initial_balance: e.target.value,
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
                            value={editForm.color}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                color: e.target.value,
                              })
                            }
                            className="h-10 w-full rounded cursor-pointer bg-transparent border border-white/10"
                            title="Escolher cor"
                          />
                        </div>
                        {editError ? (
                          <div className="md:col-span-5 -mt-2 text-xs text-red-300">
                            {editError}
                          </div>
                        ) : null}
                        <div className="md:col-span-5 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              if (!editForm.name.trim()) {
                                setEditError("Informe um nome para a conta.");
                                return;
                              }
                              try {
                                setEditLoading(true);
                                setEditError(null);
                                await userAccountsApi.updateAccount(id, {
                                  planner_id: selectedPlanner?.id,
                                  description: editForm.name.trim(),
                                  bank: editForm.bank || undefined,
                                  initial_balance: editForm.initial_balance
                                    ? Number(editForm.initial_balance)
                                    : undefined,
                                  color: editForm.color || undefined,
                                });
                                setEditingId(null);
                                await load({ page, search });
                              } finally {
                                setEditLoading(false);
                              }
                            }}
                            disabled={editLoading}
                            className="px-3 py-1.5 text-xs rounded-lg text-secondary-900 disabled:opacity-50"
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
                            className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-gray-300 bg-white/5"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 px-4 py-3">
                        <div className="flex items-center gap-4 min-w-0">
                          <div
                            className="relative w-12 h-12 rounded-xl flex items-center justify-center border"
                            style={{
                              backgroundColor: `${color}20`,
                              borderColor: `${color}50`,
                            }}
                          >
                            <Wallet className="w-6 h-6" style={{ color }} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <p className="text-white font-semibold truncate">
                                {name}
                              </p>
                              {acc.bank ? (
                                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md bg-white/10 text-gray-300">
                                  {acc.bank}
                                </span>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="truncate">Saldo atual</span>
                              <span className="text-white font-medium">
                                {currency.format(Number(current) || 0)}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span
                                  className="inline-block w-2 h-2 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-[10px] text-gray-400">
                                  cor
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(id);
                              setEditForm({
                                name,
                                bank: acc.bank || "",
                                initial_balance: String(
                                  acc.initial_balance ?? 0
                                ),
                                color,
                              });
                            }}
                            className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4 text-gray-300" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteTarget({ id: Number(id), name });
                              setDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-lg border border-white/10 bg-red-500/10 hover:bg-red-500/20"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4 text-red-300" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal de confirmação de exclusão */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            if (deleteLoadingId) return;
            setDeleteModalOpen(false);
            setDeleteTarget(null);
          }}
          onConfirm={async () => {
            if (!deleteTarget?.id) return;
            try {
              setDeleteLoadingId(deleteTarget.id);
              await userAccountsApi.deleteAccount(Number(deleteTarget.id), {
                plannerId: selectedPlanner?.id,
              });
              setDeleteModalOpen(false);
              setDeleteTarget(null);
              await load({ page: 1, search });
            } finally {
              setDeleteLoadingId(null);
            }
          }}
          title="Excluir conta"
          message={`Tem certeza que deseja excluir "${
            deleteTarget?.name || "Conta"
          }"? Essa ação não poderá ser desfeita.`}
          confirmText="Excluir"
          cancelText="Cancelar"
          type="danger"
          isLoading={!!deleteLoadingId}
        />

        {/* Paginação */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => load({ page: Math.max(1, page - 1), search })}
            disabled={loading || page <= 1}
            className="px-3 py-2 text-sm rounded-lg border border-white/10 text-gray-300 bg-white/5 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-400">Página {page}</span>
          <button
            type="button"
            onClick={() => load({ page: page + 1, search })}
            disabled={loading || !hasNextPage}
            className="px-3 py-2 text-sm rounded-lg text-secondary-900 disabled:opacity-50"
            style={accentBg}
          >
            Próxima
          </button>
        </div>
      </div>
    </BasePage>
  );
}
