/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoomStatus = 'CO_KHACH' | 'TRONG' | 'KHU_KHUAN' | 'BAO_TRI';

export interface Vitals {
  bp: string;
  hr: number;
  spo2: number;
  temp: number;
  bloodSugar: number;
}

export interface Patient {
  id: string;
  code: string;
  name: string;
  age: number;
  gender: 'Nam' | 'Nữ';
  room: string;
  facility: string;
  doctor: string;
  nurse: string;
  admissionDate: string;
  diagnosis: string;
  dietPlan: string;
  vitals: Vitals;
  allergies: string[];
  fhirResourceId: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    source: string;
  }[];
}

export interface RoomItem {
  id: string;
  name: string;
  facility: string;
  building: string;
  floor: string;
  roomType: string;
  status: RoomStatus;
  guestName: string;
  nurseInCharge: string;
  guestAge?: number;
  guestDiagnosis?: string;
  vitals?: {
    bp: string;
    hr: number;
    spo2: number;
    temp: number;
  };
  notes?: string;
  coordinates?: { x: number; y: number };
}

export interface PrescriptionOrder {
  id: string;
  rxCode: string;
  patientName: string;
  patientCode: string;
  doctorName: string;
  prescribedAt: string;
  pharmacy: 'FPT Long Châu' | 'Nhà Thuốc An Khang';
  items: {
    drugName: string;
    dosage: string;
    quantity: number;
    unit: string;
  }[];
  totalAmount: number;
  status: 'PENDING' | 'PACKING' | 'SHIPPING' | 'DELIVERED';
  trackingNumber: string;
}

export interface Doctor {
  id: string;
  title: string;
  name: string;
  specialty: string;
  degree: string;
  status: 'ON_DUTY' | 'IN_SURGERY' | 'CONSULTING' | 'OFF_DUTY';
  shifts: string;
  patientsCount: number;
}

export interface TelehealthAppointment {
  id: string;
  code: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
  roomAssign: string;
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  meetUrl: string;
  googleCalendarSynced: boolean;
  notes: string;
}

export interface AmbulanceDispatch {
  id: string;
  code: string; // e.g., 'ICU-02', 'ICU-04'
  driver: string;
  doctorOnBoard: string;
  nurseOnBoard: string;
  status: 'STANDBY' | 'DISPATCHED' | 'ON_SCENE' | 'RETURNING';
  currentLocation: string;
  destination: string;
  etaMinutes: number;
  priority: 'EMERGENCY_RED' | 'URGENT_YELLOW' | 'ROUTINE';
  vitalTelemetry: {
    bp: string;
    hr: number;
    spo2: number;
  };
}

export interface DijkstraNode {
  id: string;
  name: string;
  type: 'STATION' | 'HOSPITAL' | 'INTERSECTION';
  x: number;
  y: number;
}

export interface DijkstraEdge {
  from: string;
  to: string;
  distanceKm: number;
  trafficLevel: 'CLEAR' | 'MODERATE' | 'HEAVY';
  weightMinutes: number;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  targetService: string;
  permissions: string[];
  status: 'ACTIVE' | 'REVOKED';
  createdAt: string;
  lastUsedAt: string;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  source: 'Web 2 (Long Châu)' | 'Web 2 (An Khang)' | 'IoT Wearable' | 'Google Calendar';
  event: string;
  payload: Record<string, unknown>;
  statusCode: number;
  responseMessage: string;
}

export interface AuditRequestLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  clientIp: string;
  sourceService: string;
  httpStatus: number;
  latencyMs: number;
  protocol: 'TLS 1.3 / AES-256' | 'gRPC TLS';
}

export interface DailyHealthLog {
  id: string;
  patientId: string;
  patientName: string;
  roomName: string;
  facility: string;
  date: string;
  time: string;
  recordedBy: string;
  recorderRole: 'Bác Sĩ' | 'Điều Dưỡng' | 'Y Tá';
  symptoms: string[];
  painScore: number;
  vitals: Vitals;
  mobilityState: string;
  dietIntake: string;
  mentalState: string;
  clinicalNotes: string;
  treatmentInstructions: string;
}

export interface EmergencyCall {
  id: string;
  roomId: string;
  roomName: string;
  facility: string;
  floor: string;
  patientName: string;
  age: number;
  time: string;
  reason: string;
  status: 'CALLING' | 'ACCEPTED' | 'RESOLVED';
  handledBy?: string;
}

export interface GoogleAccount {
  name: string;
  email: string;
  avatar: string;
  role: 'Bác Sĩ' | 'Điều Dưỡng' | 'Y Tá' | 'Super Administrator';
  roleTitle: string;
  department: string;
}
