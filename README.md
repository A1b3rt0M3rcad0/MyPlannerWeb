# FinPlanner V2 Web

Plataforma completa de planejamento financeiro pessoal e empresarial.

## 🚀 Tecnologias

- **React 19** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Roteamento
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos e visualizações

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── layout/         # Layout base (BasePage, BaseContent)
│   └── ui/             # Componentes de interface
├── pages/              # Páginas da aplicação
│   ├── auth/           # Páginas de autenticação
│   ├── dashboard/      # Dashboard principal
│   ├── finances/       # Gestão financeira
│   ├── budgets/        # Orçamentos
│   ├── transactions/   # Transações
│   ├── reports/        # Relatórios
│   └── settings/       # Configurações
├── features/           # Features organizadas
│   ├── contents/       # Conteúdos específicos
│   └── forms/          # Formulários
├── hooks/              # Custom hooks
├── services/           # Serviços e API
├── config/             # Configurações
├── utils/              # Utilitários
└── styles/             # Estilos globais
```

## 🎨 Paleta de Cores

- **Light Blue**: #BCF0FA
- **Teal Blue**: #0EA8C5  
- **Dark Teal**: #0A7083
- **Purple**: #8D36BA

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Build para produção:**
   ```bash
   npm run build
   ```

4. **Preview da build:**
   ```bash
   npm run preview
   ```

## 📋 Funcionalidades

### ✅ Implementadas
- Landing page responsiva
- Sistema de autenticação
- Dashboard com resumos financeiros
- Estrutura de componentes base
- Configuração de API

### 🚧 Em Desenvolvimento
- Gestão de transações
- Criação de orçamentos
- Relatórios e gráficos
- Metas financeiras
- Investimentos

### 📅 Planejadas
- Integração com bancos
- IA para sugestões
- App mobile
- Colaboração em equipe
- Exportação de dados

## 🛠️ Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview da build
- `npm run lint` - Linter ESLint

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=FinPlanner V2
VITE_APP_VERSION=2.0.0
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para suporte@finplanner.com ou abra uma issue no GitHub.
