import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  AlertTriangle,
  Activity,
  Filter,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { usePatient } from "@/hooks/usePatient";

export default function PatientList() {
  const { user } = useAuth();
  const { patients, fetchPatientsByDoctor, isLoading } = usePatient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch patients on mount
  useEffect(() => {
    if (user?.profileId) {
      fetchPatientsByDoctor(user.profileId);
    }
  }, [user?.profileId]);

  // Determine patient status based on alerts
  const getPatientStatus = (activeAlertsCount: number) => {
    if (activeAlertsCount >= 3) return "critical";
    if (activeAlertsCount > 0) return "warning";
    return "good";
  };

  // Filter patients based on search and filter
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch = patient.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const status = getPatientStatus(patient.activeAlertsCount);

      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "alerts" && status !== "good") ||
        (filterStatus === "critical" && status === "critical");

      return matchesSearch && matchesFilter;
    });
  }, [patients, searchTerm, filterStatus]);

  // Count patients by status
  const statusCounts = useMemo(
    () => ({
      total: patients.length,
      withAlerts: patients.filter((p) => p.activeAlertsCount > 0).length,
      critical: patients.filter((p) => p.activeAlertsCount >= 3).length,
    }),
    [patients]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Patient Management</h1>
        <p className="text-xl text-muted-foreground">
          Monitor and manage your patients
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search patients by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-14 text-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-14 px-4 rounded-lg border-2 border-border bg-background text-lg"
              >
                <option value="all">All Patients ({statusCounts.total})</option>
                <option value="alerts">
                  With Active Alerts ({statusCounts.withAlerts})
                </option>
                <option value="critical">
                  Critical Only ({statusCounts.critical})
                </option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-primary border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">
                  Total Patients
                </p>
                <p className="text-4xl font-bold text-primary mt-2">
                  {statusCounts.total}
                </p>
              </div>
              <Users className="h-12 w-12 text-primary/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">
                  With Alerts
                </p>
                <p className="text-4xl font-bold text-warning mt-2">
                  {statusCounts.withAlerts}
                </p>
              </div>
              <AlertTriangle className="h-12 w-12 text-warning/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">
                  Critical Status
                </p>
                <p className="text-4xl font-bold text-destructive mt-2">
                  {statusCounts.critical}
                </p>
              </div>
              <Activity className="h-12 w-12 text-destructive/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Patients ({filteredPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">
                  {searchTerm || filterStatus !== "all"
                    ? "No patients match your filters"
                    : "No patients assigned yet"}
                </p>
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const status = getPatientStatus(patient.activeAlertsCount);

                return (
                  <Card
                    key={patient.patientId}
                    className={`hover:shadow-lg transition-shadow ${
                      status === "critical"
                        ? "border-destructive border-2"
                        : status === "warning"
                        ? "border-warning border-2"
                        : "border-success"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                              status === "critical"
                                ? "bg-destructive/20 text-destructive"
                                : status === "warning"
                                ? "bg-warning/20 text-warning"
                                : "bg-success/20 text-success"
                            }`}
                          >
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold">
                                {patient.name}
                              </h3>
                              <Badge variant="outline" className="text-base">
                                {patient.age} yrs
                              </Badge>
                              <Badge variant="outline" className="text-base">
                                {patient.gender}
                              </Badge>
                              {patient.assignedDoctorName && (
                                <Badge variant="secondary" className="text-sm">
                                  Dr. {patient.assignedDoctorName}
                                </Badge>
                              )}
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Contact</p>
                                <p className="font-semibold text-base truncate">
                                  {patient.contactInfo}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Last Vitals
                                </p>
                                <p className="font-semibold text-base">
                                  {patient.lastVitalRecordDate
                                    ? format(
                                        new Date(patient.lastVitalRecordDate),
                                        "MMM d, h:mm a"
                                      )
                                    : "No data"}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Active Alerts
                                </p>
                                <p
                                  className={`font-bold text-xl ${
                                    patient.activeAlertsCount > 0
                                      ? "text-destructive"
                                      : "text-success"
                                  }`}
                                >
                                  {patient.activeAlertsCount}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/doctor/patient/${patient.patientId}`}>
                            <Button className="btn-large">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
