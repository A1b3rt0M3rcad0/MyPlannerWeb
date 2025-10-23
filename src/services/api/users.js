import api from "../../config/api";

// Usuários - Apenas admins podem acessar
export const usersApi = {
  // Listar todos os usuários
  getUsers: async (page = 1, pageSize = 50, search = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await api.get(`/users?${params}`);
    return response.data;
  },

  // Buscar usuário por ID
  getUserById: async (userId) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },

  // Criar usuário (registro público)
  createUser: async (userData) => {
    const response = await api.post("/user/create", userData);
    return response.data;
  },

  // Atualizar usuário
  updateUser: async (userId, userData) => {
    const response = await api.put(`/user/${userId}`, userData);
    return response.data;
  },

  // Deletar usuário
  deleteUser: async (userId) => {
    const response = await api.delete(`/user/${userId}`);
    return response.data;
  },
};
