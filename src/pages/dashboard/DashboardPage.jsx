import BasePage from "../../components/layout/BasePage";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  PieChart,
  BarChart3,
  Target,
  AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  return (
    <BasePage pageTitle="Dashboard">
      <div className="space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{color: '#0A7083'}}>Saldo Total</p>
                <p className="text-2xl font-bold text-gray-800">R$ 12.450,00</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0EA8C5 0%, #8D36BA 100%)'}}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-semibold">+5.2%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{color: '#0A7083'}}>Receitas</p>
                <p className="text-2xl font-bold text-gray-800">R$ 8.500,00</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#0EA8C5'}}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-semibold">+12.3%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{color: '#0A7083'}}>Despesas</p>
                <p className="text-2xl font-bold text-gray-800">R$ 3.200,00</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#8D36BA'}}>
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-red-600 font-semibold">-2.1%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{color: '#0A7083'}}>Investimentos</p>
                <p className="text-2xl font-bold text-gray-800">R$ 7.150,00</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#0A7083'}}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-semibold">+8.7%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>
        </div>

        {/* Gráficos e Análises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Gastos por Categoria */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Gastos por Categoria</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{backgroundColor: '#0EA8C5'}}></div>
                  <span className="text-sm text-gray-600">Alimentação</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">R$ 1.200,00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{backgroundColor: '#8D36BA'}}></div>
                  <span className="text-sm text-gray-600">Transporte</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">R$ 800,00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{backgroundColor: '#0A7083'}}></div>
                  <span className="text-sm text-gray-600">Entretenimento</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">R$ 600,00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{backgroundColor: '#BCF0FA'}}></div>
                  <span className="text-sm text-gray-600">Outros</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">R$ 600,00</span>
              </div>
            </div>
          </div>

          {/* Metas Financeiras */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Metas Financeiras</h3>
              <Target className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Reserva de Emergência</span>
                  <span className="text-sm font-semibold text-gray-800">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{width: '75%', background: 'linear-gradient(135deg, #0EA8C5 0%, #8D36BA 100%)'}}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">R$ 7.500 de R$ 10.000</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Viagem para Europa</span>
                  <span className="text-sm font-semibold text-gray-800">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{width: '45%', background: 'linear-gradient(135deg, #0EA8C5 0%, #8D36BA 100%)'}}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">R$ 4.500 de R$ 10.000</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Carro Novo</span>
                  <span className="text-sm font-semibold text-gray-800">20%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{width: '20%', background: 'linear-gradient(135deg, #0EA8C5 0%, #8D36BA 100%)'}}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">R$ 6.000 de R$ 30.000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transações Recentes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Transações Recentes</h3>
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Supermercado</p>
                  <p className="text-xs text-gray-500">Hoje, 14:30</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-red-600">-R$ 120,00</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Salário</p>
                  <p className="text-xs text-gray-500">Ontem, 09:00</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600">+R$ 5.000,00</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#BCF0FA'}}>
                  <BarChart3 className="w-5 h-5" style={{color: '#0EA8C5'}} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Investimento</p>
                  <p className="text-xs text-gray-500">2 dias atrás</p>
                </div>
              </div>
              <span className="text-sm font-semibold" style={{color: '#0EA8C5'}}>+R$ 500,00</span>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
}