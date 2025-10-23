import { 
  Home, 
  DollarSign, 
  PieChart, 
  CreditCard, 
  TrendingUp, 
  FileText, 
  Settings,
  BarChart3,
  Wallet,
  Target
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: DollarSign, label: "Finanças", path: "/finances" },
  { icon: PieChart, label: "Orçamentos", path: "/budgets" },
  { icon: CreditCard, label: "Transações", path: "/transactions" },
  { icon: TrendingUp, label: "Investimentos", path: "/investments" },
  { icon: BarChart3, label: "Relatórios", path: "/reports" },
  { icon: Wallet, label: "Carteiras", path: "/wallets" },
  { icon: Target, label: "Metas", path: "/goals" },
  { icon: FileText, label: "Documentos", path: "/documents" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export default function SideBar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-md border-r border-gray-200/50 shadow-sm">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">FP</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">FinPlanner</h2>
            <p className="text-xs text-gray-500">V2</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Resumo rápido */}
        <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Resumo Rápido</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Saldo Total:</span>
              <span className="font-semibold text-green-600">R$ 12.450,00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Receitas:</span>
              <span className="font-semibold text-blue-600">R$ 8.500,00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Despesas:</span>
              <span className="font-semibold text-red-600">R$ 3.200,00</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
