export interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface PatientHealthData {
  heartRate: number;
  bloodPressure: string;
  oxygenLevel: number;
  sleepHours: number;
}

export interface XrayAnalysisResponse {
  confidence: number;
  findings: string;
  suspiciousAreas: Array<{ area: string; description: string }>;
  explanation: string;
  disclaimer: string;
}

export interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  medicines: Array<{ name: string; dosage: string; duration: string }>;
  notes: string;
}
