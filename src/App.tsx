import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";

// Auth Pages
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

// Patient Pages
import PatientDashboard from "@/pages/patient/Dashboard";
import LogVitals from "@/pages/patient/LogVitals";
import History from "@/pages/patient/History";
import Medications from "@/pages/patient/Medications";
import Alerts from "@/pages/patient/Alerts";

// Doctor Pages
import DoctorDashboard from "@/pages/doctor/Dashboard";
import PatientList from "@/pages/doctor/PatientList";
import PatientDetail from "@/pages/doctor/PatientDetail";
import AlertsDashboard from "@/pages/doctor/AlertsDashboard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Role-based Protected Route
const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              {user?.role === "Patient" ? (
                <PatientDashboard />
              ) : (
                <Navigate to="/doctor" replace />
              )}
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Patient Routes */}
      <Route
        path="/log-vitals"
        element={
          <RoleProtectedRoute allowedRoles={["Patient"]}>
            <Layout>
              <LogVitals />
            </Layout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <RoleProtectedRoute allowedRoles={["Patient"]}>
            <Layout>
              <History />
            </Layout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/medications"
        element={
          <RoleProtectedRoute allowedRoles={["Patient"]}>
            <Layout>
              <Medications />
            </Layout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/alerts"
        element={
          <RoleProtectedRoute allowedRoles={["Patient"]}>
            <Layout>
              <Alerts />
            </Layout>
          </RoleProtectedRoute>
        }
      />

      {/* Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <RoleProtectedRoute allowedRoles={["Doctor"]}>
            <Layout>
              <DoctorDashboard />
            </Layout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <RoleProtectedRoute allowedRoles={["Doctor"]}>
            <Layout>
              <PatientList />
            </Layout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/doctor/patient/:patientId"
        element={
          <RoleProtectedRoute allowedRoles={["Doctor"]}>
            <Layout>
              <PatientDetail />
            </Layout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/doctor/alerts"
        element={
          <RoleProtectedRoute allowedRoles={["Doctor"]}>
            <Layout>
              <AlertsDashboard />
            </Layout>
          </RoleProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
