import { createContext, useState, ReactNode } from "react";
import {
  vitalRecordsApi,
  VitalRecordDto,
  VitalRecordListDto,
  LogVitalRecordRequest,
} from "@/lib/api/vitalRecords.api";

interface VitalRecordsContextType {
  vitalRecord: VitalRecordDto | null;
  vitalRecordsList: VitalRecordListDto | null;
  vitalRecords: VitalRecordDto[];
  latestVitalRecord: VitalRecordDto | null;
  isLoading: boolean;
  error: string | null;
  logVitalRecord: (data: LogVitalRecordRequest) => Promise<void>;
  fetchVitalRecordById: (id: number) => Promise<void>;
  fetchVitalRecordsByPatient: (
    patientId: number,
    limit?: number
  ) => Promise<void>;
  fetchLatestVitalRecord: (patientId: number) => Promise<void>;
  fetchVitalRecordsByDateRange: (
    patientId: number,
    startDate: string,
    endDate: string
  ) => Promise<void>;
  deleteVitalRecord: (id: number) => Promise<void>;
  clearVitalRecords: () => void;
}

export const VitalRecordsContext = createContext<
  VitalRecordsContextType | undefined
>(undefined);

export function VitalRecordsProvider({ children }: { children: ReactNode }) {
  const [vitalRecord, setVitalRecord] = useState<VitalRecordDto | null>(null);
  const [vitalRecordsList, setVitalRecordsList] =
    useState<VitalRecordListDto | null>(null);
  const [vitalRecords, setVitalRecords] = useState<VitalRecordDto[]>([]);
  const [latestVitalRecord, setLatestVitalRecord] =
    useState<VitalRecordDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logVitalRecord = async (data: LogVitalRecordRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newRecord = await vitalRecordsApi.logVitalRecord(data);
      setVitalRecord(newRecord);
      // Optionally refresh the list after logging
      if (vitalRecordsList) {
        setVitalRecordsList({
          ...vitalRecordsList,
          records: [newRecord, ...vitalRecordsList.records],
          totalCount: vitalRecordsList.totalCount + 1,
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to log vital record");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVitalRecordById = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vitalRecordsApi.getById(id);
      setVitalRecord(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch vital record");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVitalRecordsByPatient = async (
    patientId: number,
    limit: number = 50
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vitalRecordsApi.getByPatient(patientId, limit);
      setVitalRecordsList(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch vital records by patient");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLatestVitalRecord = async (patientId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vitalRecordsApi.getLatest(patientId);
      setLatestVitalRecord(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch latest vital record");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVitalRecordsByDateRange = async (
    patientId: number,
    startDate: string,
    endDate: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vitalRecordsApi.getByDateRange(
        patientId,
        startDate,
        endDate
      );
      setVitalRecords(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch vital records by date range");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVitalRecord = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await vitalRecordsApi.delete(id);
      // Remove from list if it exists
      if (vitalRecordsList) {
        setVitalRecordsList({
          ...vitalRecordsList,
          records: vitalRecordsList.records.filter((r) => r.recordId !== id),
          totalCount: vitalRecordsList.totalCount - 1,
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete vital record");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearVitalRecords = () => {
    setVitalRecord(null);
    setVitalRecordsList(null);
    setVitalRecords([]);
    setLatestVitalRecord(null);
    setError(null);
  };

  return (
    <VitalRecordsContext.Provider
      value={{
        vitalRecord,
        vitalRecordsList,
        vitalRecords,
        latestVitalRecord,
        isLoading,
        error,
        logVitalRecord,
        fetchVitalRecordById,
        fetchVitalRecordsByPatient,
        fetchLatestVitalRecord,
        fetchVitalRecordsByDateRange,
        deleteVitalRecord,
        clearVitalRecords,
      }}
    >
      {children}
    </VitalRecordsContext.Provider>
  );
}
