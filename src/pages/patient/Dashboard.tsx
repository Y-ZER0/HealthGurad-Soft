import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Activity,
  Droplets,
  Thermometer,
  AlertTriangle,
  Pill,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePatient } from "@/hooks/usePatient";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { patientDashboard, fetchPatientDashboard, isLoading } = usePatient();

  // Fetch dashboard data on mount
  useEffect(() => {
    if (user?.profileId) {
      fetchPatientDashboard(user.profileId);
    }
  }, [user?.profileId]);

  const getVitalStatus = (value: number, min: number, max: number) => {
    if (value < min || value > max) return "destructive";
    if (value < min + 5 || value > max - 5) return "warning";
    return "success";
  };

  const VitalCard = ({ title, value, unit, icon: Icon, status }: any) => (
    <Card
      className={`health-stat-card ${
        status === "destructive"
          ? "border-destructive"
          : status === "warning"
          ? "border-warning"
          : "border-success"
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`text-3xl font-bold ${
            status === "destructive"
              ? "text-destructive"
              : status === "warning"
              ? "text-warning"
              : "text-success"
          }`}
        >
          {value} <span className="text-xl">{unit}</span>
        </div>
        {patientDashboard?.latestVitalsDate && (
          <p className="text-sm text-muted-foreground mt-2">
            {new Date(patientDashboard.latestVitalsDate).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // No data state
  if (!patientDashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No dashboard data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {patientDashboard.name}!
        </h1>
        <p className="text-xl opacity-90">
          Here's your health overview for today
        </p>
      </div>

      {/* Active Alerts */}
      {patientDashboard.activeAlerts.length > 0 && (
        <Card className="border-destructive border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              Active Alerts ({patientDashboard.activeAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientDashboard.activeAlerts.map((alert) => (
              <div
                key={alert.alertId}
                className={`p-4 rounded-lg ${
                  alert.severity === "Critical"
                    ? "alert-critical"
                    : alert.severity === "High"
                    ? "alert-high"
                    : alert.severity === "Medium"
                    ? "alert-warning"
                    : "alert-success"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4
                      className={`font-semibold text-lg ${
                        alert.severity === "Critical" ? "text-gray-900" : ""
                      }`}
                    >
                      {alert.alertType}
                    </h4>
                    <p
                      className={`mt-1 ${
                        alert.severity === "Critical" ? "text-gray-800" : ""
                      }`}
                    >
                      {alert.description}
                    </p>
                    <p
                      className={`text-sm mt-2 ${
                        alert.severity === "Critical"
                          ? "text-gray-700"
                          : "opacity-75"
                      }`}
                    >
                      {alert.timestampFormatted}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      alert.severity === "Critical"
                        ? "bg-red-900/30 text-gray-900"
                        : "bg-white/20"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
            <Link to="/alerts">
              <Button variant="outline" className="w-full btn-large">
                View All Alerts
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats - Latest Vital Signs */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Latest Vital Signs
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {patientDashboard.latestBloodPressureSystolic &&
          patientDashboard.latestBloodPressureDiastolic ? (
            <>
              <VitalCard
                title="Blood Pressure"
                value={`${patientDashboard.latestBloodPressureSystolic}/${patientDashboard.latestBloodPressureDiastolic}`}
                unit="mmHg"
                icon={Heart}
                status={getVitalStatus(
                  patientDashboard.latestBloodPressureSystolic,
                  110,
                  140
                )}
              />
              {patientDashboard.latestHeartRate && (
                <VitalCard
                  title="Heart Rate"
                  value={patientDashboard.latestHeartRate}
                  unit="bpm"
                  icon={Activity}
                  status={getVitalStatus(
                    patientDashboard.latestHeartRate,
                    60,
                    100
                  )}
                />
              )}
              {patientDashboard.latestGlucoseLevel && (
                <VitalCard
                  title="Blood Glucose"
                  value={patientDashboard.latestGlucoseLevel}
                  unit="mg/dL"
                  icon={Droplets}
                  status={getVitalStatus(
                    patientDashboard.latestGlucoseLevel,
                    70,
                    130
                  )}
                />
              )}
              {patientDashboard.latestTemperature && (
                <VitalCard
                  title="Temperature"
                  value={patientDashboard.latestTemperature}
                  unit="°F"
                  icon={Thermometer}
                  status={getVitalStatus(
                    patientDashboard.latestTemperature,
                    97,
                    99.5
                  )}
                />
              )}
            </>
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              <p>No vital signs recorded yet.</p>
              <Link to="/log-vitals">
                <Button className="mt-4">Log Your First Reading</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Today's Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" />
            Today's Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {patientDashboard.todaysMedications.length > 0 ? (
            <>
              {patientDashboard.todaysMedications.map((med) => (
                <div
                  key={`${med.medicationId}-${med.scheduledTime}`}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-lg">
                      {med.medicineName}
                    </h4>
                    <p className="text-muted-foreground">
                      {med.dosage} - {med.timeOfDay}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full font-semibold ${
                      med.status === "Taken"
                        ? "bg-success text-success-foreground"
                        : med.status === "Missed"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-warning text-warning-foreground"
                    }`}
                  >
                    {med.status}
                  </div>
                </div>
              ))}
              <Link to="/medications">
                <Button variant="outline" className="w-full btn-large">
                  View All Medications
                </Button>
              </Link>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No medications scheduled for today.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/log-vitals">
          <Button className="w-full btn-large h-24 text-xl" size="lg">
            <Heart className="h-8 w-8 mr-3" />
            Log Vital Signs
          </Button>
        </Link>
        <Link to="/history">
          <Button
            variant="secondary"
            className="w-full btn-large h-24 text-xl"
            size="lg"
          >
            <TrendingUp className="h-8 w-8 mr-3" />
            View Health Trends
          </Button>
        </Link>
      </div>

      {/* Emergency Button */}
      <Card className="border-destructive border-2">
        <CardContent className="p-6">
          <Button className="w-full btn-emergency">
            <AlertTriangle className="h-8 w-8 mr-3" />
            REQUEST EMERGENCY ASSISTANCE
          </Button>
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Contact your doctor immediately if you need medical attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
