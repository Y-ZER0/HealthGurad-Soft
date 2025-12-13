import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  AlertTriangle,
  Activity,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDoctor } from "@/hooks/useDoctor";
import { usePatient } from "@/hooks/usePatient";
import { useAlerts } from "@/hooks/useAlerts";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { dashboard, fetchDashboard, isLoading: doctorLoading } = useDoctor();
  const {
    patients,
    fetchPatientsByDoctor,
    isLoading: patientsLoading,
  } = usePatient();
  const {
    alerts,
    fetchAlertsBySeverity,
    isLoading: alertsLoading,
  } = useAlerts();

  // Fetch dashboard data on mount
  useEffect(() => {
    if (user?.profileId) {
      fetchDashboard(user.profileId);
      fetchPatientsByDoctor(user.profileId);
      fetchAlertsBySeverity(user.profileId, "Critical");
    }
  }, [user?.profileId]);

  // Loading state
  if (doctorLoading || patientsLoading || alertsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // No data state
  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No dashboard data available.</p>
      </div>
    );
  }

  const criticalAlerts = alerts.filter(
    (a) => a.severity === "Critical" && a.status === "Active"
  );
  const recentPatients = patients.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome, {dashboard.name}!</h1>
        {dashboard.specialty && (
          <p className="text-xl opacity-90">{dashboard.specialty}</p>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-primary border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">
                  Total Patients
                </p>
                <p className="text-4xl font-bold text-primary mt-2">
                  {dashboard.totalPatients}
                </p>
              </div>
              <Users className="h-12 w-12 text-primary/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">
                  Critical Alerts
                </p>
                <p className="text-4xl font-bold text-destructive mt-2">
                  {dashboard.criticalAlerts}
                </p>
              </div>
              <AlertTriangle className="h-12 w-12 text-destructive/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">
                  High Priority
                </p>
                <p className="text-4xl font-bold text-warning mt-2">
                  {dashboard.highPriorityAlerts}
                </p>
              </div>
              <Activity className="h-12 w-12 text-warning/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">
                  Active Patients
                </p>
                <p className="text-4xl font-bold text-secondary mt-2">
                  {dashboard.activePatients}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-secondary/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts Feed */}
      <Card className="border-destructive border-2">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            Critical Alerts Requiring Immediate Attention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {criticalAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-16 w-16 mx-auto mb-4 text-success" />
              <p className="text-xl text-muted-foreground">
                No critical alerts at this time
              </p>
            </div>
          ) : (
            criticalAlerts.map((alert) => (
              <div
                key={alert.alertId}
                className="alert-critical p-5 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-xl font-bold text-red-500">
                        {alert.patientName}
                      </h4>
                      <span className="text-sm bg-white/20 text-red-500 px-2 py-1 rounded">
                        Age {alert.patientAge}
                      </span>
                    </div>
                    <p className="text-lg text-red-500 font-semibold mb-1">
                      {alert.alertType}
                    </p>
                    <p className="mb-2 text-red-500">{alert.description}</p>
                    <p className="text-sm opacity-75 text-red-500">
                      {alert.timestampFormatted}
                    </p>
                  </div>
                  <Link to={`/doctor/patient/${alert.patientId}`}>
                    <Button variant="secondary" className="btn-large">
                      View Patient
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
          <Link to="/doctor/alerts">
            <Button variant="outline" className="w-full btn-large">
              View All Alerts
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Patient Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Recent Patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPatients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl">No patients assigned yet</p>
              </div>
            ) : (
              recentPatients.map((patient) => (
                <div
                  key={patient.patientId}
                  className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{patient.name}</h4>
                    <p className="text-muted-foreground">
                      {patient.activeAlertsCount > 0
                        ? `${patient.activeAlertsCount} active alert${
                            patient.activeAlertsCount > 1 ? "s" : ""
                          }`
                        : "No active alerts"}
                      {patient.lastVitalRecordDate && (
                        <span className="ml-2">
                          • Last vitals:{" "}
                          {new Date(
                            patient.lastVitalRecordDate
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                  <Link to={`/doctor/patient/${patient.patientId}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/doctor/patients">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary border-2">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="text-xl font-semibold">Manage Patients</h3>
              <p className="text-muted-foreground mt-2">
                View and manage all {dashboard.totalPatients} patients
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/doctor/alerts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-warning border-2">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-warning" />
              <h3 className="text-xl font-semibold">Review Alerts</h3>
              <p className="text-muted-foreground mt-2">
                Check all patient alerts (
                {dashboard.criticalAlerts + dashboard.highPriorityAlerts}{" "}
                active)
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
