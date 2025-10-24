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

    console.log("🔧 INTERCEPTOR EXECUTANDO:", {
      method: config.method,
      url: config.url,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    });

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("✅ Authorization header adicionado");
    }

    // FORÇA: SEMPRE adiciona refresh_token (body para POST/PUT/DELETE, query para GET)
    console.log("🔧 FORÇANDO refresh_token...");

    if (!refreshToken) {
      console.error("🚨 ERRO: Nenhum refresh_token no localStorage!");
      console.error("🚨 Vai enviar null/undefined mesmo assim!");
    }

    // Para requisições GET: usar query parameter
    if (config.method?.toLowerCase() === "get") {
      console.log("📤 Adicionando refresh_token como query parameter (GET)");
      config.params = {
        ...(config.params || {}),
        refresh_token: refreshToken,
      };
      console.log("✅ refresh_token adicionado como query:", config.params);
    } else {
      // Para outros métodos: usar body
      console.log("📤 Adicionando refresh_token no body (POST/PUT/DELETE)");
      config.data = {
        ...(config.data || {}),
        refresh_token: refreshToken,
      };
      console.log("✅ refresh_token FORÇADO no body:", config.data);
    }

    console.log("📤 Configuração final:", {
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e renovação de token
api.interceptors.response.use(
  (response) => {
    // Debug: Log da resposta
    console.log("📋 Resposta recebida:", response.data);

    // Verifica se há um novo access_token no body da resposta
    const newAccessToken = response.data?.new_access_token;
    console.log("🔍 Procurando new_access_token no body:", newAccessToken);

    if (newAccessToken) {
      console.log("🔄 Novo access_token recebido no body, atualizando...");
      localStorage.setItem("finplanner_v2_access_token", newAccessToken);

      // Dispara evento para notificar o AuthContext sobre a atualização do token
      window.dispatchEvent(
        new CustomEvent("token-updated", {
          detail: { newAccessToken },
        })
      );

      // Remove o new_access_token do body para não interferir com a aplicação
      delete response.data.new_access_token;
      console.log("✅ new_access_token removido do body da resposta");
    } else {
      console.log("ℹ️ Nenhum new_access_token encontrado no body");
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
