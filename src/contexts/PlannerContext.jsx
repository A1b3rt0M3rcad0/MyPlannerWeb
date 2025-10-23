import { createContext, useState, useEffect, useCallback } from "react";
import { plannersAPI } from "../services/api/planners";

export const PlannerContext = createContext({});

export function PlannerProvider({ children }) {
  const [selectedPlanner, setSelectedPlanner] = useState(null);
  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(false);

  // Chaves do localStorage
  const PLANNER_CONFIG = {
    SELECTED_PLANNER_KEY: "finplanner_v2_selected_planner",
    PLANNERS_KEY: "finplanner_v2_planners",
  };

  // Carrega planners do backend
  const loadPlanners = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Carregando planners do backend...");

      const response = await plannersAPI.listUserPlanners();
      console.log("✅ Planners carregados:", response);

      if (response && response.planners) {
        setPlanners(response.planners);
        localStorage.setItem(
          PLANNER_CONFIG.PLANNERS_KEY,
          JSON.stringify(response.planners)
        );
      }

      // Carrega planner selecionado do localStorage
      const storedSelected = localStorage.getItem(
        PLANNER_CONFIG.SELECTED_PLANNER_KEY
      );
      if (storedSelected) {
        const selectedData = JSON.parse(storedSelected);
        setSelectedPlanner(selectedData);
      } else if (
        response &&
        response.planners &&
        response.planners.length > 0
      ) {
        // Se não há planner selecionado, seleciona o primeiro automaticamente
        const firstPlanner = response.planners[0];
        setSelectedPlanner(firstPlanner);
        localStorage.setItem(
          PLANNER_CONFIG.SELECTED_PLANNER_KEY,
          JSON.stringify(firstPlanner)
        );
      }
    } catch (error) {
      console.error("❌ Erro ao carregar planners:", error);
      // Fallback para dados mockados se a API falhar
      const mockPlanners = [
        {
          id: 1,
          name: "Planner Pessoal",
          description: "Meu planejamento financeiro pessoal",
          type: "personal",
          color: "#3b82f6", // blue-500
          members_count: 1,
          created_at: "2024-01-15",
          total_balance: 12500.0,
          monthly_income: 8500.0,
          monthly_expenses: 3200.0,
        },
        {
          id: 2,
          name: "Família Silva",
          description: "Planejamento financeiro da família",
          type: "family",
          color: "#22c55e", // green-500
          members_count: 4,
          created_at: "2024-02-10",
          total_balance: 25000.0,
          monthly_income: 15000.0,
          monthly_expenses: 8500.0,
        },
        {
          id: 3,
          name: "Projeto Casa Nova",
          description: "Economia para compra da casa própria",
          type: "project",
          color: "#8b5cf6", // violet-500
          members_count: 2,
          created_at: "2024-03-05",
          total_balance: 45000.0,
          monthly_income: 5000.0,
          monthly_expenses: 0.0,
        },
      ];
      setPlanners(mockPlanners);

      // Carrega planner selecionado do localStorage mesmo com dados mockados
      const storedSelected = localStorage.getItem(
        PLANNER_CONFIG.SELECTED_PLANNER_KEY
      );
      if (storedSelected) {
        const selectedData = JSON.parse(storedSelected);
        setSelectedPlanner(selectedData);
      } else if (mockPlanners.length > 0) {
        // Se não há planner selecionado, seleciona o primeiro automaticamente
        const firstPlanner = mockPlanners[0];
        setSelectedPlanner(firstPlanner);
        localStorage.setItem(
          PLANNER_CONFIG.SELECTED_PLANNER_KEY,
          JSON.stringify(firstPlanner)
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Seleciona um planner
  const selectPlanner = useCallback((planner) => {
    console.log("📋 Selecionando planner:", planner);

    setSelectedPlanner(planner);
    localStorage.setItem(
      PLANNER_CONFIG.SELECTED_PLANNER_KEY,
      JSON.stringify(planner)
    );

    console.log("✅ Planner selecionado com sucesso");
  }, []);

  // Atualiza lista de planners
  const updatePlanners = useCallback(async () => {
    try {
      console.log("🔄 Atualizando lista de planners...");
      await loadPlanners();
      console.log("✅ Lista de planners atualizada");
    } catch (error) {
      console.error("❌ Erro ao atualizar planners:", error);
    }
  }, [loadPlanners]);

  // Limpa planner selecionado
  const clearSelectedPlanner = useCallback(() => {
    console.log("🗑️ Limpando planner selecionado");

    setSelectedPlanner(null);
    localStorage.removeItem(PLANNER_CONFIG.SELECTED_PLANNER_KEY);

    console.log("✅ Planner selecionado removido");
  }, []);

  // Carrega planners quando o componente monta
  useEffect(() => {
    loadPlanners();
  }, [loadPlanners]);

  // Debug: Log do estado quando muda
  useEffect(() => {
    console.log("📊 Estado do planner:", {
      selectedPlanner: selectedPlanner?.name || "Nenhum",
      plannersCount: planners.length,
      loading,
    });
  }, [selectedPlanner, planners, loading]);

  const value = {
    selectedPlanner,
    planners,
    loading,
    selectPlanner,
    updatePlanners,
    clearSelectedPlanner,
    setLoading,
    PLANNER_CONFIG,
  };

  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  );
}
