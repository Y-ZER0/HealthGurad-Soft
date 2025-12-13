import { ApiClient } from "./base";

// DTOs matching your C# backend
export interface DoctorDto {
  doctorId: number;
  name: string;
  specialty?: string;
  contactInfo: string;
  licenseNumber?: string;
  totalPatients: number;
}

export interface DoctorDashboardDto {
  doctorId: number;
  name: string;
  specialty?: string;
  totalPatients: number;
  activePatients: number;
  criticalAlerts: number;
  highPriorityAlerts: number;
}

class DoctorsApi extends ApiClient {
  /**
   * Get doctor by ID
   * GET /api/doctors/{id}
   */
  async getById(id: number): Promise<DoctorDto> {
    return this.request<DoctorDto>(`/doctors/${id}`);
  }

  /**
   * Get doctor by user ID
   * GET /api/doctors/user/{userId}
   */
  async getByUserId(userId: number): Promise<DoctorDto> {
    return this.request<DoctorDto>(`/doctors/user/${userId}`);
  }

  /**
   * Get doctor dashboard with stats and alerts
   * GET /api/doctors/{id}/dashboard
   */
  async getDashboard(id: number): Promise<DoctorDashboardDto> {
    return this.request<DoctorDashboardDto>(`/doctors/${id}/dashboard`);
  }

  async getAllDoctors(): Promise<DoctorDto[]> {
    return this.request<DoctorDto[]>("/doctors");
  }
}

export const doctorsApi = new DoctorsApi();
