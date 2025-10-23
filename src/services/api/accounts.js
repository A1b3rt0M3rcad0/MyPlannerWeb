import api from '../../config/api';

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
    const response = await api.post('/account/create', accountData);
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
  }
};
