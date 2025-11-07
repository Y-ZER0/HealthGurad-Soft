import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, Activity, Pill, TrendingUp } from 'lucide-react';
import { mockPatients, getActiveAlerts, getDoctorById } from '@/data/mockData';
import { format } from 'date-fns';

const MOCK_DOCTOR_ID = 1;

export default function DoctorDashboard() {
  const doctor = getDoctorById(MOCK_DOCTOR_ID);
  const myPatients = mockPatients.filter(p => p.AssignedDoctorID === MOCK_DOCTOR_ID);
  const activeAlerts = getActiveAlerts();
  const criticalAlerts = activeAlerts.filter(a => a.Severity === 'Critical');
  const highAlerts = activeAlerts.filter(a => a.Severity === 'High');

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome, {doctor?.Name}!</h1>
        <p className="text-xl opacity-90">{doctor?.Specialty}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-primary border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Total Patients</p>
                <p className="text-4xl font-bold text-primary mt-2">{myPatients.length}</p>
              </div>
              <Users className="h-12 w-12 text-primary/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Critical Alerts</p>
                <p className="text-4xl font-bold text-destructive mt-2">{criticalAlerts.length}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-destructive/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">High Priority</p>
                <p className="text-4xl font-bold text-warning mt-2">{highAlerts.length}</p>
              </div>
              <Activity className="h-12 w-12 text-warning/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Active Patients</p>
                <p className="text-4xl font-bold text-secondary mt-2">{myPatients.length}</p>
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
              <p className="text-xl text-muted-foreground">No critical alerts at this time</p>
            </div>
          ) : (
            criticalAlerts.map(alert => {
              const patient = mockPatients.find(p => p.PatientID === alert.PatientID);
              return (
                <div key={alert.AlertID} className="alert-critical p-5 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-xl font-bold">{patient?.Name}</h4>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded">
                          Age {patient?.Age}
                        </span>
                      </div>
                      <p className="text-lg font-semibold mb-1">{alert.AlertType}</p>
                      <p className="mb-2">{alert.Description}</p>
                      <p className="text-sm opacity-75">
                        {format(new Date(alert.Timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <Link to={`/doctor/patient/${patient?.PatientID}`}>
                      <Button variant="secondary" className="btn-large">
                        View Patient
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
          <Link to="/doctor/alerts">
            <Button variant="outline" className="w-full btn-large">
              View All Alerts
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Recent Patient Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myPatients.slice(0, 5).map((patient, index) => (
              <div key={patient.PatientID} className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{patient.Name}</h4>
                  <p className="text-muted-foreground">
                    {index === 0 ? 'Logged vitals 2 hours ago' :
                     index === 1 ? 'Missed medication - 5 hours ago' :
                     index === 2 ? 'High blood pressure alert - Yesterday' :
                     'Last activity 2 days ago'}
                  </p>
                </div>
                <Link to={`/doctor/patient/${patient.PatientID}`}>
                  <Button variant="outline">View</Button>
                </Link>
              </div>
            ))}
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
              <p className="text-muted-foreground mt-2">View and manage all patients</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/doctor/alerts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-warning border-2">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-warning" />
              <h3 className="text-xl font-semibold">Review Alerts</h3>
              <p className="text-muted-foreground mt-2">Check all patient alerts</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
