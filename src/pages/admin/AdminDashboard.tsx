import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { AdminUser } from "@/lib/api/auth.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Shield,
  Stethoscope,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const authContext = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (authContext) {
        const fetchedUsers = await authContext.getAllUsers();
        setUsers(fetchedUsers);
        console.log("Fetched Users:", fetchedUsers);
      }
    };
    fetchData();
  }, [authContext]);

  const allUsers = users;

  const filteredUsers = allUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveUser = async (userId: number) => {
    if (!authContext) return;

    try {
      setDeletingUserId(userId);
      await authContext.deleteUser(userId);

      // Refresh the users list after deletion
      const fetchedUsers = await authContext.getAllUsers();
      setUsers(fetchedUsers);

      toast.success("User removed successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to remove user. Please try again.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleAssignDoctor = async () => {
    if (!selectedPatient || !selectedDoctor) {
      toast.error("Please select both patient and doctor");
      return;
    }

    if (authContext) {
      await authContext.assignDoctor(selectedPatient, parseInt(selectedDoctor));
      const fetchedUsers = await authContext.getAllUsers();
      setUsers(fetchedUsers);
      toast.success("Doctor assigned successfully");
      setSelectedPatient(null);
      setSelectedDoctor("");
    }
  };

  const getDoctorName = (doctorId: number | null) => {
    if (!doctorId) return "Unassigned";
    const doctor = users.find(
      (u) => u.role === "Doctor" && u.doctorId === doctorId
    );
    return doctor ? doctor.username : "Unknown";
  };

  const doctors = users.filter((u) => u.role === "Doctor");
  const patientCount = users.filter((u) => u.role === "Patient").length;
  const doctorCount = doctors.length;
  const unassignedCount = users.filter(
    (u) => u.role === "Patient" && !u.assignedDoctorId
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Shield className="h-10 w-10 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Manage all users and system settings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">
                  Total Patients
                </p>
                <p className="text-3xl font-bold text-primary mt-2">
                  {patientCount}
                </p>
              </div>
              <Users className="h-10 w-10 text-primary/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">
                  Total Doctors
                </p>
                <p className="text-3xl font-bold text-primary mt-2">
                  {doctorCount}
                </p>
              </div>
              <Stethoscope className="h-10 w-10 text-primary/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">
                  Unassigned Patients
                </p>
                <p className="text-3xl font-bold text-destructive mt-2">
                  {unassignedCount}
                </p>
              </div>
              <UserPlus className="h-10 w-10 text-destructive/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign Doctor Section */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Doctor to Patient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Select Patient
              </label>
              <Select
                value={selectedPatient?.toString() || ""}
                onValueChange={(value) => setSelectedPatient(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a patient" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter((u) => u.role === "Patient")
                    .map((patient) => (
                      <SelectItem
                        key={patient.userId}
                        value={patient.userId.toString()}
                      >
                        {patient.username} -{" "}
                        {getDoctorName(patient.assignedDoctorId)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Select Doctor
              </label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem
                      key={doctor.userId}
                      value={doctor.doctorId!.toString()}
                    >
                      {doctor.username} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleAssignDoctor} className="w-full md:w-auto">
                Assign Doctor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Users */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={`${user.role}-${user.userId}`}>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "Doctor" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.role === "Patient" ? (
                        <div className="text-sm">
                          <div className="text-muted-foreground">
                            <div>
                              Doctor: {getDoctorName(user.assignedDoctorId)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {user.specialty}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={
                              user.role === "Doctor" ||
                              user.role === "Admin" ||
                              deletingUserId === user.userId
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deletingUserId === user.userId
                              ? "Removing..."
                              : "Remove"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove {user.username} from
                              the system. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              disabled={deletingUserId === user.userId}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveUser(user.userId)}
                              disabled={deletingUserId === user.userId}
                              className="bg-destructive text-destructive-foreground"
                            >
                              {deletingUserId === user.userId
                                ? "Removing..."
                                : "Remove User"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
