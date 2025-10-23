import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import { subscriptionPlansApi } from "../../services/api/subscriptionPlans";

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await subscriptionPlansApi.getPlans();
      setPlans(response.subscription_plans || []);
      setPagination({
        page: response.pagination?.page || 1,
        pageSize: response.pagination?.page_size || 10,
        total: response.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      setError("Erro ao carregar planos");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredPlans = plans.filter(
    (plan) =>
      plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.plan_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePlan = async (planId) => {
    if (window.confirm("Tem certeza que deseja deletar este plano?")) {
      try {
        setError(null);
        setSuccess(null);
        await subscriptionPlansApi.deletePlan(planId);
        setSuccess("Plano deletado com sucesso!");
        loadPlans();
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error("Erro ao deletar plano:", error);
        setError(error.response?.data?.message || "Erro ao deletar plano");
      }
    }
  };

  const handleCreatePlan = async (planData) => {
    try {
      setError(null);
      setSuccess(null);
      await subscriptionPlansApi.createPlan(planData);
      setSuccess("Plano criado com sucesso!");
      setShowCreateModal(false);
      loadPlans();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao criar plano:", error);
      setError(error.response?.data?.message || "Erro ao criar plano");
    }
  };

  const handleUpdatePlan = async (planId, planData) => {
    try {
      setError(null);
      setSuccess(null);
      await subscriptionPlansApi.updatePlan(planId, planData);
      setSuccess("Plano atualizado com sucesso!");
      setShowEditModal(false);
      setSelectedPlan(null);
      loadPlans();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
      setError(error.response?.data?.message || "Erro ao atualizar plano");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDuration = (days) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} ano${years > 1 ? "s" : ""}`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} mês${months > 1 ? "es" : ""}`;
    } else {
      return `${days} dia${days > 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Planos de Assinatura
            </h1>
            <p className="text-gray-600">
              Gerencie os planos de assinatura do sistema
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Novo Plano
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
              placeholder="Buscar planos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Cards de planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="col-span-full text-center p-8">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum plano encontrado
            </h3>
            <p className="text-gray-500">
              Crie seu primeiro plano de assinatura.
            </p>
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      plan.plan_type === "premium"
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-500"
                        : "bg-gradient-to-br from-blue-400 to-blue-500"
                    }`}
                  >
                    {plan.plan_type === "premium" ? (
                      <Star className="w-6 h-6 text-white" />
                    ) : (
                      <CreditCard className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600">{plan.plan_type}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    plan.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {plan.is_active ? (
                    <>
                      <CheckCircle size={12} className="mr-1" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <XCircle size={12} className="mr-1" />
                      Inativo
                    </>
                  )}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {plan.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <DollarSign size={16} className="mr-1" />
                    Preço
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(plan.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Calendar size={16} className="mr-1" />
                    Ciclo
                  </span>
                  <span className="font-medium text-gray-700">
                    {plan.billing_cycle}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Clock size={16} className="mr-1" />
                    Duração
                  </span>
                  <span className="font-medium text-gray-700">
                    {formatDuration(plan.duration || 30)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowEditModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
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
        <CreatePlanModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePlan}
        />
      )}

      {showEditModal && selectedPlan && (
        <EditPlanModal
          plan={selectedPlan}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPlan(null);
          }}
          onSubmit={(planData) => handleUpdatePlan(selectedPlan.id, planData)}
        />
      )}
    </div>
  );
}

// Componente de modal para criar plano
function CreatePlanModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    billing_cycle: "monthly",
    plan_type: "trial",
    duration: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = "Preço deve ser maior ou igual a 0";
    }

    if (!formData.duration || parseInt(formData.duration) < 1) {
      newErrors.duration = "Duração deve ser maior que 0";
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
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Criar Novo Plano</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Plano
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
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciclo de Cobrança
            </label>
            <select
              value={formData.billing_cycle}
              onChange={(e) =>
                setFormData({ ...formData, billing_cycle: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Mensal</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Plano
            </label>
            <select
              value={formData.plan_type}
              onChange={(e) =>
                setFormData({ ...formData, plan_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="trial">Trial</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração (dias)
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Plano ativo
            </label>
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
                "Criar Plano"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente de modal para editar plano
function EditPlanModal({ plan, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: plan.name || "",
    description: plan.description || "",
    price: plan.price || "",
    billing_cycle: plan.billing_cycle || "monthly",
    plan_type: plan.plan_type || "trial",
    duration: plan.duration || "",
    is_active: plan.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = "Preço deve ser maior ou igual a 0";
    }

    if (!formData.duration || parseInt(formData.duration) < 1) {
      newErrors.duration = "Duração deve ser maior que 0";
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
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Editar Plano</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Plano
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
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciclo de Cobrança
            </label>
            <select
              value={formData.billing_cycle}
              onChange={(e) =>
                setFormData({ ...formData, billing_cycle: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Mensal</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Plano
            </label>
            <select
              value={formData.plan_type}
              onChange={(e) =>
                setFormData({ ...formData, plan_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="trial">Trial</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração (dias)
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Plano ativo
            </label>
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
