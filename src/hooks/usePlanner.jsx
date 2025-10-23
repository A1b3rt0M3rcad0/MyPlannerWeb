import { useContext } from "react";
import { PlannerContext } from "../contexts/PlannerContext";

export function usePlanner() {
  const context = useContext(PlannerContext);

  if (!context) {
    throw new Error("usePlanner deve ser usado dentro de um PlannerProvider");
  }

  return context;
}
