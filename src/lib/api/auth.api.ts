import { ApiClient } from "./base";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterPatientRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  age: number;
  gender: string;
  contactInfo: string;
  emergencyContact?: string;
}

export interface RegisterDoctorRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  contactInfo: string;
  specialty: string;
  licenseNumber: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  email: string;
  role: string;
  token: string;
  profileId?: number;
  profileName?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: LoginResponse;
}

export interface AdminUser {
  userId: number;
  username: string;
  email: string;
  role: string;
  patientId?: number;
  age?: number;
  gender?: string;
  assignedDoctorId?: number;
  doctorId?: number;
  specialty?: string;
}

class AuthApi extends ApiClient {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async registerPatient(data: RegisterPatientRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register/patient", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async registerDoctor(data: RegisterDoctorRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register/doctor", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async validateToken(token: string): Promise<{ valid: boolean }> {
    return this.request<{ valid: boolean }>("/auth/validate-token", {
      method: "POST",
      body: JSON.stringify(token),
    });
  }

  async getAllUsers(): Promise<AdminUser[]> {
    return this.request<AdminUser[]>("/auth/users");
  }
}

export const authApi = new AuthApi();
