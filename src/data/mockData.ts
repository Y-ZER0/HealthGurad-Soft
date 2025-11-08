// ============= INTERFACES (matching database schema exactly) =============

export interface Patient {
  PatientID: number;
  Name: string;
  Age: number;
  Gender: string;
  ContactInfo: string;
  EmergencyContact: string;
  AssignedDoctorID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Doctor {
  DoctorID: number;
  Name: string;
  Specialty: string;
  ContactInfo: string;
  LicenseNumber: string;
  CreatedAt: string;
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
  Notes?: string;
}

export interface Medication {
  MedicationID: number;
  PatientID: number;
  MedicineName: string;
  Dosage: string;
  Frequency: string;
  TimeOfDay: string[];
  StartDate: string;
  EndDate?: string;
  Instructions?: string;
  IsActive: boolean;
  PrescribedBy: number;
  CreatedAt: string;
}

export interface MedicationLog {
  LogID: number;
  MedicationID: number;
  PatientID: number;
  ScheduledTime: string;
  TakenTime?: string;
  Status: 'Pending' | 'Taken' | 'Missed';
  Notes?: string;
}

export interface Alert {
  AlertID: number;
  PatientID: number;
  AlertType: string;
  Description: string;
  Severity: 'Low' | 'Medium' | 'High' | 'Critical';
  Timestamp: string;
  Status: 'Active' | 'Acknowledged' | 'Resolved';
  ResolvedAt?: string;
  ResolvedBy?: number;
}

export interface Message {
  MessageID: number;
  SenderID: number;
  RecipientID: number;
  MessageText: string;
  SentAt: string;
  IsRead: boolean;
  ReadAt?: string;
}

export interface AlertThreshold {
  ThresholdID: number;
  PatientID: number;
  VitalType: 'BloodPressure' | 'HeartRate' | 'Glucose' | 'Temperature';
  MinValue?: number;
  MaxValue?: number;
  SetBy: number;
  SetAt: string;
  IsActive: boolean;
}

// ============= MOCK DATA =============

export const mockDoctors: Doctor[] = [
  { 
    DoctorID: 1, 
    Name: "Dr. Sarah Johnson", 
    Specialty: "Internal Medicine", 
    ContactInfo: "sarah.johnson@healthguard.com",
    LicenseNumber: "MD-2015-12345",
    CreatedAt: new Date('2020-01-15').toISOString()
  },
  { 
    DoctorID: 2, 
    Name: "Dr. Michael Chen", 
    Specialty: "Cardiology", 
    ContactInfo: "michael.chen@healthguard.com",
    LicenseNumber: "MD-2018-67890",
    CreatedAt: new Date('2021-03-20').toISOString()
  },
  { 
    DoctorID: 3, 
    Name: "Dr. Emily Rodriguez", 
    Specialty: "Geriatrics", 
    ContactInfo: "emily.rodriguez@healthguard.com",
    LicenseNumber: "MD-2016-54321",
    CreatedAt: new Date('2020-08-10').toISOString()
  },
];

export const mockPatients: Patient[] = [
  { 
    PatientID: 1, 
    Name: "Robert Williams", 
    Age: 72, 
    Gender: "Male", 
    ContactInfo: "robert.w@email.com", 
    EmergencyContact: "+1-555-0101 (Son: Michael Williams)",
    AssignedDoctorID: 1,
    CreatedAt: new Date('2022-01-10').toISOString(),
    UpdatedAt: new Date('2025-01-01').toISOString()
  },
  { 
    PatientID: 2, 
    Name: "Mary Thompson", 
    Age: 68, 
    Gender: "Female", 
    ContactInfo: "mary.t@email.com", 
    EmergencyContact: "+1-555-0202 (Daughter: Sarah Thompson)",
    AssignedDoctorID: 1,
    CreatedAt: new Date('2022-03-15').toISOString(),
    UpdatedAt: new Date('2024-12-20').toISOString()
  },
  { 
    PatientID: 3, 
    Name: "James Anderson", 
    Age: 75, 
    Gender: "Male", 
    ContactInfo: "james.a@email.com", 
    EmergencyContact: "+1-555-0303 (Wife: Helen Anderson)",
    AssignedDoctorID: 2,
    CreatedAt: new Date('2021-11-20').toISOString(),
    UpdatedAt: new Date('2025-01-02').toISOString()
  },
  { 
    PatientID: 4, 
    Name: "Patricia Davis", 
    Age: 70, 
    Gender: "Female", 
    ContactInfo: "patricia.d@email.com", 
    EmergencyContact: "+1-555-0404 (Son: Robert Davis)",
    AssignedDoctorID: 3,
    CreatedAt: new Date('2022-06-05').toISOString(),
    UpdatedAt: new Date('2024-12-28').toISOString()
  },
  { 
    PatientID: 5, 
    Name: "John Martinez", 
    Age: 73, 
    Gender: "Male", 
    ContactInfo: "john.m@email.com", 
    EmergencyContact: "+1-555-0505 (Daughter: Maria Martinez)",
    AssignedDoctorID: 1,
    CreatedAt: new Date('2022-09-12').toISOString(),
    UpdatedAt: new Date('2024-12-15').toISOString()
  },
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
  { 
    MedicationID: 1, 
    PatientID: 1, 
    MedicineName: "Lisinopril", 
    Dosage: "10mg", 
    Frequency: "Once daily", 
    TimeOfDay: ["08:00"],
    StartDate: new Date('2024-01-15').toISOString(),
    Instructions: "Take with food. Monitor for dizziness.",
    IsActive: true,
    PrescribedBy: 1,
    CreatedAt: new Date('2024-01-15').toISOString()
  },
  { 
    MedicationID: 2, 
    PatientID: 1, 
    MedicineName: "Metformin", 
    Dosage: "500mg", 
    Frequency: "Twice daily", 
    TimeOfDay: ["08:00", "20:00"],
    StartDate: new Date('2024-02-01').toISOString(),
    Instructions: "Take with meals to reduce stomach upset.",
    IsActive: true,
    PrescribedBy: 1,
    CreatedAt: new Date('2024-02-01').toISOString()
  },
  { 
    MedicationID: 3, 
    PatientID: 1, 
    MedicineName: "Atorvastatin", 
    Dosage: "20mg", 
    Frequency: "Once daily", 
    TimeOfDay: ["20:00"],
    StartDate: new Date('2024-03-10').toISOString(),
    Instructions: "Take in the evening. Avoid grapefruit juice.",
    IsActive: true,
    PrescribedBy: 1,
    CreatedAt: new Date('2024-03-10').toISOString()
  },
  { 
    MedicationID: 4, 
    PatientID: 1, 
    MedicineName: "Aspirin", 
    Dosage: "81mg", 
    Frequency: "Once daily", 
    TimeOfDay: ["08:00"],
    StartDate: new Date('2023-11-20').toISOString(),
    Instructions: "Take with food to reduce stomach irritation.",
    IsActive: true,
    PrescribedBy: 1,
    CreatedAt: new Date('2023-11-20').toISOString()
  },
  { 
    MedicationID: 5, 
    PatientID: 2, 
    MedicineName: "Amlodipine", 
    Dosage: "5mg", 
    Frequency: "Once daily", 
    TimeOfDay: ["08:00"],
    StartDate: new Date('2024-01-05').toISOString(),
    Instructions: "May cause swelling in ankles. Contact doctor if severe.",
    IsActive: true,
    PrescribedBy: 1,
    CreatedAt: new Date('2024-01-05').toISOString()
  },
  { 
    MedicationID: 6, 
    PatientID: 2, 
    MedicineName: "Levothyroxine", 
    Dosage: "75mcg", 
    Frequency: "Once daily", 
    TimeOfDay: ["07:00"],
    StartDate: new Date('2023-06-15').toISOString(),
    Instructions: "Take on empty stomach 30 minutes before breakfast.",
    IsActive: true,
    PrescribedBy: 1,
    CreatedAt: new Date('2023-06-15').toISOString()
  },
  { 
    MedicationID: 7, 
    PatientID: 2, 
    MedicineName: "Vitamin D", 
    Dosage: "1000 IU", 
    Frequency: "Once daily", 
    TimeOfDay: ["08:00"],
    StartDate: new Date('2024-10-01').toISOString(),
    Instructions: "Take with food for better absorption.",
    IsActive: true,
    PrescribedBy: 1,
    CreatedAt: new Date('2024-10-01').toISOString()
  },
  { 
    MedicationID: 8, 
    PatientID: 3, 
    MedicineName: "Warfarin", 
    Dosage: "5mg", 
    Frequency: "Once daily", 
    TimeOfDay: ["18:00"],
    StartDate: new Date('2023-08-20').toISOString(),
    Instructions: "Regular INR monitoring required. Avoid vitamin K rich foods.",
    IsActive: true,
    PrescribedBy: 2,
    CreatedAt: new Date('2023-08-20').toISOString()
  },
  { 
    MedicationID: 9, 
    PatientID: 3, 
    MedicineName: "Furosemide", 
    Dosage: "40mg", 
    Frequency: "Once daily", 
    TimeOfDay: ["08:00"],
    StartDate: new Date('2024-02-10').toISOString(),
    Instructions: "Take in morning to avoid nighttime urination.",
    IsActive: true,
    PrescribedBy: 2,
    CreatedAt: new Date('2024-02-10').toISOString()
  },
  { 
    MedicationID: 10, 
    PatientID: 3, 
    MedicineName: "Carvedilol", 
    Dosage: "6.25mg", 
    Frequency: "Twice daily", 
    TimeOfDay: ["08:00", "20:00"],
    StartDate: new Date('2024-01-12').toISOString(),
    Instructions: "Take with food. May cause dizziness initially.",
    IsActive: true,
    PrescribedBy: 2,
    CreatedAt: new Date('2024-01-12').toISOString()
  },
  { 
    MedicationID: 11, 
    PatientID: 4, 
    MedicineName: "Losartan", 
    Dosage: "50mg", 
    Frequency: "Once daily", 
    TimeOfDay: ["08:00"],
    StartDate: new Date('2024-03-01').toISOString(),
    Instructions: "Monitor blood pressure regularly.",
    IsActive: true,
    PrescribedBy: 3,
    CreatedAt: new Date('2024-03-01').toISOString()
  },
  { 
    MedicationID: 12, 
    PatientID: 4, 
    MedicineName: "Calcium Carbonate", 
    Dosage: "600mg", 
    Frequency: "Twice daily", 
    TimeOfDay: ["08:00", "20:00"],
    StartDate: new Date('2024-05-15').toISOString(),
    Instructions: "Take with food for better absorption.",
    IsActive: true,
    PrescribedBy: 3,
    CreatedAt: new Date('2024-05-15').toISOString()
  },
  { 
    MedicationID: 13, 
    PatientID: 5, 
    MedicineName: "Ramipril", 
    Dosage: "5mg", 
    Frequency: "Once daily", 
    TimeOfDay: ["08:00"],
    StartDate: new Date('2024-02-20').toISOString(),
    Instructions: "Monitor for persistent cough.",
    IsActive: true,
    PrescribedBy: 1,
    CreatedAt: new Date('2024-02-20').toISOString()
  },
  { 
    MedicationID: 14, 
    PatientID: 5, 
    MedicineName: "Rosuvastatin", 
    Dosage: "10mg", 
    Frequency: "Once daily", 
    TimeOfDay: ["20:00"],
    StartDate: new Date('2024-04-10').toISOString(),
    Instructions: "Report any muscle pain or weakness immediately.",
    IsActive: true,
    PrescribedBy: 1,
    CreatedAt: new Date('2024-04-10').toISOString()
  },
];

export const mockAlerts: Alert[] = [
  { 
    AlertID: 1, 
    PatientID: 1, 
    AlertType: "High Blood Pressure", 
    Description: "Systolic reading of 145 mmHg exceeds threshold", 
    Severity: "High", 
    Timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
    Status: "Active" 
  },
  { 
    AlertID: 2, 
    PatientID: 1, 
    AlertType: "Missed Medication", 
    Description: "Atorvastatin not taken at scheduled time", 
    Severity: "Medium", 
    Timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), 
    Status: "Active" 
  },
  { 
    AlertID: 3, 
    PatientID: 2, 
    AlertType: "Low Heart Rate", 
    Description: "Heart rate of 58 bpm below normal range", 
    Severity: "Medium", 
    Timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
    Status: "Active" 
  },
  { 
    AlertID: 4, 
    PatientID: 3, 
    AlertType: "Critical Blood Pressure", 
    Description: "Systolic reading of 165 mmHg requires immediate attention", 
    Severity: "Critical", 
    Timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), 
    Status: "Active" 
  },
  { 
    AlertID: 5, 
    PatientID: 3, 
    AlertType: "Irregular Heart Rate", 
    Description: "Heart rate variability detected", 
    Severity: "High", 
    Timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), 
    Status: "Active" 
  },
  { 
    AlertID: 6, 
    PatientID: 4, 
    AlertType: "High Glucose", 
    Description: "Glucose level of 180 mg/dL above threshold", 
    Severity: "High", 
    Timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), 
    Status: "Active" 
  },
  { 
    AlertID: 7, 
    PatientID: 5, 
    AlertType: "Normal Reading", 
    Description: "All vitals within normal range", 
    Severity: "Low", 
    Timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), 
    Status: "Resolved",
    ResolvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    ResolvedBy: 1
  },
  { 
    AlertID: 8, 
    PatientID: 2, 
    AlertType: "Temperature Alert", 
    Description: "Temperature of 99.5°F slightly elevated", 
    Severity: "Low", 
    Timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    Status: "Resolved",
    ResolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    ResolvedBy: 1
  },
];

