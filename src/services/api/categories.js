import api from "../../config/api";

// Categorias - Apenas admins podem acessar
export const categoriesApi = {
  // Listar todas as categorias
  getCategories: async (page = 1, pageSize = 10, search = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await api.get(`/categories?${params}`);
    return response.data;
  },

  // Buscar categoria por ID
  getCategoryById: async (categoryId) => {
    const response = await api.get(`/category/${categoryId}`);
    return response.data;
  },

  // Criar categoria
  createCategory: async (categoryData) => {
    const response = await api.post("/category/create", categoryData);
    return response.data;
  },

  // Atualizar categoria
  updateCategory: async (categoryId, categoryData) => {
    const response = await api.put(`/category/${categoryId}`, categoryData);
    return response.data;
  },

  // Deletar categoria
  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/category/${categoryId}`);
    return response.data;
  },
};

// Categorias do usuário autenticado
export const userCategoriesApi = {
  // Listar categorias do usuário
  getCategories: async (page = 1, pageSize = 10, search = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await api.get(`/my/categories?${params}`);
    return response.data;
  },

  // Buscar categoria do usuário por ID
  getCategoryById: async (categoryId) => {
    const response = await api.get(`/my/category/${categoryId}`);
    return response.data;
  },

  // Criar categoria do usuário
  createCategory: async (categoryData) => {
    const response = await api.post("/my/category/create", categoryData);
    return response.data;
  },

  // Atualizar categoria do usuário
  updateCategory: async (categoryId, categoryData) => {
    const response = await api.put(`/my/category/${categoryId}`, categoryData);
    return response.data;
  },

  // Deletar categoria do usuário
  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/my/category/${categoryId}`);
    return response.data;
  },
};
