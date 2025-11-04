export interface Patient {
  PatientID: number;
  Name: string;
  Age: number;
  Gender: string;
  ContactInfo: string;
  AssignedDoctorID: number;
}

export interface Doctor {
  DoctorID: number;
  Name: string;
  Specialty: string;
  ContactInfo: string;
}

export interface VitalRecord {
  RecordID: number;
  PatientID: number;
  BloodPressureSystolic: number;
  BloodPressureDiastolic: number;
  HeartRate: number;
  GlucoseLevel: number;
  Temperature: number;
  DateLogged: string;
}

export interface Medication {
  MedicationID: number;
  PatientID: number;
  MedicineName: string;
  Dosage: string;
  Frequency: string;
  TimeOfDay: string[];
  IsTaken?: boolean;
  IsMissed?: boolean;
}

export interface Alert {
  AlertID: number;
  PatientID: number;
  AlertType: string;
  Description: string;
  Severity: 'Low' | 'Medium' | 'High' | 'Critical';
  Timestamp: string;
  Status: 'Active' | 'Resolved';
}

export interface Threshold {
  PatientID: number;
  BPSystolicMin: number;
  BPSystolicMax: number;
  BPDiastolicMin: number;
  BPDiastolicMax: number;
  HeartRateMin: number;
  HeartRateMax: number;
  GlucoseMin: number;
  GlucoseMax: number;
  TemperatureMin: number;
  TemperatureMax: number;
}

export const mockDoctors: Doctor[] = [
  { DoctorID: 1, Name: "Dr. Sarah Johnson", Specialty: "Internal Medicine", ContactInfo: "sarah.johnson@healthguard.com" },
  { DoctorID: 2, Name: "Dr. Michael Chen", Specialty: "Cardiology", ContactInfo: "michael.chen@healthguard.com" },
  { DoctorID: 3, Name: "Dr. Emily Rodriguez", Specialty: "Geriatrics", ContactInfo: "emily.rodriguez@healthguard.com" },
];

export const mockPatients: Patient[] = [
  { PatientID: 1, Name: "Robert Williams", Age: 72, Gender: "Male", ContactInfo: "robert.w@email.com", AssignedDoctorID: 1 },
  { PatientID: 2, Name: "Mary Thompson", Age: 68, Gender: "Female", ContactInfo: "mary.t@email.com", AssignedDoctorID: 1 },
  { PatientID: 3, Name: "James Anderson", Age: 75, Gender: "Male", ContactInfo: "james.a@email.com", AssignedDoctorID: 2 },
  { PatientID: 4, Name: "Patricia Davis", Age: 70, Gender: "Female", ContactInfo: "patricia.d@email.com", AssignedDoctorID: 3 },
  { PatientID: 5, Name: "John Martinez", Age: 73, Gender: "Male", ContactInfo: "john.m@email.com", AssignedDoctorID: 1 },
];

const generateVitalRecords = (): VitalRecord[] => {
  const records: VitalRecord[] = [];
  let recordID = 1;

  mockPatients.forEach(patient => {
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const baseVariation = Math.random() * 0.2 - 0.1;
      
      records.push({
        RecordID: recordID++,
        PatientID: patient.PatientID,
        BloodPressureSystolic: Math.round(125 + baseVariation * 30 + Math.random() * 15),
        BloodPressureDiastolic: Math.round(80 + baseVariation * 20 + Math.random() * 10),
        HeartRate: Math.round(72 + baseVariation * 15 + Math.random() * 10),
        GlucoseLevel: Math.round(95 + baseVariation * 25 + Math.random() * 20),
        Temperature: parseFloat((98.6 + baseVariation * 2 + Math.random() * 0.5).toFixed(1)),
        DateLogged: date.toISOString(),
      });
    }
  });

  return records;
};

export const mockVitalRecords = generateVitalRecords();

export const mockMedications: Medication[] = [
  { MedicationID: 1, PatientID: 1, MedicineName: "Lisinopril", Dosage: "10mg", Frequency: "Once daily", TimeOfDay: ["08:00"], IsTaken: true },
  { MedicationID: 2, PatientID: 1, MedicineName: "Metformin", Dosage: "500mg", Frequency: "Twice daily", TimeOfDay: ["08:00", "20:00"], IsTaken: true },
  { MedicationID: 3, PatientID: 1, MedicineName: "Atorvastatin", Dosage: "20mg", Frequency: "Once daily", TimeOfDay: ["20:00"], IsTaken: false },
  { MedicationID: 4, PatientID: 1, MedicineName: "Aspirin", Dosage: "81mg", Frequency: "Once daily", TimeOfDay: ["08:00"], IsTaken: true },
  
  { MedicationID: 5, PatientID: 2, MedicineName: "Amlodipine", Dosage: "5mg", Frequency: "Once daily", TimeOfDay: ["08:00"], IsTaken: false },
  { MedicationID: 6, PatientID: 2, MedicineName: "Levothyroxine", Dosage: "75mcg", Frequency: "Once daily", TimeOfDay: ["07:00"], IsTaken: true },
  { MedicationID: 7, PatientID: 2, MedicineName: "Vitamin D", Dosage: "1000 IU", Frequency: "Once daily", TimeOfDay: ["08:00"], IsTaken: true },
  
  { MedicationID: 8, PatientID: 3, MedicineName: "Warfarin", Dosage: "5mg", Frequency: "Once daily", TimeOfDay: ["18:00"], IsTaken: false },
  { MedicationID: 9, PatientID: 3, MedicineName: "Furosemide", Dosage: "40mg", Frequency: "Once daily", TimeOfDay: ["08:00"], IsTaken: true },
  { MedicationID: 10, PatientID: 3, MedicineName: "Carvedilol", Dosage: "6.25mg", Frequency: "Twice daily", TimeOfDay: ["08:00", "20:00"], IsTaken: true },
  
  { MedicationID: 11, PatientID: 4, MedicineName: "Losartan", Dosage: "50mg", Frequency: "Once daily", TimeOfDay: ["08:00"], IsTaken: true },
  { MedicationID: 12, PatientID: 4, MedicineName: "Calcium Carbonate", Dosage: "600mg", Frequency: "Twice daily", TimeOfDay: ["08:00", "20:00"], IsTaken: false },
  
  { MedicationID: 13, PatientID: 5, MedicineName: "Ramipril", Dosage: "5mg", Frequency: "Once daily", TimeOfDay: ["08:00"], IsTaken: true },
  { MedicationID: 14, PatientID: 5, MedicineName: "Rosuvastatin", Dosage: "10mg", Frequency: "Once daily", TimeOfDay: ["20:00"], IsTaken: false },
];

