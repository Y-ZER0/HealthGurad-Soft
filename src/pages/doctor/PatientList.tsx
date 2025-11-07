import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, AlertTriangle, Activity, Filter } from 'lucide-react';
import { mockPatients, getAlertsByPatientId, getVitalRecordsByPatientId } from '@/data/mockData';
import { format } from 'date-fns';

const MOCK_DOCTOR_ID = 1;

export default function PatientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const myPatients = mockPatients.filter(p => p.AssignedDoctorID === MOCK_DOCTOR_ID);

  const getPatientStatus = (patientId: number) => {
    const alerts = getAlertsByPatientId(patientId).filter(a => a.Status === 'Active');
    const criticalAlerts = alerts.filter(a => a.Severity === 'Critical' || a.Severity === 'High');
    
    if (criticalAlerts.length > 0) return 'critical';
    if (alerts.length > 0) return 'warning';
    return 'good';
  };

  const filteredPatients = myPatients.filter(patient => {
    const matchesSearch = patient.Name.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getPatientStatus(patient.PatientID);
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'alerts' && status !== 'good') ||
      (filterStatus === 'critical' && status === 'critical');
    
    return matchesSearch && matchesFilter;
  });

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
                <option value="all">All Patients</option>
                <option value="alerts">With Active Alerts</option>
                <option value="critical">Critical Only</option>
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
                <p className="text-sm text-muted-foreground font-semibold">Needs Attention</p>
                <p className="text-4xl font-bold text-destructive mt-2">
                  {myPatients.filter(p => getPatientStatus(p.PatientID) === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-12 w-12 text-destructive/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-success border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Stable</p>
                <p className="text-4xl font-bold text-success mt-2">
                  {myPatients.filter(p => getPatientStatus(p.PatientID) === 'good').length}
                </p>
              </div>
              <Activity className="h-12 w-12 text-success/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Table */}
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
                <p className="text-xl text-muted-foreground">No patients found</p>
              </div>
            ) : (
              filteredPatients.map(patient => {
                const alerts = getAlertsByPatientId(patient.PatientID).filter(a => a.Status === 'Active');
                const vitals = getVitalRecordsByPatientId(patient.PatientID);
                const latestVital = vitals[0];
                const status = getPatientStatus(patient.PatientID);

                return (
                  <Card
                    key={patient.PatientID}
                    className={`hover:shadow-lg transition-shadow ${
                      status === 'critical' ? 'border-destructive border-2' :
                      status === 'warning' ? 'border-warning border-2' :
                      'border-success'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                            status === 'critical' ? 'bg-destructive/20 text-destructive' :
                            status === 'warning' ? 'bg-warning/20 text-warning' :
                            'bg-success/20 text-success'
                          }`}>
                            {patient.Name.split(' ').map(n => n[0]).join('')}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold">{patient.Name}</h3>
                              <Badge variant="outline" className="text-base">
                                {patient.Age} yrs
                              </Badge>
                              <Badge variant="outline" className="text-base">
                                {patient.Gender}
                              </Badge>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Last Vitals</p>
                                <p className="font-semibold text-base">
                                  {latestVital ? format(new Date(latestVital.DateLogged), 'MMM d, h:mm a') : 'No data'}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Active Alerts</p>
                                <p className={`font-bold text-xl ${
                                  alerts.length > 0 ? 'text-destructive' : 'text-success'
                                }`}>
                                  {alerts.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/doctor/patient/${patient.PatientID}`}>
                            <Button className="btn-large">
                              View Details
                            </Button>
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
