import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Droplets, Thermometer, AlertTriangle, Pill, TrendingUp } from 'lucide-react';
import { getVitalRecordsByPatientId, getMedicationsByPatientId, getAlertsByPatientId } from '@/data/mockData';
import { format } from 'date-fns';

const MOCK_PATIENT_ID = 1;

export default function PatientDashboard() {
  const vitals = getVitalRecordsByPatientId(MOCK_PATIENT_ID);
  const latestVitals = vitals[0];
  const medications = getMedicationsByPatientId(MOCK_PATIENT_ID);
  const alerts = getAlertsByPatientId(MOCK_PATIENT_ID).filter(a => a.Status === 'Active');
  const todayMedications = medications.slice(0, 3);

  const getVitalStatus = (value: number, min: number, max: number) => {
    if (value < min || value > max) return 'destructive';
    if (value < min + 5 || value > max - 5) return 'warning';
    return 'success';
  };

  const VitalCard = ({ title, value, unit, icon: Icon, status }: any) => (
    <Card className={`health-stat-card ${
      status === 'destructive' ? 'border-destructive' :
      status === 'warning' ? 'border-warning' :
      'border-success'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${
          status === 'destructive' ? 'text-destructive' :
          status === 'warning' ? 'text-warning' :
          'text-success'
        }`}>
          {value} <span className="text-xl">{unit}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {latestVitals && format(new Date(latestVitals.DateLogged), 'MMM d, h:mm a')}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome, Robert!</h1>
        <p className="text-xl opacity-90">Here's your health overview for today</p>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card className="border-destructive border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.AlertID}
                className={`p-4 rounded-lg ${
                  alert.Severity === 'Critical' ? 'alert-critical' :
                  alert.Severity === 'High' ? 'alert-high' :
                  alert.Severity === 'Medium' ? 'alert-warning' :
                  'alert-success'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{alert.AlertType}</h4>
                    <p className="mt-1">{alert.Description}</p>
                    <p className="text-sm mt-2 opacity-75">
                      {format(new Date(alert.Timestamp), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/20 font-semibold text-sm">
                    {alert.Severity}
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

      {/* Quick Stats */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Latest Vital Signs
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestVitals && (
            <>
              <VitalCard
                title="Blood Pressure"
                value={`${latestVitals.BloodPressureSystolic}/${latestVitals.BloodPressureDiastolic}`}
                unit="mmHg"
                icon={Heart}
                status={getVitalStatus(latestVitals.BloodPressureSystolic, 110, 140)}
              />
              <VitalCard
                title="Heart Rate"
                value={latestVitals.HeartRate}
                unit="bpm"
                icon={Activity}
                status={getVitalStatus(latestVitals.HeartRate, 60, 100)}
              />
              <VitalCard
                title="Blood Glucose"
                value={latestVitals.GlucoseLevel}
                unit="mg/dL"
                icon={Droplets}
                status={getVitalStatus(latestVitals.GlucoseLevel, 70, 130)}
              />
              <VitalCard
                title="Temperature"
                value={latestVitals.Temperature}
                unit="°F"
                icon={Thermometer}
                status={getVitalStatus(latestVitals.Temperature, 97, 99.5)}
              />
            </>
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
          {todayMedications.map(med => (
            <div
              key={med.MedicationID}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div>
                <h4 className="font-semibold text-lg">{med.MedicineName}</h4>
                <p className="text-muted-foreground">{med.Dosage} - {med.TimeOfDay.join(', ')}</p>
              </div>
              <div className={`px-3 py-1 rounded-full font-semibold ${
                med.IsTaken ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'
              }`}>
                {med.IsTaken ? 'Taken' : 'Pending'}
              </div>
            </div>
          ))}
          <Link to="/medications">
            <Button variant="outline" className="w-full btn-large">
              View All Medications
            </Button>
          </Link>
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
          <Button variant="secondary" className="w-full btn-large h-24 text-xl" size="lg">
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
