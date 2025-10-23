import { useState, useEffect } from "react";
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
import { plannersApi } from "../../services/api/planners";

export default function PlannersPage() {
  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlanner, setSelectedPlanner] = useState(null);

  useEffect(() => {
    loadPlanners();
  }, []);

  const loadPlanners = async () => {
    try {
      setLoading(true);
      const response = await plannersApi.getPlanners();
      setPlanners(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar planners:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlanners = planners.filter(
    (planner) =>
      planner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePlanner = async (plannerId) => {
    if (window.confirm("Tem certeza que deseja deletar este planner?")) {
      try {
        await plannersApi.deletePlanner(plannerId);
        loadPlanners();
      } catch (error) {
        console.error("Erro ao deletar planner:", error);
      }
    }
  };

  const handleCreatePlanner = async (plannerData) => {
    try {
      await plannersApi.createPlanner(plannerData);
      setShowCreateModal(false);
      loadPlanners();
    } catch (error) {
      console.error("Erro ao criar planner:", error);
    }
  };

  const handleUpdatePlanner = async (plannerId, plannerData) => {
    try {
      await plannersApi.updatePlanner(plannerId, plannerData);
      setShowEditModal(false);
      setSelectedPlanner(null);
      loadPlanners();
    } catch (error) {
      console.error("Erro ao atualizar planner:", error);
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
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            Novo Planner
          </button>
        </div>
      </div>

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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Grid de planners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredPlanners.length === 0 ? (
          <div className="col-span-full text-center p-8">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum planner encontrado
            </h3>
            <p className="text-gray-500">
              Crie seu primeiro planner financeiro.
            </p>
          </div>
        ) : (
          filteredPlanners.map((planner) => (
            <div
              key={planner.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: planner.color || "#3B82F6" }}
                  >
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {planner.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Planner ID: {planner.id}
                    </p>
                  </div>
                </div>
              </div>

              {planner.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {planner.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <User size={16} className="mr-1" />
                    Usuário
                  </span>
                  <span className="font-medium text-gray-700">
                    ID: {planner.user_id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Palette size={16} className="mr-1" />
                    Cor
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: planner.color || "#3B82F6" }}
                    ></div>
                    <span className="font-medium text-gray-700">
                      {planner.color || "#3B82F6"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Calendar size={16} className="mr-1" />
                    Criado em
                  </span>
                  <span className="font-medium text-gray-700">
                    {planner.created_at
                      ? new Date(planner.created_at).toLocaleDateString("pt-BR")
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedPlanner(planner);
                    setShowEditModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDeletePlanner(planner.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      user_id: parseInt(formData.user_id),
    });
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor
            </label>
            <div className="space-y-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-2 flex-wrap">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color
                        ? "border-gray-800"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
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
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Criar Planner
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      user_id: parseInt(formData.user_id),
    });
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor
            </label>
            <div className="space-y-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-2 flex-wrap">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color
                        ? "border-gray-800"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
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
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
