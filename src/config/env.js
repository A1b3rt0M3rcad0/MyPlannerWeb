// Configuração de ambiente
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  APP_NAME: import.meta.env.VITE_APP_NAME || "FinPlanner V2",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "2.0.0",
  FRONTEND_PORT: 3001,
};
