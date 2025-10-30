import BasePage from "../components/layout/BasePage";
import { usePlannerColor } from "../hooks/usePlannerColor";
import { Hourglass, Rocket } from "lucide-react";

export default function ComingSoonPage() {
  const colors = usePlannerColor();

  return (
    <BasePage pageTitle="Em Breve" showPlannerSelector={false}>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="rounded-2xl border border-white/10 bg-secondary-800/50 backdrop-blur-sm px-8 py-12 shadow-lg">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <Hourglass
                className="w-8 h-8"
                style={{ color: colors.primary }}
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Em Breve</h1>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Estamos lapidando esta funcionalidade para entregar a melhor
              experiência. Enquanto isso, continue explorando as demais áreas do
              aplicativo.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-medium text-secondary-900"
                style={{ backgroundColor: colors.primary }}
              >
                Voltar ao Dashboard
              </a>
              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 border border-white/10 bg-white/5 cursor-not-allowed inline-flex items-center gap-2"
                aria-disabled="true"
                title="Em desenvolvimento"
              >
                <Rocket className="w-4 h-4" />
                Em desenvolvimento
              </button>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
}
