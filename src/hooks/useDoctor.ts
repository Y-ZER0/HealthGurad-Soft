import { useContext } from "react";
import { DoctorContext } from "@/contexts/DoctorContext";

export function useDoctor() {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error("useDoctor must be used within a DoctorProvider");
  }
  return context;
}
