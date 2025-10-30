import api from "../../config/api";

export const dashboardAPI = {
  // Obter estatísticas do dashboard
  getStats: async () => {
    try {
      const response = await api.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter estatísticas do dashboard:", error);
      throw error;
    }
  },
  // Obter estatísticas do dashboard do usuário (por planner e período)
  getUserStats: async ({ plannerId, initialDate, finalDate }) => {
    try {
      const response = await api.get("/user/dashboard/stats", {
        params: {
          planner_id: plannerId,
          initial_date: initialDate,
          final_date: finalDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao obter estatísticas do dashboard do usuário:",
        error
      );
      throw error;
    }
  },
};
