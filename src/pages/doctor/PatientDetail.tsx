import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Heart,
  Activity,
  AlertTriangle,
  Pill,
  MessageSquare,
  ArrowLeft,
  Settings,
  Phone,
  Mail,
  TrendingUp,
  CheckCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { usePatient } from "@/hooks/usePatient";
import { useAlerts } from "@/hooks/useAlerts";
import { useAlertThresholds } from "@/hooks/useAlertThresholds";
import { useMedications } from "@/hooks/useMedications";
import { useVitalRecords } from "@/hooks/useVitalRecords";

export default function PatientDetail() {
  const { patientId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Contexts
  const {
    patientDetail,
    fetchPatientDetail,
    isLoading: patientLoading,
  } = usePatient();
  const {
    alerts,
    fetchAlertsByPatient,
    resolveAlert,
    isLoading: alertsLoading,
  } = useAlerts();
  const {
    thresholds,
    fetchPatientThresholds,
    updatePatientThresholds,
    isLoading: thresholdsLoading,
  } = useAlertThresholds();
  const {
    medications,
    fetchMedicationsByPatient,
    createMedication,
    discontinueMedication,
    isLoading: medsLoading,
  } = useMedications();
  const {
    vitalRecordsList,
    fetchVitalRecordsByPatient,
    isLoading: vitalsLoading,
  } = useVitalRecords();

  // Local state for forms
  const [thresholdForm, setThresholdForm] = useState({
    systolicMin: 110,
    systolicMax: 140,
    diastolicMin: 70,
    diastolicMax: 90,
    heartRateMin: 60,
    heartRateMax: 100,
    glucoseMin: 70,
    glucoseMax: 130,
  });

  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    timeOfDay: "08:00",
    instructions: "",
  });

  // Fetch all data on mount
  useEffect(() => {
    if (patientId) {
      const id = Number(patientId);
      fetchPatientDetail(id);
      fetchAlertsByPatient(id);
      fetchPatientThresholds(id);
      fetchMedicationsByPatient(id);
      fetchVitalRecordsByPatient(id, 30); // Last 30 records for charts
    }
  }, [patientId]);

  // Update threshold form when data loads
  useEffect(() => {
    if (thresholds) {
      setThresholdForm({
        systolicMin: thresholds.systolicMin || 110,
        systolicMax: thresholds.systolicMax || 140,
        diastolicMin: thresholds.diastolicMin || 70,
        diastolicMax: thresholds.diastolicMax || 90,
        heartRateMin: thresholds.heartRateMin || 60,
        heartRateMax: thresholds.heartRateMax || 100,
        glucoseMin: thresholds.glucoseMin || 70,
        glucoseMax: thresholds.glucoseMax || 130,
      });
    }
  }, [thresholds]);

  // Computed values
  const activeAlerts = useMemo(
    () => alerts.filter((a) => a.status === "Active"),
    [alerts]
  );

  const vitalsForChart = useMemo(() => {
    if (!vitalRecordsList?.records) return [];
    return vitalRecordsList.records
      .slice(0, 14)
      .reverse()
      .map((v) => ({
        date: format(new Date(v.dateLogged), "MM/dd"),
        systolic: v.bloodPressureSystolic || 0,
        heartRate: v.heartRate || 0,
        glucose: v.glucoseLevel || 0,
      }));
  }, [vitalRecordsList]);

  // Handlers
  const handleSaveThresholds = async () => {
    if (!patientId || !user?.profileId) return;

    try {
      await updatePatientThresholds(Number(patientId), {
        patientId: Number(patientId),
        doctorId: user.profileId,
        systolicMin: thresholdForm.systolicMin,
        systolicMax: thresholdForm.systolicMax,
        diastolicMin: thresholdForm.diastolicMin,
        diastolicMax: thresholdForm.diastolicMax,
        heartRateMin: thresholdForm.heartRateMin,
        heartRateMax: thresholdForm.heartRateMax,
        glucoseMin: thresholdForm.glucoseMin,
        glucoseMax: thresholdForm.glucoseMax,
      });

      toast({
        title: "Thresholds Updated",
        description: "Alert thresholds have been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update thresholds",
        variant: "destructive",
      });
    }
  };

  const handleAddMedication = async () => {
    if (
      !newMedication.name ||
      !newMedication.dosage ||
      !patientId ||
      !user?.profileId
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required medication details",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMedication({
        patientId: Number(patientId),
        medicineName: newMedication.name,
        dosage: newMedication.dosage,
        frequency: newMedication.frequency,
        timeOfDay: newMedication.timeOfDay,
        instructions: newMedication.instructions,
        prescribedBy: user.profileId,
      });

      toast({
        title: "Medication Added",
        description: `${newMedication.name} has been prescribed successfully`,
      });

      setNewMedication({
        name: "",
        dosage: "",
        frequency: "Once daily",
        timeOfDay: "08:00",
        instructions: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add medication",
        variant: "destructive",
      });
    }
  };

  const handleResolveAlert = async (alertId: number) => {
    if (!user?.profileId) return;

    try {
      await resolveAlert(alertId, user.profileId);
      toast({
        title: "Alert Resolved",
        description: "The alert has been successfully resolved",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resolve alert",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMedication = async (
    medicationId: number,
    medicineName: string
  ) => {
    try {
      await discontinueMedication(medicationId);
      toast({
        title: "Medication Discontinued",
        description: `${medicineName} has been removed from the patient's medications`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to discontinue medication",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (patientLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not found state
  if (!patientDetail) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Patient Not Found</h1>
        <Link to="/doctor/patients">
          <Button>Back to Patient List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/doctor/patients">
            <Button variant="outline" size="icon" className="h-12 w-12">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold">{patientDetail.name}</h1>
            <p className="text-xl text-muted-foreground">
              {patientDetail.age} years • {patientDetail.gender}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="btn-large">
            <Phone className="h-5 w-5 mr-2" />
            Call
          </Button>
          <Button variant="outline" className="btn-large">
            <Mail className="h-5 w-5 mr-2" />
            Email
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 h-14">
          <TabsTrigger value="overview" className="text-base">
            <User className="h-5 w-5 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="vitals" className="text-base">
            <TrendingUp className="h-5 w-5 mr-2" />
            Vital Charts
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-base">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Alerts ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="medications" className="text-base">
            <Pill className="h-5 w-5 mr-2" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="communication" className="text-base">
            <MessageSquare className="h-5 w-5 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base">Name</Label>
                <p className="text-xl font-semibold mt-1">
                  {patientDetail.name}
                </p>
              </div>
              <div>
                <Label className="text-base">Age</Label>
                <p className="text-xl font-semibold mt-1">
                  {patientDetail.age} years
                </p>
              </div>
              <div>
                <Label className="text-base">Gender</Label>
                <p className="text-xl font-semibold mt-1">
                  {patientDetail.gender}
                </p>
              </div>
              <div>
                <Label className="text-base">Contact</Label>
                <p className="text-xl font-semibold mt-1">
                  {patientDetail.contactInfo}
                </p>
              </div>
              {patientDetail.emergencyContact && (
                <div>
                  <Label className="text-base">Emergency Contact</Label>
                  <p className="text-xl font-semibold mt-1">
                    {patientDetail.emergencyContact}
                  </p>
                </div>
              )}
              {patientDetail.assignedDoctorName && (
                <div>
                  <Label className="text-base">Assigned Doctor</Label>
                  <p className="text-xl font-semibold mt-1">
                    Dr. {patientDetail.assignedDoctorName}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Vitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Current Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patientDetail.currentBloodPressureSystolic ? (
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">
                        Blood Pressure
                      </p>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {patientDetail.currentBloodPressure || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">mmHg</p>
                    </CardContent>
                  </Card>
                  {patientDetail.currentHeartRate && (
                    <Card className="bg-muted">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">
                          Heart Rate
                        </p>
                        <p className="text-2xl font-bold text-secondary mt-1">
                          {patientDetail.currentHeartRate}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          bpm
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  {patientDetail.currentGlucoseLevel && (
                    <Card className="bg-muted">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">
                          Blood Glucose
                        </p>
                        <p className="text-2xl font-bold text-warning mt-1">
                          {patientDetail.currentGlucoseLevel}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          mg/dL
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  {patientDetail.currentTemperature && (
                    <Card className="bg-muted">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">
                          Temperature
                        </p>
                        <p className="text-2xl font-bold text-alert-high mt-1">
                          {patientDetail.currentTemperature}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">°F</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No vital signs recorded
                </p>
              )}
            </CardContent>
          </Card>

          {/* Alert Summary */}
          <Card
            className={
              activeAlerts.length > 0 ? "border-destructive border-2" : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                Alert Summary ({patientDetail.activeAlertsCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patientDetail.recentAlerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active alerts
                </p>
              ) : (
                <div className="space-y-3">
                  {patientDetail.recentAlerts.map((alert) => (
                    <div
                      key={alert.alertId}
                      className="p-4 bg-destructive/10 rounded-lg border border-destructive"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {alert.alertType}
                          </h4>
                          <p className="text-sm mt-1">{alert.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {alert.timestampFormatted}
                          </p>
                        </div>
                        <Badge variant="destructive">{alert.severity}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vitals Tab */}
        <TabsContent value="vitals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blood Pressure Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalsForChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  {thresholds && (
                    <>
                      <ReferenceLine
                        y={thresholds.systolicMax}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                      />
                      <ReferenceLine
                        y={thresholds.systolicMin}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                      />
                    </>
                  )}
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Heart Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={vitalsForChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {thresholds && (
                      <>
                        <ReferenceLine
                          y={thresholds.heartRateMax}
                          stroke="#ef4444"
                          strokeDasharray="3 3"
                        />
                        <ReferenceLine
                          y={thresholds.heartRateMin}
                          stroke="#ef4444"
                          strokeDasharray="3 3"
                        />
                      </>
                    )}
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blood Glucose</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={vitalsForChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {thresholds && (
                      <>
                        <ReferenceLine
                          y={thresholds.glucoseMax}
                          stroke="#ef4444"
                          strokeDasharray="3 3"
                        />
                        <ReferenceLine
                          y={thresholds.glucoseMin}
                          stroke="#ef4444"
                          strokeDasharray="3 3"
                        />
                      </>
                    )}
                    <Line
                      type="monotone"
                      dataKey="glucose"
                      stroke="hsl(var(--warning))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-primary" />
                Alert Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Blood Pressure</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Systolic Min</Label>
                      <Input
                        type="number"
                        value={thresholdForm.systolicMin}
                        onChange={(e) =>
                          setThresholdForm({
                            ...thresholdForm,
                            systolicMin: Number(e.target.value),
                          })
                        }
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>Systolic Max</Label>
                      <Input
                        type="number"
                        value={thresholdForm.systolicMax}
                        onChange={(e) =>
                          setThresholdForm({
                            ...thresholdForm,
                            systolicMax: Number(e.target.value),
                          })
                        }
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>Diastolic Min</Label>
                      <Input
                        type="number"
                        value={thresholdForm.diastolicMin}
                        onChange={(e) =>
                          setThresholdForm({
                            ...thresholdForm,
                            diastolicMin: Number(e.target.value),
                          })
                        }
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>Diastolic Max</Label>
                      <Input
                        type="number"
                        value={thresholdForm.diastolicMax}
                        onChange={(e) =>
                          setThresholdForm({
                            ...thresholdForm,
                            diastolicMax: Number(e.target.value),
                          })
                        }
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Other Vitals</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>HR Min (bpm)</Label>
                      <Input
                        type="number"
                        value={thresholdForm.heartRateMin}
                        onChange={(e) =>
                          setThresholdForm({
                            ...thresholdForm,
                            heartRateMin: Number(e.target.value),
                          })
                        }
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>HR Max (bpm)</Label>
                      <Input
                        type="number"
                        value={thresholdForm.heartRateMax}
                        onChange={(e) =>
                          setThresholdForm({
                            ...thresholdForm,
                            heartRateMax: Number(e.target.value),
                          })
                        }
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>Glucose Min</Label>
                      <Input
                        type="number"
                        value={thresholdForm.glucoseMin}
                        onChange={(e) =>
                          setThresholdForm({
                            ...thresholdForm,
                            glucoseMin: Number(e.target.value),
                          })
                        }
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>Glucose Max</Label>
                      <Input
                        type="number"
                        value={thresholdForm.glucoseMax}
                        onChange={(e) =>
                          setThresholdForm({
                            ...thresholdForm,
                            glucoseMax: Number(e.target.value),
                          })
                        }
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSaveThresholds}
                className="mt-6 btn-large"
                disabled={thresholdsLoading}
              >
                {thresholdsLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Thresholds"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alertsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </div>
              ) : alerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No alerts found
                </p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.alertId}
                    className={`p-4 rounded-lg ${
                      alert.severity === "Critical"
                        ? "bg-destructive/10 border border-destructive"
                        : alert.severity === "High"
                        ? "bg-orange-100 border border-orange-500"
                        : alert.severity === "Low"
                        ? "bg-green-100 border border-green-500"
                        : "bg-yellow-100 border border-yellow-500"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {alert.alertType}
                        </h4>
                        <p className="text-sm mt-1">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {alert.timestampFormatted}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            alert.status === "Resolved"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {alert.status}
                        </Badge>
                        {alert.status === "Active" && (
                          <Button
                            size="sm"
                            onClick={() => handleResolveAlert(alert.alertId)}
                            disabled={alertsLoading}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-6 w-6 text-primary" />
                Add New Medication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Medicine Name *</Label>
                  <Input
                    value={newMedication.name}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., Lisinopril"
                    className="h-12"
                  />
                </div>
                <div>
                  <Label>Dosage *</Label>
                  <Input
                    value={newMedication.dosage}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        dosage: e.target.value,
                      })
                    }
                    placeholder="e.g., 10mg"
                    className="h-12"
                  />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <select
                    value={newMedication.frequency}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        frequency: e.target.value,
                      })
                    }
                    className="w-full h-12 px-3 rounded-lg border-2 border-border bg-background"
                  >
                    <option>Once daily</option>
                    <option>Twice daily</option>
                    <option>Three times daily</option>
                    <option>As needed</option>
                  </select>
                </div>
                <div>
                  <Label>Time of Day</Label>
                  <Input
                    type="time"
                    value={newMedication.timeOfDay}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        timeOfDay: e.target.value,
                      })
                    }
                    className="h-12"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Instructions</Label>
                  <Textarea
                    value={newMedication.instructions}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        instructions: e.target.value,
                      })
                    }
                    placeholder="e.g., Take with food"
                    className="h-20"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddMedication}
                className="mt-6 btn-large"
                disabled={medsLoading}
              >
                {medsLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Medication"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {medsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </div>
              ) : medications.filter((m) => m.isActive).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active medications
                </p>
              ) : (
                medications
                  .filter((m) => m.isActive)
                  .map((med) => (
                    <div
                      key={med.medicationId}
                      className="p-4 bg-muted rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">
                            {med.medicineName}
                          </h4>
                          <p className="text-muted-foreground mt-1">
                            {med.dosage} • {med.frequency}
                            {med.timeOfDay && ` • ${med.timeOfDay}`}
                          </p>
                          {med.instructions && (
                            <p className="text-sm text-muted-foreground italic mt-2">
                              {med.instructions}
                            </p>
                          )}
                          {med.prescribedByDoctorName && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Prescribed by: {med.prescribedByDoctorName}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            handleDeleteMedication(
                              med.medicationId,
                              med.medicineName
                            )
                          }
                          className="h-9 w-9"
                          disabled={medsLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Send Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your message to the patient..."
                  className="min-h-[150px] text-lg"
                />
                <Button className="btn-large">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Message History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    2 days ago
                  </p>
                  <p>
                    Please continue taking your blood pressure medication as
                    prescribed.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    5 days ago
                  </p>
                  <p>
                    Your latest vitals look good. Keep up the healthy habits!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
