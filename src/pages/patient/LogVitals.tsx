import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Save,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useVitalRecords } from "@/hooks/useVitalRecords";
import { useAlertThresholds } from "@/hooks/useAlertThresholds";

export default function LogVitals() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { logVitalRecord, isLoading } = useVitalRecords();
  const { thresholds, fetchPatientThresholds } = useAlertThresholds();

  const [formData, setFormData] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    glucose: "",
    temperature: "",
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch patient's alert thresholds on mount
  useEffect(() => {
    if (user?.profileId) {
      fetchPatientThresholds(user.profileId);
    }
  }, [user?.profileId]);

  const validateField = (name: string, value: string) => {
    const numValue = parseFloat(value);
    const validations: Record<
      string,
      { min: number; max: number; label: string }
    > = {
      systolic: { min: 80, max: 200, label: "Systolic BP" },
      diastolic: { min: 50, max: 120, label: "Diastolic BP" },
      heartRate: { min: 40, max: 150, label: "Heart Rate" },
      glucose: { min: 40, max: 400, label: "Glucose" },
      temperature: { min: 95, max: 105, label: "Temperature" },
    };

    if (value && validations[name]) {
      const { min, max, label } = validations[name];
      if (numValue < min || numValue > max) {
        return `${label} should be between ${min} and ${max}`;
      }
      if (
        name === "systolic" &&
        formData.diastolic &&
        numValue <= parseFloat(formData.diastolic)
      ) {
        return "Systolic must be higher than diastolic";
      }
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "date") {
        const error = validateField(
          key,
          formData[key as keyof typeof formData]
        );
        if (error) newErrors[key] = error;
        if (!formData[key as keyof typeof formData]) {
          newErrors[key] = "This field is required";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    if (!user?.profileId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to log vital signs.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call API to log vital record
      await logVitalRecord({
        patientId: user.profileId,
        bloodPressureSystolic: parseInt(formData.systolic),
        bloodPressureDiastolic: parseInt(formData.diastolic),
        heartRate: parseInt(formData.heartRate),
        glucoseLevel: parseFloat(formData.glucose),
        temperature: parseFloat(formData.temperature),
        dateLogged: formData.date,
      });

      // Success
      toast({
        title: "Vital Signs Saved!",
        description: "Your health data has been recorded successfully.",
      });

      // Reset form
      setFormData({
        systolic: "",
        diastolic: "",
        heartRate: "",
        glucose: "",
        temperature: "",
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
      setErrors({});

      // Optionally navigate to history page
      // navigate('/history');
    } catch (error: any) {
      toast({
        title: "Error Saving Vital Signs",
        description:
          error.message || "Failed to save vital signs. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderFormField = (
    label: string,
    name: string,
    Icon: React.ComponentType<{ className?: string }>,
    unit: string,
    placeholder: string,
    value: string,
    error?: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-lg flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          id={name}
          name={name}
          type="number"
          step={name === "temperature" || name === "glucose" ? "0.1" : "1"}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="text-xl h-14"
          aria-label={label}
          disabled={isLoading}
        />
        <div className="flex items-center justify-center bg-muted px-4 rounded-lg min-w-[80px]">
          <span className="text-lg font-semibold text-muted-foreground">
            {unit}
          </span>
        </div>
      </div>
      {error && (
        <p className="text-destructive text-sm font-semibold">{error}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Log Vital Signs</h1>
        <p className="text-xl text-muted-foreground">
          Record your health measurements
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-2xl">Enter Your Measurements</CardTitle>
          <CardDescription className="text-base">
            All fields are required. Enter your latest vital signs below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Pressure */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Blood Pressure</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {renderFormField(
                  "Systolic (Top Number)",
                  "systolic",
                  Heart,
                  "mmHg",
                  "120",
                  formData.systolic,
                  errors.systolic
                )}
                {renderFormField(
                  "Diastolic (Bottom Number)",
                  "diastolic",
                  Heart,
                  "mmHg",
                  "80",
                  formData.diastolic,
                  errors.diastolic
                )}
              </div>
            </div>

            {/* Other Vitals */}
            <div className="grid md:grid-cols-2 gap-6">
              {renderFormField(
                "Heart Rate",
                "heartRate",
                Activity,
                "bpm",
                "72",
                formData.heartRate,
                errors.heartRate
              )}
              {renderFormField(
                "Blood Glucose",
                "glucose",
                Droplets,
                "mg/dL",
                "95",
                formData.glucose,
                errors.glucose
              )}
            </div>

            {renderFormField(
              "Body Temperature",
              "temperature",
              Thermometer,
              "°F",
              "98.6",
              formData.temperature,
              errors.temperature
            )}

            {/* Date Time */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-lg">
                Date & Time
              </Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                className="text-lg h-14"
                disabled={isLoading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1 btn-large text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-6 w-6 mr-2" />
                    Save Reading
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="flex-1 btn-large text-lg"
                onClick={() => navigate("/history")}
                disabled={isLoading}
              >
                <TrendingUp className="h-6 w-6 mr-2" />
                View Charts
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card - Dynamic Thresholds */}
      <Card className="bg-accent">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2">
            {thresholds
              ? "Your Personalized Normal Ranges"
              : "Standard Normal Ranges"}
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              • Blood Pressure: {thresholds?.systolicMin || 110}-
              {thresholds?.systolicMax || 140} /{" "}
              {thresholds?.diastolicMin || 70}-{thresholds?.diastolicMax || 90}{" "}
              mmHg
            </li>
            <li>
              • Heart Rate: {thresholds?.heartRateMin || 60}-
              {thresholds?.heartRateMax || 100} bpm
            </li>
            <li>
              • Blood Glucose: {thresholds?.glucoseMin || 70}-
              {thresholds?.glucoseMax || 130} mg/dL
            </li>
            <li>• Temperature: 97.0-99.5 °F</li>
          </ul>
          {thresholds && (
            <p className="text-xs text-muted-foreground mt-3 italic">
              These ranges have been customized by your doctor based on your
              health profile.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
