import { Bell, User, Settings, LogOut } from "lucide-react";

export default function Header({ pageTitle }) {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Título da página */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FP</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">
              {pageTitle || "FinPlanner V2"}
            </h1>
          </div>

          {/* Ações do usuário */}
          <div className="flex items-center gap-4">
            {/* Notificações */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Menu do usuário */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">João Silva</p>
                  <p className="text-xs text-gray-500">joao@email.com</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <LogOut className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
