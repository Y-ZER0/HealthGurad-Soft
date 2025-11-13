import { createContext, useState, ReactNode } from "react";
import {
  patientsApi,
  PatientDto,
  PatientDetailDto,
  PatientDashboardDto,
} from "@/lib/api/patients.api";

interface PatientContextType {
  patient: PatientDto | null;
  patientDetail: PatientDetailDto | null;
  patientDashboard: PatientDashboardDto | null;
  patients: PatientDto[];
  isLoading: boolean;
  error: string | null;
  fetchPatientById: (id: number) => Promise<void>;
  fetchPatientByUserId: (userId: number) => Promise<void>;
  fetchPatientDetail: (id: number) => Promise<void>;
  fetchPatientDashboard: (id: number) => Promise<void>;
  fetchPatientsByDoctor: (doctorId: number) => Promise<void>;
  assignDoctor: (patientId: number, doctorId: number) => Promise<void>;
  clearPatient: () => void;
}

export const PatientContext = createContext<PatientContextType | undefined>(
  undefined
);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<PatientDto | null>(null);
  const [patientDetail, setPatientDetail] = useState<PatientDetailDto | null>(
    null
  );
  const [patientDashboard, setPatientDashboard] =
    useState<PatientDashboardDto | null>(null);
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatientById = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientsApi.getById(id);
      setPatient(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch patient");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientByUserId = async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientsApi.getByUserId(userId);
      setPatient(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch patient by user ID");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientDetail = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientsApi.getDetail(id);
      setPatientDetail(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch patient detail");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientDashboard = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientsApi.getDashboard(id);
      setPatientDashboard(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch patient dashboard");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientsByDoctor = async (doctorId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientsApi.getByDoctor(doctorId);
      setPatients(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch patients by doctor");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const assignDoctor = async (patientId: number, doctorId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await patientsApi.assignDoctor(patientId, doctorId);
      // Optionally refetch patient data after assignment
      await fetchPatientDetail(patientId);
    } catch (err: any) {
      setError(err.message || "Failed to assign doctor");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearPatient = () => {
    setPatient(null);
    setPatientDetail(null);
    setPatientDashboard(null);
    setPatients([]);
    setError(null);
  };

  return (
    <PatientContext.Provider
      value={{
        patient,
        patientDetail,
        patientDashboard,
        patients,
        isLoading,
        error,
        fetchPatientById,
        fetchPatientByUserId,
        fetchPatientDetail,
        fetchPatientDashboard,
        fetchPatientsByDoctor,
        assignDoctor,
        clearPatient,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}
