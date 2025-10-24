export default function Footer() {
  return (
    <footer className="bg-secondary-900/50 backdrop-blur-md border-t border-white/10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-300">
          <div className="flex items-center gap-4">
            <span>© 2024 FinPlanner V2</span>
            <span>•</span>
            <span>Planejamento Financeiro Inteligente</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Versão 2.0.0</span>
            <span>•</span>
            <span>Última atualização: {new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
