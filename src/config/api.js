// Configuração da API do FinPlanner V2
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Endpoints da API
export const endpoints = {
  // Autenticação
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  
  // Finanças
  finances: {
    dashboard: '/finances/dashboard',
    transactions: '/finances/transactions',
    categories: '/finances/categories',
    accounts: '/finances/accounts',
  },
  
  // Orçamentos
  budgets: {
    list: '/budgets',
    create: '/budgets',
    update: '/budgets/:id',
    delete: '/budgets/:id',
  },
  
  // Investimentos
  investments: {
    portfolio: '/investments/portfolio',
    assets: '/investments/assets',
    performance: '/investments/performance',
  },
  
  // Relatórios
  reports: {
    monthly: '/reports/monthly',
    yearly: '/reports/yearly',
    custom: '/reports/custom',
  },
  
  // Metas
  goals: {
    list: '/goals',
    create: '/goals',
    update: '/goals/:id',
    delete: '/goals/:id',
  },
};

export default apiConfig;
