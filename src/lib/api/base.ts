const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://healthguard-api.fly.dev/api";

export class ApiClient {
  protected getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    // Handle empty response bodies (e.g., DELETE endpoints)
    const contentLength = response.headers.get("content-length");
    if (contentLength === "0" || response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }
}
