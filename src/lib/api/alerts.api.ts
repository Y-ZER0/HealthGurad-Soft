import { ApiClient } from "./base";

// DTOs matching your C# backend
export interface AlertDto {
  alertId: number;
  patientId: number;
  patientName: string;
  patientAge: number;
  alertType: string; // "High Blood Pressure", "Missed Medication"
  description: string;
  severity: string; // "Low", "Medium", "High", "Critical"
  timestamp: string;
  status: string; // "Active", "Resolved"
  resolvedAt?: string;
  resolvedBy?: number;
  resolvedByDoctorName?: string;
  timestampFormatted: string; // "Nov 13, 2024 - 2:30 PM"
}

export interface AlertCountsDto {
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  resolvedCount: number;
}

class AlertsApi extends ApiClient {
  /**
   * Get alert by ID
   * GET /api/alerts/{id}
   */
  async getById(id: number): Promise<AlertDto> {
    return this.request<AlertDto>(`/alerts/${id}`);
  }

  /**
   * Get all alerts for a patient
   * GET /api/alerts/patient/{patientId}
   */
  async getByPatient(patientId: number): Promise<AlertDto[]> {
    return this.request<AlertDto[]>(`/alerts/patient/${patientId}`);
  }

  /**
   * Get active alerts for a doctor (all their patients)
   * GET /api/alerts/doctor/{doctorId}/active
   * Requires Doctor role
   */
  async getActiveByDoctor(doctorId: number): Promise<AlertDto[]> {
    return this.request<AlertDto[]>(`/alerts/doctor/${doctorId}/active`);
  }

  /**
   * Get alerts by severity for a doctor
   * GET /api/alerts/doctor/{doctorId}/severity/{severity}
   * Requires Doctor role
   */
  async getBySeverity(doctorId: number, severity: string): Promise<AlertDto[]> {
    return this.request<AlertDto[]>(
      `/alerts/doctor/${doctorId}/severity/${severity}`
    );
  }

  /**
   * Get alert counts for a doctor
   * GET /api/alerts/doctor/{doctorId}/counts
   * Requires Doctor role
   */
  async getAlertCounts(doctorId: number): Promise<AlertCountsDto> {
    return this.request<AlertCountsDto>(`/alerts/doctor/${doctorId}/counts`);
  }

  /**
   * Resolve an alert
   * PUT /api/alerts/{id}/resolve?doctorId=...
   * Requires Doctor role
   */
  async resolve(id: number, doctorId: number): Promise<AlertDto> {
    return this.request<AlertDto>(
      `/alerts/${id}/resolve?doctorId=${doctorId}`,
      {
        method: "PUT",
      }
    );
  }
}

export const alertsApi = new AlertsApi();
