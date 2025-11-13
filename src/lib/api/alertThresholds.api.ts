import { ApiClient } from "./base";

// DTOs matching your C# backend
export interface PatientThresholdsDto {
  patientId: number;
  systolicMin?: number;
  systolicMax?: number;
  diastolicMin?: number;
  diastolicMax?: number;
  heartRateMin?: number;
  heartRateMax?: number;
  glucoseMin?: number;
  glucoseMax?: number;
  setBy: number; // DoctorId
}

export interface UpdateThresholdsRequest {
  patientId: number;
  doctorId: number;
  systolicMin?: number;
  systolicMax?: number;
  diastolicMin?: number;
  diastolicMax?: number;
  heartRateMin?: number;
  heartRateMax?: number;
  glucoseMin?: number;
  glucoseMax?: number;
}

class AlertThresholdsApi extends ApiClient {
  /**
   * Get thresholds for a specific patient
   * GET /api/alertthresholds/patient/{patientId}
   */
  async getPatientThresholds(patientId: number): Promise<PatientThresholdsDto> {
    return this.request<PatientThresholdsDto>(
      `/alertthresholds/patient/${patientId}`
    );
  }

  /**
   * Update thresholds for a specific patient (Doctor only)
   * PUT /api/alertthresholds/patient/{patientId}
   */
  async updatePatientThresholds(
    patientId: number,
    data: UpdateThresholdsRequest
  ): Promise<PatientThresholdsDto> {
    return this.request<PatientThresholdsDto>(
      `/alertthresholds/patient/${patientId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  }
}

export const alertThresholdsApi = new AlertThresholdsApi();
