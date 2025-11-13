import { useContext } from "react";
import { PatientContext } from "@/contexts/PatientContext ";

export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
}
