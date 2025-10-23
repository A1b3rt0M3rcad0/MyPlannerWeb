import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Wallet,
  Users,
  CreditCard,
  Receipt,
  Settings,
  BarChart3,
  Bell,
  User,
  FolderOpen,
  Tag,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Logout específico para admin - sempre redireciona para login de admin
  const handleAdminLogout = () => {
    // Limpa os dados de autenticação
    localStorage.removeItem("finplanner_v2_access_token");
    localStorage.removeItem("finplanner_v2_refresh_token");
    localStorage.removeItem("finplanner_v2_user_info");

    // Redireciona para login de admin
    navigate("/system/access", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">FinPlanner</h2>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-bold">
                  {user.first_name?.[0] || user.email?.[0] || "A"}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {user.first_name || user.email}
                </p>
                <p className="text-xs text-gray-400">Administrador</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <button
            onClick={() => navigate("/admin")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive("/admin")
                ? "text-white bg-yellow-600"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/admin/users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive("/admin/users")
                ? "text-white bg-yellow-600"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Users size={20} />
            <span className="font-medium">Usuários</span>
          </button>
          <button
            onClick={() => navigate("/admin/plans")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive("/admin/plans")
                ? "text-white bg-yellow-600"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            <CreditCard size={20} />
            <span className="font-medium">Planos</span>
          </button>
          <button
            onClick={() => navigate("/admin/planners")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive("/admin/planners")
                ? "text-white bg-yellow-600"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            <FolderOpen size={20} />
            <span className="font-medium">Planners</span>
          </button>
          <button
            onClick={() => navigate("/admin/categories")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive("/admin/categories")
                ? "text-white bg-yellow-600"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Tag size={20} />
            <span className="font-medium">Categorias</span>
          </button>
          <button
            onClick={() => navigate("/admin/accounts")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive("/admin/accounts")
                ? "text-white bg-yellow-600"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Wallet size={20} />
            <span className="font-medium">Contas</span>
          </button>
          <button
            onClick={() => navigate("/admin/transactions")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive("/admin/transactions")
                ? "text-white bg-yellow-600"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Receipt size={20} />
            <span className="font-medium">Transações</span>
          </button>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200"
          >
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Título da página baseado na rota atual */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-yellow-500 rounded-full"></div>
              <h1 className="text-xl font-bold text-gray-800">
                {getPageTitle(location.pathname)}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                <Bell size={20} />
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                <Settings size={20} />
              </button>

              {/* Profile */}
              <button className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                <User size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Função para obter o título da página baseado na rota
function getPageTitle(pathname) {
  const titles = {
    "/admin": "Dashboard",
    "/admin/users": "Usuários",
    "/admin/plans": "Planos de Assinatura",
    "/admin/planners": "Planners",
    "/admin/categories": "Categorias",
    "/admin/accounts": "Contas Financeiras",
    "/admin/transactions": "Transações",
  };

  return titles[pathname] || "Painel Administrativo";
}
