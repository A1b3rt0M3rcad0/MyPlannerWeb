import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanner } from "../../hooks/usePlanner.jsx";
import { plannersAPI } from "../../services/api/planners";
import { ArrowLeft, Save, X } from "lucide-react";
import ColorWheel from "../../components/ColorWheel";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await plannersAPI.createPlanner({
        name: formData.name,
        description: formData.description,
        color: formData.color,
      });

      if (response.success) {
        await updatePlanners();
        navigate("/planner/selection");
      } else {
        setError(response.error || "Erro ao criar planner");
      }
    } catch (err) {
      console.error("Erro ao criar planner:", err);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header com gradiente */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 group"
                title="Voltar"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">FP</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Criar Novo Planner
                  </h1>
                  <p className="text-sm text-gray-500">
                    Configure seu planejamento financeiro
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Card principal com glassmorphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header do card */}
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-8 py-6 border-b border-gray-100/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Novo Planner Financeiro
                </h2>
                <p className="text-gray-600">
                  Configure seu planejamento personalizado com cores e detalhes
                  únicos
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Layout em duas colunas para desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coluna esquerda - Formulário */}
                <div className="space-y-6">
                  {/* Nome do Planner */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                      Nome do Planner *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ex: Meu Planejamento Pessoal"
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-400"
                        required
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                      Descrição *
                    </label>
                    <div className="relative">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Descreva o propósito e objetivos deste planner..."
                        rows={4}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-400 resize-none"
                        required
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                {/* Coluna direita - Seletor de Cor */}
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-4 group-focus-within:text-blue-600 transition-colors">
                      Cor do Planner *
                    </label>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/50 h-fit">
                      <div className="flex justify-center">
                        <ColorWheel
                          value={formData.color}
                          onChange={(color) =>
                            setFormData((prev) => ({ ...prev, color }))
                          }
                          size={200}
                          showPresets={true}
                          className="w-full max-w-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl p-6 shadow-lg mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <X className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-red-800 font-medium">
                        Erro ao criar planner
                      </p>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200/50 mt-8">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Preencha todos os campos obrigatórios</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Criando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Criar Planner</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
