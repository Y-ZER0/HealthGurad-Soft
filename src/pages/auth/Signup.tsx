import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Loader2, UserCircle, Stethoscope } from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "patient";
  const [role, setRole] = useState<"patient" | "doctor">(
    initialRole as "patient" | "doctor"
  );
  const [isLoading, setIsLoading] = useState(false);
  const { registerPatient, registerDoctor } = useAuth();
  const navigate = useNavigate();

  // Patient form fields
  const [patientData, setPatientData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    age: "",
    gender: "",
    contactInfo: "",
    emergencyContact: "",
  });

  // Doctor form fields
  const [doctorData, setDoctorData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    contactInfo: "",
    specialty: "",
    licenseNumber: "",
  });

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "doctor" || roleParam === "patient") {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (patientData.password !== patientData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (parseInt(patientData.age) < 0 || parseInt(patientData.age) > 150) {
      toast.error("Please enter a valid age");
      return;
    }

    setIsLoading(true);

    try {
      await registerPatient({
        ...patientData,
        age: parseInt(patientData.age),
      });
      toast.success("Registration successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (doctorData.password !== doctorData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await registerDoctor(doctorData);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatientData = (field: string, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }));
  };

  const updateDoctorData = (field: string, value: string) => {
    setDoctorData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Sign up for HealthGuard as a{" "}
            {role === "patient" ? "Patient" : "Doctor"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Role Selector */}
          <div className="mb-6">
            <Label className="mb-2 block">Account Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={role === "patient" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setRole("patient")}
                disabled={isLoading}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                Patient
              </Button>
              <Button
                type="button"
                variant={role === "doctor" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setRole("doctor")}
                disabled={isLoading}
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                Doctor
              </Button>
            </div>
          </div>

          {role === "patient" ? (
            <form onSubmit={handlePatientSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={patientData.username}
                    onChange={(e) =>
                      updatePatientData("username", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={patientData.email}
                    onChange={(e) => updatePatientData("email", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={patientData.password}
                    onChange={(e) =>
                      updatePatientData("password", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={patientData.confirmPassword}
                    onChange={(e) =>
                      updatePatientData("confirmPassword", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={patientData.name}
                    onChange={(e) => updatePatientData("name", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Your age"
                    value={patientData.age}
                    onChange={(e) => updatePatientData("age", e.target.value)}
                    required
                    min="0"
                    max="150"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={patientData.gender}
                    onValueChange={(value) =>
                      updatePatientData("gender", value)
                    }
                    required
                    disabled={isLoading}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactInfo">Contact Info *</Label>
                  <Input
                    id="contactInfo"
                    type="text"
                    placeholder="Phone or email"
                    value={patientData.contactInfo}
                    onChange={(e) =>
                      updatePatientData("contactInfo", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  type="text"
                  placeholder="Emergency contact details (optional)"
                  value={patientData.emergencyContact}
                  onChange={(e) =>
                    updatePatientData("emergencyContact", e.target.value)
                  }
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Patient Account"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleDoctorSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-username">Username *</Label>
                  <Input
                    id="doctor-username"
                    type="text"
                    placeholder="Choose a username"
                    value={doctorData.username}
                    onChange={(e) =>
                      updateDoctorData("username", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-email">Email *</Label>
                  <Input
                    id="doctor-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={doctorData.email}
                    onChange={(e) => updateDoctorData("email", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-password">Password *</Label>
                  <Input
                    id="doctor-password"
                    type="password"
                    placeholder="Create a password"
                    value={doctorData.password}
                    onChange={(e) =>
                      updateDoctorData("password", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-confirmPassword">
                    Confirm Password *
                  </Label>
                  <Input
                    id="doctor-confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={doctorData.confirmPassword}
                    onChange={(e) =>
                      updateDoctorData("confirmPassword", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-name">Full Name *</Label>
                  <Input
                    id="doctor-name"
                    type="text"
                    placeholder="Dr. Your Name"
                    value={doctorData.name}
                    onChange={(e) => updateDoctorData("name", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-contactInfo">Contact Info *</Label>
                  <Input
                    id="doctor-contactInfo"
                    type="text"
                    placeholder="Phone or email"
                    value={doctorData.contactInfo}
                    onChange={(e) =>
                      updateDoctorData("contactInfo", e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-specialty">Specialty</Label>
                  <Input
                    id="doctor-specialty"
                    type="text"
                    placeholder="e.g., Cardiology, Internal Medicine"
                    value={doctorData.specialty}
                    onChange={(e) =>
                      updateDoctorData("specialty", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-licenseNumber">License Number</Label>
                  <Input
                    id="doctor-licenseNumber"
                    type="text"
                    placeholder="Medical license number"
                    value={doctorData.licenseNumber}
                    onChange={(e) =>
                      updateDoctorData("licenseNumber", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Doctor Account"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
