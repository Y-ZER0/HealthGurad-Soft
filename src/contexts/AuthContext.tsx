import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  authApi,
  LoginResponse,
  AdminUser,
  RegisterPatientRequest,
  RegisterDoctorRequest,
} from "@/lib/api/auth.api";
import { adminApi } from "@/lib/api/admin.api";

interface AuthContextType {
  user: LoginResponse | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  registerPatient: (data: RegisterPatientRequest) => Promise<void>;
  registerDoctor: (data: RegisterDoctorRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  getAllUsers: () => Promise<AdminUser[]>;
  assignDoctor: (userId: number, doctorId: number) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AUTH_TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userData = localStorage.getItem(USER_DATA_KEY);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authApi.login({ username, password });

    if (response.success && response.data) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data));
      setUser(response.data);
    } else {
      throw new Error(response.message || "Login failed");
    }
  };

  const registerPatient = async (data: RegisterPatientRequest) => {
    const response = await authApi.registerPatient(data);

    if (response.success && response.data) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data));
      setUser(response.data);
    } else {
      throw new Error(response.message || "Registration failed");
    }
  };

  const registerDoctor = async (data: RegisterDoctorRequest) => {
    const response = await authApi.registerDoctor(data);

    if (response.success && response.data) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data));
      setUser(response.data);
    } else {
      throw new Error(response.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    setUser(null);
  };

  const getAllUsers = async (): Promise<AdminUser[]> => {
    return authApi.getAllUsers();
  };

  const assignDoctor = async (userId: number, doctorId: number) => {
    return adminApi.assignDoctor(userId, doctorId);
  };

  const deleteUser = async (userId: number) => {
    return adminApi.deleteUser(userId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        registerPatient,
        registerDoctor,
        logout,
        isAuthenticated: !!user,
        getAllUsers,
        assignDoctor,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