// Generate medication logs for the past 7 days plus upcoming doses
const generateMedicationLogs = (): MedicationLog[] => {
  const logs: MedicationLog[] = [];
  let logID = 1;

  mockMedications.forEach(medication => {
    // Generate logs for past 7 days
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      medication.TimeOfDay.forEach(time => {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() - dayOffset);
        const [hours, minutes] = time.split(':');
        scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const now = new Date();
        const isOverdue = scheduledDate < now;
        
        // Simulate realistic adherence patterns
        const random = Math.random();
        let status: 'Pending' | 'Taken' | 'Missed' = 'Pending';
        let takenTime: string | undefined = undefined;

        if (isOverdue) {
          if (random < 0.85) { // 85% adherence rate
            status = 'Taken';
            const takenDate = new Date(scheduledDate);
            takenDate.setMinutes(takenDate.getMinutes() + Math.floor(Math.random() * 30));
            takenTime = takenDate.toISOString();
          } else {
            status = 'Missed';
          }
        }

        logs.push({
          LogID: logID++,
          MedicationID: medication.MedicationID,
          PatientID: medication.PatientID,
          ScheduledTime: scheduledDate.toISOString(),
          TakenTime: takenTime,
          Status: status,
          Notes: undefined
        });
      });
    }

    // Add upcoming doses for better testing (next 24 hours)
    for (let dayOffset = 1; dayOffset <= 2; dayOffset++) {
      medication.TimeOfDay.forEach(time => {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + dayOffset);
        const [hours, minutes] = time.split(':');
        scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        logs.push({
          LogID: logID++,
          MedicationID: medication.MedicationID,
          PatientID: medication.PatientID,
          ScheduledTime: scheduledDate.toISOString(),
          TakenTime: undefined,
          Status: 'Pending',
          Notes: undefined
        });
      });
    }
  });

  // Add some additional pending medications for right now/very soon for Patient 1
  const now = new Date();
  
  // Lisinopril - due in 30 minutes
  const lisinoprilTime = new Date(now.getTime() + 30 * 60 * 1000);
  logs.push({
    LogID: logID++,
    MedicationID: 1,
    PatientID: 1,
    ScheduledTime: lisinoprilTime.toISOString(),
    TakenTime: undefined,
    Status: 'Pending',
    Notes: undefined
  });

  // Aspirin - due in 45 minutes
  const aspirinTime = new Date(now.getTime() + 45 * 60 * 1000);
  logs.push({
    LogID: logID++,
    MedicationID: 4,
    PatientID: 1,
    ScheduledTime: aspirinTime.toISOString(),
    TakenTime: undefined,
    Status: 'Pending',
    Notes: undefined
  });

  // Metformin - due in 1 hour
  const metforminTime = new Date(now.getTime() + 60 * 60 * 1000);
  logs.push({
    LogID: logID++,
    MedicationID: 2,
    PatientID: 1,
    ScheduledTime: metforminTime.toISOString(),
    TakenTime: undefined,
    Status: 'Pending',
    Notes: undefined
  });

  // Atorvastatin - due in 1.5 hours
  const atorvastatinTime = new Date(now.getTime() + 90 * 60 * 1000);
  logs.push({
    LogID: logID++,
    MedicationID: 3,
    PatientID: 1,
    ScheduledTime: atorvastatinTime.toISOString(),
    TakenTime: undefined,
    Status: 'Pending',
    Notes: undefined
  });

  return logs;
};

