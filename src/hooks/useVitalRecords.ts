import { useContext } from "react";
import { VitalRecordsContext } from "@/contexts/VitalRecordsContext";

export function useVitalRecords() {
  const context = useContext(VitalRecordsContext);
  if (context === undefined) {
    throw new Error(
      "useVitalRecords must be used within a VitalRecordsProvider"
    );
  }
  return context;
}
