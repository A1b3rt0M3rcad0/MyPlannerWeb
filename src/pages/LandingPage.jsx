import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Shield,
  TrendingUp,
  Users,
  Wallet,
  BarChart3,
  CreditCard,
  Target,
  CheckCircle,
  Zap,
  Lock,
  Globe,
  Calendar,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  // Planos mockados - apenas 3 tipos de assinatura
  const plans = [
    {
      id: 1,
      name: "Mensal",
      price: "29.90",
      billing_cycle_days: 30,
      description: "Teste a plataforma",
    },
    {
      id: 2,
      name: "Semestral",
      price: "131.40", // 6 meses × R$ 21,90
      billing_cycle_days: 180,
      description: "6 meses com desconto",
    },
    {
      id: 3,
      name: "Anual",
      price: "214.80", // 12 meses × R$ 17,90
      billing_cycle_days: 365,
      description: "12 meses com maior desconto",
    }
  ];

  const features = [
    {
      icon: Wallet,
      title: "Gestão Financeira Completa",
      description:
        "Controle suas receitas, despesas e investimentos em um só lugar.",
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description:
        "Visualize gráficos e análises para tomar decisões mais inteligentes.",
    },
    {
      icon: Target,
      title: "Metas e Objetivos",
      description:
        "Defina e acompanhe suas metas financeiras de forma simples e eficaz.",
    },
    {
      icon: CreditCard,
      title: "Controle de Cartões",
      description:
        "Gerencie seus cartões de crédito e acompanhe faturas automaticamente.",
    },
    {
      icon: TrendingUp,
      title: "Planejamento Inteligente",
      description:
        "Crie orçamentos e planeje seu futuro financeiro com facilidade.",
    },
    {
      icon: Users,
      title: "Compartilhamento",
      description:
        "Compartilhe o planejamento financeiro com família ou equipe.",
    },
  ];

  const getBillingLabel = (days) => {
    if (days === 30) return "Mensal";
    if (days === 180) return "Semestral";
    if (days === 365) return "Anual";
    return `${days} dias`;
  };

  const getPlanFeatures = (plan) => {
    // Features principais em formato compacto
    return [
      "Gestão completa de transações",
      "Controle de contas bancárias", 
      "Gestão de cartões de crédito",
      "Orçamentos por categoria",
      "Relatórios e gráficos",
      "Transações recorrentes",
      "Controle de faturas",
      "Múltiplos planejadores",
      "Categorização automática",
      "Backup automático",
      "Sincronização em tempo real",
      "Suporte 24/7"
    ];
  };

  const getPlanAdvantages = (plan) => {
    // Vantagens baseadas apenas no período de assinatura
    if (plan.billing_cycle_days === 30) {
      return [
        "Teste sem compromisso",
        "Cancele quando quiser",
        "Sem taxas de cancelamento",
        "Acesso completo a todas as funcionalidades"
      ];
    } else if (plan.billing_cycle_days === 180) {
      return [
        "27% de economia",
        "6 meses de acesso",
        "Mesmo acesso a todas as funcionalidades",
        "Pagamento semestral"
      ];
    } else {
      return [
        "40% de economia",
        "12 meses de acesso",
        "Mesmo acesso a todas as funcionalidades",
        "Pagamento anual"
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      {/* Header/Navbar */}
      <nav className="bg-secondary-900/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-secondary-900" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                FinPlanner
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 text-white hover:text-primary-400 transition-colors font-medium"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-secondary-900 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl hover:shadow-primary-500/30 font-semibold"
              >
                Começar Grátis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 text-sm font-medium">
                Planejamento Financeiro Inteligente
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Controle suas finanças com
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                {" "}
                simplicidade
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Gerencie suas receitas, despesas e investimentos de forma
              inteligente. Alcance seus objetivos financeiros com o FinPlanner.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-secondary-900 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl hover:shadow-primary-500/30 font-bold text-lg flex items-center justify-center gap-2"
              >
                Começar Agora
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all border border-white/20 font-semibold text-lg"
              >
                Já tenho conta
            </button>
          </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Teste grátis 14 dias</span>
            </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Cancele quando quiser</span>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Tudo que você precisa para organizar suas finanças
            </h2>
            <p className="text-xl text-gray-300">
              Ferramentas poderosas para você tomar o controle do seu dinheiro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-secondary-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-primary-500/50 transition-all hover:shadow-lg hover:shadow-primary-500/10"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                    <Icon className="w-6 h-6 text-secondary-900" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
              </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Escolha seu período de assinatura
            </h2>
            <p className="text-xl text-gray-300">
              Mesmas funcionalidades, apenas o período de pagamento muda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => {
                const isHighlighted = plan.billing_cycle_days === 365; // Destaca o plano anual
                
                // Calcula o preço mensal para todos os planos
                const getMonthlyPrice = () => {
                  if (plan.billing_cycle_days === 30) return "29,90";
                  if (plan.billing_cycle_days === 180) return "21,90"; // 131.40 / 6
                  if (plan.billing_cycle_days === 365) return "17,90"; // 214.80 / 12
                  return null;
                };

                const monthlyPrice = getMonthlyPrice();

                // Calcula desconto para planos longos
                const calculateDiscount = () => {
                  if (plan.billing_cycle_days === 365) {
                    const monthlyPlan = plans.find((p) => p.billing_cycle_days === 30);
                    if (monthlyPlan) {
                      const yearlyIfMonthly = parseFloat(monthlyPlan.price) * 12; // 29.90 × 12 = 358.80
                      const yearlyPrice = parseFloat(plan.price); // 214.80
                      const discount = (
                        ((yearlyIfMonthly - yearlyPrice) / yearlyIfMonthly) * 100
                      ).toFixed(0);
                      return discount; // 40% de desconto
                    }
                  }
                  if (plan.billing_cycle_days === 180) {
                    const monthlyPlan = plans.find((p) => p.billing_cycle_days === 30);
                    if (monthlyPlan) {
                      const semestralIfMonthly = parseFloat(monthlyPlan.price) * 6; // 29.90 × 6 = 179.40
                      const semestralPrice = parseFloat(plan.price); // 131.40
                      const discount = (
                        ((semestralIfMonthly - semestralPrice) / semestralIfMonthly) * 100
                      ).toFixed(0);
                      return discount; // 27% de desconto
                    }
                  }
                  return null;
                };

                const discount = calculateDiscount();

                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl p-6 relative ${
                      isHighlighted
                        ? "bg-gradient-to-br from-primary-500 to-primary-600 shadow-2xl shadow-primary-500/30 transform scale-105 border-4 border-green-400"
                        : "bg-secondary-800/50 backdrop-blur-sm border border-white/10"
                    }`}
                  >
                    {/* Badge de desconto */}
                    {discount && (
                      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-xl transform rotate-12 font-bold text-sm animate-pulse">
                        -{discount}% OFF
                      </div>
                    )}

                    <div className="text-center mb-6">
                      {/* Badge do ciclo */}
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                          isHighlighted
                            ? "bg-secondary-900/20 text-secondary-900"
                            : "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                        }`}
                      >
                        <Calendar size={14} />
                        {getBillingLabel(plan.billing_cycle_days)}
                      </div>

                      {/* Preço mensal sempre em destaque */}
                      <div className="mb-3">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-lg font-bold" style={{color: isHighlighted ? '#111827' : '#f59e0b'}}>
                              Apenas
                            </span>
                            <span className="text-lg font-bold" style={{color: isHighlighted ? '#111827' : '#f59e0b'}}>
                              R$
                            </span>
                            <span className="text-6xl font-black leading-none" style={{color: isHighlighted ? '#111827' : '#f59e0b'}}>
                              {monthlyPrice.split(",")[0]}
                            </span>
                            <span className="text-4xl font-black" style={{color: isHighlighted ? '#111827' : '#f59e0b'}}>
                              ,{monthlyPrice.split(",")[1]}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold" style={{color: isHighlighted ? '#111827' : '#f59e0b'}}>
                              por mês
                            </span>
                            {plan.billing_cycle_days !== 30 && (
                              <span className="text-[10px] font-normal opacity-70" style={{color: isHighlighted ? '#111827' : '#f59e0b'}}>
                                (no plano {getBillingLabel(plan.billing_cycle_days).toLowerCase()})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Preço total - bem pequeno como "fishing" */}
                      {plan.billing_cycle_days !== 30 && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <p className="text-[8px] opacity-50 mb-1 font-normal uppercase tracking-wider text-center" style={{color: isHighlighted ? '#111827' : '#9ca3af'}}>
                            Pagamento {getBillingLabel(plan.billing_cycle_days).toLowerCase()} de:
                          </p>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-[10px] opacity-60" style={{color: isHighlighted ? '#111827' : '#9ca3af'}}>
                              R$
                            </span>
                            <span className="text-sm font-medium opacity-70" style={{color: isHighlighted ? '#111827' : '#9ca3af'}}>
                              {plan.price}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Badges de benefícios */}
                      {discount && (
                        <div className="mt-4 space-y-2">
                          <div className="w-full">
                            <div className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-bold shadow-lg">
                              <CheckCircle size={16} />
                              Economia de {discount}%
                            </div>
                          </div>
                          {plan.billing_cycle_days === 365 && (
                            <div className="w-full">
                              <div className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-bold shadow-lg">
                                <Zap size={16} />
                                Escolha Mais Popular
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Features compactas com hint */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle
                          className={`w-4 h-4 ${
                            isHighlighted
                              ? "text-secondary-900"
                              : "text-primary-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            isHighlighted
                              ? "text-secondary-900"
                              : "text-white"
                          }`}
                        >
                          Mesmas funcionalidades em todos os planos
                        </span>
                        <div className="group relative">
                          <div className="w-4 h-4 rounded-full border-2 border-dashed cursor-help flex items-center justify-center text-xs hover:bg-white/10 transition-colors" style={{borderColor: isHighlighted ? '#111827' : '#f59e0b'}}>
                            ?
                          </div>
                          {/* Tooltip com features */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-secondary-800 border border-white/20 rounded-lg p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                            <div className="text-xs text-gray-300 mb-2 font-semibold">Funcionalidades inclusas:</div>
                            <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
                              {getPlanFeatures(plan).map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <div className="w-1 h-1 rounded-full bg-primary-400"></div>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Vantagens específicas do plano */}
                      <div className="space-y-2">
                        {getPlanAdvantages(plan).map((advantage, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: isHighlighted ? '#111827' : '#f59e0b'}}></div>
                            <span
                              className={`text-xs ${
                                isHighlighted
                                  ? "text-secondary-800"
                                  : "text-gray-300"
                              }`}
                            >
                              {advantage}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/login")}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        isHighlighted
                          ? "bg-secondary-900 text-white hover:bg-secondary-800"
                          : "bg-gradient-to-r from-primary-500 to-primary-600 text-secondary-900 hover:from-primary-600 hover:to-primary-700 shadow-lg"
                      }`}
                    >
                      Começar Agora
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  100% Seguro
                </span>
              </div>

              <h2 className="text-4xl font-bold text-white mb-6">
                Seus dados estão seguros conosco
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Utilizamos as mais avançadas tecnologias de criptografia e
                segurança para proteger suas informações financeiras.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: Lock,
                    title: "Criptografia de ponta",
                    desc: "Todos os dados são criptografados com SSL/TLS",
                  },
                  {
                    icon: Shield,
                    title: "Proteção de dados",
                    desc: "Conforme LGPD e padrões internacionais",
                  },
                  {
                    icon: Globe,
                    title: "Backup automático",
                    desc: "Seus dados sempre protegidos e disponíveis",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-2xl border border-primary-500/30 flex items-center justify-center">
                <Shield className="w-48 h-48 text-primary-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Junte-se a milhares de pessoas que já estão no controle do seu
            dinheiro
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-12 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-secondary-900 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl hover:shadow-primary-500/30 font-bold text-lg inline-flex items-center gap-2"
          >
            Começar Gratuitamente
            <ArrowRight size={24} />
            </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-secondary-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-secondary-900" />
                </div>
                <span className="text-xl font-bold text-white">FinPlanner</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sua plataforma completa de gestão financeira pessoal e
                empresarial.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button className="hover:text-primary-400 transition-colors">
                    Funcionalidades
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary-400 transition-colors">
                    Preços
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary-400 transition-colors">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button className="hover:text-primary-400 transition-colors">
                    Sobre
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary-400 transition-colors">
                    Blog
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary-400 transition-colors">
                    Contato
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button className="hover:text-primary-400 transition-colors">
                    Privacidade
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary-400 transition-colors">
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary-400 transition-colors">
                    LGPD
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} FinPlanner. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
