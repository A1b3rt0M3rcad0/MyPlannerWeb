import api from "../../config/api";

// Planners administrativos - Apenas admins podem acessar
export const adminPlannersApi = {
  // Listar todos os planners (admin)
  getPlanners: async (page = 1, pageSize = 50, search = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await api.get(`/planners?${params}`);
    return response.data;
  },

  // Buscar planner por ID (admin)
  getPlannerById: async (plannerId) => {
    const response = await api.get(`/planner/${plannerId}`);
    return response.data;
  },

  // Criar planner (admin)
  createPlanner: async (plannerData) => {
    const response = await api.post("/planner/create", plannerData);
    return response.data;
  },

  // Atualizar planner (admin)
  updatePlanner: async (plannerId, plannerData) => {
    const response = await api.put(`/planner/${plannerId}`, plannerData);
    return response.data;
  },

  // Deletar planner (admin)
  deletePlanner: async (plannerId) => {
    const response = await api.delete(`/planner/${plannerId}`);
    return response.data;
  },
};
