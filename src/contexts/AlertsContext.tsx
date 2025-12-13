import { createContext, useState, ReactNode } from "react";
import { alertsApi, AlertDto, AlertCountsDto } from "@/lib/api/alerts.api";

interface AlertsContextType {
  alert: AlertDto | null;
  alerts: AlertDto[];
  alertCounts: AlertCountsDto | null;
  isLoading: boolean;
  error: string | null;
  fetchAlertById: (id: number) => Promise<void>;
  fetchAlertsByPatient: (patientId: number) => Promise<void>;
  fetchActiveAlertsByDoctor: (doctorId: number) => Promise<void>;
  fetchAlertsBySeverity: (doctorId: number, severity: string) => Promise<void>;
  fetchAlertCounts: (doctorId: number) => Promise<void>;
  resolveAlert: (id: number, doctorId: number) => Promise<void>;
  clearAlerts: () => void;
}

export const AlertsContext = createContext<AlertsContextType | undefined>(
  undefined
);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertDto | null>(null);
  const [alerts, setAlerts] = useState<AlertDto[]>([]);
  const [alertCounts, setAlertCounts] = useState<AlertCountsDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlertById = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alertsApi.getById(id);
      setAlert(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch alert");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlertsByPatient = async (patientId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alertsApi.getByPatient(patientId);
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch alerts by patient");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveAlertsByDoctor = async (doctorId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alertsApi.getActiveByDoctor(doctorId);
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch active alerts by doctor");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlertsBySeverity = async (doctorId: number, severity: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alertsApi.getBySeverity(doctorId, severity);
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch alerts by severity");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlertCounts = async (doctorId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alertsApi.getAlertCounts(doctorId);
      setAlertCounts(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch alert counts");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resolveAlert = async (id: number, doctorId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const resolvedAlert = await alertsApi.resolve(id, doctorId);
      setAlert(resolvedAlert);
      // Update in alerts list
      setAlerts((prev) =>
        prev.map((a) => (a.alertId === id ? resolvedAlert : a))
      );
    } catch (err: any) {
      setError(err.message || "Failed to resolve alert");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearAlerts = () => {
    setAlert(null);
    setAlerts([]);
    setAlertCounts(null);
    setError(null);
  };

  return (
    <AlertsContext.Provider
      value={{
        alert,
        alerts,
        alertCounts,
        isLoading,
        error,
        fetchAlertById,
        fetchAlertsByPatient,
        fetchActiveAlertsByDoctor,
        fetchAlertsBySeverity,
        fetchAlertCounts,
        resolveAlert,
        clearAlerts,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}
