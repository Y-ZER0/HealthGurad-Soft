import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import {
  Heart,
  Activity,
  Droplets,
  Thermometer,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useVitalRecords } from "@/hooks/useVitalRecords";

export default function History() {
  const { user } = useAuth();
  const { vitalRecordsList, fetchVitalRecordsByPatient, isLoading } =
    useVitalRecords();
  const [timeRange, setTimeRange] = useState("7");

  // Fetch vital records on mount
  useEffect(() => {
    if (user?.profileId) {
      fetchVitalRecordsByPatient(user.profileId, 90); // Fetch up to 90 days
    }
  }, [user?.profileId]);

  // Filter and prepare data based on time range
  const filteredVitals = useMemo(() => {
    if (!vitalRecordsList?.records) return [];

    const limit = parseInt(timeRange);
    return vitalRecordsList.records.slice(0, limit).reverse();
  }, [vitalRecordsList, timeRange]);

  const chartData = useMemo(() => {
    return filteredVitals.map((v) => ({
      date: format(new Date(v.dateLogged), "MM/dd"),
      systolic: v.bloodPressureSystolic || 0,
      diastolic: v.bloodPressureDiastolic || 0,
      heartRate: v.heartRate || 0,
      glucose: v.glucoseLevel || 0,
      temperature: v.temperature || 0,
    }));
  }, [filteredVitals]);

  const VitalChart = ({
    title,
    dataKey,
    color,
    min,
    max,
    unit,
    icon: Icon,
  }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[min - 10, max + 10]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card p-3 border-2 border-border rounded-lg shadow-lg">
                      <p className="font-semibold">{payload[0].payload.date}</p>
                      <p className="text-primary font-bold">
                        {payload[0].value} {unit}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={min}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label="Min"
            />
            <ReferenceLine
              y={max}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label="Max"
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // No data state
  if (!vitalRecordsList || vitalRecordsList.records.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Vital Signs History</h1>
          <p className="text-xl text-muted-foreground">
            Track your health trends over time
          </p>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-4">
              No vital signs recorded yet.
            </p>
            <p className="text-muted-foreground">
              Start logging your vital signs to see trends and charts.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Vital Signs History</h1>
          <p className="text-xl text-muted-foreground">
            Track your health trends over time
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48 h-12 text-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="14">Last 2 Weeks</SelectItem>
            <SelectItem value="30">Last Month</SelectItem>
            <SelectItem value="90">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-14">
          <TabsTrigger value="all" className="text-base">
            <TrendingUp className="h-5 w-5 mr-2" />
            All Vitals
          </TabsTrigger>
          <TabsTrigger value="bp" className="text-base">
            <Heart className="h-5 w-5 mr-2" />
            Blood Pressure
          </TabsTrigger>
          <TabsTrigger value="hr" className="text-base">
            <Activity className="h-5 w-5 mr-2" />
            Heart Rate
          </TabsTrigger>
          <TabsTrigger value="glucose" className="text-base">
            <Droplets className="h-5 w-5 mr-2" />
            Glucose
          </TabsTrigger>
          <TabsTrigger value="temp" className="text-base">
            <Thermometer className="h-5 w-5 mr-2" />
            Temperature
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <VitalChart
              title="Blood Pressure - Systolic"
              dataKey="systolic"
              color="hsl(var(--primary))"
              min={110}
              max={140}
              unit="mmHg"
              icon={Heart}
            />
            <VitalChart
              title="Heart Rate"
              dataKey="heartRate"
              color="hsl(var(--secondary))"
              min={60}
              max={100}
              unit="bpm"
              icon={Activity}
            />
            <VitalChart
              title="Blood Glucose"
              dataKey="glucose"
              color="hsl(var(--alert-high))"
              min={70}
              max={130}
              unit="mg/dL"
              icon={Droplets}
            />
            <VitalChart
              title="Body Temperature"
              dataKey="temperature"
              color="hsl(var(--warning))"
              min={97}
              max={99.5}
              unit="°F"
              icon={Thermometer}
            />
          </div>
        </TabsContent>

        <TabsContent value="bp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Blood Pressure Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[60, 160]} />
                  <Tooltip />
                  <ReferenceLine
                    y={140}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label="Max Systolic"
                  />
                  <ReferenceLine
                    y={90}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label="Max Diastolic"
                  />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name="Systolic"
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={3}
                    name="Diastolic"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hr">
          <VitalChart
            title="Heart Rate Over Time"
            dataKey="heartRate"
            color="hsl(var(--secondary))"
            min={60}
            max={100}
            unit="bpm"
            icon={Activity}
          />
        </TabsContent>

        <TabsContent value="glucose">
          <VitalChart
            title="Blood Glucose Levels"
            dataKey="glucose"
            color="hsl(var(--alert-high))"
            min={70}
            max={130}
            unit="mg/dL"
            icon={Droplets}
          />
        </TabsContent>

        <TabsContent value="temp">
          <VitalChart
            title="Body Temperature"
            dataKey="temperature"
            color="hsl(var(--warning))"
            min={97}
            max={99.5}
            unit="°F"
            icon={Thermometer}
          />
        </TabsContent>
      </Tabs>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Recent Readings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b-2 border-border">
                <tr>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">BP</th>
                  <th className="p-3 font-semibold">HR</th>
                  <th className="p-3 font-semibold">Glucose</th>
                  <th className="p-3 font-semibold">Temp</th>
                </tr>
              </thead>
              <tbody>
                {filteredVitals.slice(0, 10).map((vital) => (
                  <tr
                    key={vital.recordId}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-3">{vital.dateLoggedFormatted}</td>
                    <td className="p-3 font-semibold">
                      {vital.bloodPressure || "N/A"}
                    </td>
                    <td className="p-3 font-semibold">
                      {vital.heartRate ? `${vital.heartRate} bpm` : "N/A"}
                    </td>
                    <td className="p-3 font-semibold">
                      {vital.glucoseLevel
                        ? `${vital.glucoseLevel} mg/dL`
                        : "N/A"}
                    </td>
                    <td className="p-3 font-semibold">
                      {vital.temperature ? `${vital.temperature} °F` : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
