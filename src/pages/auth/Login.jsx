import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authAPI } from "../../services/api/auth";
import { ROUTES } from "../../config/constants";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Verifica se já está autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      // Verifica se é admin
      const isAdmin =
        user.role === "admin" ||
        user.is_super_admin ||
        user.user_type === "admin";
      if (isAdmin) {
        console.log(
          "✅ Usuário já autenticado como admin, redirecionando para dashboard admin"
        );
        navigate("/admin", { replace: true });
      } else {
        console.log("✅ Usuário já autenticado, redirecionando para seleção de planner");
        navigate("/planner/selection", { replace: true });
      }
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  // Mostra loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);

      if (response.data?.access_token) {
        // Decodifica o token JWT para extrair informações do usuário
        const token = response.data.access_token;
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));

        const userInfo = {
          id: tokenPayload.id,
          email: tokenPayload.email,
          first_name: tokenPayload.name?.split(" ")[0] || email.split("@")[0],
          last_name: tokenPayload.name?.split(" ").slice(1).join(" ") || "",
          role: tokenPayload.role,
          user_type: tokenPayload.role, // Para compatibilidade
        };

        // Salva tokens e informações do usuário
        login(
          response.data.access_token,
          response.data.refresh_token,
          userInfo
        );

        // Feedback de sucesso
        console.log("✅ Login realizado com sucesso");
        console.log("Usuário:", userInfo.first_name);
        console.log("Role:", userInfo.role);

        // Redireciona baseado no role
        if (userInfo.role === "admin") {
          console.log("🔄 Redirecionando para dashboard administrativo");
          navigate(ROUTES.ADMIN_DASHBOARD);
        } else {
          console.log("🔄 Redirecionando para seleção de planner");
          navigate("/planner/selection");
        }
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError(err.response?.data?.error || "Email ou senha incorretos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-primary-400 to-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Entrar na sua conta
            </h1>
            <p className="text-gray-300">Acesse sua conta FinPlanner</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-4">
            <Link
              to={ROUTES.ADMIN_LOGIN}
              className="text-primary-300 hover:text-primary-200 text-sm transition-colors"
            >
              Acesso administrativo
            </Link>
            <div className="text-gray-400 text-sm">
              Não tem uma conta?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="text-primary-300 hover:text-primary-200 transition-colors"
              >
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>

        {/* Link de Volta */}
        <div className="text-center mt-6">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
