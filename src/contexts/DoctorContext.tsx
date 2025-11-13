import { createContext, useState, ReactNode } from "react";
import {
  doctorsApi,
  DoctorDto,
  DoctorDashboardDto,
} from "@/lib/api/doctors.api";

interface DoctorContextType {
  doctor: DoctorDto | null;
  dashboard: DoctorDashboardDto | null;
  isLoading: boolean;
  error: string | null;
  fetchDoctorById: (id: number) => Promise<void>;
  fetchDoctorByUserId: (userId: number) => Promise<void>;
  fetchDashboard: (id: number) => Promise<void>;
  clearDoctor: () => void;
}

export const DoctorContext = createContext<DoctorContextType | undefined>(
  undefined
);

export function DoctorProvider({ children }: { children: ReactNode }) {
  const [doctor, setDoctor] = useState<DoctorDto | null>(null);
  const [dashboard, setDashboard] = useState<DoctorDashboardDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctorById = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await doctorsApi.getById(id);
      setDoctor(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch doctor");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorByUserId = async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await doctorsApi.getByUserId(userId);
      setDoctor(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch doctor by user ID");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboard = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await doctorsApi.getDashboard(id);
      setDashboard(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearDoctor = () => {
    setDoctor(null);
    setDashboard(null);
    setError(null);
  };

  return (
    <DoctorContext.Provider
      value={{
        doctor,
        dashboard,
        isLoading,
        error,
        fetchDoctorById,
        fetchDoctorByUserId,
        fetchDashboard,
        clearDoctor,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}
