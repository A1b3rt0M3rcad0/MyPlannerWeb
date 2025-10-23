import axios from "axios";
import { ENV } from "./env";

// Configuração base da API
const API_BASE_URL = ENV.API_URL;

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("finplanner_v2_access_token");
    const refreshToken = localStorage.getItem("finplanner_v2_refresh_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Adiciona refresh_token em TODAS as requisições (sempre no body para segurança)
    if (refreshToken) {
      // Para todas as requisições, adiciona no body (mais seguro que query params)
      if (config.data && typeof config.data === "object") {
        config.data.refresh_token = refreshToken;
      } else {
        // Para requisições sem body (como GET), cria um body com o refresh_token
        config.data = { refresh_token: refreshToken };
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e renovação de token
api.interceptors.response.use(
  (response) => {
    // Verifica se há um novo access_token no header
    const newAccessToken = response.headers["x-new-access-token"];
    if (newAccessToken) {
      console.log("🔄 Novo access_token recebido, atualizando...");
      localStorage.setItem("finplanner_v2_access_token", newAccessToken);

      // Dispara evento para notificar o AuthContext sobre a atualização do token
      window.dispatchEvent(
        new CustomEvent("token-updated", {
          detail: { newAccessToken },
        })
      );
    }

    return response;
  },
  (error) => {
    // Se receber 401, dispara evento de erro de autenticação
    if (error.response?.status === 401) {
      console.log("🚨 Erro 401 - Token inválido ou expirado");
      window.dispatchEvent(new CustomEvent("auth-error"));
    }

    return Promise.reject(error);
  }
);

export default api;
