import { createContext, useState, ReactNode } from "react";
import {
  medicationsApi,
  MedicationDto,
  CreateMedicationRequest,
  TodayMedicationDto,
  MedicationLogDto,
  WeeklyAdherenceDto,
} from "@/lib/api/medications.api";

interface MedicationsContextType {
  medication: MedicationDto | null;
  medications: MedicationDto[];
  todaysMedications: TodayMedicationDto[];
  weeklyAdherence: WeeklyAdherenceDto | null;
  isLoading: boolean;
  error: string | null;
  createMedication: (data: CreateMedicationRequest) => Promise<void>;
  fetchMedicationById: (id: number) => Promise<void>;
  fetchMedicationsByPatient: (patientId: number) => Promise<void>;
  fetchTodaysMedications: (patientId: number) => Promise<void>;
  discontinueMedication: (id: number) => Promise<void>;
  markMedicationAsTaken: (
    medicationId: number,
    scheduledTime: string
  ) => Promise<void>;
  markMedicationAsMissed: (
    medicationId: number,
    scheduledTime: string
  ) => Promise<void>;
  fetchWeeklyAdherence: (patientId: number) => Promise<void>;
  clearMedications: () => void;
}

export const MedicationsContext = createContext<
  MedicationsContextType | undefined
>(undefined);

export function MedicationsProvider({ children }: { children: ReactNode }) {
  const [medication, setMedication] = useState<MedicationDto | null>(null);
  const [medications, setMedications] = useState<MedicationDto[]>([]);
  const [todaysMedications, setTodaysMedications] = useState<
    TodayMedicationDto[]
  >([]);
  const [weeklyAdherence, setWeeklyAdherence] =
    useState<WeeklyAdherenceDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMedication = async (data: CreateMedicationRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newMedication = await medicationsApi.create(data);
      setMedication(newMedication);
      // Optionally add to medications list
      setMedications((prev) => [...prev, newMedication]);
    } catch (err: any) {
      setError(err.message || "Failed to create medication");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedicationById = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await medicationsApi.getById(id);
      setMedication(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch medication");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedicationsByPatient = async (patientId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await medicationsApi.getByPatient(patientId);
      setMedications(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch medications by patient");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodaysMedications = async (patientId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await medicationsApi.getTodaysMedications(patientId);
      setTodaysMedications(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch today's medications");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const discontinueMedication = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await medicationsApi.discontinue(id);
      // Update local state
      setMedications((prev) =>
        prev.map((med) =>
          med.medicationId === id ? { ...med, isActive: false } : med
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to discontinue medication");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markMedicationAsTaken = async (
    medicationId: number,
    scheduledTime: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await medicationsApi.markAsTaken(medicationId, scheduledTime);
      // Update today's medications status
      setTodaysMedications((prev) =>
        prev.map((med) =>
          med.medicationId === medicationId &&
          med.scheduledTime === scheduledTime
            ? { ...med, status: "Taken" }
            : med
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to mark medication as taken");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markMedicationAsMissed = async (
    medicationId: number,
    scheduledTime: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await medicationsApi.markAsMissed(medicationId, scheduledTime);
      // Update today's medications status
      setTodaysMedications((prev) =>
        prev.map((med) =>
          med.medicationId === medicationId &&
          med.scheduledTime === scheduledTime
            ? { ...med, status: "Missed" }
            : med
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to mark medication as missed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeeklyAdherence = async (patientId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await medicationsApi.getWeeklyAdherence(patientId);
      setWeeklyAdherence(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weekly adherence");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMedications = () => {
    setMedication(null);
    setMedications([]);
    setTodaysMedications([]);
    setWeeklyAdherence(null);
    setError(null);
  };

  return (
    <MedicationsContext.Provider
      value={{
        medication,
        medications,
        todaysMedications,
        weeklyAdherence,
        isLoading,
        error,
        createMedication,
        fetchMedicationById,
        fetchMedicationsByPatient,
        fetchTodaysMedications,
        discontinueMedication,
        markMedicationAsTaken,
        markMedicationAsMissed,
        fetchWeeklyAdherence,
        clearMedications,
      }}
    >
      {children}
    </MedicationsContext.Provider>
  );
}
