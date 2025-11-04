import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import { getMedicationsByPatientId } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const MOCK_PATIENT_ID = 1;

export default function Medications() {
  const { toast } = useToast();
  const [medications, setMedications] = useState(getMedicationsByPatientId(MOCK_PATIENT_ID));

  const todayMeds = medications.filter(m => m.TimeOfDay.some(time => {
    const hour = parseInt(time.split(':')[0]);
    const now = new Date().getHours();
    return Math.abs(hour - now) <= 2;
  }));

  const handleMarkTaken = (medId: number) => {
    setMedications(prev =>
      prev.map(m => m.MedicationID === medId ? { ...m, IsTaken: true } : m)
    );
    toast({
      title: 'Medication Recorded',
      description: 'Marked as taken successfully',
    });
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
            todayMeds.map(med => (
              <div
                key={med.MedicationID}
                className="p-6 bg-accent rounded-xl border-2 border-primary/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{med.MedicineName}</h3>
                    <p className="text-lg text-muted-foreground mt-1">{med.Dosage}</p>
                  </div>
                  <Badge
                    variant={med.IsTaken ? 'default' : 'destructive'}
                    className="text-base px-4 py-1"
                  >
                    {med.IsTaken ? 'Taken' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-4 text-lg">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">{med.TimeOfDay.join(', ')}</span>
                </div>
                {!med.IsTaken && (
                  <Button
                    onClick={() => handleMarkTaken(med.MedicationID)}
                    className="w-full btn-large text-lg"
                  >
                    <CheckCircle2 className="h-6 w-6 mr-2" />
                    Mark as Taken
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Weekly Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            This Week's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="font-semibold mb-2 text-lg">{day}</div>
                <div className="space-y-1">
                  {medications.slice(0, 3).map(med => (
                    <div
                      key={`${day}-${med.MedicationID}`}
                      className={`p-2 rounded text-xs ${
                        index < 3 ? 'bg-success/20 text-success' :
                        index === 3 ? 'bg-destructive/20 text-destructive' :
                        'bg-primary/20 text-primary'
                      }`}
                    >
                      {med.MedicineName.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
          {medications.map(med => (
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
                </div>
                <div className="flex gap-2">
                  {med.IsTaken ? (
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  ) : (
                    <XCircle className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          ))}
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
                {Math.round((medications.filter(m => m.IsTaken).length / medications.length) * 100)}%
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
