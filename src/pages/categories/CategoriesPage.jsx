import { useEffect, useMemo, useState } from "react";
import BasePage from "../../components/layout/BasePage";
import { usePlannerColor } from "../../hooks/usePlannerColor";
import { usePlanner } from "../../hooks/usePlanner";
import { userCategoriesApi } from "../../services/api/categories";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  Search,
  Plus,
  FolderOpen,
  Loader2,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import SmartList from "../../components/SmartList";

export default function CategoriesPage() {
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
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const accentBg = useMemo(
    () => ({ backgroundColor: colors.primary }),
    [colors.primary]
  );
  const accentText = useMemo(
    () => ({ color: colors.primary }),
    [colors.primary]
  );

  const load = async (opts = {}) => {
    const nextPage = opts.page ?? page;
    const term = opts.search ?? search;
    try {
      setLoading(true);
      setError(null);
      const data = await userCategoriesApi.getCategories(
        nextPage,
        pageSize,
        term
      );
      // Esperado: { items: [...], total: number, page: number, page_size: number }
      const list = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];
      setItems(list);
      if (typeof data?.total === "number") {
        const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
        setHasNextPage(nextPage < totalPages);
      } else {
        setHasNextPage(list.length === pageSize); // fallback heurístico
      }
      setPage(nextPage);
      setSearch(term);
    } catch (e) {
      setError("Não foi possível carregar as categorias.");
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
    if (!newName.trim()) {
      setCreateError("Informe um nome para a categoria.");
      return;
    }
    if (!selectedPlanner?.id) {
      setCreateError("Selecione um planner para criar categorias.");
      return;
    }
    try {
      setCreateLoading(true);
      setCreateError(null);
      await userCategoriesApi.createCategory({
        name: newName.trim(),
        color: newColor || undefined,
        planner_id: selectedPlanner.id,
      });
      setShowCreate(false);
      setNewName("");
      setNewColor("");
      await load({ page: 1, search });
    } catch (err) {
      setCreateError("Não foi possível criar a categoria.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <BasePage pageTitle="Categorias" showPlannerSelector={true}>
      <div className="space-y-6 animate-dashboard-enter-slow">
        {/* Barra de ações */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <form onSubmit={onSubmitSearch} className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar categorias..."
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
                <Plus className="w-4 h-4" /> Nova categoria
              </>
            )}
          </button>
        </div>

        {/* Seção de criação com animação de expansão */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showCreate
              ? "max-h-[500px] opacity-100 translate-y-0"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex.: Alimentação"
                    className="w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Cor
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColor || "#6b7280"}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="h-10 w-12 rounded cursor-pointer bg-transparent border border-white/10"
                      title="Escolher cor"
                    />
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="#RRGGBB"
                      className="flex-1 px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                    />
                  </div>
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
                <FolderOpen className="w-6 h-6 text-secondary-900" />
              </div>
              <p className="text-white font-semibold mb-1">
                Nenhuma categoria encontrada
              </p>
              <p className="text-gray-400 text-sm">
                Tente ajustar a busca ou criar uma nova categoria.
              </p>
            </div>
          ) : (
            <div className="dashboard-stagger-slow">
              {items.map((c) => {
                const id = c.id ?? c.category_id;
                const isEditing = editingId === id;

                const item = {
                  id,
                  title: c.name || c.category_name || "Categoria",
                  subtitle: `#${id ?? "—"}`,
                  leftColor: c.color || colors.primary,
                  leftIcon: (
                    <FolderOpen
                      className="w-5 h-5"
                      style={{ color: c.color || colors.primary }}
                    />
                  ),
                  actions: [
                    {
                      key: "edit",
                      title: "Editar",
                      icon: <Pencil className="w-4 h-4 text-gray-300" />,
                      onClick: () => {
                        setEditingId(id);
                        setEditName(c.name || c.category_name || "");
                        setEditColor(c.color || "");
                      },
                      className:
                        "p-2 rounded-lg border border-white/10 text-gray-300 bg-white/5 hover:bg-white/10",
                    },
                    {
                      key: "delete",
                      title: "Excluir",
                      icon: <Trash2 className="w-4 h-4 text-red-300" />,
                      onClick: () => {
                        setDeleteTarget({
                          id,
                          name: c.name || c.category_name || "Categoria",
                        });
                        setDeleteModalOpen(true);
                      },
                      className:
                        "p-2 rounded-lg border border-white/10 bg-red-500/10 hover:bg-red-500/20",
                    },
                  ],
                };

                return (
                  <div key={id} className="mb-2">
                    <SmartList items={[item]} />
                    {isEditing ? (
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span
                            className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor:
                                editColor || c.color || colors.primary,
                            }}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="md:col-span-2 w-full px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                              placeholder="Nome da categoria"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={editColor || "#6b7280"}
                                onChange={(e) => setEditColor(e.target.value)}
                                className="h-10 w-12 rounded cursor-pointer bg-transparent border border-white/10"
                                title="Escolher cor"
                              />
                              <input
                                type="text"
                                value={editColor}
                                onChange={(e) => setEditColor(e.target.value)}
                                placeholder="#RRGGBB"
                                className="flex-1 px-3 py-2 rounded-lg bg-secondary-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              if (!editName.trim()) {
                                setEditError(
                                  "Informe um nome para a categoria."
                                );
                                return;
                              }
                              try {
                                setEditLoading(true);
                                setEditError(null);
                                await userCategoriesApi.updateCategory(id, {
                                  name: editName.trim(),
                                  color: editColor || undefined,
                                  planner_id: selectedPlanner?.id,
                                });
                                setEditingId(null);
                                await load({ page, search });
                              } catch (err) {
                                setEditError(
                                  "Não foi possível atualizar a categoria."
                                );
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
                    ) : null}
                    {isEditing && editError ? (
                      <div className="mt-2 rounded-lg p-2 text-xs bg-red-500/10 border border-red-500/30 text-red-300">
                        {editError}
                      </div>
                    ) : null}
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
              await userCategoriesApi.deleteCategory(deleteTarget.id);
              setDeleteModalOpen(false);
              setDeleteTarget(null);
              await load({ page: 1, search });
            } finally {
              setDeleteLoadingId(null);
            }
          }}
          title="Excluir categoria"
          message={`Tem certeza que deseja excluir a categoria "${
            deleteTarget?.name || ""
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
