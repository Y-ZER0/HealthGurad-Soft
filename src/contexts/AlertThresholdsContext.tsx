import { createContext, useState, ReactNode } from "react";
import {
  alertThresholdsApi,
  PatientThresholdsDto,
  UpdateThresholdsRequest,
} from "@/lib/api/alertThresholds.api";

interface AlertThresholdsContextType {
  thresholds: PatientThresholdsDto | null;
  isLoading: boolean;
  error: string | null;
  fetchPatientThresholds: (patientId: number) => Promise<void>;
  updatePatientThresholds: (
    patientId: number,
    data: UpdateThresholdsRequest
  ) => Promise<void>;
  clearThresholds: () => void;
}

export const AlertThresholdsContext = createContext<
  AlertThresholdsContextType | undefined
>(undefined);

export function AlertThresholdsProvider({ children }: { children: ReactNode }) {
  const [thresholds, setThresholds] = useState<PatientThresholdsDto | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatientThresholds = async (patientId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alertThresholdsApi.getPatientThresholds(patientId);
      setThresholds(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch patient thresholds");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatientThresholds = async (
    patientId: number,
    data: UpdateThresholdsRequest
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await alertThresholdsApi.updatePatientThresholds(
        patientId,
        data
      );
      setThresholds(updated);
    } catch (err: any) {
      setError(err.message || "Failed to update patient thresholds");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearThresholds = () => {
    setThresholds(null);
    setError(null);
  };

  return (
    <AlertThresholdsContext.Provider
      value={{
        thresholds,
        isLoading,
        error,
        fetchPatientThresholds,
        updatePatientThresholds,
        clearThresholds,
      }}
    >
      {children}
    </AlertThresholdsContext.Provider>
  );
}
