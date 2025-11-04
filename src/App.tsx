import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";

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

const App = () => {
  const [userRole, setUserRole] = useState<'patient' | 'doctor'>('patient');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout userRole={userRole} onRoleChange={setUserRole}>
            <Routes>
              {/* Patient Routes */}
              {userRole === 'patient' && (
                <>
                  <Route path="/" element={<PatientDashboard />} />
                  <Route path="/log-vitals" element={<LogVitals />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/medications" element={<Medications />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/doctor/*" element={<Navigate to="/" replace />} />
                </>
              )}

              {/* Doctor Routes */}
              {userRole === 'doctor' && (
                <>
                  <Route path="/" element={<Navigate to="/doctor" replace />} />
                  <Route path="/doctor" element={<DoctorDashboard />} />
                  <Route path="/doctor/patients" element={<PatientList />} />
                  <Route path="/doctor/patient/:patientId" element={<PatientDetail />} />
                  <Route path="/doctor/alerts" element={<AlertsDashboard />} />
                  <Route path="/log-vitals" element={<Navigate to="/doctor" replace />} />
                  <Route path="/history" element={<Navigate to="/doctor" replace />} />
                  <Route path="/medications" element={<Navigate to="/doctor" replace />} />
                  <Route path="/alerts" element={<Navigate to="/doctor/alerts" replace />} />
                </>
              )}

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
