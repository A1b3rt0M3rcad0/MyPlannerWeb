import api from '../../config/api';

// Planners - Apenas admins podem acessar
export const plannersApi = {
  // Listar todos os planners
  getPlanners: async () => {
    const response = await api.get('/planners');
    return response.data;
  },

  // Buscar planner por ID
  getPlannerById: async (plannerId) => {
    const response = await api.get(`/planner/${plannerId}`);
    return response.data;
  },

  // Criar planner
  createPlanner: async (plannerData) => {
    const response = await api.post('/planner/create', plannerData);
    return response.data;
  },

  // Atualizar planner
  updatePlanner: async (plannerId, plannerData) => {
    const response = await api.put(`/planner/${plannerId}`, plannerData);
    return response.data;
  },

  // Deletar planner
  deletePlanner: async (plannerId) => {
    const response = await api.delete(`/planner/${plannerId}`);
    return response.data;
  }
};
