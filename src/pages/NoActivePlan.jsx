import BasePage from "../components/layout/BasePage";
import { usePlannerColor } from "../hooks/usePlannerColor";
import { CreditCard, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NoActivePlanPage() {
  const colors = usePlannerColor();
  const navigate = useNavigate();

  return (
    <BasePage pageTitle="Assinatura Necessária" showPlannerSelector={false}>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="rounded-2xl border border-white/10 bg-secondary-800/50 backdrop-blur-sm px-8 py-12 shadow-lg">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <AlertCircle
                className="w-8 h-8"
                style={{ color: colors.primary }}
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              Assinatura Necessária
            </h1>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Você precisa ter um plano ativo para acessar esta funcionalidade.
              Ative sua assinatura para continuar utilizando o FinPlanner.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-yellow-400 mb-1">
                    Como ativar meu plano?
                  </p>
                  <p className="text-sm text-yellow-200">
                    Entre em contato com o suporte para ativar sua assinatura ou
                    verificar o status do seu plano.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/planner/selection")}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/20 bg-white/5 hover:bg-white/10 inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para Planners
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-lg text-sm font-medium text-secondary-900 hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                style={{ backgroundColor: colors.primary }}
              >
                Ir para Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
}

