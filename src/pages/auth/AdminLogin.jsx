import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { authAPI } from "../../services/api/auth";
import { ROUTES } from "../../config/constants";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();

  // Verifica se já está autenticado como admin
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      // Verifica se é admin
      const isAdmin =
        user.role === "admin" ||
        user.is_super_admin ||
        user.user_type === "admin";
      if (isAdmin) {
        console.log(
          "✅ Usuário já autenticado como admin, redirecionando para dashboard"
        );
        navigate("/admin", { replace: true });
      } else {
        console.log(
          "⚠️ Usuário autenticado mas não é admin, redirecionando para dashboard de usuário"
        );
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  // Mostra loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
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
          name: tokenPayload.name || email.split("@")[0], // Nome completo
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

        // Redireciona baseado no role - SEMPRE para admin dashboard se for admin
        if (userInfo.role === "admin") {
          console.log("🔄 Redirecionando para dashboard administrativo");
          navigate(ROUTES.ADMIN);
        } else {
          console.log("🔄 Redirecionando para dashboard de usuário");
          navigate(ROUTES.DASHBOARD);
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
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-2xl shadow-primary-500/50 mb-4">
            <Shield className="w-12 h-12 text-secondary-900" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">FinPlanner</h1>
          <p className="text-primary-400">Sistema de Acesso</p>
        </div>

        {/* Card de login */}
        <div className="bg-secondary-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Acesso ao Sistema
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-200">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 outline-none transition-all backdrop-blur-sm"
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
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 outline-none transition-all backdrop-blur-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Botão de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-secondary-900 font-bold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Acessar Sistema"}
            </button>
          </form>
        </div>

        {/* Link para voltar */}
        <div className="text-center mt-6">
          <Link
            to={ROUTES.HOME}
            className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
          >
            ← Voltar para home
          </Link>
        </div>
      </div>
    </div>
  );
}
