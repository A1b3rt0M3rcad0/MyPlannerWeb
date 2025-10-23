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
