import { ApiClient } from "./base";

// Alert Summary DTO (used in other DTOs)
export interface AlertSummaryDto {
  alertId: number;
  alertType: string;
  description: string;
  severity: string;
  timestamp: string;
  timestampFormatted: string;
}

// Medication DTO (used in dashboard)
export interface TodayMedicationDto {
  medicationId: number;
  medicineName: string;
  dosage: string;
  timeOfDay: string; // "08:00"
  status: string; // "Taken", "Missed", "Pending"
  scheduledTime: string;
}

// Main Patient DTOs
export interface PatientDto {
  patientId: number;
  name: string;
  age: number;
  gender: string;
  contactInfo: string;
  lastVitalRecordDate?: string;
  activeAlertsCount: number;
  assignedDoctorId?: number;
  assignedDoctorName?: string;
}

export interface PatientDetailDto {
  patientId: number;
  name: string;
  age: number;
  gender: string;
  contactInfo: string;
  emergencyContact?: string;
  assignedDoctorId?: number;
  assignedDoctorName?: string;
  doctorSpecialty?: string;
  doctorContactInfo?: string;
  currentBloodPressureSystolic?: number;
  currentBloodPressureDiastolic?: number;
  currentHeartRate?: number;
  currentGlucoseLevel?: number;
  currentTemperature?: number;
  currentVitalsDate?: string;
  currentBloodPressure?: string;
  activeAlertsCount: number;
  recentAlerts: AlertSummaryDto[];
}

export interface PatientDashboardDto {
  patientId: number;
  name: string;
  latestBloodPressureSystolic?: number;
  latestBloodPressureDiastolic?: number;
  latestHeartRate?: number;
  latestGlucoseLevel?: number;
  latestTemperature?: number;
  latestVitalsDate?: string;
  activeAlerts: AlertSummaryDto[];
  todaysMedications: TodayMedicationDto[];
}

class PatientsApi extends ApiClient {
  /**
   * Get patient by ID
   * GET /api/patients/{id}
   */
  async getById(id: number): Promise<PatientDto> {
    return this.request<PatientDto>(`/patients/${id}`);
  }

  /**
   * Get patient by user ID
   * GET /api/patients/user/{userId}
   */
  async getByUserId(userId: number): Promise<PatientDto> {
    return this.request<PatientDto>(`/patients/user/${userId}`);
  }

  /**
   * Get detailed patient information
   * GET /api/patients/{id}/detail
   */
  async getDetail(id: number): Promise<PatientDetailDto> {
    return this.request<PatientDetailDto>(`/patients/${id}/detail`);
  }

  /**
   * Get patient dashboard with vitals, alerts, and medications
   * GET /api/patients/{id}/dashboard
   * Requires Patient role
   */
  async getDashboard(id: number): Promise<PatientDashboardDto> {
    return this.request<PatientDashboardDto>(`/patients/${id}/dashboard`);
  }

  /**
   * Get all patients assigned to a specific doctor
   * GET /api/patients/doctor/{doctorId}
   * Requires Doctor role
   */
  async getByDoctor(doctorId: number): Promise<PatientDto[]> {
    return this.request<PatientDto[]>(`/patients/doctor/${doctorId}`);
  }

  /**
   * Assign a doctor to a patient
   * PUT /api/patients/{patientId}/assign-doctor/{doctorId}
   * Requires Doctor role
   */
  async assignDoctor(
    patientId: number,
    doctorId: number
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/patients/${patientId}/assign-doctor/${doctorId}`,
      {
        method: "PUT",
      }
    );
  }
}

export const patientsApi = new PatientsApi();
