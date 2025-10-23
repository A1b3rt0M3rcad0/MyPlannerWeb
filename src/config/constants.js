// Constantes do FinPlanner V2

// Cores da paleta
export const COLORS = {
  lightBlue: '#BCF0FA',
  tealBlue: '#0EA8C5',
  darkTeal: '#0A7083',
  purple: '#8D36BA',
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
};

// Categorias de transações
export const TRANSACTION_CATEGORIES = {
  income: [
    { id: 'salary', name: 'Salário', icon: 'DollarSign', color: 'green' },
    { id: 'freelance', name: 'Freelance', icon: 'Briefcase', color: 'blue' },
    { id: 'investment', name: 'Investimentos', icon: 'TrendingUp', color: 'purple' },
    { id: 'other_income', name: 'Outras Receitas', icon: 'Plus', color: 'gray' },
  ],
  expense: [
    { id: 'food', name: 'Alimentação', icon: 'Utensils', color: 'red' },
    { id: 'transport', name: 'Transporte', icon: 'Car', color: 'blue' },
    { id: 'entertainment', name: 'Entretenimento', icon: 'Gamepad2', color: 'purple' },
    { id: 'health', name: 'Saúde', icon: 'Heart', color: 'pink' },
    { id: 'education', name: 'Educação', icon: 'BookOpen', color: 'indigo' },
    { id: 'shopping', name: 'Compras', icon: 'ShoppingBag', color: 'orange' },
    { id: 'bills', name: 'Contas', icon: 'FileText', color: 'yellow' },
    { id: 'other_expense', name: 'Outras Despesas', icon: 'Minus', color: 'gray' },
  ],
};

// Tipos de metas financeiras
export const GOAL_TYPES = {
  emergency_fund: 'Reserva de Emergência',
  vacation: 'Viagem',
  car: 'Carro',
  house: 'Casa',
  education: 'Educação',
  retirement: 'Aposentadoria',
  investment: 'Investimento',
  other: 'Outro',
};

// Status de transações
export const TRANSACTION_STATUS = {
  pending: 'Pendente',
  completed: 'Concluída',
  cancelled: 'Cancelada',
  failed: 'Falhou',
};

// Moedas suportadas
export const CURRENCIES = {
  BRL: 'Real Brasileiro (R$)',
  USD: 'Dólar Americano (US$)',
  EUR: 'Euro (€)',
  GBP: 'Libra Esterlina (£)',
};

// Períodos de relatórios
export const REPORT_PERIODS = {
  week: 'Semana',
  month: 'Mês',
  quarter: 'Trimestre',
  year: 'Ano',
  custom: 'Personalizado',
};

// Configurações de notificação
export const NOTIFICATION_TYPES = {
  budget_alert: 'Alerta de Orçamento',
  goal_reminder: 'Lembrete de Meta',
  bill_due: 'Conta Vencendo',
  investment_update: 'Atualização de Investimento',
  security: 'Segurança',
};

export default {
  COLORS,
  TRANSACTION_CATEGORIES,
  GOAL_TYPES,
  TRANSACTION_STATUS,
  CURRENCIES,
  REPORT_PERIODS,
  NOTIFICATION_TYPES,
};
