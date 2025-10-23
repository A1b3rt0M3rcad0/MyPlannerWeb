import { useMemo } from "react";
import { usePlanner } from "./usePlanner";

/**
 * Hook para gerenciar cores do planner selecionado
 * Retorna as cores CSS personalizadas baseadas no planner ativo
 * Funciona com qualquer cor hexadecimal
 */
export function usePlannerColor() {
  const { selectedPlanner } = usePlanner();

  const colors = useMemo(() => {
    if (!selectedPlanner?.color) {
      // Cores padrão quando não há planner selecionado
      return {
        primary: "#3b82f6", // blue-500
        primaryLight: "#60a5fa", // blue-400
        primaryDark: "#2563eb", // blue-600
        primaryBg: "bg-blue-500",
        primaryText: "text-blue-500",
        primaryBorder: "border-blue-500",
        gradient: "from-blue-500 to-blue-600",
      };
    }

    // Função para escurecer uma cor
    const darkenColor = (hex, amount) => {
      const num = parseInt(hex.replace("#", ""), 16);
      const amt = Math.round(2.55 * amount);
      const R = (num >> 16) - amt;
      const G = ((num >> 8) & 0x00ff) - amt;
      const B = (num & 0x0000ff) - amt;
      return (
        "#" +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
          .toString(16)
          .slice(1)
      );
    };

    // Função para clarear uma cor
    const lightenColor = (hex, amount) => {
      const num = parseInt(hex.replace("#", ""), 16);
      const amt = Math.round(2.55 * amount);
      const R = (num >> 16) + amt;
      const G = ((num >> 8) & 0x00ff) + amt;
      const B = (num & 0x0000ff) + amt;
      return (
        "#" +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
          .toString(16)
          .slice(1)
      );
    };

    const primaryColor = selectedPlanner.color;
    const primaryDark = darkenColor(primaryColor, 20);
    const primaryLight = lightenColor(primaryColor, 20);

    return {
      primary: primaryColor,
      primaryLight: primaryLight,
      primaryDark: primaryDark,
      primaryBg: `bg-[${primaryColor}]`,
      primaryText: `text-[${primaryColor}]`,
      primaryBorder: `border-[${primaryColor}]`,
      gradient: `from-[${primaryColor}] to-[${primaryDark}]`,
    };
  }, [selectedPlanner?.color]);

  return colors;
}
