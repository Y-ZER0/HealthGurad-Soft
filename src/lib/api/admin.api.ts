import { ApiClient } from "./base";

class AdminApi extends ApiClient {
  assignDoctor(userId: number, doctorId: number): Promise<void> {
    return this.request<void>(`/patients/${userId}/assign-doctor/${doctorId}`, {
      method: "PUT",
    });
  }

  deleteUser(userId: number): Promise<void> {
    return this.request<void>(`/auth/users/${userId}`, {
      method: "DELETE",
    });
  }
}

export const adminApi = new AdminApi();
