import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanner } from "../../hooks/usePlanner.jsx";
import { plannersAPI } from "../../services/api/planners";
import { ArrowLeft, Save, X } from "lucide-react";

export default function CreatePlannerPage() {
  const navigate = useNavigate();
  const { updatePlanners } = usePlanner();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6", // Cor padrão azul
  });

  const colorOptions = [
    { value: "#3B82F6", label: "Azul", color: "bg-blue-500" },
    { value: "#10B981", label: "Verde", color: "bg-green-500" },
    { value: "#F59E0B", label: "Amarelo", color: "bg-yellow-500" },
    { value: "#EF4444", label: "Vermelho", color: "bg-red-500" },
    { value: "#8B5CF6", label: "Roxo", color: "bg-purple-500" },
    { value: "#06B6D4", label: "Ciano", color: "bg-cyan-500" },
    { value: "#F97316", label: "Laranja", color: "bg-orange-500" },
    { value: "#EC4899", label: "Rosa", color: "bg-pink-500" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Nome do planner é obrigatório");
      return;
    }

    if (!formData.description.trim()) {
      setError("Descrição do planner é obrigatória");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Criando planner:", formData);

      // Chama a API para criar o planner
      const response = await plannersAPI.createUserPlanner(formData);

      console.log("✅ Planner criado com sucesso:", response);

      // Atualiza a lista de planners
      await updatePlanners();

      // Redireciona para a seleção de planners
      navigate("/planner/selection");
    } catch (err) {
      console.error("❌ Erro ao criar planner:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Erro ao criar planner. Tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/planner/selection");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Voltar"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FP</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                Criar Novo Planner
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Criar Novo Planner
            </h2>
            <p className="text-gray-600">
              Preencha as informações abaixo para criar seu novo planner
              financeiro
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Planner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Planner *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Meu Planejamento Pessoal"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva o propósito deste planner..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                required
              />
            </div>

            {/* Cor do Planner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Cor do Planner *
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {colorOptions.map((color) => {
                  const isSelected = formData.color === color.value;

                  return (
                    <div
                      key={color.value}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color: color.value }))
                      }
                      className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-primary-500 ring-2 ring-primary-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      title={color.label}
                    >
                      <div
                        className={`w-8 h-8 ${color.color} rounded-lg mx-auto`}
                        style={{ backgroundColor: color.value }}
                      ></div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-2 h-2 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-red-500" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Criar Planner
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
