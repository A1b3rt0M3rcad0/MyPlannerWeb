import { useEffect, useMemo, useRef, useState } from "react";
import BasePage from "../../components/layout/BasePage";
import { usePlanner } from "../../hooks/usePlanner";
import { usePlannerColor } from "../../hooks/usePlannerColor";
import { userTransactionsApi } from "../../services/api/transactions";
import { userAccountsApi } from "../../services/api/accounts";
import { userCategoriesApi } from "../../services/api/categories";
import ConfirmationModal from "../../components/ConfirmationModal";
import SmartList from "../../components/SmartList";
import {
  Search,
  Plus,
  Loader2,
  TrendingUp,
  TrendingDown,
  Pencil,
  Trash2,
  Wallet,
  Tag,
  Calendar,
} from "lucide-react";

export default function TransactionsPage() {
  const { selectedPlanner } = usePlanner();
  const colors = usePlannerColor();

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
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    type: "expense", // expense | income
    category: "",
    description: "",
    wallet: "",
    accountId: "",
    categoryId: "",
  });
  const [touched, setTouched] = useState({});
  const amountInputRef = useRef(null);

  const [categoryOptions, setCategoryOptions] = useState([]); // [{id,label,color}]
  const [accountOptions, setAccountOptions] = useState([]); // [{id, label}]

  const [editingId, setEditingId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    type: "expense",
    category: "",
    description: "",
    wallet: "",
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const accentBg = useMemo(
    () => ({ backgroundColor: colors.primary }),
    [colors.primary]
  );

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
    []
  );

  const categoriesById = useMemo(() => {
    const map = {};
    for (const c of categoryOptions) {
      if (c && Number.isFinite(c.id)) {
        map[c.id] = { label: c.label, color: c.color };
      }
    }
    return map;
  }, [categoryOptions]);

  const load = async (opts = {}) => {
    const nextPage = opts.page ?? page;
    const term = opts.search ?? search;
    try {
      setLoading(true);
      setError(null);
      const data = await userTransactionsApi.getTransactions({
        page: nextPage,
        pageSize,
        search: term,
        plannerId: selectedPlanner?.id,
      });
      // Normaliza formatos possíveis: { data: { transactions: [...] } } | { transactions: [...] } | { items: [...] } | array direto
      const list = Array.isArray(data?.data?.transactions)
        ? data.data.transactions
        : Array.isArray(data?.transactions)
        ? data.transactions
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];
      setItems(list);
      const pagination = data?.data?.pagination || data?.pagination;
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
      setError("Não foi possível carregar as transações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ page: 1, search: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sugestões de categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await userCategoriesApi.getCategories(1, 20, "");
        const list = Array.isArray(data?.data?.categories)
          ? data.data.categories
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : [];
        const options = list
          .map((c) => ({
            id: Number(c.id ?? c.category_id),
            label: (c.name || c.category_name || "Categoria").toString(),
            color: c.color || "#8b5cf6",
          }))
          .filter((o) => Number.isFinite(o.id));
        setCategoryOptions(options.slice(0, 50));
      } catch (e) {
        // silencioso
      }
    };
    fetchCategories();
  }, []);

  // Contas (carteiras)
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await userAccountsApi.getAccounts(1, 50, "");
        // Normaliza formatos possíveis: { data: { accounts: [...] } } | { items: [...] } | array direto
        const list = Array.isArray(data?.data?.accounts)
          ? data.data.accounts
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : [];
        const options = list
          .map((a) => ({
            id: Number(a.id ?? a.account_id),
            label: (
              a.description ||
              a.name ||
              a.account_name ||
              "Conta"
            ).toString(),
          }))
          .filter((o) => Number.isFinite(o.id));
        setAccountOptions(options);
      } catch (e) {
        // silencioso
      }
    };
    fetchAccounts();
  }, []);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    load({ page: 1, search: searchInput.trim() });
  };

  const onCreate = async (e) => {
    e.preventDefault();
    const amountNumber = normalizeAmountToNumber(form.amount);
    setTouched((t) => ({ ...t, amount: true, date: true }));
    if (!amountNumber || Number.isNaN(Number(amountNumber))) {
      setCreateError("Informe um valor válido.");
      return;
    }
    if (!form.date) {
      setCreateError("Selecione a data.");
      return;
    }
    if (!form.accountId) {
      setCreateError("Selecione uma conta.");
      return;
    }
    if (!form.categoryId) {
      setCreateError("Selecione uma categoria.");
      return;
    }
    try {
      setCreateLoading(true);
      setCreateError(null);
      const payload = {
        amount: Number(amountNumber),
        planner_id: selectedPlanner?.id,
        account_id: Number(form.accountId),
        category_id: Number(form.categoryId),
        is_income: form.type === "income",
        ...(form.description ? { description: form.description.trim() } : {}),
      };
      await userTransactionsApi.createTransaction(payload);
      setShowCreate(false);
      setForm({
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        type: "expense",
        category: "",
        description: "",
        wallet: "",
        accountId: "",
        categoryId: "",
      });
      setTouched({});
      await load({ page: 1, search });
    } catch (err) {
      setCreateError("Não foi possível criar a transação.");
    } finally {
      setCreateLoading(false);
    }
  };

  const onSaveEdit = async (id) => {
    if (!editForm.amount || Number.isNaN(Number(editForm.amount))) {
      setEditError("Informe um valor válido.");
      return;
    }
    try {
      setEditLoading(true);
      setEditError(null);
      const payload = {
        amount: Number(editForm.amount),
        is_income: editForm.type === "income",
        ...(editForm.description ? { description: editForm.description } : {}),
      };
      await userTransactionsApi.updateTransaction(id, payload);
      setEditingId(null);
      await load({ page, search });
    } catch (err) {
      setEditError("Não foi possível atualizar a transação.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <BasePage pageTitle="Transações" showPlannerSelector={true}>
      <div className="space-y-6 animate-dashboard-enter-slow">
        {/* Barra de ações */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <form onSubmit={onSubmitSearch} className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por descrição, categoria..."
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
              <>Fechar</>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Nova transação
              </>
            )}
          </button>
        </div>

        {/* Formulário de criação */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showCreate
              ? "max-h-[700px] opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2"
          }`}
        >
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg">
            <form onSubmit={onCreate} className="space-y-4" noValidate>
              {createError && (
                <div className="rounded-lg p-3 text-sm bg-red-500/10 border border-red-500/30 text-red-300">
                  {createError}
                </div>
              )}
              {/* Tipo da transação - destaque com ícones */}
              <div
                role="radiogroup"
                aria-label="Tipo da transação"
                className="space-y-2"
              >
                <div className="text-xs text-gray-400">Tipo da transação</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={form.type === "expense"}
                    onClick={() => setForm({ ...form, type: "expense" })}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 ${
                      form.type === "expense"
                        ? "bg-red-500/20 border-red-500/50 text-red-200"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                    title="Marcar como Despesa"
                  >
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-medium">Despesa</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={form.type === "income"}
                    onClick={() => setForm({ ...form, type: "income" })}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 ${
                      form.type === "income"
                        ? "bg-green-500/20 border-green-500/50 text-green-200"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                    title="Marcar como Receita"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Receita</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Valor
                  </label>
                  <input
                    ref={amountInputRef}
                    inputMode="decimal"
                    value={form.amount}
                    onBlur={() =>
                      setForm((f) => ({
                        ...f,
                        amount: formatAmountBRL(f.amount),
                      }))
                    }
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const next = keepNumericDecimal(e.target.value);
                      setForm({ ...form, amount: next });
                    }}
                    placeholder={
                      form.type === "income"
                        ? "+ 0,00 (receita)"
                        : "- 0,00 (despesa)"
                    }
                    className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                    aria-invalid={touched.amount && !isValidAmount(form.amount)}
                    aria-describedby="amount-help"
                  />
                  <p id="amount-help" className="mt-1 text-xs text-gray-500">
                    Use vírgula para centavos. Ex.: 123,45
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Data
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      className="w-full pl-9 px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                      aria-invalid={touched.date && !form.date}
                    />
                  </div>
                </div>
                {/* Tipo removido do grid; agora controlado pelos botões acima */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Categoria
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm({ ...form, categoryId: e.target.value })
                      }
                      className="w-full pl-9 px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categoryOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Conta
                  </label>
                  <div className="relative">
                    <Wallet className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={form.accountId}
                      onChange={(e) =>
                        setForm({ ...form, accountId: e.target.value })
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
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Opcional"
                  className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                />
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
                  disabled={
                    createLoading ||
                    !isValidAmount(form.amount) ||
                    !form.date ||
                    !form.accountId ||
                    !form.categoryId
                  }
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
                <TrendingDown className="w-6 h-6 text-secondary-900" />
              </div>
              <p className="text-white font-semibold mb-1">
                Nenhuma transação encontrada
              </p>
              <p className="text-gray-400 text-sm">
                Tente ajustar a busca ou criar uma nova transação.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10 dashboard-stagger-slow">
              {items.map((t) => {
                const id = t.id ?? t.transaction_id;
                const isIncome = !!(t.is_income ?? t.type === "income");
                const amount = currency.format(
                  Math.abs(t.amount ?? t.transaction_amount ?? 0)
                );
                const date = t.date ?? t.transaction_date ?? t.created_at;
                const dateStr = date
                  ? new Date(date).toLocaleDateString("pt-BR")
                  : "";
                const categoryName =
                  t.category ??
                  t.transaction_category ??
                  (Number.isFinite(Number(t.category_id))
                    ? categoriesById[Number(t.category_id)]?.label
                    : undefined) ??
                  "—";
                const categoryColor =
                  (Number.isFinite(Number(t.category_id))
                    ? categoriesById[Number(t.category_id)]?.color
                    : undefined) ?? (isIncome ? "#10b981" : "#ef4444");
                const description =
                  t.description ?? t.transaction_description ?? "";
                const wallet = t.wallet ?? t.transaction_wallet ?? "";
                const isEditing = editingId === id;

                return (
                  <div key={id} className="py-3">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Valor
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                amount: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Data
                          </label>
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) =>
                              setEditForm({ ...editForm, date: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Tipo
                          </label>
                          <select
                            value={editForm.type}
                            onChange={(e) =>
                              setEditForm({ ...editForm, type: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                          >
                            <option value="expense">Despesa</option>
                            <option value="income">Receita</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Categoria
                          </label>
                          <input
                            type="text"
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Carteira
                          </label>
                          <input
                            type="text"
                            value={editForm.wallet}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                wallet: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Descrição
                          </label>
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                          />
                        </div>
                        {editError ? (
                          <div className="md:col-span-6 -mt-2 text-xs text-red-300">
                            {editError}
                          </div>
                        ) : null}
                        <div className="md:col-span-6 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onSaveEdit(id)}
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
                      <SmartList
                        items={[
                          {
                            id,
                            title: `${categoryName}${
                              description ? ` • ${description}` : ""
                            }`,
                            subtitle: `${dateStr}${
                              wallet ? ` • ${wallet}` : ""
                            }`,
                            leftColor: categoryColor,
                            leftIcon: isIncome ? (
                              <TrendingUp
                                className="w-5 h-5"
                                style={{ color: categoryColor }}
                              />
                            ) : (
                              <TrendingDown
                                className="w-5 h-5"
                                style={{ color: categoryColor }}
                              />
                            ),
                            rightValue: `${isIncome ? "+" : "-"}${amount}`,
                            actions: [
                              {
                                key: "edit",
                                title: "Editar",
                                icon: (
                                  <Pencil className="w-4 h-4 text-gray-300" />
                                ),
                                onClick: () => {
                                  setEditingId(id);
                                  setEditForm({
                                    amount: String(
                                      Math.abs(
                                        t.amount ?? t.transaction_amount ?? 0
                                      )
                                    ),
                                    date: (
                                      t.date ??
                                      t.transaction_date ??
                                      new Date().toISOString().slice(0, 10)
                                    ).slice(0, 10),
                                    type: isIncome ? "income" : "expense",
                                    category: categoryName,
                                    description,
                                    wallet,
                                  });
                                },
                                className:
                                  "p-2 rounded-lg border border-white/10 text-gray-300 bg-white/5 hover:bg-white/10",
                              },
                              {
                                key: "delete",
                                title: "Excluir",
                                icon: (
                                  <Trash2 className="w-4 h-4 text-red-300" />
                                ),
                                onClick: () => {
                                  setDeleteTarget({
                                    id,
                                    label:
                                      description ||
                                      categoryName ||
                                      "Transação",
                                  });
                                  setDeleteModalOpen(true);
                                },
                                className:
                                  "p-2 rounded-lg border border-white/10 bg-red-500/10 hover:bg-red-500/20",
                              },
                            ],
                          },
                        ]}
                      />
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
              await userTransactionsApi.deleteTransaction(deleteTarget.id);
              setDeleteModalOpen(false);
              setDeleteTarget(null);
              await load({ page: 1, search });
            } finally {
              setDeleteLoadingId(null);
            }
          }}
          title="Excluir transação"
          message={`Tem certeza que deseja excluir "${
            deleteTarget?.label || "Transação"
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

// Helpers para valor em pt-BR
function keepNumericDecimal(value) {
  return value
    .replace(/[^0-9.,]/g, "")
    .replace(/(,)(?=.*,)/g, "")
    .replace(/\.(?=.*\.)/g, "");
}

function normalizeAmountToNumber(value) {
  if (!value) return 0;
  const clean = String(value).trim().replace(/\./g, "").replace(/,/g, ".");
  const num = Number(clean);
  return Number.isFinite(num) ? num : 0;
}

function isValidAmount(value) {
  const n = normalizeAmountToNumber(value);
  return Number.isFinite(n) && n > 0;
}

function formatAmountBRL(value) {
  const n = normalizeAmountToNumber(value);
  if (!n) return "";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(n)
      .replace(/\s/g, "");
  } catch (e) {
    return String(value);
  }
}
