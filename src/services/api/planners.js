import api from "../../config/api";

const PLANNERS_ENDPOINTS = {
  LIST_USER_PLANNERS: "/my/planners",
  GET_USER_PLANNER: "/my/planner",
  CREATE_USER_PLANNER: "/my/planner/create",
  UPDATE_USER_PLANNER: "/my/planner",
  DELETE_USER_PLANNER: "/my/planner",
};

export const plannersAPI = {
  // Lista todos os planners do usuário autenticado
  async listUserPlanners() {
    try {
      const response = await api.get(PLANNERS_ENDPOINTS.LIST_USER_PLANNERS);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar planners:", error);
      throw error;
    }
  },

  // Busca um planner específico do usuário
  async getUserPlanner(plannerId) {
    try {
      const response = await api.get(
        `${PLANNERS_ENDPOINTS.GET_USER_PLANNER}/${plannerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar planner:", error);
      throw error;
    }
  },

  // Cria um novo planner
  async createUserPlanner(plannerData) {
    try {
      const response = await api.post(
        PLANNERS_ENDPOINTS.CREATE_USER_PLANNER,
        plannerData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar planner:", error);
      throw error;
    }
  },

  // Atualiza um planner existente
  async updateUserPlanner(plannerId, plannerData) {
    try {
      const response = await api.put(
        `${PLANNERS_ENDPOINTS.UPDATE_USER_PLANNER}/${plannerId}`,
        plannerData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar planner:", error);
      throw error;
    }
  },

  // Deleta um planner
  async deleteUserPlanner(plannerId) {
    try {
      const response = await api.delete(
        `${PLANNERS_ENDPOINTS.DELETE_USER_PLANNER}/${plannerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar planner:", error);
      throw error;
    }
  },
};
