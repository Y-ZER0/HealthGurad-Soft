import { ApiClient } from "./base";

// DTOs matching your C# backend
export interface VitalRecordDto {
  recordId: number;
  patientId: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  glucoseLevel?: number;
  temperature?: number;
  dateLogged: string;
  bloodPressure?: string; // Computed: "120/80"
  dateLoggedFormatted: string; // Formatted: "Nov 13, 2:30 PM"
}

export interface VitalRecordListDto {
  patientId: number;
  records: VitalRecordDto[];
  totalCount: number;
}

export interface LogVitalRecordRequest {
  patientId: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  glucoseLevel?: number;
  temperature?: number;
  dateLogged?: string; // Defaults to now if not provided
}

class VitalRecordsApi extends ApiClient {
  /**
   * Log a new vital record
   * POST /api/vitalrecords
   * Requires Patient role
   */
  async logVitalRecord(data: LogVitalRecordRequest): Promise<VitalRecordDto> {
    return this.request<VitalRecordDto>("/vitalrecords", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get vital record by ID
   * GET /api/vitalrecords/{id}
   */
  async getById(id: number): Promise<VitalRecordDto> {
    return this.request<VitalRecordDto>(`/vitalrecords/${id}`);
  }

  /**
   * Get vital records for a patient
   * GET /api/vitalrecords/patient/{patientId}?limit=50
   */
  async getByPatient(
    patientId: number,
    limit: number = 50
  ): Promise<VitalRecordListDto> {
    return this.request<VitalRecordListDto>(
      `/vitalrecords/patient/${patientId}?limit=${limit}`
    );
  }

  /**
   * Get latest vital record for a patient
   * GET /api/vitalrecords/patient/{patientId}/latest
   */
  async getLatest(patientId: number): Promise<VitalRecordDto> {
    return this.request<VitalRecordDto>(
      `/vitalrecords/patient/${patientId}/latest`
    );
  }

  /**
   * Get vital records by date range
   * GET /api/vitalrecords/patient/{patientId}/date-range?startDate=...&endDate=...
   */
  async getByDateRange(
    patientId: number,
    startDate: string,
    endDate: string
  ): Promise<VitalRecordDto[]> {
    return this.request<VitalRecordDto[]>(
      `/vitalrecords/patient/${patientId}/date-range?startDate=${startDate}&endDate=${endDate}`
    );
  }

  /**
   * Delete a vital record
   * DELETE /api/vitalrecords/{id}
   * Requires Patient or Doctor role
   */
  async delete(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/vitalrecords/${id}`, {
      method: "DELETE",
    });
  }
}

export const vitalRecordsApi = new VitalRecordsApi();
