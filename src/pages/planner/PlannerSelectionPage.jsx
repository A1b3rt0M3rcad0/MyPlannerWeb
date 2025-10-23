import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanner } from "../../hooks/usePlanner.jsx";
import { Plus, Users, Calendar, DollarSign, ArrowRight } from "lucide-react";

export default function PlannerSelectionPage() {
  const navigate = useNavigate();
  const { planners, selectPlanner, loading, updatePlanners } = usePlanner();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

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

  const filteredPlanners = planners.filter(
    (planner) =>
      planner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getPlannerIcon = (color) => {
    // Retorna ícone baseado na cor
    return <DollarSign className="w-6 h-6" />;
  };

  const getPlannerTypeLabel = (color) => {
    // Retorna label baseado na cor
    return "Planner";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando planners...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao carregar planners
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FP</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                FinPlanner V2
              </h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título e busca */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Selecione um Planner
          </h2>
          <p className="text-gray-600 mb-6">
            Escolha o planner que deseja acessar ou crie um novo
          </p>

          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Buscar planners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Grid de planners */}
        {filteredPlanners.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm
                ? "Nenhum planner encontrado"
                : "Nenhum planner criado"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Tente ajustar sua busca ou criar um novo planner"
                : "Crie seu primeiro planner para começar a organizar suas finanças"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredPlanners.map((planner) => (
              <div
                key={planner.id}
                onClick={() => handleSelectPlanner(planner)}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: planner.color }}
                    >
                      {getPlannerIcon(planner.color)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {planner.name || "Sem nome"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getPlannerTypeLabel(planner.color)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {planner.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Criado em:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(planner.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-semibold text-gray-900">
                      #{planner.id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão criar novo planner */}
        <div className="text-center">
          <button
            onClick={handleCreatePlanner}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Criar Novo Planner
          </button>
        </div>
      </div>
    </div>
  );
}
