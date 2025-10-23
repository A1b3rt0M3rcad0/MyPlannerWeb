import api from '../../config/api';

// Planos de Assinatura - Apenas admins podem acessar
export const subscriptionPlansApi = {
  // Listar todos os planos
  getPlans: async () => {
    const response = await api.get('/subscription_plans');
    return response.data;
  },

  // Buscar plano por ID
  getPlanById: async (planId) => {
    const response = await api.get(`/subscription_plan/${planId}`);
    return response.data;
  },

  // Criar plano
  createPlan: async (planData) => {
    const response = await api.post('/subscription_plan/create', planData);
    return response.data;
  },

  // Atualizar plano
  updatePlan: async (planId, planData) => {
    const response = await api.put(`/subscription_plan/${planId}`, planData);
    return response.data;
  },

  // Deletar plano
  deletePlan: async (planId) => {
    const response = await api.delete(`/subscription_plan/${planId}`);
    return response.data;
  }
};