export const mockAlerts: Alert[] = [
  { AlertID: 1, PatientID: 1, AlertType: "High Blood Pressure", Description: "Systolic reading of 145 mmHg exceeds threshold", Severity: "High", Timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), Status: "Active" },
  { AlertID: 2, PatientID: 1, AlertType: "Missed Medication", Description: "Atorvastatin not taken at scheduled time", Severity: "Medium", Timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), Status: "Active" },
  
  { AlertID: 3, PatientID: 2, AlertType: "Low Heart Rate", Description: "Heart rate of 58 bpm below normal range", Severity: "Medium", Timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), Status: "Active" },
  
  { AlertID: 4, PatientID: 3, AlertType: "Critical Blood Pressure", Description: "Systolic reading of 165 mmHg requires immediate attention", Severity: "Critical", Timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), Status: "Active" },
  { AlertID: 5, PatientID: 3, AlertType: "Irregular Heart Rate", Description: "Heart rate variability detected", Severity: "High", Timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), Status: "Active" },
  
  { AlertID: 6, PatientID: 4, AlertType: "High Glucose", Description: "Glucose level of 180 mg/dL above threshold", Severity: "High", Timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), Status: "Active" },
  
  { AlertID: 7, PatientID: 5, AlertType: "Normal Reading", Description: "All vitals within normal range", Severity: "Low", Timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), Status: "Resolved" },
  { AlertID: 8, PatientID: 2, AlertType: "Temperature Alert", Description: "Temperature of 99.5°F slightly elevated", Severity: "Low", Timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), Status: "Resolved" },
];

export const mockThresholds: Threshold[] = [
  { PatientID: 1, BPSystolicMin: 110, BPSystolicMax: 140, BPDiastolicMin: 70, BPDiastolicMax: 90, HeartRateMin: 60, HeartRateMax: 100, GlucoseMin: 70, GlucoseMax: 130, TemperatureMin: 97.0, TemperatureMax: 99.5 },
  { PatientID: 2, BPSystolicMin: 110, BPSystolicMax: 140, BPDiastolicMin: 70, BPDiastolicMax: 90, HeartRateMin: 60, HeartRateMax: 100, GlucoseMin: 70, GlucoseMax: 130, TemperatureMin: 97.0, TemperatureMax: 99.5 },
  { PatientID: 3, BPSystolicMin: 100, BPSystolicMax: 135, BPDiastolicMin: 65, BPDiastolicMax: 85, HeartRateMin: 55, HeartRateMax: 95, GlucoseMin: 70, GlucoseMax: 130, TemperatureMin: 97.0, TemperatureMax: 99.5 },
  { PatientID: 4, BPSystolicMin: 110, BPSystolicMax: 140, BPDiastolicMin: 70, BPDiastolicMax: 90, HeartRateMin: 60, HeartRateMax: 100, GlucoseMin: 80, GlucoseMax: 140, TemperatureMin: 97.0, TemperatureMax: 99.5 },
  { PatientID: 5, BPSystolicMin: 110, BPSystolicMax: 140, BPDiastolicMin: 70, BPDiastolicMax: 90, HeartRateMin: 60, HeartRateMax: 100, GlucoseMin: 70, GlucoseMax: 130, TemperatureMin: 97.0, TemperatureMax: 99.5 },
];

export const getPatientById = (id: number) => mockPatients.find(p => p.PatientID === id);
export const getDoctorById = (id: number) => mockDoctors.find(d => d.DoctorID === id);
export const getVitalRecordsByPatientId = (patientId: number) => mockVitalRecords.filter(v => v.PatientID === patientId);
export const getMedicationsByPatientId = (patientId: number) => mockMedications.filter(m => m.PatientID === patientId);
export const getAlertsByPatientId = (patientId: number) => mockAlerts.filter(a => a.PatientID === patientId);
export const getThresholdByPatientId = (patientId: number) => mockThresholds.find(t => t.PatientID === patientId);
export const getActiveAlerts = () => mockAlerts.filter(a => a.Status === 'Active');
export const getPatientsByDoctorId = (doctorId: number) => mockPatients.filter(p => p.AssignedDoctorID === doctorId);
