import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Bell, CheckCircle, Filter } from 'lucide-react';
import { getAlertsByPatientId } from '@/data/mockData';
import { format } from 'date-fns';

const MOCK_PATIENT_ID = 1;

export default function Alerts() {
  const [alerts, setAlerts] = useState(getAlertsByPatientId(MOCK_PATIENT_ID));
  const [filter, setFilter] = useState<string>('all');

  const activeAlerts = alerts.filter(a => a.Status === 'Active');
  const resolvedAlerts = alerts.filter(a => a.Status === 'Resolved');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'alert-high';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'muted';
    }
  };

  const AlertCard = ({ alert, showActions = true }: any) => {
    const colorClass = getSeverityColor(alert.Severity);
    
    return (
      <Card className={`border-2 ${
        alert.Severity === 'Critical' ? 'border-destructive shadow-lg' :
        alert.Severity === 'High' ? 'border-orange-500' :
        alert.Severity === 'Medium' ? 'border-yellow-500' :
        'border-green-500'
      }`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-8 w-8 text-${colorClass}`} />
              <div>
                <h3 className="text-2xl font-bold">{alert.AlertType}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(alert.Timestamp), 'MMM d, yyyy - h:mm a')}
                </p>
              </div>
            </div>
            <Badge variant={alert.Severity === 'Critical' ? 'destructive' : 'default'} className="text-base px-3 py-1">
              {alert.Severity}
            </Badge>
          </div>

          <p className="text-lg mb-4">{alert.Description}</p>

          {alert.Status === 'Resolved' && alert.ResolvedBy && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-success font-semibold">
                <CheckCircle className="h-5 w-5" />
                Resolved by Doctor
              </div>
              {alert.ResolvedAt && (
                <p className="text-sm text-muted-foreground">
                  Resolved on {format(new Date(alert.ResolvedAt), 'MMM d, yyyy - h:mm a')}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const filteredActiveAlerts = filter === 'all' ? activeAlerts : 
    activeAlerts.filter(a => a.Severity === filter);

  const filteredResolvedAlerts = filter === 'all' ? resolvedAlerts :
    resolvedAlerts.filter(a => a.Severity === filter);

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
              {activeAlerts.filter(a => a.Severity === 'Critical').length}
            </div>
            <p className="text-lg font-semibold mt-2">Critical</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 border-orange-500 border-2">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-orange-700">
              {activeAlerts.filter(a => a.Severity === 'High').length}
            </div>
            <p className="text-lg font-semibold mt-2">High</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100 border-yellow-500 border-2">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-yellow-700">
              {activeAlerts.filter(a => a.Severity === 'Medium').length}
            </div>
            <p className="text-lg font-semibold mt-2">Medium</p>
          </CardContent>
        </Card>
        <Card className="bg-success/10 border-success border-2">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-success">
              {resolvedAlerts.length}
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
                const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
                return severityOrder[a.Severity as keyof typeof severityOrder] - 
                       severityOrder[b.Severity as keyof typeof severityOrder];
              })
              .map(alert => <AlertCard key={alert.AlertID} alert={alert} />)
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
            filteredResolvedAlerts.map(alert => (
              <AlertCard key={alert.AlertID} alert={alert} showActions={false} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
