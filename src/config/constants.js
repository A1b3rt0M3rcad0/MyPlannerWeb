// Rotas da aplicação
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN_LOGIN: "/system/access", // Rota escondida para admin
  DASHBOARD: "/dashboard",
  ADMIN: "/admin", // Sistema administrativo
};

// Configurações de autenticação
export const AUTH_CONFIG = {
  ACCESS_TOKEN_KEY: "finplanner_v2_access_token",
  REFRESH_TOKEN_KEY: "finplanner_v2_refresh_token",
  USER_INFO_KEY: "finplanner_v2_user_info",
};