export const mockMedicationLogs = generateMedicationLogs();

export const mockMessages: Message[] = [
  {
    MessageID: 1,
    SenderID: 1, // Dr. Sarah Johnson
    RecipientID: 1, // Robert Williams patient
    MessageText: "Hi Robert, I've reviewed your latest blood pressure readings. They're looking much better! Keep up with your medication schedule.",
    SentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    IsRead: true,
    ReadAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
  },
  {
    MessageID: 2,
    SenderID: 1, // Robert Williams patient
    RecipientID: 1, // Dr. Sarah Johnson
    MessageText: "Thank you, Doctor! I've been very consistent with taking my medications. Should I continue with the same dosage?",
    SentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    IsRead: true,
    ReadAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    MessageID: 3,
    SenderID: 1, // Dr. Sarah Johnson
    RecipientID: 1, // Robert Williams patient
    MessageText: "Yes, continue with your current dosage. Let's schedule a follow-up in two weeks.",
    SentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    IsRead: true,
    ReadAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString()
  },
  {
    MessageID: 4,
    SenderID: 2, // Dr. Michael Chen
    RecipientID: 3, // James Anderson patient
    MessageText: "James, I noticed your heart rate has been irregular. Please come in for an EKG this week if possible.",
    SentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    IsRead: false
  },
  {
    MessageID: 5,
    SenderID: 3, // Dr. Emily Rodriguez
    RecipientID: 4, // Patricia Davis patient
    MessageText: "Patricia, your glucose levels are trending higher. Let's discuss adjusting your diet and medication during our next appointment.",
    SentAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    IsRead: true,
    ReadAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
];

// New threshold structure - separate rows per vital type
export const mockAlertThresholds: AlertThreshold[] = [
  // Patient 1 - Robert Williams
  { ThresholdID: 1, PatientID: 1, VitalType: 'BloodPressure', MinValue: 110, MaxValue: 140, SetBy: 1, SetAt: new Date('2024-01-15').toISOString(), IsActive: true },
  { ThresholdID: 2, PatientID: 1, VitalType: 'HeartRate', MinValue: 60, MaxValue: 100, SetBy: 1, SetAt: new Date('2024-01-15').toISOString(), IsActive: true },
  { ThresholdID: 3, PatientID: 1, VitalType: 'Glucose', MinValue: 70, MaxValue: 130, SetBy: 1, SetAt: new Date('2024-01-15').toISOString(), IsActive: true },
  { ThresholdID: 4, PatientID: 1, VitalType: 'Temperature', MinValue: 97.0, MaxValue: 99.5, SetBy: 1, SetAt: new Date('2024-01-15').toISOString(), IsActive: true },
  
  // Patient 2 - Mary Thompson
  { ThresholdID: 5, PatientID: 2, VitalType: 'BloodPressure', MinValue: 110, MaxValue: 140, SetBy: 1, SetAt: new Date('2024-03-15').toISOString(), IsActive: true },
  { ThresholdID: 6, PatientID: 2, VitalType: 'HeartRate', MinValue: 60, MaxValue: 100, SetBy: 1, SetAt: new Date('2024-03-15').toISOString(), IsActive: true },
  { ThresholdID: 7, PatientID: 2, VitalType: 'Glucose', MinValue: 70, MaxValue: 130, SetBy: 1, SetAt: new Date('2024-03-15').toISOString(), IsActive: true },
  { ThresholdID: 8, PatientID: 2, VitalType: 'Temperature', MinValue: 97.0, MaxValue: 99.5, SetBy: 1, SetAt: new Date('2024-03-15').toISOString(), IsActive: true },
  
  // Patient 3 - James Anderson (custom thresholds by cardiologist)
  { ThresholdID: 9, PatientID: 3, VitalType: 'BloodPressure', MinValue: 100, MaxValue: 135, SetBy: 2, SetAt: new Date('2024-02-10').toISOString(), IsActive: true },
  { ThresholdID: 10, PatientID: 3, VitalType: 'HeartRate', MinValue: 55, MaxValue: 95, SetBy: 2, SetAt: new Date('2024-02-10').toISOString(), IsActive: true },
  { ThresholdID: 11, PatientID: 3, VitalType: 'Glucose', MinValue: 70, MaxValue: 130, SetBy: 2, SetAt: new Date('2024-02-10').toISOString(), IsActive: true },
  { ThresholdID: 12, PatientID: 3, VitalType: 'Temperature', MinValue: 97.0, MaxValue: 99.5, SetBy: 2, SetAt: new Date('2024-02-10').toISOString(), IsActive: true },
  
  // Patient 4 - Patricia Davis (diabetic - different glucose thresholds)
  { ThresholdID: 13, PatientID: 4, VitalType: 'BloodPressure', MinValue: 110, MaxValue: 140, SetBy: 3, SetAt: new Date('2024-06-05').toISOString(), IsActive: true },
  { ThresholdID: 14, PatientID: 4, VitalType: 'HeartRate', MinValue: 60, MaxValue: 100, SetBy: 3, SetAt: new Date('2024-06-05').toISOString(), IsActive: true },
  { ThresholdID: 15, PatientID: 4, VitalType: 'Glucose', MinValue: 80, MaxValue: 140, SetBy: 3, SetAt: new Date('2024-06-05').toISOString(), IsActive: true },
  { ThresholdID: 16, PatientID: 4, VitalType: 'Temperature', MinValue: 97.0, MaxValue: 99.5, SetBy: 3, SetAt: new Date('2024-06-05').toISOString(), IsActive: true },
  
  // Patient 5 - John Martinez
  { ThresholdID: 17, PatientID: 5, VitalType: 'BloodPressure', MinValue: 110, MaxValue: 140, SetBy: 1, SetAt: new Date('2024-09-12').toISOString(), IsActive: true },
  { ThresholdID: 18, PatientID: 5, VitalType: 'HeartRate', MinValue: 60, MaxValue: 100, SetBy: 1, SetAt: new Date('2024-09-12').toISOString(), IsActive: true },
  { ThresholdID: 19, PatientID: 5, VitalType: 'Glucose', MinValue: 70, MaxValue: 130, SetBy: 1, SetAt: new Date('2024-09-12').toISOString(), IsActive: true },
  { ThresholdID: 20, PatientID: 5, VitalType: 'Temperature', MinValue: 97.0, MaxValue: 99.5, SetBy: 1, SetAt: new Date('2024-09-12').toISOString(), IsActive: true },
];

// ============= UTILITY FUNCTIONS =============

export const getPatientById = (id: number) => mockPatients.find(p => p.PatientID === id);
export const getDoctorById = (id: number) => mockDoctors.find(d => d.DoctorID === id);
export const getVitalRecordsByPatientId = (patientId: number) => mockVitalRecords.filter(v => v.PatientID === patientId);
export const getMedicationsByPatientId = (patientId: number) => mockMedications.filter(m => m.PatientID === patientId);
export const getAlertsByPatientId = (patientId: number) => mockAlerts.filter(a => a.PatientID === patientId);
export const getAlertThresholdsByPatientId = (patientId: number) => mockAlertThresholds.filter(t => t.PatientID === patientId);
export const getActiveAlerts = () => mockAlerts.filter(a => a.Status === 'Active');
export const getPatientsByDoctorId = (doctorId: number) => mockPatients.filter(p => p.AssignedDoctorID === doctorId);
export const getMedicationLogsByPatientId = (patientId: number) => mockMedicationLogs.filter(log => log.PatientID === patientId);
export const getMedicationLogsByMedicationId = (medicationId: number) => mockMedicationLogs.filter(log => log.MedicationID === medicationId);
export const getMessagesByUserId = (userId: number) => mockMessages.filter(m => m.SenderID === userId || m.RecipientID === userId);
export const getUnreadMessagesByRecipientId = (recipientId: number) => mockMessages.filter(m => m.RecipientID === recipientId && !m.IsRead);

// Calculate medication adherence percentage for a patient
export const getMedicationAdherence = (patientId: number): number => {
  const logs = getMedicationLogsByPatientId(patientId);
  const completedLogs = logs.filter(log => log.Status === 'Taken' || log.Status === 'Missed');
  
  if (completedLogs.length === 0) return 100;
  
  const takenLogs = completedLogs.filter(log => log.Status === 'Taken');
  return Math.round((takenLogs.length / completedLogs.length) * 100);
};
