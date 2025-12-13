import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Filter,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useAlerts } from "@/hooks/useAlerts";

export default function Alerts() {
  const { user } = useAuth();
  const { alerts, fetchAlertsByPatient, isLoading } = useAlerts();
  const [filter, setFilter] = useState<string>("all");

  // Fetch alerts on mount
  useEffect(() => {
    if (user?.profileId) {
      fetchAlertsByPatient(user.profileId);
    }
  }, [user?.profileId]);

  // Separate active and resolved alerts
  const activeAlerts = useMemo(
    () => alerts.filter((a) => a.status === "Active"),
    [alerts]
  );

  const resolvedAlerts = useMemo(
    () => alerts.filter((a) => a.status === "Resolved"),
    [alerts]
  );

  // Count alerts by severity
  const alertCounts = useMemo(
    () => ({
      critical: activeAlerts.filter((a) => a.severity === "Critical").length,
      high: activeAlerts.filter((a) => a.severity === "High").length,
      medium: activeAlerts.filter((a) => a.severity === "Medium").length,
      resolved: resolvedAlerts.length,
    }),
    [activeAlerts, resolvedAlerts]
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive";
      case "High":
        return "alert-high";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "muted";
    }
  };

  const AlertCard = ({ alert, showActions = true }: any) => {
    const colorClass = getSeverityColor(alert.severity);

    return (
      <Card
        className={`border-2 ${
          alert.severity === "Critical"
            ? "border-destructive shadow-lg"
            : alert.severity === "High"
            ? "border-orange-500"
            : alert.severity === "Medium"
            ? "border-yellow-500"
            : "border-green-500"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-8 w-8 text-${colorClass}`} />
              <div>
                <h3 className="text-2xl font-bold">{alert.alertType}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {alert.timestampFormatted}
                </p>
              </div>
            </div>
            <Badge
              variant={
                alert.severity === "Critical" ? "destructive" : "default"
              }
              className="text-base px-3 py-1"
            >
              {alert.severity}
            </Badge>
          </div>

          <p className="text-lg mb-4">{alert.description}</p>

          {alert.status === "Resolved" && alert.resolvedByDoctorName && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-success font-semibold">
                <CheckCircle className="h-5 w-5" />
                Resolved by {alert.resolvedByDoctorName}
              </div>
              {alert.resolvedAt && (
                <p className="text-sm text-muted-foreground">
                  Resolved on{" "}
                  {format(new Date(alert.resolvedAt), "MMM d, yyyy - h:mm a")}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const filteredActiveAlerts = useMemo(() => {
    return filter === "all"
      ? activeAlerts
      : activeAlerts.filter((a) => a.severity === filter);
  }, [activeAlerts, filter]);

  const filteredResolvedAlerts = useMemo(() => {
    return filter === "all"
      ? resolvedAlerts
      : resolvedAlerts.filter((a) => a.severity === filter);
  }, [resolvedAlerts, filter]);

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Health Alerts</h1>
          <p className="text-xl text-muted-foreground">
            Monitor and manage your health notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-12 px-4 rounded-lg border-2 border-border bg-background text-lg"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-destructive/10 border-destructive border-2">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-destructive">
              {alertCounts.critical}
            </div>
            <p className="text-lg font-semibold mt-2">Critical</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 border-orange-500 border-2">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-orange-700">
              {alertCounts.high}
            </div>
            <p className="text-lg font-semibold mt-2">High</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100 border-yellow-500 border-2">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-yellow-700">
              {alertCounts.medium}
            </div>
            <p className="text-lg font-semibold mt-2">Medium</p>
          </CardContent>
        </Card>
        <Card className="bg-success/10 border-success border-2">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-success">
              {alertCounts.resolved}
            </div>
            <p className="text-lg font-semibold mt-2">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-14">
          <TabsTrigger value="active" className="text-lg">
            <Bell className="h-5 w-5 mr-2" />
            Active Alerts ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="text-lg">
            <CheckCircle className="h-5 w-5 mr-2" />
            Resolved ({resolvedAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filteredActiveAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-20 w-20 mx-auto mb-4 text-success" />
                <h3 className="text-2xl font-bold mb-2">No Active Alerts</h3>
                <p className="text-lg text-muted-foreground">
                  All your health metrics are within normal ranges
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredActiveAlerts
              .sort((a, b) => {
                const severityOrder = {
                  Critical: 0,
                  High: 1,
                  Medium: 2,
                  Low: 3,
                };
                return (
                  severityOrder[a.severity as keyof typeof severityOrder] -
                  severityOrder[b.severity as keyof typeof severityOrder]
                );
              })
              .map((alert) => <AlertCard key={alert.alertId} alert={alert} />)
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {filteredResolvedAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">No Resolved Alerts</h3>
                <p className="text-lg text-muted-foreground">
                  Past resolved alerts will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredResolvedAlerts.map((alert) => (
              <AlertCard
                key={alert.alertId}
                alert={alert}
                showActions={false}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
