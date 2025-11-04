import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  User, Heart, Activity, AlertTriangle, Pill, MessageSquare,
  ArrowLeft, Settings, Phone, Mail, TrendingUp
} from 'lucide-react';
import {
  getPatientById,
  getVitalRecordsByPatientId,
  getAlertsByPatientId,
  getMedicationsByPatientId,
  getThresholdByPatientId,
} from '@/data/mockData';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function PatientDetail() {
  const { patientId } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const patient = getPatientById(Number(patientId));
  const vitals = getVitalRecordsByPatientId(Number(patientId));
  const alerts = getAlertsByPatientId(Number(patientId));
  const medications = getMedicationsByPatientId(Number(patientId));
  const threshold = getThresholdByPatientId(Number(patientId));

  const [thresholds, setThresholds] = useState(threshold || {
    BPSystolicMin: 110,
    BPSystolicMax: 140,
    BPDiastolicMin: 70,
    BPDiastolicMax: 90,
    HeartRateMin: 60,
    HeartRateMax: 100,
    GlucoseMin: 70,
    GlucoseMax: 130,
    TemperatureMin: 97.0,
    TemperatureMax: 99.5,
  });

  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    timeOfDay: '08:00',
  });

  const latestVital = vitals[0];
  const activeAlerts = alerts.filter(a => a.Status === 'Active');

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Patient Not Found</h1>
        <Link to="/doctor/patients">
          <Button>Back to Patient List</Button>
        </Link>
      </div>
    );
  }

  const handleSaveThresholds = () => {
    toast({
      title: 'Thresholds Updated',
      description: 'Alert thresholds have been saved successfully',
    });
  };

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast({
        title: 'Error',
        description: 'Please fill in all medication details',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Medication Added',
      description: `${newMedication.name} has been prescribed successfully`,
    });

    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'Once daily',
      timeOfDay: '08:00',
    });
  };

  const chartData = vitals.slice(0, 14).reverse().map(v => ({
    date: format(new Date(v.DateLogged), 'MM/dd'),
    systolic: v.BloodPressureSystolic,
    heartRate: v.HeartRate,
    glucose: v.GlucoseLevel,
  }));

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
            <h1 className="text-4xl font-bold">{patient.Name}</h1>
            <p className="text-xl text-muted-foreground">
              {patient.Age} years • {patient.Gender}
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                <p className="text-xl font-semibold mt-1">{patient.Name}</p>
              </div>
              <div>
                <Label className="text-base">Age</Label>
                <p className="text-xl font-semibold mt-1">{patient.Age} years</p>
              </div>
              <div>
                <Label className="text-base">Gender</Label>
                <p className="text-xl font-semibold mt-1">{patient.Gender}</p>
              </div>
              <div>
                <Label className="text-base">Contact</Label>
                <p className="text-xl font-semibold mt-1">{patient.ContactInfo}</p>
              </div>
            </CardContent>
          </Card>

          {/* Latest Vitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Current Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestVital ? (
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Blood Pressure</p>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {latestVital.BloodPressureSystolic}/{latestVital.BloodPressureDiastolic}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">mmHg</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Heart Rate</p>
                      <p className="text-2xl font-bold text-secondary mt-1">
                        {latestVital.HeartRate}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">bpm</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Blood Glucose</p>
                      <p className="text-2xl font-bold text-warning mt-1">
                        {latestVital.GlucoseLevel}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">mg/dL</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="text-2xl font-bold text-alert-high mt-1">
                        {latestVital.Temperature}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">°F</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No vital signs recorded</p>
              )}
            </CardContent>
          </Card>

          {/* Alert Summary */}
          <Card className={activeAlerts.length > 0 ? 'border-destructive border-2' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                Alert Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No active alerts</p>
              ) : (
                <div className="space-y-3">
                  {activeAlerts.map(alert => (
                    <div key={alert.AlertID} className="p-4 bg-destructive/10 rounded-lg border border-destructive">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{alert.AlertType}</h4>
                          <p className="text-sm mt-1">{alert.Description}</p>
                        </div>
                        <Badge variant="destructive">{alert.Severity}</Badge>
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
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  {thresholds && (
                    <>
                      <ReferenceLine y={thresholds.BPSystolicMax} stroke="#ef4444" strokeDasharray="3 3" />
                      <ReferenceLine y={thresholds.BPSystolicMin} stroke="#ef4444" strokeDasharray="3 3" />
                    </>
                  )}
                  <Line type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" strokeWidth={2} />
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
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {thresholds && (
                      <>
                        <ReferenceLine y={thresholds.HeartRateMax} stroke="#ef4444" strokeDasharray="3 3" />
                        <ReferenceLine y={thresholds.HeartRateMin} stroke="#ef4444" strokeDasharray="3 3" />
                      </>
                    )}
                    <Line type="monotone" dataKey="heartRate" stroke="hsl(var(--secondary))" strokeWidth={2} />
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
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {thresholds && (
                      <>
                        <ReferenceLine y={thresholds.GlucoseMax} stroke="#ef4444" strokeDasharray="3 3" />
                        <ReferenceLine y={thresholds.GlucoseMin} stroke="#ef4444" strokeDasharray="3 3" />
                      </>
                    )}
                    <Line type="monotone" dataKey="glucose" stroke="hsl(var(--warning))" strokeWidth={2} />
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
                        value={thresholds.BPSystolicMin}
                        onChange={(e) => setThresholds({...thresholds, BPSystolicMin: Number(e.target.value)})}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>Systolic Max</Label>
                      <Input
                        type="number"
                        value={thresholds.BPSystolicMax}
                        onChange={(e) => setThresholds({...thresholds, BPSystolicMax: Number(e.target.value)})}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>Diastolic Min</Label>
                      <Input
                        type="number"
                        value={thresholds.BPDiastolicMin}
                        onChange={(e) => setThresholds({...thresholds, BPDiastolicMin: Number(e.target.value)})}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>Diastolic Max</Label>
                      <Input
                        type="number"
                        value={thresholds.BPDiastolicMax}
                        onChange={(e) => setThresholds({...thresholds, BPDiastolicMax: Number(e.target.value)})}
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
                        value={thresholds.HeartRateMin}
                        onChange={(e) => setThresholds({...thresholds, HeartRateMin: Number(e.target.value)})}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>HR Max (bpm)</Label>
                      <Input
                        type="number"
                        value={thresholds.HeartRateMax}
                        onChange={(e) => setThresholds({...thresholds, HeartRateMax: Number(e.target.value)})}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>Glucose Min</Label>
                      <Input
                        type="number"
                        value={thresholds.GlucoseMin}
                        onChange={(e) => setThresholds({...thresholds, GlucoseMin: Number(e.target.value)})}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label>Glucose Max</Label>
                      <Input
                        type="number"
                        value={thresholds.GlucoseMax}
                        onChange={(e) => setThresholds({...thresholds, GlucoseMax: Number(e.target.value)})}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveThresholds} className="mt-6 btn-large">
                Save Thresholds
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.AlertID}
                  className={`p-4 rounded-lg ${
                    alert.Severity === 'Critical' ? 'bg-destructive/10 border border-destructive' :
                    alert.Severity === 'High' ? 'bg-orange-100 border border-orange-500' :
                    'bg-yellow-100 border border-yellow-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{alert.AlertType}</h4>
                      <p className="text-sm mt-1">{alert.Description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(alert.Timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <Badge>{alert.Status}</Badge>
                  </div>
                </div>
              ))}
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
                  <Label>Medicine Name</Label>
                  <Input
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                    placeholder="e.g., Lisinopril"
                    className="h-12"
                  />
                </div>
                <div>
                  <Label>Dosage</Label>
                  <Input
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    placeholder="e.g., 10mg"
                    className="h-12"
                  />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <select
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
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
                    onChange={(e) => setNewMedication({...newMedication, timeOfDay: e.target.value})}
                    className="h-12"
                  />
                </div>
              </div>
              <Button onClick={handleAddMedication} className="mt-6 btn-large">
                Add Medication
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {medications.map(med => (
                <div key={med.MedicationID} className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{med.MedicineName}</h4>
                      <p className="text-muted-foreground mt-1">
                        {med.Dosage} • {med.Frequency} • {med.TimeOfDay.join(', ')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
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
                  <p className="text-sm text-muted-foreground mb-2">2 days ago</p>
                  <p>Please continue taking your blood pressure medication as prescribed.</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">5 days ago</p>
                  <p>Your latest vitals look good. Keep up the healthy habits!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
