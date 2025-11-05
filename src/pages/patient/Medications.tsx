import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { getMedicationsByPatientId, getMedicationLogsByPatientId, mockMedicationLogs } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const MOCK_PATIENT_ID = 1;

export default function Medications() {
  const { toast } = useToast();
  const medications = getMedicationsByPatientId(MOCK_PATIENT_ID);
  const [medicationLogs, setMedicationLogs] = useState(getMedicationLogsByPatientId(MOCK_PATIENT_ID));

  // Get medication logs due now or soon (within 2 hours)
  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  
  const dueSoonLogs = medicationLogs.filter(log => {
    const scheduledTime = new Date(log.ScheduledTime);
    return scheduledTime <= twoHoursLater && scheduledTime >= new Date(now.getTime() - 2 * 60 * 60 * 1000) && log.Status === 'Pending';
  });

  // Get medications that are due soon
  const todayMeds = medications.filter(med => 
    dueSoonLogs.some(log => log.MedicationID === med.MedicationID)
  );

  const handleMarkTaken = (medId: number, logId: number) => {
    const updatedLogs = medicationLogs.map(log => 
      log.LogID === logId ? { ...log, Status: 'Taken' as const, TakenTime: new Date().toISOString() } : log
    );
    setMedicationLogs(updatedLogs);
    
    // Also update the global mock data
    const globalLogIndex = mockMedicationLogs.findIndex(log => log.LogID === logId);
    if (globalLogIndex !== -1) {
      mockMedicationLogs[globalLogIndex].Status = 'Taken';
      mockMedicationLogs[globalLogIndex].TakenTime = new Date().toISOString();
    }
    
    toast({
      title: 'Medication Recorded',
      description: 'Marked as taken successfully',
    });
  };

  // Get medication status for display
  const getMedicationStatus = (medicationId: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = medicationLogs.filter(log => {
      const logDate = new Date(log.ScheduledTime);
      logDate.setHours(0, 0, 0, 0);
      return log.MedicationID === medicationId && logDate.getTime() === today.getTime();
    });

    if (todayLogs.length === 0) return { status: 'Pending', allTaken: false };
    
    const allTaken = todayLogs.every(log => log.Status === 'Taken');
    const anyPending = todayLogs.some(log => log.Status === 'Pending');
    
    if (allTaken) return { status: 'Taken', allTaken: true };
    if (anyPending) return { status: 'Pending', allTaken: false };
    return { status: 'Missed', allTaken: false };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Medication Schedule</h1>
        <p className="text-xl text-muted-foreground">
          Manage and track your medications
        </p>
      </div>

      {/* Today's Medications */}
      <Card className="border-primary border-2">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Due Now or Soon ({todayMeds.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayMeds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-success" />
              <p className="text-xl">All caught up! No medications due right now.</p>
            </div>
           ) : (
            todayMeds.map(med => {
              const dueLogs = dueSoonLogs.filter(log => log.MedicationID === med.MedicationID);
              return (
                <div key={med.MedicationID} className="space-y-3">
                  {dueLogs.map(log => (
                    <div
                      key={log.LogID}
                      className="p-6 bg-accent rounded-xl border-2 border-primary/20"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-primary">{med.MedicineName}</h3>
                          <p className="text-lg text-muted-foreground mt-1">{med.Dosage}</p>
                        </div>
                        <Badge
                          variant={log.Status === 'Taken' ? 'default' : 'destructive'}
                          className="text-base px-4 py-1"
                        >
                          {log.Status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-4 text-lg">
                        <Clock className="h-5 w-5" />
                        <span className="font-semibold">
                          Scheduled: {format(new Date(log.ScheduledTime), 'h:mm a')}
                        </span>
                      </div>
                      {log.Status === 'Pending' && (
                        <Button
                          onClick={() => handleMarkTaken(med.MedicationID, log.LogID)}
                          className="w-full btn-large text-lg"
                        >
                          <CheckCircle2 className="h-6 w-6 mr-2" />
                          Mark as Taken
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              );
            })
           )}
        </CardContent>
      </Card>
      {/* All Medications List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" />
            All Current Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {medications.map(med => {
            const { status, allTaken } = getMedicationStatus(med.MedicationID);
            return (
              <div
                key={med.MedicationID}
                className="p-5 bg-muted rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold">{med.MedicineName}</h4>
                    <div className="flex gap-4 text-muted-foreground">
                      <span className="font-semibold">{med.Dosage}</span>
                      <span>•</span>
                      <span>{med.Frequency}</span>
                      <span>•</span>
                      <span>{med.TimeOfDay.join(', ')}</span>
                    </div>
                    {med.Instructions && (
                      <p className="text-sm text-muted-foreground italic mt-2">
                        {med.Instructions}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {allTaken ? (
                      <CheckCircle2 className="h-8 w-8 text-success" />
                    ) : status === 'Missed' ? (
                      <XCircle className="h-8 w-8 text-destructive" />
                    ) : (
                      <Clock className="h-8 w-8 text-warning" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
                {(() => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  const weekLogs = medicationLogs.filter(log => new Date(log.ScheduledTime) >= weekAgo);
                  const takenLogs = weekLogs.filter(log => log.Status === 'Taken');
                  const completedLogs = weekLogs.filter(log => log.Status !== 'Pending');
                  return completedLogs.length > 0 ? Math.round((takenLogs.length / completedLogs.length) * 100) : 100;
                })()}%
              </p>
              <p className="text-lg text-muted-foreground mt-2">Taken on time this week</p>
            </div>
            <CheckCircle2 className="h-24 w-24 text-success/30" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
