import { ApiClient } from "./base";

// DTOs matching your C# backend
export interface MedicationDto {
  medicationId: number;
  patientId: number;
  medicineName: string;
  dosage: string;
  frequency: string; // "Once daily", "Twice daily"
  timeOfDay?: string; // "08:00", "08:00, 20:00"
  instructions?: string;
  isActive: boolean;
  prescribedBy?: number;
  prescribedByDoctorName?: string;
}

export interface CreateMedicationRequest {
  patientId: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  timeOfDay?: string;
  instructions?: string;
  prescribedBy?: number; // DoctorId
}

export interface TodayMedicationDto {
  medicationId: number;
  medicineName: string;
  dosage: string;
  timeOfDay: string; // "08:00"
  status: string; // "Taken", "Missed", "Pending"
  scheduledTime: string;
}

export interface MedicationLogDto {
  logId: number;
  medicationId: number;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  takenTime?: string;
  status: string; // "Pending", "Taken", "Missed"
}

export interface WeeklyAdherenceDto {
  patientId: number;
  totalScheduledDoses: number;
  takenDoses: number;
  adherencePercentage: number; // 76
  period: string; // "This Week"
}

class MedicationsApi extends ApiClient {
  /**
   * Create a new medication
   * POST /api/medications
   * Requires Doctor role
   */
  async create(data: CreateMedicationRequest): Promise<MedicationDto> {
    return this.request<MedicationDto>("/medications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get medication by ID
   * GET /api/medications/{id}
   */
  async getById(id: number): Promise<MedicationDto> {
    return this.request<MedicationDto>(`/medications/${id}`);
  }

  /**
   * Get all medications for a patient
   * GET /api/medications/patient/{patientId}
   */
  async getByPatient(patientId: number): Promise<MedicationDto[]> {
    return this.request<MedicationDto[]>(`/medications/patient/${patientId}`);
  }

  /**
   * Get today's medications for a patient
   * GET /api/medications/patient/{patientId}/today
   * Requires Patient role
   */
  async getTodaysMedications(patientId: number): Promise<TodayMedicationDto[]> {
    return this.request<TodayMedicationDto[]>(
      `/medications/patient/${patientId}/today`
    );
  }

  /**
   * Discontinue a medication
   * PUT /api/medications/{id}/discontinue
   * Requires Doctor role
   */
  async discontinue(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/medications/${id}/discontinue`, {
      method: "PUT",
    });
  }

  /**
   * Mark medication as taken
   * POST /api/medications/{medicationId}/mark-taken?scheduledTime=...
   * Requires Patient role
   */
  async markAsTaken(
    medicationId: number,
    scheduledTime: string
  ): Promise<MedicationLogDto> {
    return this.request<MedicationLogDto>(
      `/medications/${medicationId}/mark-taken?scheduledTime=${scheduledTime}`,
      {
        method: "POST",
      }
    );
  }

  /**
   * Mark medication as missed
   * POST /api/medications/{medicationId}/mark-missed?scheduledTime=...
   * Requires Patient or Doctor role
   */
  async markAsMissed(
    medicationId: number,
    scheduledTime: string
  ): Promise<MedicationLogDto> {
    return this.request<MedicationLogDto>(
      `/medications/${medicationId}/mark-missed?scheduledTime=${scheduledTime}`,
      {
        method: "POST",
      }
    );
  }

  /**
   * Get weekly adherence for a patient
   * GET /api/medications/patient/{patientId}/adherence/weekly
   */
  async getWeeklyAdherence(patientId: number): Promise<WeeklyAdherenceDto> {
    return this.request<WeeklyAdherenceDto>(
      `/medications/patient/${patientId}/adherence/weekly`
    );
  }
}

export const medicationsApi = new MedicationsApi();
