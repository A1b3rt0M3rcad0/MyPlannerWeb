import {
  Home,
  PieChart,
  CreditCard,
  Settings,
  Wallet,
  Target,
  Users,
  Tag,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { usePlannerColor } from "../hooks/usePlannerColor.js";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: PieChart, label: "Orçamentos", path: "/coming-soon" },
  { icon: CreditCard, label: "Transações", path: "/transactions" },
  { icon: Wallet, label: "Carteiras", path: "/coming-soon" },
  { icon: Tag, label: "Categorias", path: "/categories" },
  { icon: Target, label: "Metas", path: "/coming-soon" },
  { icon: Users, label: "Membros", path: "/coming-soon" },
  { icon: Settings, label: "Configurações", path: "/coming-soon" },
];

export default function SideBar() {
  const location = useLocation();
  const colors = usePlannerColor();

  return (
    <aside className="w-64 bg-secondary-800/50 backdrop-blur-md border-r border-white/10 shadow-sm">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <span className="text-secondary-900 font-bold text-lg">FP</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">FinPlanner</h2>
            <p className="text-xs text-gray-300">V2</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={`${item.path}-${item.label}`}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "text-secondary-900 shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                style={isActive ? { backgroundColor: colors.primary } : {}}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
