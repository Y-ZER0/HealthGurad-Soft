import { useContext } from "react";
import { MedicationsContext } from "@/contexts/MedicationsContext";

export function useMedications() {
  const context = useContext(MedicationsContext);
  if (context === undefined) {
    throw new Error("useMedications must be used within a MedicationsProvider");
  }
  return context;
}
