import api from "../../config/api";

// Contas - Apenas admins podem acessar
export const accountsApi = {
  // Listar todas as contas
  getAccounts: async (page = 1, pageSize = 10, search = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await api.get(`/accounts?${params}`);
    return response.data;
  },

  // Buscar conta por ID
  getAccountById: async (accountId) => {
    const response = await api.get(`/account/${accountId}`);
    return response.data;
  },

  // Criar conta
  createAccount: async (accountData) => {
    const response = await api.post("/account/create", accountData);
    return response.data;
  },

  // Atualizar conta
  updateAccount: async (accountId, accountData) => {
    const response = await api.put(`/account/${accountId}`, accountData);
    return response.data;
  },

  // Deletar conta
  deleteAccount: async (accountId) => {
    const response = await api.delete(`/account/${accountId}`);
    return response.data;
  },
};

// Contas do usuário autenticado
export const userAccountsApi = {
  getAccounts: async (page = 1, pageSize = 10, search = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (search) params.append("search", search);
    const response = await api.get(`/my/accounts?${params}`);
    return response.data;
  },

  getAccountById: async (accountId) => {
    const response = await api.get(`/my/account/${accountId}`);
    return response.data;
  },

  createAccount: async (accountData) => {
    const response = await api.post("/my/account/create", accountData);
    return response.data;
  },

  updateAccount: async (accountId, accountData) => {
    const response = await api.put(`/my/account/${accountId}`, accountData);
    return response.data;
  },

  deleteAccount: async (accountId, { plannerId } = {}) => {
    // Envia planner_id no body para backends que validam propriedade por planner
    const response = await api.delete(`/my/account/${accountId}`, {
      data: plannerId ? { planner_id: plannerId } : undefined,
    });
    return response.data;
  },
};
