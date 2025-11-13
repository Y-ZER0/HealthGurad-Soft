import { useContext } from "react";
import { AlertThresholdsContext } from "@/contexts/AlertThresholdsContext";

export function useAlertThresholds() {
  const context = useContext(AlertThresholdsContext);
  if (context === undefined) {
    throw new Error(
      "useAlertThresholds must be used within an AlertThresholdsProvider"
    );
  }
  return context;
}
