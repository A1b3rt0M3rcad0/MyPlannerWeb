import { ArrowLeft, Home, ChevronRight } from "lucide-react";

function BaseContent({ pageTitle, onBack, children, breadcrumbs = [] }) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Header com Breadcrumbs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="px-6 py-4">
          {/* Botão Voltar e Título */}
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={onBack}
              aria-label="Voltar"
              className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {pageTitle}
              </h2>
            </div>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200"
              >
                <Home className="w-4 h-4" />
                <span>Início</span>
              </button>

              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  {crumb.onClick ? (
                    <button
                      onClick={crumb.onClick}
                      className="hover:text-blue-600 transition-colors duration-200"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-gray-700 font-medium">
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}

export default BaseContent;
