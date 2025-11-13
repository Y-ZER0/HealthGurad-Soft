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

  async registerDoctor(data: any): Promise<AuthResponse> {
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
}

export const authApi = new AuthApi();
