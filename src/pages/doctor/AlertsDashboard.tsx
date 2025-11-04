import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Filter, Users } from 'lucide-react';
import { getActiveAlerts, mockAlerts, getPatientById } from '@/data/mockData';
import { format } from 'date-fns';

export default function AlertsDashboard() {
  const [filter, setFilter] = useState<string>('all');
  const activeAlerts = getActiveAlerts();

  const criticalAlerts = activeAlerts.filter(a => a.Severity === 'Critical');
  const highAlerts = activeAlerts.filter(a => a.Severity === 'High');
  const mediumAlerts = activeAlerts.filter(a => a.Severity === 'Medium');
  const resolvedAlerts = mockAlerts.filter(a => a.Status === 'Resolved');

  const filteredActiveAlerts = filter === 'all' ? activeAlerts :
    activeAlerts.filter(a => a.Severity === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Alert Management</h1>
          <p className="text-xl text-muted-foreground">
            Monitor and respond to patient alerts
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

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-destructive border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Critical</p>
                <p className="text-4xl font-bold text-destructive mt-2">{criticalAlerts.length}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-destructive/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500 border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">High Priority</p>
                <p className="text-4xl font-bold text-orange-600 mt-2">{highAlerts.length}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-orange-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500 border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Medium</p>
                <p className="text-4xl font-bold text-yellow-600 mt-2">{mediumAlerts.length}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-yellow-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-success border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Resolved</p>
                <p className="text-4xl font-bold text-success mt-2">{resolvedAlerts.length}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-success/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-14">
          <TabsTrigger value="active" className="text-lg">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Active Alerts ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="text-lg">
            <Users className="h-5 w-5 mr-2" />
            Resolved ({resolvedAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filteredActiveAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertTriangle className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">No Active Alerts</h3>
                <p className="text-lg text-muted-foreground">
                  All patients are within safe parameters
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredActiveAlerts
              .sort((a, b) => {
                const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
                return severityOrder[a.Severity as keyof typeof severityOrder] -
                       severityOrder[b.Severity as keyof typeof severityOrder];
              })
              .map(alert => {
                const patient = getPatientById(alert.PatientID);
                
                return (
                  <Card
                    key={alert.AlertID}
                    className={`border-2 ${
                      alert.Severity === 'Critical' ? 'border-destructive shadow-lg' :
                      alert.Severity === 'High' ? 'border-orange-500' :
                      alert.Severity === 'Medium' ? 'border-yellow-500' :
                      'border-green-500'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                              alert.Severity === 'Critical' ? 'bg-destructive/20 text-destructive' :
                              alert.Severity === 'High' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {patient?.Name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-bold">{patient?.Name}</h3>
                                <Badge variant="outline" className="text-sm">
                                  {patient?.Age} yrs
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(alert.Timestamp), 'MMM d, yyyy - h:mm a')}
                              </p>
                            </div>
                          </div>

                          <div className="ml-15 space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xl font-semibold">{alert.AlertType}</h4>
                              <Badge variant={alert.Severity === 'Critical' ? 'destructive' : 'default'} className="text-base">
                                {alert.Severity}
                              </Badge>
                            </div>
                            <p className="text-lg">{alert.Description}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/doctor/patient/${patient?.PatientID}`}>
                            <Button className="btn-large">
                              View Patient
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedAlerts.map(alert => {
            const patient = getPatientById(alert.PatientID);
            
            return (
              <Card key={alert.AlertID} className="border-success">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center text-lg font-bold">
                          {patient?.Name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{patient?.Name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(alert.Timestamp), 'MMM d, yyyy - h:mm a')}
                          </p>
                        </div>
                      </div>

                      <div className="ml-15 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-semibold">{alert.AlertType}</h4>
                          <Badge variant="default" className="bg-success text-base">
                            Resolved
                          </Badge>
                        </div>
                        <p className="text-lg">{alert.Description}</p>
                      </div>
                    </div>

                    <Link to={`/doctor/patient/${patient?.PatientID}`}>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
