import api from "../../config/api";

// Transações - Apenas admins podem acessar
export const transactionsApi = {
  // Listar todas as transações
  getTransactions: async (page = 1, pageSize = 10, search = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await api.get(`/transactions?${params}`);
    return response.data;
  },

  // Buscar transação por ID
  getTransactionById: async (transactionId) => {
    const response = await api.get(`/transaction/${transactionId}`);
    return response.data;
  },

  // Criar transação
  createTransaction: async (transactionData) => {
    const response = await api.post("/transaction/create", transactionData);
    return response.data;
  },

  // Atualizar transação
  updateTransaction: async (transactionId, transactionData) => {
    const response = await api.put(
      `/transaction/${transactionId}`,
      transactionData
    );
    return response.data;
  },

  // Deletar transação
  deleteTransaction: async (transactionId) => {
    const response = await api.delete(`/transaction/${transactionId}`);
    return response.data;
  },
};

// Transações do usuário autenticado
export const userTransactionsApi = {
  getTransactions: async ({
    page = 1,
    pageSize = 10,
    search = "",
    plannerId,
    accountId,
  } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (search) params.append("search", search);
    let path;
    if (plannerId) {
      path = `/my/planner/${plannerId}/transactions`;
    } else if (accountId) {
      path = `/my/account/${accountId}/transactions`;
    } else {
      throw new Error(
        "plannerId ou accountId é obrigatório para listar transações do usuário"
      );
    }
    const response = await api.get(`${path}?${params}`);
    return response.data;
  },

  getTransactionById: async (transactionId) => {
    const response = await api.get(`/my/transaction/${transactionId}`);
    return response.data;
  },

  createTransaction: async (transactionData) => {
    const response = await api.post("/my/transaction/create", transactionData);
    return response.data;
  },

  updateTransaction: async (transactionId, transactionData) => {
    const response = await api.put(
      `/my/transaction/${transactionId}`,
      transactionData
    );
    return response.data;
  },

  deleteTransaction: async (transactionId) => {
    const response = await api.delete(`/my/transaction/${transactionId}`);
    return response.data;
  },
};
