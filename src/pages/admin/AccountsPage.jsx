import { useState, useEffect } from "react";
import {
  Wallet,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Building2,
  Calendar,
  Palette,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { accountsApi } from "../../services/api/accounts";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountsApi.getAccounts();
      setAccounts(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bank?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteAccount = async (accountId) => {
    if (window.confirm("Tem certeza que deseja deletar esta conta?")) {
      try {
        await accountsApi.deleteAccount(accountId);
        loadAccounts();
      } catch (error) {
        console.error("Erro ao deletar conta:", error);
      }
    }
  };

  const handleCreateAccount = async (accountData) => {
    try {
      await accountsApi.createAccount(accountData);
      setShowCreateModal(false);
      loadAccounts();
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }
  };

  const handleUpdateAccount = async (accountId, accountData) => {
    try {
      await accountsApi.updateAccount(accountId, accountData);
      setShowEditModal(false);
      setSelectedAccount(null);
      loadAccounts();
    } catch (error) {
      console.error("Erro ao atualizar conta:", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Contas Financeiras
            </h1>
            <p className="text-gray-600">
              Gerencie todas as contas bancárias do sistema
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            Nova Conta
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar contas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Grid de contas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="col-span-full text-center p-8">
            <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma conta encontrada
            </h3>
            <p className="text-gray-500">Crie sua primeira conta financeira.</p>
          </div>
        ) : (
          filteredAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: account.color || "#3B82F6" }}
                  >
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {account.description || "Conta sem nome"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {account.bank || "Banco não informado"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Building2 size={16} className="mr-1" />
                    Planner
                  </span>
                  <span className="font-medium text-gray-700">
                    ID: {account.planner_id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <DollarSign size={16} className="mr-1" />
                    Saldo Inicial
                  </span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(account.initial_balance || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Wallet size={16} className="mr-1" />
                    Saldo Atual
                  </span>
                  <span
                    className={`font-semibold ${
                      (account.current_balance || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(account.current_balance || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Palette size={16} className="mr-1" />
                    Cor
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: account.color || "#3B82F6" }}
                    ></div>
                    <span className="font-medium text-gray-700">
                      {account.color || "#3B82F6"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Calendar size={16} className="mr-1" />
                    Criado em
                  </span>
                  <span className="font-medium text-gray-700">
                    {account.created_at
                      ? new Date(account.created_at).toLocaleDateString("pt-BR")
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedAccount(account);
                    setShowEditModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modais */}
      {showCreateModal && (
        <CreateAccountModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAccount}
        />
      )}

      {showEditModal && selectedAccount && (
        <EditAccountModal
          account={selectedAccount}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAccount(null);
          }}
          onSubmit={(accountData) =>
            handleUpdateAccount(selectedAccount.id, accountData)
          }
        />
      )}
    </div>
  );
}

// Componente de modal para criar conta
function CreateAccountModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    user_id: "",
    planner_id: "",
    description: "",
    bank: "",
    initial_balance: "",
    current_balance: "",
    color: "#3B82F6",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      user_id: parseInt(formData.user_id),
      planner_id: parseInt(formData.planner_id),
      initial_balance: parseFloat(formData.initial_balance || 0),
      current_balance: parseFloat(formData.current_balance || 0),
    });
  };

  const predefinedColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#14B8A6",
    "#6366F1",
    "#EC4899",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Criar Nova Conta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID do Usuário
            </label>
            <input
              type="number"
              required
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID do Planner
            </label>
            <input
              type="number"
              required
              value={formData.planner_id}
              onChange={(e) =>
                setFormData({ ...formData, planner_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banco
            </label>
            <input
              type="text"
              value={formData.bank}
              onChange={(e) =>
                setFormData({ ...formData, bank: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saldo Inicial (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.initial_balance}
              onChange={(e) =>
                setFormData({ ...formData, initial_balance: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saldo Atual (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.current_balance}
              onChange={(e) =>
                setFormData({ ...formData, current_balance: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor
            </label>
            <div className="space-y-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-2 flex-wrap">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color
                        ? "border-gray-800"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente de modal para editar conta
function EditAccountModal({ account, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    user_id: account.user_id || "",
    planner_id: account.planner_id || "",
    description: account.description || "",
    bank: account.bank || "",
    initial_balance: account.initial_balance || "",
    current_balance: account.current_balance || "",
    color: account.color || "#3B82F6",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      user_id: parseInt(formData.user_id),
      planner_id: parseInt(formData.planner_id),
      initial_balance: parseFloat(formData.initial_balance || 0),
      current_balance: parseFloat(formData.current_balance || 0),
    });
  };

  const predefinedColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#14B8A6",
    "#6366F1",
    "#EC4899",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Editar Conta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID do Usuário
            </label>
            <input
              type="number"
              required
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID do Planner
            </label>
            <input
              type="number"
              required
              value={formData.planner_id}
              onChange={(e) =>
                setFormData({ ...formData, planner_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banco
            </label>
            <input
              type="text"
              value={formData.bank}
              onChange={(e) =>
                setFormData({ ...formData, bank: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saldo Inicial (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.initial_balance}
              onChange={(e) =>
                setFormData({ ...formData, initial_balance: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saldo Atual (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.current_balance}
              onChange={(e) =>
                setFormData({ ...formData, current_balance: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor
            </label>
            <div className="space-y-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-2 flex-wrap">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color
                        ? "border-gray-800"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
