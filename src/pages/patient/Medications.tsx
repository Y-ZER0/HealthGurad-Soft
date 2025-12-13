import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMedications } from "@/hooks/useMedications";

export default function Medications() {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    medications,
    todaysMedications,
    weeklyAdherence,
    fetchMedicationsByPatient,
    fetchTodaysMedications,
    fetchWeeklyAdherence,
    markMedicationAsTaken,
    markMedicationAsMissed,
    isLoading,
  } = useMedications();

  // Fetch data on mount
  useEffect(() => {
    if (user?.profileId) {
      fetchMedicationsByPatient(user.profileId);
      fetchTodaysMedications(user.profileId);
      fetchWeeklyAdherence(user.profileId);
    }
  }, [user?.profileId]);

  // Get medications that are due now or soon (pending status)
  const dueSoonMeds = useMemo(() => {
    return todaysMedications.filter((med) => med.status === "Pending");
  }, [todaysMedications]);

  const handleMarkTaken = async (
    medicationId: number,
    scheduledTime: string
  ) => {
    try {
      await markMedicationAsTaken(medicationId, scheduledTime);
      toast({
        title: "Medication Recorded",
        description: "Marked as taken successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark medication as taken",
        variant: "destructive",
      });
    }
  };

  const handleMarkMissed = async (
    medicationId: number,
    scheduledTime: string
  ) => {
    try {
      await markMedicationAsMissed(medicationId, scheduledTime);
      toast({
        title: "Medication Updated",
        description: "Marked as missed",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark medication as missed",
        variant: "destructive",
      });
    }
  };

  // Get medication status for all medications display
  const getMedicationStatus = (medicationId: number) => {
    const medToday = todaysMedications.filter(
      (med) => med.medicationId === medicationId
    );

    if (medToday.length === 0) return { status: "Pending", allTaken: false };

    const allTaken = medToday.every((med) => med.status === "Taken");
    const anyPending = medToday.some((med) => med.status === "Pending");
    const anyMissed = medToday.some((med) => med.status === "Missed");

    if (allTaken) return { status: "Taken", allTaken: true };
    if (anyMissed) return { status: "Missed", allTaken: false };
    if (anyPending) return { status: "Pending", allTaken: false };
    return { status: "Pending", allTaken: false };
  };

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
        <h1 className="text-4xl font-bold mb-2">Medication Schedule</h1>
        <p className="text-xl text-muted-foreground">
          Manage and track your medications
        </p>
      </div>

      {/* Today's Medications - Due Now or Soon */}
      <Card className="border-primary border-2">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Due Today ({dueSoonMeds.length} Pending)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dueSoonMeds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-success" />
              <p className="text-xl">
                All caught up! No pending medications right now.
              </p>
            </div>
          ) : (
            dueSoonMeds.map((med) => (
              <div
                key={`${med.medicationId}-${med.scheduledTime}`}
                className="p-6 bg-accent rounded-xl border-2 border-primary/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">
                      {med.medicineName}
                    </h3>
                    <p className="text-lg text-muted-foreground mt-1">
                      {med.dosage}
                    </p>
                  </div>
                  <Badge
                    variant={med.status === "Taken" ? "default" : "destructive"}
                    className="text-base px-4 py-1"
                  >
                    {med.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-4 text-lg">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">
                    Scheduled: {med.timeOfDay}
                  </span>
                </div>
                {med.status === "Pending" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleMarkTaken(med.medicationId, med.scheduledTime)
                      }
                      className="flex-1 btn-large text-lg"
                      disabled={isLoading}
                    >
                      <CheckCircle2 className="h-6 w-6 mr-2" />
                      Mark as Taken
                    </Button>
                    <Button
                      onClick={() =>
                        handleMarkMissed(med.medicationId, med.scheduledTime)
                      }
                      variant="outline"
                      className="flex-1 btn-large text-lg"
                      disabled={isLoading}
                    >
                      <XCircle className="h-6 w-6 mr-2" />
                      Mark as Missed
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* All Medications List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" />
            All Current Medications (
            {medications.filter((m) => m.isActive).length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {medications.filter((med) => med.isActive).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Pill className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl">No active medications</p>
            </div>
          ) : (
            medications
              .filter((med) => med.isActive)
              .map((med) => {
                const { status, allTaken } = getMedicationStatus(
                  med.medicationId
                );
                return (
                  <div
                    key={med.medicationId}
                    className="p-5 bg-muted rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="text-xl font-semibold">
                          {med.medicineName}
                        </h4>
                        <div className="flex gap-4 text-muted-foreground">
                          <span className="font-semibold">{med.dosage}</span>
                          <span>•</span>
                          <span>{med.frequency}</span>
                          {med.timeOfDay && (
                            <>
                              <span>•</span>
                              <span>{med.timeOfDay}</span>
                            </>
                          )}
                        </div>
                        {med.instructions && (
                          <p className="text-sm text-muted-foreground italic mt-2">
                            {med.instructions}
                          </p>
                        )}
                        {med.prescribedByDoctorName && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Prescribed by: {med.prescribedByDoctorName}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {allTaken ? (
                          <CheckCircle2 className="h-8 w-8 text-success" />
                        ) : status === "Missed" ? (
                          <XCircle className="h-8 w-8 text-destructive" />
                        ) : (
                          <Clock className="h-8 w-8 text-warning" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </CardContent>
      </Card>

      {/* Medication Adherence */}
      <Card className="bg-accent">
        <CardHeader>
          <CardTitle className="text-2xl">Medication Adherence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-5xl font-bold text-primary">
                {weeklyAdherence?.adherencePercentage || 0}%
              </p>
              <p className="text-lg text-muted-foreground mt-2">
                {weeklyAdherence?.period || "This Week"}
              </p>
              {weeklyAdherence && (
                <p className="text-sm text-muted-foreground mt-1">
                  {weeklyAdherence.takenDoses} of{" "}
                  {weeklyAdherence.totalScheduledDoses} doses taken
                </p>
              )}
            </div>
            <CheckCircle2 className="h-24 w-24 text-success/30" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
