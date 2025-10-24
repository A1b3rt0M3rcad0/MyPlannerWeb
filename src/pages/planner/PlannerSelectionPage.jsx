import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanner } from "../../hooks/usePlanner.jsx";
import { plannersAPI } from "../../services/api/planners";
import {
  Plus,
  Users,
  Calendar,
  DollarSign,
  ArrowRight,
  Search,
  FolderOpen,
  Sparkles,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";

export default function PlannerSelectionPage() {
  const navigate = useNavigate();
  const { planners, selectPlanner, loading, updatePlanners } = usePlanner();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [plannerToDelete, setPlannerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [plannerToEdit, setPlannerToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  });
  const [updating, setUpdating] = useState(false);

  // Carrega planners quando o componente monta
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        await updatePlanners();
      } catch (err) {
        console.error("Erro ao carregar planners:", err);
        setError("Erro ao carregar planners. Tente novamente.");
      }
    };

    loadData();
  }, [updatePlanners]);

  const handleSelectPlanner = (planner) => {
    selectPlanner(planner);
    navigate("/dashboard");
  };

  const handleCreatePlanner = () => {
    navigate("/planner/create");
  };

  const handleDeleteClick = (planner, e) => {
    e.stopPropagation(); // Previne o clique no card
    setPlannerToDelete(planner);
    setShowDeleteModal(true);
  };

  const handleEditClick = (planner, e) => {
    e.stopPropagation(); // Previne o clique no card
    setPlannerToEdit(planner);
    setEditForm({
      name: planner.name || "",
      description: planner.description || "",
      color: planner.color || "#3B82F6",
    });
    setShowEditModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!plannerToDelete) return;

    setDeleting(true);
    try {
      await plannersAPI.deleteUserPlanner(plannerToDelete.id);
      await updatePlanners(); // Recarrega a lista
      setShowDeleteModal(false);
      setPlannerToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar planner:", error);
      setError("Erro ao deletar planner. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPlannerToDelete(null);
  };

  const handleConfirmEdit = async () => {
    if (!plannerToEdit) return;

    setUpdating(true);
    try {
      await plannersAPI.updateUserPlanner(plannerToEdit.id, editForm);
      await updatePlanners(); // Recarrega a lista
      setShowEditModal(false);
      setPlannerToEdit(null);
      setEditForm({ name: "", description: "", color: "#3B82F6" });
    } catch (error) {
      console.error("Erro ao atualizar planner:", error);
      setError("Erro ao atualizar planner. Tente novamente.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setPlannerToEdit(null);
    setEditForm({ name: "", description: "", color: "#3B82F6" });
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredPlanners = planners.filter(
    (planner) =>
      planner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlannerIcon = (color) => {
    return <DollarSign className="w-6 h-6" />;
  };

  const getPlannerTypeLabel = (color) => {
    return "Planner";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary-900 border-t-transparent"></div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Carregando planners...
          </h3>
          <p className="text-gray-300">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
        </div>
        <div className="text-center max-w-md relative z-10">
          <div className="w-20 h-20 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Erro ao carregar planners
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-secondary-900 rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:shadow-primary-500/30"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
      </div>

      {/* Header com gradiente */}
      <div className="bg-secondary-900/50 backdrop-blur-md border-b border-white/10 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-secondary-900 font-bold text-sm">FP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  FinPlanner V2
                </h1>
                <p className="text-sm text-gray-300">Selecione seu planner</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-gray-300 hover:text-primary-400 hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Card principal com glassmorphism */}
        <div className="bg-secondary-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden mb-8">
          {/* Header do card */}
          <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 px-8 py-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FolderOpen className="w-6 h-6 text-secondary-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Meus Planners
                </h2>
                <p className="text-gray-300">
                  Escolha um planner para acessar ou crie um novo
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Busca */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar planners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-white/10 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 bg-secondary-800/50 backdrop-blur-sm text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Grid de planners */}
            {filteredPlanners.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FolderOpen className="w-10 h-10 text-secondary-900" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {searchTerm
                    ? "Nenhum planner encontrado"
                    : "Nenhum planner criado"}
                </h3>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                  {searchTerm
                    ? "Tente ajustar sua busca ou criar um novo planner"
                    : "Crie seu primeiro planner para começar a organizar suas finanças"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleCreatePlanner}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-secondary-900 rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Criar Primeiro Planner</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredPlanners.map((planner) => (
                  <div
                    key={planner.id}
                    onClick={() => handleSelectPlanner(planner)}
                    className="bg-secondary-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group transform hover:-translate-y-1 relative cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                          style={{ backgroundColor: planner.color }}
                        >
                          {getPlannerIcon(planner.color)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors">
                            {planner.name || "Sem nome"}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {getPlannerTypeLabel(planner.color)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleEditClick(planner, e)}
                          className="p-2 text-gray-400 hover:text-primary-400 hover:bg-white/10 rounded-lg transition-all duration-200"
                          title="Editar planner"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(planner, e)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                          title="Deletar planner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {planner.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Criado em:</span>
                        <span className="font-semibold text-white">
                          {new Date(planner.created_at).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">ID:</span>
                        <span className="font-semibold text-white">
                          #{planner.id}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botão criar novo planner */}
            {filteredPlanners.length > 0 && (
              <div className="text-center">
                <button
                  onClick={handleCreatePlanner}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-secondary-900 rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  <span>Criar Novo Planner</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edição */}
      {showEditModal && plannerToEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-secondary-800/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 border border-white/10 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-500/20 border border-primary-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Edit className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Editar Planner
              </h3>
              <p className="text-gray-300">
                Atualize as informações do seu planner
              </p>
            </div>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Planner
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleEditFormChange("name", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 bg-secondary-700/50 backdrop-blur-sm text-white placeholder-gray-400"
                  placeholder="Digite o nome do planner"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    handleEditFormChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 bg-secondary-700/50 backdrop-blur-sm text-white placeholder-gray-400 resize-none"
                  placeholder="Digite uma descrição para o planner"
                />
              </div>

              {/* Cor */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cor do Planner
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editForm.color}
                    onChange={(e) =>
                      handleEditFormChange("color", e.target.value)
                    }
                    className="w-12 h-12 border-2 border-white/10 rounded-xl cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editForm.color}
                      onChange={(e) =>
                        handleEditFormChange("color", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 bg-secondary-700/50 backdrop-blur-sm text-white placeholder-gray-400"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleCancelEdit}
                disabled={updating}
                className="flex-1 px-6 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmEdit}
                disabled={updating || !editForm.name.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Atualizando...
                  </>
                ) : (
                  "Atualizar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de delete */}
      {showDeleteModal && plannerToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-secondary-800/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 border border-white/10 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Deletar Planner
              </h3>
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja deletar o planner{" "}
                <span className="font-semibold text-white">
                  "{plannerToDelete.name}"
                </span>
                ? Esta ação não pode ser desfeita e todos os dados relacionados
                serão perdidos.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleCancelDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Deletando...
                    </>
                  ) : (
                    "Deletar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
