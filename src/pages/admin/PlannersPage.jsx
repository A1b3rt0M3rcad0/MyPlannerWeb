import { useState, useEffect, useCallback } from "react";
import {
  FolderOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  User,
  Calendar,
  Palette,
  FileText,
} from "lucide-react";
import { adminPlannersApi } from "../../services/api/adminPlanners";
import ColorWheel from "../../components/ColorWheel";

export default function PlannersPage() {
  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlanner, setSelectedPlanner] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const loadPlanners = useCallback(
    async (page = pagination.page, pageSize = pagination.pageSize) => {
      try {
        setLoading(true);
        const response = await adminPlannersApi.getPlanners(
          page,
          pageSize,
          searchTerm
        );
        setPlanners(response.planners || []);
        setPagination({
          page: response.pagination?.page || page,
          pageSize: response.pagination?.page_size || pageSize,
          total: response.pagination?.total || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar planners:", error);
        setError("Erro ao carregar planners");
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize, searchTerm]
  );

  useEffect(() => {
    loadPlanners();
  }, []);

  // Debounce para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPlanners(1); // Reset para página 1 quando buscar
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [loadPlanners]);

  // A filtragem agora é feita no backend
  const filteredPlanners = planners;

  const handleDeletePlanner = async (plannerId) => {
    if (window.confirm("Tem certeza que deseja deletar este planner?")) {
      try {
        setError(null);
        setSuccess(null);
        await adminPlannersApi.deletePlanner(plannerId);
        setSuccess("Planner deletado com sucesso!");
        loadPlanners(pagination.page);
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error("Erro ao deletar planner:", error);
        setError(error.response?.data?.message || "Erro ao deletar planner");
      }
    }
  };

  const handleCreatePlanner = async (plannerData) => {
    try {
      setError(null);
      setSuccess(null);
      await adminPlannersApi.createPlanner(plannerData);
      setSuccess("Planner criado com sucesso!");
      setShowCreateModal(false);
      loadPlanners(1);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao criar planner:", error);
      setError(error.response?.data?.message || "Erro ao criar planner");
    }
  };

  const handleUpdatePlanner = async (plannerId, plannerData) => {
    try {
      setError(null);
      setSuccess(null);
      await adminPlannersApi.updatePlanner(plannerId, plannerData);
      setSuccess("Planner atualizado com sucesso!");
      setShowEditModal(false);
      setSelectedPlanner(null);
      loadPlanners(pagination.page);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao atualizar planner:", error);
      setError(error.response?.data?.message || "Erro ao atualizar planner");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Planners</h1>
            <p className="text-gray-600">
              Gerencie todos os planners financeiros do sistema
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Novo Planner
          </button>
        </div>
      </div>

      {/* Mensagens de feedback */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar planners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tabela de planners */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando planners...</p>
          </div>
        ) : filteredPlanners.length === 0 ? (
          <div className="p-8 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum planner encontrado
            </h3>
            <p className="text-gray-500">
              Crie seu primeiro planner financeiro.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Planner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlanners.map((planner) => (
                  <tr key={planner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                          style={{
                            backgroundColor: planner.color || "#3B82F6",
                          }}
                        >
                          <FolderOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {planner.name}
                          </div>
                          {planner.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {planner.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <User size={16} className="mr-2 text-gray-400" />
                        ID: {planner.user_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{
                            backgroundColor: planner.color || "#3B82F6",
                          }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">
                          {planner.color || "#3B82F6"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {planner.created_at
                          ? new Date(planner.created_at).toLocaleDateString(
                              "pt-BR"
                            )
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedPlanner(planner);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePlanner(planner.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Deletar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Controles de paginação */}
      {!loading && filteredPlanners.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
          <div className="flex items-center justify-between">
            {/* Informações da paginação */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Mostrando {(pagination.page - 1) * pagination.pageSize + 1} a{" "}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total
                )}{" "}
                de {pagination.total} planners
              </span>

              {/* Seletor de itens por página */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Itens por página:</span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) => {
                    const newPageSize = Number(e.target.value);
                    setPagination((prev) => ({
                      ...prev,
                      pageSize: newPageSize,
                      page: 1,
                    }));
                    loadPlanners();
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Navegação de páginas */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (pagination.page > 1) {
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
                    loadPlanners();
                  }
                }}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {/* Números das páginas */}
              <div className="flex items-center gap-1">
                {Array.from(
                  {
                    length: Math.min(
                      5,
                      Math.ceil(pagination.total / pagination.pageSize)
                    ),
                  },
                  (_, i) => {
                    const totalPages = Math.ceil(
                      pagination.total / pagination.pageSize
                    );
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setPagination((prev) => ({ ...prev, page: pageNum }));
                          loadPlanners();
                        }}
                        className={`px-3 py-1 text-sm border rounded ${
                          pageNum === pagination.page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => {
                  const totalPages = Math.ceil(
                    pagination.total / pagination.pageSize
                  );
                  if (pagination.page < totalPages) {
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
                    loadPlanners();
                  }
                }}
                disabled={
                  pagination.page ===
                  Math.ceil(pagination.total / pagination.pageSize)
                }
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modais */}
      {showCreateModal && (
        <CreatePlannerModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePlanner}
        />
      )}

      {showEditModal && selectedPlanner && (
        <EditPlannerModal
          planner={selectedPlanner}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPlanner(null);
          }}
          onSubmit={(plannerData) =>
            handleUpdatePlanner(selectedPlanner.id, plannerData)
          }
        />
      )}
    </div>
  );
}

// Componente de modal para criar planner
function CreatePlannerModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    description: "",
    color: "#3B82F6",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_id || parseInt(formData.user_id) < 1) {
      newErrors.user_id = "ID do usuário deve ser maior que 0";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        user_id: parseInt(formData.user_id),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Criar Novo Planner</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID do Usuário
            </label>
            <input
              type="number"
              required
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Planner
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor
            </label>
            <div className="flex justify-center">
              <ColorWheel
                value={formData.color}
                onChange={(color) => setFormData({ ...formData, color })}
                size={150}
                showPresets={true}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Criando...
                </>
              ) : (
                "Criar Planner"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente de modal para editar planner
function EditPlannerModal({ planner, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    user_id: planner.user_id || "",
    name: planner.name || "",
    description: planner.description || "",
    color: planner.color || "#3B82F6",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_id || parseInt(formData.user_id) < 1) {
      newErrors.user_id = "ID do usuário deve ser maior que 0";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        user_id: parseInt(formData.user_id),
      });
    } finally {
      setLoading(false);
    }
  };

  const predefinedColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Planner</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID do Usuário
            </label>
            <input
              type="number"
              required
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Planner
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor
            </label>
            <div className="flex justify-center">
              <ColorWheel
                value={formData.color}
                onChange={(color) => setFormData({ ...formData, color })}
                size={150}
                showPresets={true}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 data"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
