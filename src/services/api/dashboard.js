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
};
