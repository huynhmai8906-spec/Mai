/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  RefreshCw,
  ExternalLink,
  LayoutGrid,
  Users,
  FileText,
  Stethoscope,
  Calendar,
  Bed,
  PhoneCall,
  Share2,
  FileCheck,
  CheckCircle2,
  Search,
  Plus,
  Activity,
  Heart,
  Pill,
  X,
  MapPin,
  Clock,
  Sun,
  Moon,
  Check,
  BellRing,
  Volume2,
  VolumeX,
  LogOut,
  AlertTriangle,
  ClipboardList,
  Thermometer,
  Compass,
  Sparkles,
  Terminal,
  Key,
  Play,
  Download,
  Trash2,
  ArrowRight,
  ArrowLeftRight,
  Send,
  Zap,
  Server,
  FileCode2,
  Ambulance,
  Phone,
  Music,
  Sliders,
  Volume1,
  Lock,
  Boxes,
  Link,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

// ============================================================================
// DATA TYPES & INTERFACES
// ============================================================================

export type RoomStatus = 'CO_KHACH' | 'TRONG' | 'KHU_KHUAN' | 'BAO_TRI';

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

export interface Patient {
  id: string;
  code: string; // EHR Code: EHR-2026-XXXX
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
  vitals: {
    bp: string;
    hr: number;
    spo2: number;
    temp: number;
    bloodSugar: number;
  };
  allergies: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    source: string;
  }[];
  fhirResourceId?: string;
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
  painScore: number; // 0 - 10
  vitals: {
    bp: string;
    hr: number;
    spo2: number;
    temp: number;
    bloodSugar: number;
  };
  mobilityState: string;
  dietIntake: string;
  mentalState: string;
  clinicalNotes: string;
  treatmentInstructions: string;
}

export interface PrescriptionOrder {
  id: string;
  orderCode: string;
  patientName: string;
  patientEHR: string;
  doctorName: string;
  medication: string;
  dosage: string;
  quantity: number;
  unit: string;
  pharmacyHub: 'FPT Long Châu' | 'An Khang';
  status: 'DANG_VAN_CHUYEN' | 'DA_GIAO' | 'DANG_XU_LY';
  createdAt: string;
  deliveryETA: string;
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

export interface DrugItem {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  supplier: string;
  expiryDate: string;
  status: 'SanSang' | 'SapHet' | 'CanDatThem';
  batchNo: string;
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
  patientName: string;
  room: string;
  specialist: string;
  specialty: string;
  time: string;
  type: 'Khám Định Kỳ Lão Khoa' | 'Hội Chẩn Tim Mạch' | 'Vật Lý Trị Liệu';
  googleCalendarSynced: boolean;
  status: 'SAP_DIEN_RA' | 'DANG_DIEN_RA' | 'HOAN_TAT';
}

export interface AmbulanceUnit {
  id: string;
  unitCode: string; // ICU-02, ICU-04
  model: string;
  station: string;
  driver: string;
  doctorLead: string;
  nurseLead: string;
  status: 'SAN_SANG' | 'DANG_DIEU_PHOI' | 'BAO_TRI';
  etaMinutes: number;
  currentLocation: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  direction: 'INBOUND' | 'OUTBOUND';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  operator: string;
  description: string;
}

export interface MedicalBlock {
  blockNumber: number;
  hash: string;
  previousHash: string;
  timestamp: string;
  validatorNode: string;
  patientCode: string;
  patientName: string;
  action: string;
  signature: string;
  status: 'VERIFIED' | 'PENDING';
}

// ============================================================================
// INITIAL SEED DATA
// ============================================================================

const INITIAL_BLOCKCHAIN_LEDGER: MedicalBlock[] = [
  {
    blockNumber: 0,
    hash: '0x8f2d4e8c1b9a70123f8510dcba7691ee45a80f074d2cbfa619895c1102e3b8a1',
    previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    timestamp: '2026-10-08 00:00:01',
    validatorNode: 'GoCare MedChain Genesis Node',
    patientCode: 'SYSTEM',
    patientName: 'Hệ Thống GoCare',
    action: 'Khởi tạo Chuỗi Khối Y Tế Bất Biến (Genesis Block)',
    signature: 'ECDSA-secp256k1:0x41f8...91a2',
    status: 'VERIFIED'
  },
  {
    blockNumber: 1,
    hash: '0x3a4b9c1d8e7f6051289a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
    previousHash: '0x8f2d4e8c1b9a70123f8510dcba7691ee45a80f074d2cbfa619895c1102e3b8a1',
    timestamp: '2026-10-08 07:15:30',
    validatorNode: 'Node GoCare Sala Authority',
    patientCode: 'EHR-2026-0891',
    patientName: 'Trần Thị Thu Hà',
    action: 'Ký số hồ sơ bệnh án HL7/FHIR & Sinh hiệu tiếp nhận',
    signature: 'ECDSA-secp256k1:0x78ab...3c44',
    status: 'VERIFIED'
  },
  {
    blockNumber: 2,
    hash: '0x71e2d3c4b5a69807f1e2d3c4b5a69807f1e2d3c4b5a69807f1e2d3c4b5a69807',
    previousHash: '0x3a4b9c1d8e7f6051289a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
    timestamp: '2026-10-08 08:30:12',
    validatorNode: 'FPT Long Châu Bridge Node',
    patientCode: 'EHR-2026-0891',
    patientName: 'Trần Thị Thu Hà',
    action: 'Xác thực xuất kho đơn thuốc RX-LC-9011 Coversyl Plus',
    signature: 'ECDSA-secp256k1:0x99ff...1e22',
    status: 'VERIFIED'
  },
  {
    blockNumber: 3,
    hash: '0x99a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8',
    previousHash: '0x71e2d3c4b5a69807f1e2d3c4b5a69807f1e2d3c4b5a69807f1e2d3c4b5a69807',
    timestamp: '2026-10-08 09:12:45',
    validatorNode: 'GoCare Clinical Staff Node',
    patientCode: 'EHR-2026-1044',
    patientName: 'Huỳnh Mai',
    action: 'Cập nhật triệu chứng hằng ngày & Sinh hiệu từ Tầng 2 tác nghiệp',
    signature: 'ECDSA-secp256k1:0x55aa...88ee',
    status: 'VERIFIED'
  }
];

const PRESET_ACCOUNTS: GoogleAccount[] = [
  {
    name: 'Huỳnh Mai (Bạn)',
    email: 'huynhmai8906@gmail.com',
    avatar: 'HM',
    role: 'Bác Sĩ',
    roleTitle: 'Bác Sĩ Chuyên Khoa Lão Khoa',
    department: 'Khoa Nội Lão & Phục Hồi Chức Năng'
  },
  {
    name: 'PGS. TS. Trần Vinh Quang',
    email: 'quang.tran@gocare.med.vn',
    avatar: 'VQ',
    role: 'Super Administrator',
    roleTitle: 'Chủ Tịch Hội Đồng Y Khoa',
    department: 'Ban Giám Đốc Chuyên Môn'
  },
  {
    name: 'ĐĐ. Lê Thu Trang',
    email: 'trang.le@gocare.med.vn',
    avatar: 'TT',
    role: 'Điều Dưỡng',
    roleTitle: 'Điều Dưỡng Trưởng Ca Trực',
    department: 'Đội Trực Lão Khoa Sala'
  },
  {
    name: 'Y tá Phạm Thảo Nhi',
    email: 'nhi.pham@gocare.med.vn',
    avatar: 'TN',
    role: 'Y Tá',
    roleTitle: 'Y Tá Chăm Sóc & Vật Lý Trị Liệu',
    department: 'Bộ Phận Trị Liệu Thủy Sinh & Lão Khoa'
  }
];

const INITIAL_ROOMS: RoomItem[] = [
  {
    id: '101',
    name: 'Villa Sen Vàng 101',
    facility: 'GoCare Sala',
    building: 'Khu Villa Biệt Lập A',
    floor: 'Tầng 1 (Khu Vườn Thiền)',
    roomType: 'VIP Villa Đơn Lập',
    status: 'CO_KHACH',
    guestName: 'Trần Thị Thu Hà',
    nurseInCharge: 'ĐĐ. Lê Thu Trang',
    guestAge: 78,
    guestDiagnosis: 'Tăng huyết áp vô căn, Đái tháo đường Type 2 kiểm soát tốt',
    vitals: { bp: '125/80', hr: 74, spo2: 98, temp: 36.6 },
    notes: 'Chế độ ăn giảm muối, theo dõi đường huyết trước bữa ăn 30 phút.',
    coordinates: { x: 22, y: 35 }
  },
  {
    id: '204',
    name: 'Villa Sen Vàng 204',
    facility: 'GoCare Sala',
    building: 'Khu Suite Lão Khoa B',
    floor: 'Tầng 2 (Khu Dưỡng Sinh)',
    roomType: 'VIP Suite Lão Khoa',
    status: 'CO_KHACH',
    guestName: 'Huỳnh Mai',
    nurseInCharge: 'ĐĐ. Phạm Thảo Nhi',
    guestAge: 69,
    guestDiagnosis: 'Phục hồi chức năng sau thay khớp gối nhân tạo tuần thứ 3',
    vitals: { bp: '118/75', hr: 70, spo2: 99, temp: 36.5 },
    notes: 'Tập vật lý trị liệu thủy sinh 15:00 hàng ngày, chườm lạnh sau tập.',
    coordinates: { x: 45, y: 30 }
  },
  {
    id: '302',
    name: 'Sala Premier 302',
    facility: 'GoCare Premier Bạch Đằng',
    building: 'Tòa Nhà Premier Center',
    floor: 'Tầng 3 (Tim Mạch & Chăm Sóc Toàn Diện)',
    roomType: 'Phòng Đôi Tiêu Chuẩn',
    status: 'CO_KHACH',
    guestName: 'Nguyễn Văn Hùng',
    nurseInCharge: 'ĐĐ. Nguyễn Hoài Nam',
    guestAge: 82,
    guestDiagnosis: 'Bệnh mạch vành mạn, suy tim phân suất tống máu bảo tồn (HFpEF)',
    vitals: { bp: '130/85', hr: 68, spo2: 97, temp: 36.7 },
    notes: 'Đeo cảm biến Holter ECG không dây 24/7, hạn chế vận động gắng sức.',
    coordinates: { x: 68, y: 40 }
  },
  {
    id: '303',
    name: 'Sala Premier 303',
    facility: 'GoCare Premier Bạch Đằng',
    building: 'Tòa Nhà Premier Center',
    floor: 'Tầng 3 (Tim Mạch)',
    roomType: 'Phòng Đôi Tiêu Chuẩn',
    status: 'TRONG',
    guestName: 'Chưa xếp khách',
    nurseInCharge: 'Kíp trực Sala 02',
    notes: 'Phòng đã hoàn tất kiểm tra tiện nghi lão khoa & giường điện tự động, sẵn sàng đón khách mới.',
    coordinates: { x: 75, y: 65 }
  },
  {
    id: '401',
    name: 'Sanctuary Suite 401',
    facility: 'GoCare Thảo Điền',
    building: 'Sanctuary Riverside',
    floor: 'Tầng 4 (Khu Thủy Trị Liệu)',
    roomType: 'Phòng Trị Liệu Thủy Sinh',
    status: 'KHU_KHUAN',
    guestName: 'Chưa xếp khách',
    nurseInCharge: 'Đội Khử Khuẩn HEPA',
    notes: 'Đang chạy chu trình khử trùng khí dung UV-C & màng lọc HEPA áp lực dương. Hoàn tất lúc 16:00.',
    coordinates: { x: 30, y: 70 }
  }
];

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p1',
    code: 'EHR-2026-0891',
    name: 'Trần Thị Thu Hà',
    age: 78,
    gender: 'Nữ',
    room: 'Villa Sen Vàng 101',
    facility: 'GoCare Sala',
    doctor: 'PGS. TS. Trần Vinh Quang',
    nurse: 'ĐĐ. Lê Thu Trang',
    admissionDate: '2026-09-15',
    diagnosis: 'Tăng huyết áp vô căn độ II, Đái tháo đường Type 2 kiểm soát tốt, Thoái hóa khớp gối',
    dietPlan: 'Chế độ ăn giảm muối (DASH), giảm carbohydrate tinh chế, bổ sung Omega-3',
    vitals: {
      bp: '125/80',
      hr: 74,
      spo2: 98,
      temp: 36.6,
      bloodSugar: 5.6
    },
    allergies: ['Penicillin', 'Hải sản có vỏ'],
    medications: [
      { name: 'Coversyl Plus Arginine 5mg/1.25mg', dosage: '1 viên', frequency: 'Sáng sau ăn', source: 'Kho Dược Long Châu' },
      { name: 'Glucophage XR 750mg', dosage: '1 viên', frequency: 'Tối sau ăn', source: 'Kho Dược Long Châu' }
    ],
    fhirResourceId: 'urn:uuid:patient-fhir-0891'
  },
  {
    id: 'p2',
    code: 'EHR-2026-1044',
    name: 'Huỳnh Mai',
    age: 69,
    gender: 'Nữ',
    room: 'Villa Sen Vàng 204',
    facility: 'GoCare Sala',
    doctor: 'BSCKII. Vũ Thị Mai',
    nurse: 'ĐĐ. Phạm Thảo Nhi',
    admissionDate: '2026-09-28',
    diagnosis: 'Hậu phẫu thay khớp gối toàn phần (TKR) tuần thứ 3, Loãng xương mức độ trung bình',
    dietPlan: 'Dinh dưỡng giàu canxi, vitamin D3, đạm chất lượng cao phục hồi cơ',
    vitals: {
      bp: '118/75',
      hr: 70,
      spo2: 99,
      temp: 36.5,
      bloodSugar: 5.4
    },
    allergies: ['Không ghi nhận'],
    medications: [
      { name: 'Celebrex 200mg (Celecoxib)', dosage: '1 viên', frequency: 'Trưa sau ăn', source: 'Kho Dược Long Châu' },
      { name: 'Calci D3 MK7', dosage: '1 viên', frequency: 'Sáng sau ăn', source: 'Kho Dược An Khang' }
    ],
    fhirResourceId: 'urn:uuid:patient-fhir-1044'
  },
  {
    id: 'p3',
    code: 'EHR-2026-0773',
    name: 'Nguyễn Văn Hùng',
    age: 82,
    gender: 'Nam',
    room: 'Sala Premier 302',
    facility: 'GoCare Premier Bạch Đằng',
    doctor: 'ThS. BS. Lê Hoàng Long',
    nurse: 'ĐĐ. Nguyễn Hoài Nam',
    admissionDate: '2026-09-10',
    diagnosis: 'Bệnh cơ tim thiếu máu cục bộ sau đặt stent vành năm 2023, Suy tim NYHA II',
    dietPlan: 'Ăn nhạt tuyệt đối, hạn chế nước nhập dưới 1.5 lít/ngày',
    vitals: {
      bp: '130/85',
      hr: 68,
      spo2: 97,
      temp: 36.7,
      bloodSugar: 5.8
    },
    allergies: ['Aspirin (gây kích ứng dạ dày nhẹ)'],
    medications: [
      { name: 'Concor 2.5mg (Bisoprolol)', dosage: '1 viên', frequency: '08:00 sáng', source: 'Kho Dược Long Châu' },
      { name: 'Plavix 75mg (Clopidogrel)', dosage: '1 viên', frequency: 'Trưa', source: 'Kho Dược Long Châu' }
    ],
    fhirResourceId: 'urn:uuid:patient-fhir-0773'
  }
];

const INITIAL_PRESCRIPTIONS: PrescriptionOrder[] = [
  {
    id: 'rx-1',
    orderCode: 'RX-LC-9011',
    patientName: 'Trần Thị Thu Hà',
    patientEHR: 'EHR-2026-0891',
    doctorName: 'PGS. TS. Trần Vinh Quang',
    medication: 'Coversyl Plus Arginine 5mg/1.25mg',
    dosage: '1 viên / sáng (Hộp 30 viên)',
    quantity: 2,
    unit: 'Hộp',
    pharmacyHub: 'FPT Long Châu',
    status: 'DANG_VAN_CHUYEN',
    createdAt: '08:15 - Hôm nay',
    deliveryETA: '15 phút (Đang giao hỏa tốc)'
  },
  {
    id: 'rx-2',
    orderCode: 'RX-LC-9012',
    patientName: 'Huỳnh Mai',
    patientEHR: 'EHR-2026-1044',
    doctorName: 'BSCKII. Vũ Thị Mai',
    medication: 'Celebrex 200mg (Celecoxib Pfizer)',
    dosage: '1 viên / trưa sau ăn (Hộp 30 viên)',
    quantity: 1,
    unit: 'Hộp',
    pharmacyHub: 'FPT Long Châu',
    status: 'DA_GIAO',
    createdAt: '07:45 - Hôm nay',
    deliveryETA: 'Đã nhận tại trạm điều dưỡng Sala'
  },
  {
    id: 'rx-3',
    orderCode: 'RX-AK-4421',
    patientName: 'Nguyễn Văn Hùng',
    patientEHR: 'EHR-2026-0773',
    doctorName: 'ThS. BS. Lê Hoàng Long',
    medication: 'Concor 2.5mg (Bisoprolol Merck)',
    dosage: '1 viên / 08:00 sáng (Hộp 30 viên)',
    quantity: 2,
    unit: 'Hộp',
    pharmacyHub: 'An Khang',
    status: 'DANG_VAN_CHUYEN',
    createdAt: '09:00 - Hôm nay',
    deliveryETA: '25 phút (Đang vận chuyển)'
  }
];

const INITIAL_HEALTH_LOGS: DailyHealthLog[] = [
  {
    id: 'hl-1',
    patientId: 'p1',
    patientName: 'Trần Thị Thu Hà',
    roomName: 'Villa Sen Vàng 101',
    facility: 'GoCare Sala',
    date: '2026-10-08',
    time: '08:15',
    recordedBy: 'Huỳnh Mai (Bạn)',
    recorderRole: 'Bác Sĩ',
    symptoms: ['Không đau ngực', 'Không khó thở', 'Ăn ngủ tốt', 'Hơi mỏi khớp nhẹ buổi sáng'],
    painScore: 2,
    vitals: { bp: '125/80', hr: 74, spo2: 98, temp: 36.6, bloodSugar: 5.6 },
    mobilityState: 'Đi dạo vườn thiền 30 phút cùng điều dưỡng',
    dietIntake: 'Ăn hết 100% khẩu phần giảm muối',
    mentalState: 'Tỉnh táo, vui vẻ, giao tiếp hoạt bát',
    clinicalNotes: 'Huyết áp và đường huyết duy trì mục tiêu điều trị lão khoa. Tim đều rõ, phổi không ran.',
    treatmentInstructions: 'Duy trì Coversyl Plus sáng. Cho tập yoga nhẹ nhàng lúc 16:30.'
  },
  {
    id: 'hl-2',
    patientId: 'p2',
    patientName: 'Huỳnh Mai',
    roomName: 'Villa Sen Vàng 204',
    facility: 'GoCare Sala',
    date: '2026-10-08',
    time: '09:00',
    recordedBy: 'ĐĐ. Phạm Thảo Nhi',
    recorderRole: 'Điều Dưỡng',
    symptoms: ['Gối bớt sưng', 'Không sốt', 'Đi lại tự tin hơn với nạng hỗ trợ'],
    painScore: 3,
    vitals: { bp: '118/75', hr: 70, spo2: 99, temp: 36.5, bloodSugar: 5.4 },
    mobilityState: 'Tự đi có khung hỗ trợ 50m quanh hành lang',
    dietIntake: 'Ăn ngon miệng, đủ dinh dưỡng',
    mentalState: 'Tinh thần lạc quan, rất hợp tác tập luyện',
    clinicalNotes: 'Vết mổ khớp gối khô liền sẹo tốt. Góc gập duỗi đạt tiến độ 95 độ.',
    treatmentInstructions: 'Vật lý trị liệu thủy sinh 15:00. Uống Celebrex sau ăn trưa.'
  }
];

const INITIAL_DRUGS: DrugItem[] = [
  {
    id: 'd1',
    code: 'LC-COV5',
    name: 'Coversyl Plus Arginine 5mg/1.25mg',
    category: 'Tim Mạch - Huyết Áp',
    stock: 148,
    unit: 'Hộp',
    minStock: 20,
    supplier: 'Hệ Thống Nhà Thuốc FPT Long Châu',
    expiryDate: '12/2027',
    status: 'SanSang',
    batchNo: 'LC-VN-9082'
  },
  {
    id: 'd2',
    code: 'LC-GLU750',
    name: 'Glucophage XR 750mg (Metformin)',
    category: 'Nội Tiết - Đái Tháo Đường',
    stock: 92,
    unit: 'Hộp',
    minStock: 15,
    supplier: 'Hệ Thống Nhà Thuốc FPT Long Châu',
    expiryDate: '09/2027',
    status: 'SanSang',
    batchNo: 'LC-VN-4412'
  },
  {
    id: 'd3',
    code: 'LC-CEL200',
    name: 'Celebrex 200mg (Celecoxib Pfizer)',
    category: 'Cơ Xương Khớp - Giảm Đau',
    stock: 35,
    unit: 'Hộp',
    minStock: 30,
    supplier: 'Hệ Thống Nhà Thuốc FPT Long Châu',
    expiryDate: '03/2027',
    status: 'SapHet',
    batchNo: 'LC-VN-1198'
  },
  {
    id: 'd4',
    code: 'LC-CON25',
    name: 'Concor 2.5mg (Bisoprolol Merck)',
    category: 'Tim Mạch - Loạn Nhịp',
    stock: 210,
    unit: 'Hộp',
    minStock: 25,
    supplier: 'Hệ Thống Nhà Thuốc FPT Long Châu',
    expiryDate: '11/2027',
    status: 'SanSang',
    batchNo: 'LC-VN-5520'
  }
];

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc1',
    title: 'Bác Sĩ',
    name: 'Huỳnh Mai (Bạn)',
    specialty: 'Nội Lão Khoa & Điều Trị Toàn Diện',
    degree: 'Bác Sĩ Chuyên Khoa • Đại học Y Dược TP.HCM',
    status: 'ON_DUTY',
    shifts: 'Trực Chuyên Môn Chính - 24/7',
    patientsCount: 14
  },
  {
    id: 'doc2',
    title: 'PGS. TS.',
    name: 'Trần Vinh Quang',
    specialty: 'Chủ Tịch Hội Đồng Lão Khoa & Tim Mạch',
    degree: 'Tiến Sĩ Y Khoa ĐH Y Dược TP.HCM • Tu nghiệp Paris',
    status: 'ON_DUTY',
    shifts: 'Trực Điều Hành Trưởng - 24/7',
    patientsCount: 12
  },
  {
    id: 'doc3',
    title: 'TS. BS.',
    name: 'Lê Hồng Hùng',
    specialty: 'Thần Kinh Lão Khoa & Sa Sút Trí Tuệ',
    degree: 'Tiến sĩ Thần Kinh • Cố vấn Hội Y Học TP.HCM',
    status: 'CONSULTING',
    shifts: 'Ca Chiều (13:30 - 18:00)',
    patientsCount: 9
  },
  {
    id: 'doc4',
    title: 'BSCKII.',
    name: 'Vũ Thị Mai',
    specialty: 'Phục Hồi Chức Năng & Cơ Xương Khớp Lão Khoa',
    degree: 'Bác sĩ Chuyên Khoa II • Nguyên Trưởng Khoa BV Chợ Rẫy',
    status: 'CONSULTING',
    shifts: 'Ca Sáng - Chiều (07:30 - 17:00)',
    patientsCount: 8
  },
  {
    id: 'doc5',
    title: 'ThS. BS.',
    name: 'Lê Hoàng Long',
    specialty: 'Hồi Sức Cấp Cứu & Can Thiệp Tim Mạch',
    degree: 'Thạc sĩ Cấp cứu Đa khoa • Chứng chỉ Quốc tế ACLS',
    status: 'ON_DUTY',
    shifts: 'Đội Trực Cấp Cứu ICU GoCare 115',
    patientsCount: 6
  }
];

const INITIAL_TELEHEALTH: TelehealthAppointment[] = [
  {
    id: 'th-1',
    patientName: 'Huỳnh Mai',
    room: 'Villa Sen Vàng 204',
    specialist: 'BSCKII. Vũ Thị Mai',
    specialty: 'Cơ Xương Khớp & Phục Hồi Chức Năng',
    time: '14:30 - Chiều nay',
    type: 'Vật Lý Trị Liệu',
    googleCalendarSynced: true,
    status: 'SAP_DIEN_RA'
  },
  {
    id: 'th-2',
    patientName: 'Nguyễn Văn Hùng',
    room: 'Sala Premier 302',
    specialist: 'PGS. TS. Trần Vinh Quang',
    specialty: 'Tim Mạch Lão Khoa Toàn Diện',
    time: '16:00 - Chiều nay',
    type: 'Hội Chẩn Tim Mạch',
    googleCalendarSynced: true,
    status: 'SAP_DIEN_RA'
  },
  {
    id: 'th-3',
    patientName: 'Trần Thị Thu Hà',
    room: 'Villa Sen Vàng 101',
    specialist: 'TS. BS. Lê Hồng Hùng',
    specialty: 'Tư Vấn Giấc Ngủ & Trí Nhớ Lão Niên',
    time: '09:00 - Sáng mai',
    type: 'Khám Định Kỳ Lão Khoa',
    googleCalendarSynced: false,
    status: 'SAP_DIEN_RA'
  }
];

const INITIAL_AMBULANCES: AmbulanceUnit[] = [
  {
    id: 'amb-1',
    unitCode: 'ICU-02 Sala',
    model: 'Mercedes-Benz Sprinter Mobile ICU 2026',
    station: 'Trạm Cấp Cứu GoCare Sala',
    driver: 'Nguyễn Văn Định (Lái xe chứng chỉ 115)',
    doctorLead: 'ThS. BS. Lê Hoàng Long',
    nurseLead: 'ĐĐ. Nguyễn Văn Minh',
    status: 'SAN_SANG',
    etaMinutes: 4,
    currentLocation: 'GoCare Sala Campus (Sẵn sàng xuất phát)'
  },
  {
    id: 'amb-2',
    unitCode: 'ICU-04 Thảo Điền',
    model: 'Ford Transit Advanced Life Support (ALS)',
    station: 'Trạm Cấp Cứu GoCare Thảo Điền',
    driver: 'Trần Hữu Lợi',
    doctorLead: 'BS. Trương Tuấn Anh',
    nurseLead: 'ĐĐ. Hoàng Yến',
    status: 'SAN_SANG',
    etaMinutes: 6,
    currentLocation: 'Sanctuary Riverside Hub'
  }
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit-001',
    timestamp: '10:14:02',
    direction: 'INBOUND',
    method: 'GET',
    endpoint: '/api/v1/patients/EHR-2026-0891/vitals',
    statusCode: 200,
    latencyMs: 14,
    operator: 'huynhmai8906@gmail.com (Bác Sĩ)',
    description: 'Truy vấn sinh hiệu trực tiếp bệnh nhân Trần Thị Thu Hà'
  },
  {
    id: 'audit-002',
    timestamp: '10:12:45',
    direction: 'OUTBOUND',
    method: 'POST',
    endpoint: '/api/v1/pharmacy/orders [FPT Long Châu Bridge]',
    statusCode: 201,
    latencyMs: 22,
    operator: 'GoCare Rx Service Bridge',
    description: 'Bắn đơn thuốc Coversyl Plus Arginine sang FPT Long Châu'
  },
  {
    id: 'audit-003',
    timestamp: '10:08:19',
    direction: 'INBOUND',
    method: 'PUT',
    endpoint: '/api/v1/rooms/401/status',
    statusCode: 200,
    latencyMs: 18,
    operator: 'Đội Khử Khuẩn HEPA',
    description: 'Chuyển trạng thái phòng 401 sang KHỬ KHUẨN HEPA'
  },
  {
    id: 'audit-004',
    timestamp: '10:05:00',
    direction: 'INBOUND',
    method: 'POST',
    endpoint: '/api/v1/webhook/wearable-vitals',
    statusCode: 200,
    latencyMs: 12,
    operator: 'IoT Holter Stream Gateway',
    description: 'Nhận nhịp tim 68 bpm và SpO2 97% từ cảm biến Sala 302'
  }
];

// ============================================================================
// WEB AUDIO API SOS EMERGENCY CHIME ENGINE (6 DISTINCT ACOUSTIC PROFILES)
// ============================================================================

export interface SOSChimeOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  toneInfo: string;
  type: 'STANDARD' | 'URGENT' | 'MELODIC' | 'ICU' | 'GENTLE' | 'PULSE';
}

export const SOS_CHIME_OPTIONS: SOSChimeOption[] = [
  {
    id: 'HOSPITAL_TWO_TONE',
    name: 'Chuông Y Viện Tiêu Chuẩn',
    badge: 'Mặc Định Y Tế',
    description: 'Âm sắc đôi B5 (987Hz) ➔ E5 (659Hz) êm dịu, vang vọng chuẩn trạm điều dưỡng quốc tế.',
    toneInfo: 'B5 ➔ E5 (2 hồi nhịp đôi)',
    type: 'STANDARD'
  },
  {
    id: 'CODE_BLUE_SIREN',
    name: 'Còi Cấp Cứu Khẩn Cấp (Code Blue)',
    badge: 'Báo Động Cực Gấp',
    description: 'Chuỗi còi dồn dập tần số 780Hz - 980Hz, cảnh báo cấp cứu ngừng tuần hoàn hoặc tình huống tối khẩn.',
    toneInfo: '780Hz ➔ 980Hz (Quét liên tục)',
    type: 'URGENT'
  },
  {
    id: 'DING_DONG_MELODY',
    name: 'Chuông Ding-Dong Y Tá Gọi',
    badge: 'Giai Điệu Nhẹ',
    description: 'Âm chuông 3 nốt nhạc G5 ➔ E5 ➔ C5 thanh thoát, đặc biệt phù hợp cho khu nghỉ dưỡng lão khoa VIP.',
    toneInfo: 'G5 ➔ E5 ➔ C5 (Hài âm chuông phòng)',
    type: 'MELODIC'
  },
  {
    id: 'ICU_TELEMETRY_BEEP',
    name: 'Cảnh Báo Điện Tử Monitor ICU',
    badge: 'ICU Telemetry',
    description: 'Ba hồi bíp điện tử dứt khoát C6 (1046Hz), mô phỏng chuông monitor theo dõi dấu hiệu sinh tồn.',
    toneInfo: 'C6 1046Hz (3 hồi bíp nhanh)',
    type: 'ICU'
  },
  {
    id: 'GENTLE_ZEN_CHIME',
    name: 'Chuông Lão Khoa Dưỡng Sinh (528Hz)',
    badge: 'Thư Giãn Dịu Êm',
    description: 'Âm chuông thiền Solfeggio 528Hz cộng hưởng 792Hz, không gây giật mình cho người cao tuổi tim mạch.',
    toneInfo: '528Hz Solfeggio & 792Hz',
    type: 'GENTLE'
  },
  {
    id: 'MORPHEUS_PULSE',
    name: 'Âm Nhịp Tim Pulse Alarm',
    badge: 'Nhịp Điệu Sinh Tồn',
    description: 'Nhịp đập sinh học kép hai dải tần số 880Hz + 1174Hz, tạo cảm giác nhắc nhở y tế chuẩn xác.',
    toneInfo: '880Hz + 1174Hz (Dual Pulse)',
    type: 'PULSE'
  }
];

export const playSOSChimeById = (chimeId: string, volume: number = 0.8) => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume();

    const vol = Math.max(0.05, Math.min(1.0, volume));
    const now = ctx.currentTime;

    if (chimeId === 'CODE_BLUE_SIREN') {
      // Urgent siren alternating tones
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(780, now);
      osc.frequency.linearRampToValueAtTime(980, now + 0.18);
      osc.frequency.linearRampToValueAtTime(780, now + 0.36);
      osc.frequency.linearRampToValueAtTime(980, now + 0.54);
      osc.frequency.linearRampToValueAtTime(780, now + 0.72);
      osc.frequency.linearRampToValueAtTime(980, now + 0.90);
      osc.frequency.linearRampToValueAtTime(650, now + 1.15);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35 * vol, now + 0.05);
      gain.gain.setValueAtTime(0.35 * vol, now + 0.95);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } else if (chimeId === 'DING_DONG_MELODY') {
      // 3-note melodic ding-dong: G5 -> E5 -> C5
      const playBellNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.45 * vol, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      playBellNote(783.99, now, 0.45);        // G5
      playBellNote(659.25, now + 0.25, 0.55); // E5
      playBellNote(523.25, now + 0.55, 0.95); // C5
    } else if (chimeId === 'ICU_TELEMETRY_BEEP') {
      // Rapid 3 high-pitch beeps
      const playBeep = (start: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, start); // C6

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.4 * vol, start + 0.02);
        gain.gain.setValueAtTime(0.4 * vol, start + 0.12);
        gain.gain.linearRampToValueAtTime(0.001, start + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.18);
      };

      playBeep(now);
      playBeep(now + 0.22);
      playBeep(now + 0.44);
    } else if (chimeId === 'GENTLE_ZEN_CHIME') {
      // Warm gentle resonant tone (528 Hz Solfeggio & 792 Hz harmonic)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(528, now);
      osc2.frequency.setValueAtTime(792, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35 * vol, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.6);
      osc2.stop(now + 1.6);
    } else if (chimeId === 'MORPHEUS_PULSE') {
      // Life support pulse dual
      const playPulse = (start: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, start);
        osc.frequency.exponentialRampToValueAtTime(1174, start + 0.15);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.35 * vol, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      };

      playPulse(now);
      playPulse(now + 0.4);
    } else {
      // HOSPITAL_TWO_TONE (Default standard)
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4 * vol, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      playTone(987.77, now, 0.45);        // B5
      playTone(659.25, now + 0.2, 0.7);    // E5
      playTone(987.77, now + 0.75, 0.45);  // B5
      playTone(659.25, now + 0.95, 0.85);  // E5
    }
  } catch (err) {
    console.warn('Audio chime warning:', err);
  }
};

const playHospitalNurseCallChime = (vol: number = 0.8) => {
  playSOSChimeById('HOSPITAL_TWO_TONE', vol);
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Theme state: 'light' (clean & clear) vs 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Google Account Auth State
  const [currentAccount, setCurrentAccount] = useState<GoogleAccount>(PRESET_ACCOUNTS[0]);
  const [showGoogleLoginModal, setShowGoogleLoginModal] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Active Navigation Tab (Covers all 10 subsystems + Daily health)
  // 1: TONG_QUAN, 2: BENH_NHAN, 3: KHO_DUOC, 4: BAC_SI, 5: LICH_KHAM,
  // 6: PHONG_NGHI, 7: CAP_CUU, 8: GATEWAY, 9: KIEM_TOAN, 10: REST_TERMINAL
  // Plus: CAP_NHAT_SUC_KHOE
  const [activeTab, setActiveTab] = useState<string>('TONG_QUAN');

  // Master Data States
  const [rooms, setRooms] = useState<RoomItem[]>(INITIAL_ROOMS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>(INITIAL_PRESCRIPTIONS);
  const [drugs] = useState<DrugItem[]>(INITIAL_DRUGS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [telehealthList, setTelehealthList] = useState<TelehealthAppointment[]>(INITIAL_TELEHEALTH);
  const [ambulances] = useState<AmbulanceUnit[]>(INITIAL_AMBULANCES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [healthLogs, setHealthLogs] = useState<DailyHealthLog[]>(INITIAL_HEALTH_LOGS);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFacility, setSelectedFacility] = useState<string>('ALL');

  // Dedicated Login & Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loginUsername, setLoginUsername] = useState<string>('huynhmai8906@gmail.com');
  const [loginPassword, setLoginPassword] = useState<string>('gocare2026');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [registerName, setRegisterName] = useState<string>('');
  const [registerRole, setRegisterRole] = useState<'Bác Sĩ' | 'Điều Dưỡng' | 'Y Tá'>('Bác Sĩ');
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  // Emergency SOS State & Sound Engine
  const [activeEmergencyCall, setActiveEmergencyCall] = useState<EmergencyCall | null>(null);
  const [selectedChimeId, setSelectedChimeId] = useState<string>('HOSPITAL_TWO_TONE');
  const [chimeVolume, setChimeVolume] = useState<number>(0.8);
  const [showChimeModal, setShowChimeModal] = useState<boolean>(false);

  // Live Vital Signs Stream Toggle (Subsystem 2)
  const [isLiveVitalsStreaming, setIsLiveVitalsStreaming] = useState<boolean>(true);

  // Modals & Forms
  const [showAddPatientModal, setShowAddPatientModal] = useState<boolean>(false);
  const [showNewRxModal, setShowNewRxModal] = useState<boolean>(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState<boolean>(false);
  const [showDailyLogModal, setShowDailyLogModal] = useState<boolean>(false);
  const [showFHIRPreviewModal, setShowFHIRPreviewModal] = useState<Patient | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Patient Form State
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState<number>(75);
  const [newPatientGender, setNewPatientGender] = useState<'Nam' | 'Nữ'>('Nữ');
  const [newPatientRoom, setNewPatientRoom] = useState('Villa Sen Vàng 101');
  const [newPatientDoctor, setNewPatientDoctor] = useState('PGS. TS. Trần Vinh Quang');
  const [newPatientDiagnosis, setNewPatientDiagnosis] = useState('Hội chứng lão khoa tổng quát, tăng huyết áp');

  // New Rx Form State
  const [newRxPatient, setNewRxPatient] = useState('Trần Thị Thu Hà');
  const [newRxDrug, setNewRxDrug] = useState('Coversyl Plus Arginine 5mg/1.25mg');
  const [newRxDosage, setNewRxDosage] = useState('1 viên / ngày sau ăn sáng');
  const [newRxQuantity, setNewRxQuantity] = useState<number>(2);
  const [newRxHub, setNewRxHub] = useState<'FPT Long Châu' | 'An Khang'>('FPT Long Châu');

  // New Doctor Form State
  const [newDocTitle, setNewDocTitle] = useState('TS. BS.');
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('Nội Lão Khoa & Lão Học Thực Nghiệm');
  const [newDocDegree, setNewDocDegree] = useState('Tiến sĩ Y học • ĐH Y Dược');

  // Daily Log Form State
  const [selectedPatientForLog, setSelectedPatientForLog] = useState<Patient>(INITIAL_PATIENTS[0]);
  const [logSymptoms, setLogSymptoms] = useState<string[]>(['Tỉnh táo', 'Ăn ngon miệng']);
  const [logPainScore, setLogPainScore] = useState<number>(2);
  const [logBP, setLogBP] = useState<string>('120/80');
  const [logHR, setLogHR] = useState<number>(72);
  const [logSpO2, setLogSpO2] = useState<number>(98);
  const [logTemp, setLogTemp] = useState<number>(36.6);
  const [logBloodSugar, setLogBloodSugar] = useState<number>(5.6);
  const [logMobility, setLogMobility] = useState<string>('Tự đi lại tốt quanh phòng');
  const [logDiet, setLogDiet] = useState<string>('Ăn hết 100% khẩu phần');
  const [logNotes, setLogNotes] = useState<string>('');
  const [logInstructions, setLogInstructions] = useState<string>('');

  // Subsystem 8: Master API Keys
  const [apiKeys, setApiKeys] = useState<{ [key: string]: string }>({
    'GoCare Master': 'GC-KEY-2026-LIVE-8841-A9',
    'Long Châu Sync': 'LC-KEY-PHARMA-SYNC-9920-FPT',
    'An Khang Emergency': 'AK-KEY-EMERGENCY-3312-LIVE'
  });

  // Subsystem 10: REST Sandbox State
  const [terminalEndpoint, setTerminalEndpoint] = useState<string>('/api/v1/patients');
  const [terminalMethod, setTerminalMethod] = useState<'GET' | 'POST' | 'PUT'>('GET');
  const [terminalPayload, setTerminalPayload] = useState<string>('{\n  "status": "ACTIVE"\n}');
  const [terminalResponse, setTerminalResponse] = useState<{ status: number; latency: number; data: unknown } | null>({
    status: 200,
    latency: 16,
    data: {
      success: true,
      count: INITIAL_PATIENTS.length,
      patients: INITIAL_PATIENTS.map(p => ({ code: p.code, name: p.name, room: p.room, doctor: p.doctor }))
    }
  });

  // Dijkstra Algorithm interactive simulation state
  const [dijkstraDestination, setDijkstraDestination] = useState<string>('Villa Sen Vàng 101');
  const [dijkstraResult, setDijkstraResult] = useState<{
    path: string[];
    eta: number;
    distance: string;
    trafficCondition: string;
    dispatchedUnit: string;
  }>({
    path: ['Trạm Cấp Cứu GoCare Sala', 'Đại lộ Mai Chí Thọ', 'Trục Đường Sala Nội Khu', 'Villa Sen Vàng 101'],
    eta: 3.5,
    distance: '1.8 km',
    trafficCondition: 'Thông thoáng (Ưu tiên xe cấp cứu 115)',
    dispatchedUnit: 'ICU-02 Sala'
  });

  // Blockchain Immutable Medical Ledger State
  const [blockchainLedger, setBlockchainLedger] = useState<MedicalBlock[]>(INITIAL_BLOCKCHAIN_LEDGER);
  const [isMiningBlock, setIsMiningBlock] = useState<boolean>(false);
  const [selectedBlockDetail, setSelectedBlockDetail] = useState<MedicalBlock | null>(null);

  // Helper function to mine and commit a block to the immutable chain
  const mineAndCommitBlock = (actionDesc: string, patCode: string, patName: string, validator: string = 'GoCare Node Authority') => {
    setIsMiningBlock(true);
    setTimeout(() => {
      setBlockchainLedger(prevChain => {
        const lastBlock = prevChain[prevChain.length - 1];
        const newBlockNum = lastBlock.blockNumber + 1;
        const randHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const newHash = `0x${randHex}`;
        const newSig = `ECDSA-secp256k1:0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

        const newBlock: MedicalBlock = {
          blockNumber: newBlockNum,
          hash: newHash,
          previousHash: lastBlock.hash,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          validatorNode: validator,
          patientCode: patCode,
          patientName: patName,
          action: actionDesc,
          signature: newSig,
          status: 'VERIFIED'
        };
        return [...prevChain, newBlock];
      });
      setIsMiningBlock(false);
      showToast(`⛓️ Đã đóng khối mới thành công lên GoCare MedChain!`);
    }, 600);
  };

  const isDark = theme === 'dark';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live heart rate animation effect
  useEffect(() => {
    if (!isLiveVitalsStreaming) return;
    const interval = setInterval(() => {
      setPatients(prev =>
        prev.map(p => ({
          ...p,
          vitals: {
            ...p.vitals,
            hr: Math.min(88, Math.max(64, p.vitals.hr + (Math.random() > 0.5 ? 1 : -1))),
            spo2: Math.min(100, Math.max(96, p.vitals.spo2 + (Math.random() > 0.8 ? 1 : 0)))
          }
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [isLiveVitalsStreaming]);

  // Trigger Emergency SOS Call with Web Audio chime
  const triggerEmergencyNurseCall = (room: RoomItem, reasonText?: string) => {
    const newCall: EmergencyCall = {
      id: `call-${Date.now()}`,
      roomId: room.id,
      roomName: room.name,
      facility: room.facility,
      floor: room.floor,
      patientName: room.guestName,
      age: room.guestAge || 78,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      reason: reasonText || 'Bệnh nhân bấm chuông gọi cấp cứu tại giường (SOS) - Cần trợ giúp khẩn cấp!',
      status: 'CALLING'
    };

    setActiveEmergencyCall(newCall);

    if (!isSoundMuted) {
      playSOSChimeById(selectedChimeId, chimeVolume);
    }

    // Add to audit trail
    const newAudit: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      direction: 'INBOUND',
      method: 'POST',
      endpoint: `/api/v1/emergency/nurse-call [${room.name}]`,
      statusCode: 200,
      latencyMs: 11,
      operator: 'Cảm Biến Chuông Tại Giường SOS',
      description: `[SOS KHẨN CẤP] ${room.guestName} tại ${room.name} (${room.floor})`
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    showToast(`🔔 CẢNH BÁO SOS: Chuông gọi cấp cứu tại ${room.name}!`);
  };

  const handleAcceptEmergencyCall = () => {
    if (!activeEmergencyCall) return;
    showToast(`Đã tiếp nhận cuộc gọi phòng ${activeEmergencyCall.roomName}. ${currentAccount.name} đang đến ngay!`);
    setActiveEmergencyCall(null);
  };

  // Add Patient Handler (HL7/FHIR compliant)
  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newCode = `EHR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPat: Patient = {
      id: `pat-${Date.now()}`,
      code: newCode,
      name: newPatientName,
      age: newPatientAge,
      gender: newPatientGender,
      room: newPatientRoom,
      facility: 'GoCare Sala',
      doctor: newPatientDoctor,
      nurse: 'ĐĐ. Lê Thu Trang',
      admissionDate: new Date().toISOString().split('T')[0],
      diagnosis: newPatientDiagnosis,
      dietPlan: 'Chế độ ăn lão khoa cân đối dinh dưỡng',
      vitals: { bp: '120/80', hr: 72, spo2: 98, temp: 36.6, bloodSugar: 5.5 },
      allergies: ['Chưa ghi nhận'],
      medications: [],
      fhirResourceId: `urn:uuid:patient-${newCode.toLowerCase()}`
    };

    setPatients(prev => [newPat, ...prev]);

    // Update room if matches
    setRooms(prev =>
      prev.map(r =>
        r.name === newPatientRoom
          ? { ...r, status: 'CO_KHACH', guestName: newPatientName, guestAge: newPatientAge, guestDiagnosis: newPatientDiagnosis }
          : r
      )
    );

    // Commit to Immutable Blockchain Ledger
    mineAndCommitBlock(
      `Đăng ký bệnh nhân mới & Khởi tạo EHR (${newCode}) chuẩn HL7/FHIR`,
      newCode,
      newPatientName,
      'GoCare Sala Master Node'
    );

    // Audit log
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        direction: 'INBOUND',
        method: 'POST',
        endpoint: '/api/v1/patients [Tạo Hồ Sơ HL7/FHIR]',
        statusCode: 201,
        latencyMs: 19,
        operator: `${currentAccount.name} (${currentAccount.role})`,
        description: `Tạo mới hồ sơ bệnh nhân ${newPatientName} (${newCode})`
      },
      ...prev
    ]);

    setShowAddPatientModal(false);
    setNewPatientName('');
    showToast(`Đã tạo hồ sơ bệnh nhân ${newPatientName} (${newCode}) và lưu Chuỗi Khối Blockchain!`);
  };

  // Add Prescription Handler
  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.name === newRxPatient) || patients[0];
    const orderCode = `RX-${newRxHub === 'FPT Long Châu' ? 'LC' : 'AK'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: PrescriptionOrder = {
      id: `rx-${Date.now()}`,
      orderCode,
      patientName: pat.name,
      patientEHR: pat.code,
      doctorName: currentAccount.name,
      medication: newRxDrug,
      dosage: newRxDosage,
      quantity: newRxQuantity,
      unit: 'Hộp',
      pharmacyHub: newRxHub,
      status: 'DANG_VAN_CHUYEN',
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Vừa kê',
      deliveryETA: '20 phút (Đang đồng bộ giao hỏa tốc)'
    };

    setPrescriptions(prev => [newOrder, ...prev]);

    // Commit Prescription to Blockchain Ledger
    mineAndCommitBlock(
      `Kê toa thuốc [${orderCode}] ${newRxDrug} x${newRxQuantity} gửi kho ${newRxHub}`,
      pat.code,
      pat.name,
      `${newRxHub} Validator Node`
    );

    // Audit log
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        direction: 'OUTBOUND',
        method: 'POST',
        endpoint: `/api/v1/pharmacy/orders [${newRxHub} Bridge]`,
        statusCode: 201,
        latencyMs: 24,
        operator: currentAccount.name,
        description: `Kê đơn ${newRxDrug} cho BN ${pat.name} qua ${newRxHub}`
      },
      ...prev
    ]);

    setShowNewRxModal(false);
    showToast(`Đã gửi đơn thuốc sang hệ thống ${newRxHub} và xác thực trên Blockchain!`);
  };

  // Toggle Rx status
  const handleToggleRxStatus = (id: string) => {
    setPrescriptions(prev =>
      prev.map(rx => {
        if (rx.id === id) {
          const nextStatus = rx.status === 'DANG_VAN_CHUYEN' ? 'DA_GIAO' : 'DANG_VAN_CHUYEN';
          showToast(`Đơn ${rx.orderCode}: Chuyển sang ${nextStatus === 'DA_GIAO' ? 'Đã giao bệnh nhân' : 'Đang vận chuyển'}`);
          return {
            ...rx,
            status: nextStatus,
            deliveryETA: nextStatus === 'DA_GIAO' ? 'Đã nhận tại giường bệnh nhân' : '15 phút (Đang vận chuyển)'
          };
        }
        return rx;
      })
    );
  };

  // Add Doctor Handler
  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      title: newDocTitle,
      name: newDocName,
      specialty: newDocSpecialty,
      degree: newDocDegree,
      status: 'ON_DUTY',
      shifts: 'Ca Trực Chuyên Gia 24/7',
      patientsCount: 0
    };
    setDoctors(prev => [...prev, newDoc]);
    setShowAddDoctorModal(false);
    setNewDocName('');
    showToast(`Đã thêm ${newDocTitle} ${newDocName} vào Hội Đồng Cố Vấn Y Khoa!`);
  };

  // Synchronize Google Calendar
  const handleSyncGoogleCalendar = (id: string) => {
    setTelehealthList(prev =>
      prev.map(item => (item.id === id ? { ...item, googleCalendarSynced: true } : item))
    );
    showToast('Đã đồng bộ lịch hẹn sang Google Calendar của Bác Sĩ & Bệnh Nhân!');
  };

  // Room status change
  const handleSetRoomStatus = (roomId: string, newStatus: RoomStatus) => {
    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          let updatedGuest = r.guestName;
          let updatedNurse = r.nurseInCharge;
          let note = r.notes;

          if (newStatus === 'TRONG') {
            updatedGuest = 'Chưa xếp khách';
            updatedNurse = 'Kíp trực Sala 02';
            note = 'Phòng đã sẵn sàng tiếp nhận người cao tuổi mới.';
          } else if (newStatus === 'KHU_KHUAN') {
            updatedGuest = 'Chưa xếp khách';
            updatedNurse = 'Đội Khử Khuẩn HEPA';
            note = 'Đang tiến hành phun khử khuẩn quang hóa HEPA & UV-C.';
          } else if (newStatus === 'CO_KHACH') {
            if (r.guestName === 'Chưa xếp khách') {
              updatedGuest = 'Khách Mới (Bà Lê Kim Oanh)';
              updatedNurse = currentAccount.name;
              note = 'Đón tiếp khách nghỉ dưỡng và kiểm tra sinh hiệu ban đầu.';
            }
          }
          return { ...r, status: newStatus, guestName: updatedGuest, nurseInCharge: updatedNurse, notes: note };
        }
        return r;
      })
    );
    showToast(`Đã cập nhật trạng thái phòng thành công!`);
  };

  // Webhook Simulator Action (Subsystem 8)
  const handleFireWebhookEvent = (eventType: string) => {
    if (eventType === 'DRUG_DELIVERED') {
      showToast('⚡ Webhook Long Châu: Đã giao xong thuốc tại phòng Sen Vàng 101!');
      setPrescriptions(prev =>
        prev.map((rx, idx) => (idx === 0 ? { ...rx, status: 'DA_GIAO', deliveryETA: 'Vừa giao xong lúc này' } : rx))
      );
    } else if (eventType === 'NEW_TELEHEALTH') {
      const newAppt: TelehealthAppointment = {
        id: `th-${Date.now()}`,
        patientName: 'Huỳnh Mai',
        room: 'Villa Sen Vàng 204',
        specialist: 'TS. BS. Lê Hồng Hùng',
        specialty: 'Khám Lão Khoa & Đánh Giá Giấc Ngủ',
        time: '17:00 - Hôm nay',
        type: 'Khám Định Kỳ Lão Khoa',
        googleCalendarSynced: true,
        status: 'SAP_DIEN_RA'
      };
      setTelehealthList(prev => [newAppt, ...prev]);
      showToast('⚡ Webhook An Khang: Đã tạo tự động buổi hội chẩn chuyên khoa mới!');
    } else if (eventType === 'WEARABLE_ANOMALY') {
      showToast('⚡ Webhook IoT: Thiết bị đeo phát hiện nhịp tim dao động! Đã đồng bộ cảnh báo.');
      triggerEmergencyNurseCall(rooms[0], 'Cảnh báo từ thiết bị đeo thông minh: Nhịp tim tăng 105 bpm');
    }

    // Record webhook into audit trail
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        direction: 'INBOUND',
        method: 'POST',
        endpoint: `/api/v1/webhook/${eventType.toLowerCase()}`,
        statusCode: 200,
        latencyMs: 16,
        operator: 'Webhook Bridge Sim (Web 2 ➔ Web 1)',
        description: `Bắn sự kiện giả lập: ${eventType}`
      },
      ...prev
    ]);
  };

  // Calculate Dijkstra Emergency Route
  const handleRunDijkstra = (destRoomName: string) => {
    setDijkstraDestination(destRoomName);
    const room = rooms.find(r => r.name === destRoomName) || rooms[0];
    let eta = 3.2;
    let distance = '1.8 km';
    let path = ['Trạm Cấp Cứu GoCare Sala', 'Đại lộ Mai Chí Thọ', 'Trục Đường Sala', destRoomName];

    if (room.facility.includes('Thảo Điền')) {
      eta = 5.5;
      distance = '3.4 km';
      path = ['Trạm Cấp Cứu GoCare Thảo Điền', 'Đường Nguyễn Văn Hưởng', 'Sanctuary Riverside', destRoomName];
    } else if (room.facility.includes('Bạch Đằng')) {
      eta = 4.1;
      distance = '2.2 km';
      path = ['Trạm Cấp Cứu Bạch Đằng', 'Đường Bạch Đằng', 'Premier Center', destRoomName];
    }

    setDijkstraResult({
      path,
      eta,
      distance,
      trafficCondition: 'Đã mở luồng xanh ưu tiên xe 115',
      dispatchedUnit: room.facility.includes('Thảo Điền') ? 'ICU-04 Thảo Điền' : 'ICU-02 Sala'
    });

    showToast(`Thuật toán Dijkstra: Lộ trình tối ưu tới ${destRoomName} - ETA ${eta} phút`);
  };

  // REST API Sandbox execution
  const handleRunRestSandbox = () => {
    const startTime = performance.now();
    let responseData: unknown = {};
    let status = 200;

    if (terminalEndpoint === '/api/v1/patients') {
      responseData = { count: patients.length, patients };
    } else if (terminalEndpoint === '/api/v1/rooms') {
      responseData = { count: rooms.length, rooms };
    } else if (terminalEndpoint === '/api/v1/pharmacy/orders') {
      responseData = { count: prescriptions.length, orders: prescriptions };
    } else if (terminalEndpoint === '/api/v1/doctors') {
      responseData = { count: doctors.length, doctors };
    } else if (terminalEndpoint === '/api/v1/telehealth/appointments') {
      responseData = { count: telehealthList.length, appointments: telehealthList };
    } else if (terminalEndpoint === '/api/v1/emergency/dijkstra-eta') {
      responseData = dijkstraResult;
    } else if (terminalEndpoint === '/api/v1/audit-trail') {
      responseData = { count: auditLogs.length, logs: auditLogs };
    } else {
      responseData = { message: 'Thao tác API thành công', endpoint: terminalEndpoint, timestamp: new Date().toISOString() };
    }

    const latency = Math.round(performance.now() - startTime + Math.floor(Math.random() * 12 + 10));
    setTerminalResponse({ status, latency, data: responseData });
    showToast(`REST Sandbox: Đã thực thi [${terminalMethod} ${terminalEndpoint}] (${latency}ms)`);
  };

  // KPI calculations
  const occupiedCount = rooms.filter(r => r.status === 'CO_KHACH').length;
  const occupancyPercent = Math.round((occupiedCount / rooms.length) * 100);
  const deliveringRxCount = prescriptions.filter(p => p.status === 'DANG_VAN_CHUYEN').length;

  // ============================================================================
  // AUTHENTICATION VIEW: THE DEDICATED LOGIN & REGISTER WRAPPER
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070d19] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden select-text">
        {/* Ambient glowing radial effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="text-xl sm:text-2xl font-bold text-amber-300 tracking-tight flex items-center gap-2">
              GoCare Cloud Admin
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                /admin v3.0.0 MASTER
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Hệ Thống Quản Trị Y Khoa & Điều Hành 2-Web
            </div>
          </div>
        </div>

        {/* The Exact User Requested Login / Register Card */}
        <div className="wrapper">
          <form
            onSubmit={e => {
              e.preventDefault();
              setIsAuthenticated(true);
              showToast(`Đăng nhập thành công với tài khoản: ${currentAccount.name}`);
            }}
          >
            <h1>{authMode === 'LOGIN' ? 'Login' : 'Register'}</h1>

            {authMode === 'REGISTER' && (
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Họ & Tên Bác Sĩ / Điều Dưỡng"
                  required
                  value={registerName}
                  onChange={e => setRegisterName(e.target.value)}
                />
                <i className="bx bxs-id-card"></i>
              </div>
            )}

            <div className="input-box">
              <input
                type="text"
                placeholder="Username hoặc Email"
                required
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
              />
              <i className="bx bxs-user"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>

            {authMode === 'LOGIN' ? (
              <div className="remember-forgot">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setShowForgotModal(true);
                  }}
                >
                  Forgot password?
                </a>
              </div>
            ) : (
              <div className="mb-4 text-xs">
                <label className="text-slate-300 block mb-1 font-semibold">Vai trò phân quyền y tế:</label>
                <select
                  value={registerRole}
                  onChange={e => setRegisterRole(e.target.value as 'Bác Sĩ' | 'Điều Dưỡng' | 'Y Tá')}
                  className="w-full px-4 py-2.5 rounded-full border border-white/20 bg-slate-900/90 text-white text-xs outline-none"
                >
                  <option value="Bác Sĩ">Bác Sĩ Chuyên Khoa Lão Khoa</option>
                  <option value="Điều Dưỡng">Điều Dưỡng Trưởng</option>
                  <option value="Y Tá">Y Tá Chăm Sóc</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn">
              {authMode === 'LOGIN' ? 'Login' : 'Register'}
            </button>

            {/* Quick Google Sign In */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentAccount(PRESET_ACCOUNTS[0]);
                  setIsAuthenticated(true);
                  showToast('Đã đăng nhập qua Google: huynhmai8906@gmail.com');
                }}
                className="w-full py-2.5 px-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Đăng nhập nhanh với Google (huynhmai8906@gmail.com)</span>
              </button>
            </div>

            <div className="register-link">
              <p>
                {authMode === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
                  }}
                >
                  {authMode === 'LOGIN' ? 'Register' : 'Login'}
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Demo Fast Access */}
        <div className="mt-5 text-xs text-slate-400 flex items-center gap-3">
          <span>Truy cập nhanh Demo:</span>
          <button
            onClick={() => {
              setCurrentAccount(PRESET_ACCOUNTS[0]);
              setIsAuthenticated(true);
            }}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Bác Sĩ Huỳnh Mai
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setCurrentAccount(PRESET_ACCOUNTS[1]);
              setIsAuthenticated(true);
            }}
            className="text-amber-400 hover:underline cursor-pointer"
          >
            PGS.TS Quang (Admin)
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setCurrentAccount(PRESET_ACCOUNTS[2]);
              setIsAuthenticated(true);
            }}
            className="text-emerald-400 hover:underline cursor-pointer"
          >
            ĐĐ. Thu Trang
          </button>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-sm w-full p-6 rounded-2xl bg-[#0f1c38] border border-slate-700 text-left space-y-3">
              <h3 className="font-bold text-base text-white">Khôi Phục Mật Khẩu Y Tế</h3>
              <p className="text-xs text-slate-400">
                Mật khẩu quản trị hệ thống mặc định đã được cấu hình sẵn cho tài khoản <strong>huynhmai8906@gmail.com</strong>.
              </p>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
                Mật khẩu: gocare2026
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setLoginPassword('gocare2026');
                }}
                className="w-full py-2 rounded-lg bg-blue-600 text-white font-bold text-xs cursor-pointer"
              >
                Tự Động Điền Mật Khẩu & Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 select-text ${
        isDark ? 'bg-[#070d19] text-slate-100' : 'bg-[#f4f6f9] text-slate-800'
      }`}
    >
      {/* ==================================================================== */}
      {/* EMERGENCY SOS BANNER (WEB AUDIO API CHIME & LOCATION ALERT)          */}
      {/* ==================================================================== */}
      {activeEmergencyCall && (
        <div className="bg-red-600 text-white px-4 py-3 shadow-2xl z-50 sticky top-0 animate-pulse border-b-2 border-red-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <BellRing className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs sm:text-sm uppercase bg-white text-red-700 px-2 py-0.5 rounded-md">
                    🔔 CHUÔNG CẤP CỨU TẠI GIƯỜNG (SOS)
                  </span>
                  <span className="text-xs bg-red-800 px-2 py-0.5 rounded font-mono">
                    {activeEmergencyCall.time}
                  </span>
                </div>
                <p className="text-xs sm:text-sm mt-1 text-red-100 font-medium">
                  Vị trí: <strong>{activeEmergencyCall.roomName}</strong> ({activeEmergencyCall.facility} • {activeEmergencyCall.floor}) • Bệnh nhân: <strong>{activeEmergencyCall.patientName}</strong> ({activeEmergencyCall.age} tuổi)
                </p>
                <p className="text-xs text-yellow-200 mt-0.5 italic">
                  Lý do: &ldquo;{activeEmergencyCall.reason}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => playSOSChimeById(selectedChimeId, chimeVolume)}
                title="Phát lại tiếng chuông y tế đang chọn"
                className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-red-400"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe Chuông</span>
              </button>

              <button
                onClick={() => setShowChimeModal(true)}
                title="Đổi kiểu chuông hoặc âm lượng SOS"
                className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-900 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-red-500 shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Đổi Chuông</span>
              </button>

              <button
                onClick={handleAcceptEmergencyCall}
                className="px-4 py-1.5 rounded-lg bg-white text-red-700 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Tiếp Nhận & Đến Phòng Ngay</span>
              </button>

              <button
                onClick={() => setActiveEmergencyCall(null)}
                className="p-1.5 rounded-lg bg-red-800 hover:bg-red-900 text-red-200 hover:text-white cursor-pointer"
                title="Đóng cảnh báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MASTER TOP HEADER                                                    */}
      {/* ==================================================================== */}
      <header
        className={`h-16 px-4 sm:px-6 flex items-center justify-between border-b sticky ${
          activeEmergencyCall ? 'top-auto' : 'top-0'
        } z-30 transition-colors ${
          isDark ? 'bg-[#0f1b35] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        {/* Brand & Connection State */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${
              isDark
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-blue-50 text-blue-600 border border-blue-200'
            }`}
          >
            <Shield className="w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`font-bold text-base sm:text-lg tracking-tight ${
                  isDark ? 'text-amber-300' : 'text-slate-900'
                }`}
              >
                GoCare Cloud Admin
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                  isDark
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                /admin v3.0.0 MASTER
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="hidden sm:inline">Quản Trị Y Khoa & Điều Hành 2-Web</span>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>18ms Ping (TLS 1.3 / AES-256)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-2">
          {/* Change SOS Chime Button */}
          <button
            onClick={() => setShowChimeModal(true)}
            title="Cài đặt & đổi loại âm chuông cấp cứu SOS"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
              isDark
                ? 'bg-amber-400/10 border-amber-500/30 text-amber-300 hover:bg-amber-400/20'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="hidden lg:inline">Đổi Chuông SOS</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
              {SOS_CHIME_OPTIONS.find(c => c.id === selectedChimeId)?.badge || 'Chuông'}
            </span>
          </button>

          {/* Quick SOS Test Chime */}
          <button
            onClick={() =>
              triggerEmergencyNurseCall(
                rooms[0],
                'Khách bấm chuông gọi điều dưỡng tại giường - Huyết áp tăng / Chóng mặt nhẹ'
              )
            }
            title="Thử nghiệm tiếng chuông gọi cấp cứu tại giường"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-all cursor-pointer shadow-xs"
          >
            <BellRing className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span className="hidden md:inline">Thử Chuông SOS</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              setIsSoundMuted(!isSoundMuted);
              showToast(isSoundMuted ? 'Đã bật âm thanh chuông y tế' : 'Đã tắt âm thanh chuông');
            }}
            title={isSoundMuted ? 'Bật âm thanh chuông' : 'Tắt âm thanh chuông'}
            className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
              isSoundMuted ? 'bg-slate-200 text-slate-500 border-slate-300' : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            title={isDark ? 'Chuyển sang chế độ sáng dễ nhìn' : 'Chuyển sang chế độ tối'}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* 2-Way Sync Button */}
          <button
            onClick={() => {
              showToast('Đang đồng bộ dữ liệu thời gian thực giữa GoCare & FPT Long Châu / An Khang...');
              setTimeout(() => showToast('✅ Đồng bộ 2-Web hoàn tất (Độ trễ 18ms, TLS 1.3)'), 900);
            }}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer ${
              isDark ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đồng Bộ 2 Chiều</span>
          </button>

          {/* Google Account Login & Switch */}
          <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowGoogleLoginModal(true)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shadow-xs ${
                isDark
                  ? 'bg-slate-800/90 border-slate-700 text-slate-100 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
              title="Đăng nhập / Chuyển tài khoản Google Y tế"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <div className="flex flex-col text-left">
                <span className="font-bold leading-none">{currentAccount.name.split(' ')[0]}</span>
                <span className="text-[10px] text-blue-600 dark:text-amber-400 font-semibold leading-none mt-0.5">
                  {currentAccount.role}
                </span>
              </div>
            </button>
          </div>

          {/* Logout / Lock Screen Button */}
          <button
            onClick={() => {
              setIsAuthenticated(false);
              showToast('Đã khóa phiên làm việc. Màn hình đăng nhập đã sẵn sàng.');
            }}
            title="Đăng xuất / Khóa màn hình (Về trang Login)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all shadow-xs ${
              isDark
                ? 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-red-400 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Đăng Xuất</span>
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN CONTAINER: SIDEBAR NAVIGATION & VIEWPORTS                       */}
      {/* ==================================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* --- LEFT SIDEBAR (10 SUB-SYSTEMS + DAILY HEALTH UPDATE) --- */}
        <aside
          className={`w-64 border-r flex flex-col justify-between shrink-0 overflow-y-auto transition-colors ${
            isDark ? 'bg-[#0d162d] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="p-3">
            {/* Google Account Active Status */}
            <div className="px-3 py-2 mb-2 rounded-lg bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Tài Khoản Google Đang Dùng:
              </div>
              <div className="font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                {currentAccount.name}
              </div>
              <div className="text-[11px] text-blue-600 dark:text-amber-400 font-medium truncate">
                {currentAccount.roleTitle}
              </div>
            </div>

            <div
              className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-400'
              }`}
            >
              10 PHÂN HỆ QUẢN TRỊ (/admin)
            </div>

            <nav className="space-y-1 mt-1">
              {[
                { id: 'TONG_QUAN', label: '1. Tổng Quan Command Center', icon: LayoutGrid, badge: 'Live' },
                { id: 'BENH_NHAN', label: '2. Quản Lý Bệnh Nhân & EHR', icon: Users, badge: `${patients.length}` },
                { id: 'KHO_DUOC', label: '3. Kho Dược & Đơn Long Châu', icon: FileText, badge: `${deliveringRxCount} đang giao` },
                { id: 'BAC_SI', label: '4. Đội Ngũ Bác Sĩ & Lịch Trực', icon: Stethoscope, badge: `${doctors.length}` },
                { id: 'LICH_KHAM', label: '5. Lịch Khám & Telehealth', icon: Calendar, badge: `${telehealthList.length}` },
                { id: 'PHONG_NGHI', label: '6. Sơ Đồ Phòng & Giường Bệnh', icon: Bed, badge: `${occupiedCount}/${rooms.length}` },
                { id: 'CAP_CUU', label: '7. Cấp Cứu GPS & Dijkstra', icon: PhoneCall, badge: activeEmergencyCall ? 'SOS' : '115', isAlert: !!activeEmergencyCall },
                { id: 'GATEWAY', label: '8. Cổng Liên Kết 2-Web Gateway', icon: Share2, badge: '2-WAY' },
                { id: 'KIEM_TOAN', label: '9. Nhật Ký Kiểm Toán Real-time', icon: FileCheck, badge: `${auditLogs.length}` },
                { id: 'REST_TERMINAL', label: '10. REST API Terminal Sandbox', icon: Terminal, badge: '10+ API' },
                { id: 'BLOCKCHAIN_LEDGER', label: '11. Sổ Cái Chuỗi Khối MedChain', icon: Boxes, badge: `${blockchainLedger.length} Khối`, isBlockchain: true },
                { id: 'CAP_NHAT_SUC_KHOE', label: 'Cập Nhật Triệu Chứng Hằng Ngày', icon: ClipboardList, badge: `${healthLogs.length} Bản tin`, isSpecial: true }
              ].map(item => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;

                let activeClass = '';
                if (isActive) {
                  activeClass = isDark
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'bg-blue-50 text-blue-700 font-bold border border-blue-200';
                } else if (item.isAlert) {
                  activeClass = 'bg-red-50 text-red-700 border border-red-300 font-bold animate-pulse';
                } else if (item.isBlockchain) {
                  activeClass = isDark
                    ? 'text-purple-300 hover:bg-purple-950/40 font-medium'
                    : 'text-purple-700 hover:bg-purple-50 font-medium';
                } else if (item.isSpecial) {
                  activeClass = isDark
                    ? 'text-amber-300 hover:bg-slate-800/80 font-medium'
                    : 'text-blue-700 hover:bg-blue-50 font-medium';
                } else {
                  activeClass = isDark
                    ? 'text-slate-300 hover:bg-slate-800/60'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${activeClass}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <IconComponent
                        className={`w-4 h-4 shrink-0 ${item.isAlert ? 'text-red-600 animate-bounce' : ''}`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-semibold rounded shrink-0 ${
                        isActive
                          ? isDark
                            ? 'bg-slate-950/20 text-slate-950 font-extrabold'
                            : 'bg-blue-600 text-white'
                          : item.isAlert
                          ? 'bg-red-600 text-white font-bold'
                          : isDark
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div
            className={`p-3 border-t text-xs ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Chuông Y Tế: {isSoundMuted ? 'Tắt' : 'Bật'}</span>
              </span>
              <button
                onClick={() => setShowGoogleLoginModal(true)}
                className="text-blue-600 hover:underline cursor-pointer text-[11px]"
              >
                Đổi Bác Sĩ/Y Tá
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  showToast('Đã đăng xuất khỏi phiên làm việc. Màn hình Login đã mở.');
                }}
                className="text-red-500 hover:underline cursor-pointer text-[11px] flex items-center gap-1 font-medium"
              >
                <LogOut className="w-3 h-3" />
                <span>Đăng Xuất (Về Màn Hình Login)</span>
              </button>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT VIEWPORT --- */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ================================================================ */}
          {/* 1. TỔNG QUAN COMMAND CENTER (LIVE ANALYTICS)                      */}
          {/* ================================================================ */}
          {activeTab === 'TONG_QUAN' && (
            <div className="space-y-6">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-blue-600" />
                    <span>1. Tổng Quan Command Center (Live Analytics)</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Trung tâm chỉ huy vận hành y khoa & giám sát kết nối 2-Web theo thời gian thực
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    TLS 1.3 / AES-256 (18ms Ping)
                  </span>
                </div>
              </div>

              {/* Comprehensive KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {[
                  {
                    label: 'Tổng Bệnh Nhân Quản Lý',
                    val: `${patients.length}`,
                    sub: '100% Hồ sơ chuẩn HL7/FHIR',
                    color: 'text-blue-600'
                  },
                  {
                    label: 'Đơn Long Châu Đang Giao',
                    val: `${deliveringRxCount}`,
                    sub: 'Giao hỏa tốc đến phòng VIP',
                    color: 'text-amber-600'
                  },
                  {
                    label: 'Tỷ Lệ Lấp Đầy Phòng VIP',
                    val: `${occupancyPercent}%`,
                    sub: `${occupiedCount}/${rooms.length} phòng đang có khách`,
                    color: 'text-emerald-600'
                  },
                  {
                    label: 'Độ Trễ Ping Kết Nối 2 Web',
                    val: '18ms',
                    sub: 'REST & Webhook Bridge ổn định',
                    color: 'text-purple-600'
                  },
                  {
                    label: 'Bảo Mật & Mã Hóa',
                    val: 'TLS 1.3',
                    sub: 'AES-256 end-to-end',
                    color: 'text-indigo-600'
                  }
                ].map((kpi, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <span className="text-xs text-slate-400 block">{kpi.label}</span>
                    <div className={`text-2xl font-bold font-mono mt-1 ${kpi.color}`}>{kpi.val}</div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">{kpi.sub}</span>
                  </div>
                ))}
              </div>

              {/* Interactive 2-Way Data Flow Map */}
              <div
                className={`p-5 rounded-xl border ${
                  isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-sm sm:text-base">
                      Bản Đồ Tương Tác Luồng Dữ Liệu 2 Chiều (2-Way Data Flow Bridge)
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    WebSocket & REST API Đồng Bộ Tự Động
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Left: Web 1 GoCare Master */}
                  <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                        WEB 1: GOCARE MASTER
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-600 text-white font-mono">
                        Port 3000
                      </span>
                    </div>
                    <h4 className="font-bold text-sm">Hệ Thống Nghỉ Dưỡng Lão Khoa</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <li>• 5 Phòng nghỉ dưỡng & Giường bệnh</li>
                      <li>• Bộ đo sinh hiệu IoT trực tiếp</li>
                      <li>• Hội đồng bác sĩ & Kê đơn y lệnh</li>
                    </ul>
                  </div>

                  {/* Middle: The REST & Webhook Bridge */}
                  <div className="flex flex-col items-center justify-center p-3 text-center space-y-2">
                    <div className="w-full flex items-center justify-center gap-2">
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-400 to-amber-400"></div>
                      <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs">
                        <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
                      </div>
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-400 to-blue-400"></div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
                      [REST & Webhook Bridge]
                    </span>
                    <span className="text-[10px] text-slate-400">Độ trễ 18ms • Payload AES-256</span>
                    <button
                      onClick={() => handleFireWebhookEvent('DRUG_DELIVERED')}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-xs"
                    >
                      Bắn Giao Thuốc Thử Nghiệm
                    </button>
                  </div>

                  {/* Right: Web 2 Pharmacy & Partner */}
                  <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                        WEB 2: LONG CHÂU / AN KHANG
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-600 text-white font-mono">
                        Partner API
                      </span>
                    </div>
                    <h4 className="font-bold text-sm">Kho Dược & Dược Phẩm Quốc Gia</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <li>• Xuất kho tự động khi bác sĩ kê toa</li>
                      <li>• Trực thăng / Xe hỏa tốc giao 15-25p</li>
                      <li>• Đồng bộ số lô & hạn dùng dược phẩm</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent EHR Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <h3 className="font-bold text-sm mb-3">Tình Trạng Sinh Hiệu Trực Tiếp (Live Vitals Feed)</h3>
                  <div className="space-y-2 text-xs">
                    {patients.map(p => (
                      <div
                        key={p.id}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{p.name}</div>
                          <span className="text-slate-500">{p.room} • {p.code}</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">HA: {p.vitals.bp}</span>
                          <span className="text-blue-600 font-bold">HR: {p.vitals.hr} bpm</span>
                          <span className="text-amber-600 font-bold">SpO2: {p.vitals.spo2}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <h3 className="font-bold text-sm mb-3">Đơn Thuốc Gần Nhất Qua Cổng Long Châu</h3>
                  <div className="space-y-2 text-xs">
                    {prescriptions.map(rx => (
                      <div
                        key={rx.id}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold">{rx.medication}</div>
                          <span className="text-slate-500">BN: {rx.patientName} • {rx.pharmacyHub}</span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rx.status === 'DA_GIAO'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rx.status === 'DA_GIAO' ? 'Đã Giao' : 'Đang Vận Chuyển'}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1 font-mono">{rx.deliveryETA}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 2. QUẢN LÝ BỆNH NHÂN & HỒ SƠ EHR (PATIENT EHR MASTER)            */}
          {/* ================================================================ */}
          {activeTab === 'BENH_NHAN' && (
            <div className="space-y-5">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>2. Quản Lý Bệnh Nhân & Hồ Sơ EHR (Patient EHR Master)</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hồ sơ bệnh án điện tử định dạng chuẩn y khoa quốc tế HL7/FHIR với bộ đo sinh hiệu trực tiếp
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLiveVitalsStreaming(!isLiveVitalsStreaming)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                      isLiveVitalsStreaming
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    <Activity className={`w-3.5 h-3.5 ${isLiveVitalsStreaming ? 'animate-pulse text-emerald-600' : ''}`} />
                    <span>{isLiveVitalsStreaming ? 'Đang Phát Sinh Hiệu Live' : 'Tạm Dừng Live'}</span>
                  </button>

                  <button
                    onClick={() => setShowAddPatientModal(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Thêm Bệnh Nhân Chuẩn HL7/FHIR</span>
                  </button>
                </div>
              </div>

              {/* Patient EHR Table */}
              <div
                className={`rounded-xl border overflow-hidden ${
                  isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="relative w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên hoặc mã EHR..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Tổng: {patients.length} Hồ sơ EHR
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Mã EHR</th>
                        <th className="py-3 px-4">Họ & Tên</th>
                        <th className="py-3 px-4">Phòng Nghỉ Dưỡng</th>
                        <th className="py-3 px-4">Bác Sĩ Phụ Trách</th>
                        <th className="py-3 px-4">Bộ Đo Sinh Hiệu Trực Tiếp</th>
                        <th className="py-3 px-4 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {patients
                        .filter(
                          p =>
                            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.code.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                            <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                              {p.code}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 dark:text-slate-100">{p.name}</div>
                              <span className="text-[11px] text-slate-400">{p.age} tuổi • {p.gender}</span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                              <div>{p.room}</div>
                              <span className="text-[10px] text-slate-400">{p.facility}</span>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                              {p.doctor}
                            </td>
                            <td className="py-3 px-4 font-mono">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold">
                                  HA: {p.vitals.bp}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-bold">
                                  HR: {p.vitals.hr}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[11px] font-bold">
                                  SpO2: {p.vitals.spo2}%
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[11px] font-bold">
                                  ĐH: {p.vitals.bloodSugar}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1.5">
                              <button
                                onClick={() => setShowFHIRPreviewModal(p)}
                                title="Xem cấu trúc HL7/FHIR JSON"
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 text-[11px] font-mono cursor-pointer"
                              >
                                HL7/FHIR
                              </button>
                              <button
                                onClick={() => {
                                  const jsonStr = JSON.stringify(p, null, 2);
                                  const blob = new Blob([jsonStr], { type: 'application/json' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `${p.code}-HL7-FHIR.json`;
                                  a.click();
                                  showToast(`Đã xuất hồ sơ ${p.code} dạng JSON!`);
                                }}
                                title="Xuất file hồ sơ"
                                className="p-1 rounded text-slate-500 hover:text-blue-600 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 inline" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${p.name} (${p.code})?`)) {
                                    setPatients(prev => prev.filter(x => x.id !== p.id));
                                    showToast(`Đã xóa hồ sơ ${p.code}`);
                                  }
                                }}
                                title="Xóa hồ sơ"
                                className="p-1 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 3. KHO DƯỢC & ĐƠN THUỐC LONG CHÂU / AN KHANG                      */}
          {/* ================================================================ */}
          {activeTab === 'KHO_DUOC' && (
            <div className="space-y-5">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <span>3. Kho Dược & Đơn Thuốc Long Châu / An Khang (Pharmacy Hub & Rx Bridge)</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quản lý danh sách toa thuốc đã kê, liên thông tự động kho FPT Long Châu & An Khang
                  </p>
                </div>

                <button
                  onClick={() => setShowNewRxModal(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Kê Đơn Mới Sang Kho Long Châu / An Khang</span>
                </button>
              </div>

              {/* Prescriptions List */}
              <div
                className={`rounded-xl border overflow-hidden ${
                  isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 font-bold text-xs">
                  Danh Sách Toa Thuốc Bác Sĩ Đã Kê & Trạng Thái Vận Chuyển Hỏa Tốc
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Mã Đơn Thuốc</th>
                        <th className="py-3 px-4">Bệnh Nhân (EHR)</th>
                        <th className="py-3 px-4">Bác Sĩ Kê Đơn</th>
                        <th className="py-3 px-4">Tên Thuốc & Liều Lượng</th>
                        <th className="py-3 px-4">Kho Đối Tác</th>
                        <th className="py-3 px-4">Trạng Thái</th>
                        <th className="py-3 px-4 text-right">Chuyển Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {prescriptions.map(rx => (
                        <tr key={rx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="py-3 px-4 font-mono font-bold text-amber-600">{rx.orderCode}</td>
                          <td className="py-3 px-4 font-medium">
                            {rx.patientName} <span className="text-slate-400 font-mono text-[11px]">({rx.patientEHR})</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{rx.doctorName}</td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 dark:text-slate-100">{rx.medication}</div>
                            <span className="text-[11px] text-slate-500">{rx.dosage} • SL: {rx.quantity} {rx.unit}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-blue-600">{rx.pharmacyHub}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                rx.status === 'DA_GIAO'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                              }`}
                            >
                              {rx.status === 'DA_GIAO' ? 'Đã Giao Bệnh Nhân' : 'Đang Vận Chuyển'}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1 font-mono">{rx.deliveryETA}</div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleToggleRxStatus(rx.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                            >
                              {rx.status === 'DANG_VAN_CHUYEN' ? '➔ Đã Nhận & Giao' : '➔ Đổi Trạng Thái'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Available Drugs in Long Chau Catalog */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <h3 className="font-bold text-sm mb-3">Tồn Kho Liên Thông FPT Long Châu</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {drugs.map(d => (
                    <div
                      key={d.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-1 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-blue-600">{d.code}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                          {d.stock} {d.unit}
                        </span>
                      </div>
                      <div className="font-bold truncate" title={d.name}>{d.name}</div>
                      <div className="text-slate-400 text-[11px]">Hạn dùng: {d.expiryDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 4. ĐỘI NGŨ BÁC SĨ & LỊCH TRỰC HỘI ĐỒNG Y KHOA                    */}
          {/* ================================================================ */}
          {activeTab === 'BAC_SI' && (
            <div className="space-y-5">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    <span>4. Đội Ngũ Bác Sĩ & Lịch Trực Hội Đồng Y Khoa</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hồ sơ các giáo sư, phó giáo sư, tiến sĩ và bác sĩ chuyên khoa phụ trách theo dõi bệnh nhân
                  </p>
                </div>

                <button
                  onClick={() => setShowAddDoctorModal(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm Bác Sĩ Vào Hội Đồng</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map(doc => (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-sm sm:text-base">
                            {doc.title} {doc.name}
                          </h3>
                          <span className="text-xs font-semibold text-blue-600 dark:text-amber-400">
                            {doc.specialty}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            doc.status === 'ON_DUTY'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {doc.status === 'ON_DUTY' ? 'Đang Trực 24/7' : 'Hội Chẩn'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg">
                        {doc.degree}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span>Ca: <strong>{doc.shifts}</strong></span>
                      <span className="font-mono text-blue-600 font-bold">{doc.patientsCount} Bệnh nhân</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 5. QUẢN LÝ LỊCH KHÁM & HỘI CHẨN TELEHEALTH                        */}
          {/* ================================================================ */}
          {activeTab === 'LICH_KHAM' && (
            <div className="space-y-5">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>5. Quản Lý Lịch Khám & Hội Chẩn Telehealth</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lịch hẹn chuyên khoa, phân phòng, tự động đồng bộ sang Google Calendar
                  </p>
                </div>

                <button
                  onClick={() => {
                    setTelehealthList(prev => prev.map(t => ({ ...t, googleCalendarSynced: true })));
                    showToast('Đã đồng bộ toàn bộ lịch khám sang Google Calendar!');
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đồng Bộ Toàn Bộ Google Calendar</span>
                </button>
              </div>

              <div className="space-y-3">
                {telehealthList.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base">{item.type}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                          {item.room}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Bệnh nhân: <strong>{item.patientName}</strong> • Chuyên gia: <strong>{item.specialist}</strong> ({item.specialty})
                      </p>
                      <div className="text-xs font-mono text-blue-600 dark:text-amber-400 font-bold mt-1">
                        Thời gian: {item.time}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                          item.googleCalendarSynced
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        {item.googleCalendarSynced ? 'Đã sync Google Calendar' : 'Chưa sync'}
                      </span>

                      {!item.googleCalendarSynced && (
                        <button
                          onClick={() => handleSyncGoogleCalendar(item.id)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                        >
                          Sync Ngay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 6. SƠ ĐỒ PHÒNG NGHỈ DƯỠNG & GIƯỜNG BỆNH LÃO KHOA                  */}
          {/* ================================================================ */}
          {activeTab === 'PHONG_NGHI' && (
            <div className="space-y-5">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Bed className="w-5 h-5 text-blue-600" />
                    <span>6. Sơ Đồ Phòng Nghỉ Dưỡng & Giường Bệnh Lão Khoa</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quản lý phòng nghỉ các khu Villa Sala, Premier Bạch Đằng, Thảo Điền với nút đổi trạng thái nhanh
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedFacility}
                    onChange={e => setSelectedFacility(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="ALL">Tất cả cơ sở (5 phòng)</option>
                    <option value="GoCare Sala">GoCare Sala</option>
                    <option value="GoCare Premier Bạch Đằng">Premier Bạch Đằng</option>
                    <option value="GoCare Thảo Điền">Thảo Điền</option>
                  </select>
                </div>
              </div>

              {/* Room Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms
                  .filter(r => selectedFacility === 'ALL' || r.facility.includes(selectedFacility))
                  .map(room => {
                    const isCalling = activeEmergencyCall?.roomId === room.id;

                    return (
                      <div
                        key={room.id}
                        className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                          isCalling
                            ? 'border-red-500 ring-2 ring-red-400 bg-red-50/20'
                            : isDark
                            ? 'bg-[#0f1c38] border-slate-800'
                            : 'bg-white border-slate-200 shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-base">{room.name}</h3>
                              <span className="text-xs text-slate-500">
                                {room.facility} • {room.floor}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                room.status === 'CO_KHACH'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : room.status === 'TRONG'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              }`}
                            >
                              {room.status === 'CO_KHACH'
                                ? 'CÓ KHÁCH'
                                : room.status === 'TRONG'
                                ? 'TRỐNG'
                                : 'KHỬ KHUẨN'}
                            </span>
                          </div>

                          <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-xs space-y-1">
                            <div>Khách: <strong>{room.guestName}</strong></div>
                            <div className="text-slate-500">Phụ trách: {room.nurseInCharge}</div>
                            {room.vitals && (
                              <div className="font-mono text-emerald-600 font-bold text-[11px] pt-1">
                                HA: {room.vitals.bp} | HR: {room.vitals.hr} bpm | SpO2: {room.vitals.spo2}%
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick Status Changers */}
                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Đổi Nhanh:</span>
                            <button
                              onClick={() => handleSetRoomStatus(room.id, 'TRONG')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                room.status === 'TRONG'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                              }`}
                            >
                              [Đặt Trống]
                            </button>
                            <button
                              onClick={() => handleSetRoomStatus(room.id, 'CO_KHACH')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                room.status === 'CO_KHACH'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                              }`}
                            >
                              [Có Khách]
                            </button>
                            <button
                              onClick={() => handleSetRoomStatus(room.id, 'KHU_KHUAN')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                room.status === 'KHU_KHUAN'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                              }`}
                            >
                              [Khử Khuẩn]
                            </button>
                          </div>

                          <button
                            onClick={() => triggerEmergencyNurseCall(room, `Khách bấm chuông tại phòng ${room.name}`)}
                            className="w-full py-1 rounded-lg text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <BellRing className="w-3.5 h-3.5" />
                            <span>Bấm Chuông SOS Phòng Này</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 7. TRUNG TÂM ĐIỀU PHỐI CẤP CỨU GPS & DIJKSTRA                     */}
          {/* ================================================================ */}
          {activeTab === 'CAP_CUU' && (
            <div className="space-y-5">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-red-600" />
                    <span>7. Trung Tâm Điều Phối Cấp Cứu GPS & Thuật Toán Dijkstra</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quản lý ca điều phối cấp cứu khẩn cấp, xe cứu thương ICU-02 / ICU-04 và kíp trực 115
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                    Trực 115 Toàn Viện: 24/7 Sẵn Sàng
                  </span>
                </div>
              </div>

              {/* Dijkstra Routing Simulation Box */}
              <div
                className={`p-5 rounded-xl border ${
                  isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-sm sm:text-base">
                      Bộ Tính Toán Lộ Trình Cấp Cứu Dijkstra (Shortest Path & ETA Engine)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Điểm đến cấp cứu:</span>
                    <select
                      value={dijkstraDestination}
                      onChange={e => handleRunDijkstra(e.target.value)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      {rooms.map(r => (
                        <option key={r.id} value={r.name}>{r.name} ({r.facility})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400">Thời gian ETA dự kiến:</span>
                    <div className="text-2xl font-bold font-mono text-red-600">{dijkstraResult.eta} phút</div>
                    <span className="text-[11px] text-slate-500">Khoảng cách: {dijkstraResult.distance}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400">Xe Cứu Thương Điều Phối:</span>
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100">{dijkstraResult.dispatchedUnit}</div>
                    <span className="text-[11px] text-emerald-600 font-semibold">{dijkstraResult.trafficCondition}</span>
                  </div>

                  <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 block mb-1">Các Nút Đồ Thị Dijkstra Tối Ưu:</span>
                    <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
                      {dijkstraResult.path.map((node, i) => (
                        <React.Fragment key={i}>
                          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">
                            {node}
                          </span>
                          {i < dijkstraResult.path.length - 1 && <ArrowRight className="w-3 h-3 text-slate-400" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ICU Ambulances Fleet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ambulances.map(amb => (
                  <div
                    key={amb.id}
                    className={`p-4 rounded-xl border space-y-2 text-xs ${
                      isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Ambulance className="w-5 h-5 text-red-600" />
                        <h4 className="font-bold text-sm">{amb.unitCode}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {amb.status === 'SAN_SANG' ? 'Sẵn Sàng Xuất Kích' : 'Đang Điều Phối'}
                      </span>
                    </div>
                    <div className="text-slate-500">{amb.model} • {amb.station}</div>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 space-y-1">
                      <div>Lái xe: <strong>{amb.driver}</strong></div>
                      <div>Bác sĩ kíp trực: <strong>{amb.doctorLead}</strong></div>
                      <div>Điều dưỡng kíp trực: <strong>{amb.nurseLead}</strong></div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                      <span className="text-slate-400 font-mono">Vị trí: {amb.currentLocation}</span>
                      <button
                        onClick={() => showToast(`Đã phát lệnh kích hoạt khẩn cấp xe ${amb.unitCode}!`)}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
                      >
                        Xuất Phát Ngay
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SOS Chime Sound Configuration Card in Subsystem 7 */}
              <div
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Music className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">Âm Thanh Chuông Cấp Cứu SOS Đang Sử Dụng</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {SOS_CHIME_OPTIONS.find(c => c.id === selectedChimeId)?.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kiểu chuông: <strong>{SOS_CHIME_OPTIONS.find(c => c.id === selectedChimeId)?.name}</strong> • Tần số: <span className="font-mono text-blue-600">{SOS_CHIME_OPTIONS.find(c => c.id === selectedChimeId)?.toneInfo}</span> • Âm lượng: <strong>{Math.round(chimeVolume * 100)}%</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playSOSChimeById(selectedChimeId, chimeVolume)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe Thử</span>
                  </button>
                  <button
                    onClick={() => setShowChimeModal(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Đổi Kiểu Chuông SOS</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 8. CỔNG QUẢN TRỊ LIÊN KẾT 2 WEB (2-WEB GATEWAY MANAGER)           */}
          {/* ================================================================ */}
          {activeTab === 'GATEWAY' && (
            <div className="space-y-5">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-purple-600" />
                    <span>8. Cổng Quản Trị Liên Kết 2 Web (2-Web Gateway Manager)</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quản lý Master API Keys & Bộ giả lập Webhook thời gian thực từ Web 2 sang Web 1
                  </p>
                </div>
              </div>

              {/* Master API Keys Management */}
              <div
                className={`p-5 rounded-xl border space-y-4 ${
                  isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm">Quản Lý Master API Keys Hệ Thống</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {Object.entries(apiKeys).map(([keyName, keyVal]) => (
                    <div
                      key={keyName}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span>{keyName}</span>
                        <span className="font-bold text-emerald-600">ACTIVE</span>
                      </div>
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate text-[11px] bg-white dark:bg-slate-800 p-1.5 rounded border border-slate-200 dark:border-slate-700">
                        {keyVal}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(keyVal);
                          showToast(`Đã sao chép khóa API: ${keyName}`);
                        }}
                        className="text-[11px] text-blue-600 hover:underline cursor-pointer block"
                      >
                        Sao chép mã API Key
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhook Simulator */}
              <div
                className={`p-5 rounded-xl border space-y-4 ${
                  isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-sm">Bộ Giả Lập Webhook (Bắn Thử Sự Kiện Từ Web 2 Sang Web 1)</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Thử nghiệm việc nhận và phân luồng sự kiện Webhook từ đối tác kho dược & thiết bị đeo thông minh
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleFireWebhookEvent('DRUG_DELIVERED')}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-left cursor-pointer transition-all hover:shadow-xs"
                  >
                    <div className="font-bold text-xs text-amber-600">1. Giao Xong Thuốc (Long Châu)</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Bắn sự kiện webhook cập nhật trạng thái đơn thuốc sang Đã Giao
                    </p>
                  </button>

                  <button
                    onClick={() => handleFireWebhookEvent('NEW_TELEHEALTH')}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-left cursor-pointer transition-all hover:shadow-xs"
                  >
                    <div className="font-bold text-xs text-blue-600">2. Tạo Lịch Hội Chẩn (An Khang)</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Đẩy lịch khám chuyên khoa mới vào hàng đợi Telehealth
                    </p>
                  </button>

                  <button
                    onClick={() => handleFireWebhookEvent('WEARABLE_ANOMALY')}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-400 text-left cursor-pointer transition-all hover:shadow-xs"
                  >
                    <div className="font-bold text-xs text-red-600">3. Đẩy Sinh Hiệu Bất Thường (IoT)</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Gửi tín hiệu cảnh báo nhịp tim & kích hoạt chuông y tế SOS
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 9. NHẬT KÝ KIỂM TOÁN (AUDIT TRAIL REAL-TIME LOGS)                 */}
          {/* ================================================================ */}
          {activeTab === 'KIEM_TOAN' && (
            <div className="space-y-5">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                    <span>9. Nhật Ký Kiểm Toán (Audit Trail Real-time Logs)</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bảng theo dõi toàn bộ request Inbound / Outbound, mã HTTP (200 OK), thời gian và độ trễ (ms)
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newLog: AuditLogItem = {
                      id: `audit-${Date.now()}`,
                      timestamp: new Date().toLocaleTimeString('vi-VN'),
                      direction: 'INBOUND',
                      method: 'GET',
                      endpoint: '/api/v1/healthcheck [Ping 2-Web]',
                      statusCode: 200,
                      latencyMs: 18,
                      operator: 'Hệ thống tự động',
                      description: 'Kiểm tra liveness định kỳ 2-Web Bridge'
                    };
                    setAuditLogs(prev => [newLog, ...prev]);
                    showToast('Đã ghi nhận request kiểm toán mới!');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  Tạo Request Mới
                </button>
              </div>

              <div
                className={`rounded-xl border overflow-hidden ${
                  isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Thời Gian</th>
                        <th className="py-3 px-4">Luồng</th>
                        <th className="py-3 px-4">Phương Thức & Endpoint</th>
                        <th className="py-3 px-4">HTTP Mã</th>
                        <th className="py-3 px-4">Độ Trễ</th>
                        <th className="py-3 px-4">Tác Nhân & Mô Tả</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                log.direction === 'INBOUND'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              }`}
                            >
                              {log.direction}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {log.method}
                            </span>{' '}
                            <span className="text-slate-600 dark:text-slate-400">{log.endpoint}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {log.statusCode} OK
                            </span>
                          </td>
                          <td className="py-3 px-4 text-emerald-600 font-bold">{log.latencyMs} ms</td>
                          <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">
                            <div>{log.description}</div>
                            <span className="text-[10px] text-slate-400 font-mono">by {log.operator}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 10. REST API TERMINAL & SANDBOX                                  */}
          {/* ================================================================ */}
          {activeTab === 'REST_TERMINAL' && (
            <div className="space-y-5">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-600" />
                    <span>10. REST API Terminal & Sandbox</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thử nghiệm trực tiếp toàn bộ 10+ endpoint REST API của Backend Node.js với trình hiển thị JSON chi tiết
                  </p>
                </div>
              </div>

              {/* Terminal Controls */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={terminalMethod}
                    onChange={e => setTerminalMethod(e.target.value as 'GET' | 'POST' | 'PUT')}
                    className="text-xs font-mono font-bold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                  </select>

                  <select
                    value={terminalEndpoint}
                    onChange={e => setTerminalEndpoint(e.target.value)}
                    className="flex-1 text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  >
                    <option value="/api/v1/patients">GET /api/v1/patients (Danh sách bệnh nhân HL7/FHIR)</option>
                    <option value="/api/v1/rooms">GET /api/v1/rooms (Sơ đồ phòng nghỉ dưỡng)</option>
                    <option value="/api/v1/pharmacy/orders">GET /api/v1/pharmacy/orders (Đơn thuốc Long Châu)</option>
                    <option value="/api/v1/doctors">GET /api/v1/doctors (Hội đồng bác sĩ chuyên gia)</option>
                    <option value="/api/v1/telehealth/appointments">GET /api/v1/telehealth/appointments (Lịch hội chẩn)</option>
                    <option value="/api/v1/emergency/dijkstra-eta">GET /api/v1/emergency/dijkstra-eta (Tính toán Dijkstra)</option>
                    <option value="/api/v1/audit-trail">GET /api/v1/audit-trail (Nhật ký kiểm toán)</option>
                  </select>

                  <button
                    onClick={handleRunRestSandbox}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Thực Thi (Send Request)</span>
                  </button>
                </div>

                {terminalMethod !== 'GET' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">JSON Request Body:</label>
                    <textarea
                      rows={3}
                      value={terminalPayload}
                      onChange={e => setTerminalPayload(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* JSON Response Viewer */}
              {terminalResponse && (
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isDark ? 'bg-[#0b1325] border-slate-800' : 'bg-slate-900 text-slate-100 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 font-mono">
                        {terminalResponse.status} OK
                      </span>
                      <span className="font-mono text-slate-400">Độ trễ: {terminalResponse.latency} ms</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Content-Type: application/json; charset=utf-8</span>
                  </div>

                  <pre className="p-3 bg-black/40 rounded-lg text-xs font-mono overflow-x-auto text-emerald-400 max-h-96">
                    {JSON.stringify(terminalResponse.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* CẬP NHẬT TRIỆU CHỨNG HẰNG NGÀY (DAILY HEALTH LOGS)               */}
          {/* ================================================================ */}
          {activeTab === 'CAP_NHAT_SUC_KHOE' && (
            <div className="space-y-5">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-emerald-600" />
                    <span>Nhật Ký Cập Nhật Triệu Chứng & Sức Khỏe Hằng Ngày</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ghi nhận triệu chứng lâm sàng, sinh hiệu, mức độ đau VAS và y lệnh điều trị theo từng ngày của bệnh nhân
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedPatientForLog(patients[0]);
                    setShowDailyLogModal(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm Báo Cáo Triệu Chứng Hôm Nay</span>
                </button>
              </div>

              {/* Feed of Daily Logs */}
              <div className="space-y-4">
                {healthLogs.map(log => (
                  <div
                    key={log.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                          {log.patientName.split(' ').slice(-1)[0][0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm sm:text-base">{log.patientName}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                              {log.roomName} ({log.facility})
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            Ngày ghi nhận: <strong className="font-mono">{log.date}</strong> lúc <span className="font-mono">{log.time}</span>
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        Người cập nhật: {log.recordedBy} ({log.recorderRole})
                      </span>
                    </div>

                    {/* Vitals Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-3">
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-xs">
                        <span className="text-slate-400 text-[10px] block">Huyết Áp</span>
                        <span className="font-mono font-bold text-emerald-600 text-sm">{log.vitals.bp} mmHg</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-xs">
                        <span className="text-slate-400 text-[10px] block">Nhịp Tim</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{log.vitals.hr} bpm</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-xs">
                        <span className="text-slate-400 text-[10px] block">SpO2</span>
                        <span className="font-mono font-bold text-blue-600 text-sm">{log.vitals.spo2}%</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-xs">
                        <span className="text-slate-400 text-[10px] block">Nhiệt Độ</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{log.vitals.temp}°C</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-xs col-span-2 sm:col-span-1">
                        <span className="text-slate-400 text-[10px] block">Đường Huyết</span>
                        <span className="font-mono font-bold text-amber-600 text-sm">{log.vitals.bloodSugar} mmol/L</span>
                      </div>
                    </div>

                    {/* Symptoms & Notes */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold text-[10px] uppercase">Triệu chứng lâm sàng:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {log.symptoms.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                              {s}
                            </span>
                          ))}
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[11px]">
                            Thang điểm đau VAS: {log.painScore}/10
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                          <strong className="text-slate-500 block mb-0.5">Đánh giá vận động & ăn uống:</strong>
                          <p>{log.mobilityState} • {log.dietIntake}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                          <strong className="text-blue-600 dark:text-blue-400 block mb-0.5">Y lệnh điều trị & dặn dò:</strong>
                          <p>{log.treatmentInstructions}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* PHÂN HỆ 11: SỔ CÁI CHUỖI KHỐI Y TẾ (BLOCKCHAIN MEDCHAIN)         */}
          {/* ================================================================ */}
          {activeTab === 'BLOCKCHAIN_LEDGER' && (
            <div className="space-y-5">
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-purple-600" />
                    <span>11. Sổ Cái Chuỗi Khối Y Tế Bất Biến (GoCare MedChain Ledger)</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mạng lưới Private Blockchain phân tầng bảo mật: Tầng 1 (Lãnh Đạo & Quản Trị Cấp Cao) giám sát toàn chuỗi, Tầng 2 (Bác Sĩ & Điều Dưỡng) xác thực ký số dữ liệu
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      mineAndCommitBlock(
                        `Xác thực toàn vẹn khối từ node điều hành ${currentAccount.name}`,
                        'SYS-AUDIT',
                        'Toàn Hệ Thống',
                        'Consensus Proof-of-Authority (PoA)'
                      );
                    }}
                    disabled={isMiningBlock}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white cursor-pointer shadow-xs"
                  >
                    <Link className={`w-4 h-4 ${isMiningBlock ? 'animate-spin' : ''}`} />
                    <span>{isMiningBlock ? 'Đang Đóng Khối...' : '+ Đóng Khối Xác Thực Mới'}</span>
                  </button>
                </div>
              </div>

              {/* Blockchain Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div
                  className={`p-3.5 rounded-xl border ${
                    isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <span className="text-[11px] text-slate-400 block mb-1">Chiều Cao Khối (Height):</span>
                  <div className="text-xl font-bold font-mono text-purple-600 flex items-center gap-2">
                    <Boxes className="w-4 h-4" />
                    <span>#{blockchainLedger.length - 1}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Khối Genesis + {blockchainLedger.length - 1} giao dịch</span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border ${
                    isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <span className="text-[11px] text-slate-400 block mb-1">Cơ Chế Đồng Thuận:</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>PoA (Proof-of-Authority)</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">3 Validator Nodes hoạt động</span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border ${
                    isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <span className="text-[11px] text-slate-400 block mb-1">Thuật Toán Ký Số:</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>ECDSA secp256k1</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">SHA-256 Block Hashing</span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border ${
                    isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <span className="text-[11px] text-slate-400 block mb-1">Mức Phân Tầng Phân Quyền:</span>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4" />
                    <span>2 Tầng Bảo Mật Kép</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Tầng 1 Admin • Tầng 2 Y Tá/BS</span>
                </div>
              </div>

              {/* Blockchain Visual Chain */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-purple-600" />
                    <span>Chuỗi Các Khối Ghi Nhận Y Tế Bất Biến (Live MedChain Visualizer)</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Dữ liệu không thể sửa hoặc xóa</span>
                </div>

                <div className="space-y-3">
                  {blockchainLedger.slice().reverse().map((block, idx) => (
                    <div
                      key={block.blockNumber}
                      onClick={() => setSelectedBlockDetail(block)}
                      className={`p-4 rounded-xl border text-xs transition-all cursor-pointer hover:border-purple-500 ${
                        isDark ? 'bg-[#0b1426] border-slate-800 hover:bg-slate-800/50' : 'bg-slate-50 border-slate-200 hover:bg-purple-50/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold font-mono">
                            Khối #{block.blockNumber}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">{block.action}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{block.timestamp}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                            {block.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 font-mono text-[11px]">
                        <div className="space-y-1">
                          <div className="text-slate-400">Current Hash:</div>
                          <div className="text-purple-600 dark:text-purple-400 truncate bg-purple-500/10 px-2 py-1 rounded">
                            {block.hash}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-slate-400">Previous Hash:</div>
                          <div className="text-slate-500 truncate bg-slate-200/50 dark:bg-slate-800 px-2 py-1 rounded">
                            {block.previousHash}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                        <div className="flex items-center gap-3">
                          <span>Bệnh nhân: <strong className="text-slate-800 dark:text-slate-200">{block.patientName}</strong> ({block.patientCode})</span>
                          <span>Node xác thực: <strong className="text-purple-600">{block.validatorNode}</strong></span>
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          Chữ ký: {block.signature}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================================================================== */}
      {/* MODAL: GOOGLE SIGN-IN & ROLE SWITCHER                                */}
      {/* ==================================================================== */}
      {showGoogleLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-5 ${
              isDark ? 'bg-[#0f1c38] border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="font-bold text-base">Đăng Nhập Tài Khoản Google Y Tế</h3>
              </div>
              <button
                onClick={() => setShowGoogleLoginModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Chọn tài khoản Google của bạn để phân quyền làm việc theo đúng vai trò <strong>Bác Sĩ</strong>, <strong>Điều Dưỡng</strong> hoặc <strong>Y Tá</strong> phụ trách cập nhật sức khỏe & tiếp nhận chuông cấp cứu.
            </p>

            <div className="space-y-2.5">
              {PRESET_ACCOUNTS.map((acc, index) => {
                const isSelected = currentAccount.email === acc.email;
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentAccount(acc);
                      setShowGoogleLoginModal(false);
                      showToast(`Đã đăng nhập tài khoản Google: ${acc.name} (${acc.roleTitle})`);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-amber-400/10 border-amber-400'
                          : 'bg-blue-50 border-blue-500'
                        : isDark
                        ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                        {acc.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{acc.name}</div>
                        <div className="text-xs text-slate-500">{acc.email}</div>
                        <div className="text-[11px] text-blue-600 dark:text-amber-400 font-medium">
                          {acc.roleTitle}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-emerald-500" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: TẠO BỆNH NHÂN CHUẨN HL7/FHIR (SUBSYSTEM 2)                    */}
      {/* ==================================================================== */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-lg w-full p-6 rounded-2xl border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-[#0f1c38] border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Thêm Bệnh Nhân Mới (Chuẩn HL7/FHIR)</span>
              </h3>
              <button onClick={() => setShowAddPatientModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Họ & Tên Bệnh Nhân:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lê Thị Thanh Tâm"
                  value={newPatientName}
                  onChange={e => setNewPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tuổi:</label>
                  <input
                    type="number"
                    value={newPatientAge}
                    onChange={e => setNewPatientAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Giới tính:</label>
                  <select
                    value={newPatientGender}
                    onChange={e => setNewPatientGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="Nữ">Nữ</option>
                    <option value="Nam">Nam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Xếp Phòng Nghỉ Dưỡng:</label>
                <select
                  value={newPatientRoom}
                  onChange={e => setNewPatientRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.name}>{r.name} ({r.facility} - {r.status})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Bác Sĩ Phụ Trách:</label>
                <select
                  value={newPatientDoctor}
                  onChange={e => setNewPatientDoctor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={`${d.title} ${d.name}`}>{d.title} {d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Chẩn Đoán Ban Đầu (ICD-10):</label>
                <textarea
                  rows={2}
                  value={newPatientDiagnosis}
                  onChange={e => setNewPatientDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Tạo Hồ Sơ HL7/FHIR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: KÊ ĐƠN THUỐC MỚI SANG LONG CHÂU / AN KHANG (SUBSYSTEM 3)      */}
      {/* ==================================================================== */}
      {showNewRxModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0f1c38] border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Pill className="w-5 h-5 text-amber-600" />
                <span>Kê Toa Thuốc Mới Sang Kho Dược</span>
              </h3>
              <button onClick={() => setShowNewRxModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Chọn Bệnh Nhân:</label>
                <select
                  value={newRxPatient}
                  onChange={e => setNewRxPatient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.code} - {p.room})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Thuốc Cần Kê:</label>
                <select
                  value={newRxDrug}
                  onChange={e => setNewRxDrug(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  {drugs.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Liều Lượng & Cách Dùng:</label>
                <input
                  type="text"
                  value={newRxDosage}
                  onChange={e => setNewRxDosage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Số Lượng (Hộp):</label>
                  <input
                    type="number"
                    min={1}
                    value={newRxQuantity}
                    onChange={e => setNewRxQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kho Liên Thông:</label>
                  <select
                    value={newRxHub}
                    onChange={e => setNewRxHub(e.target.value as 'FPT Long Châu' | 'An Khang')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-blue-600"
                  >
                    <option value="FPT Long Châu">FPT Long Châu</option>
                    <option value="An Khang">An Khang</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewRxModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
                >
                  Gửi Đơn Sang Kho Long Châu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: THÊM BÁC SĨ MỚI (SUBSYSTEM 4)                                */}
      {/* ==================================================================== */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0f1c38] border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <span>Thêm Bác Sĩ Vào Hội Đồng Cố Vấn</span>
              </h3>
              <button onClick={() => setShowAddDoctorModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold block mb-1">Học Hàm:</label>
                  <select
                    value={newDocTitle}
                    onChange={e => setNewDocTitle(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="PGS. TS.">PGS. TS.</option>
                    <option value="TS. BS.">TS. BS.</option>
                    <option value="BSCKII.">BSCKII.</option>
                    <option value="ThS. BS.">ThS. BS.</option>
                    <option value="BS.">BS.</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="font-bold block mb-1">Họ & Tên Bác Sĩ:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Trọng Nghĩa"
                    value={newDocName}
                    onChange={e => setNewDocName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Chuyên Khoa:</label>
                <input
                  type="text"
                  required
                  value={newDocSpecialty}
                  onChange={e => setNewDocSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Bằng Cấp & Nơi Công Tác:</label>
                <input
                  type="text"
                  value={newDocDegree}
                  onChange={e => setNewDocDegree(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Thêm Bác Sĩ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: XEM HL7/FHIR RESOURCE JSON (SUBSYSTEM 2)                      */}
      {/* ==================================================================== */}
      {showFHIRPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-2xl w-full p-6 rounded-2xl border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-[#0f1c38] border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-blue-600" />
                  <span>HL7 FHIR Release 4 (R4) Resource: {showFHIRPreviewModal.code}</span>
                </h3>
                <span className="text-xs text-slate-500">Bệnh nhân: {showFHIRPreviewModal.name}</span>
              </div>
              <button onClick={() => setShowFHIRPreviewModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
              {JSON.stringify(
                {
                  resourceType: 'Patient',
                  id: showFHIRPreviewModal.code,
                  meta: {
                    versionId: '1',
                    lastUpdated: new Date().toISOString(),
                    profile: ['http://hl7.org/fhir/StructureDefinition/Patient']
                  },
                  identifier: [
                    {
                      system: 'urn:gocare:ehr',
                      value: showFHIRPreviewModal.code
                    }
                  ],
                  active: true,
                  name: [
                    {
                      use: 'official',
                      text: showFHIRPreviewModal.name
                    }
                  ],
                  gender: showFHIRPreviewModal.gender === 'Nam' ? 'male' : 'female',
                  generalPractitioner: [
                    {
                      display: showFHIRPreviewModal.doctor
                    }
                  ],
                  managingOrganization: {
                    display: showFHIRPreviewModal.facility
                  },
                  clinicalStatus: {
                    condition: showFHIRPreviewModal.diagnosis,
                    vitals: showFHIRPreviewModal.vitals
                  }
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: FORM CẬP NHẬT TRIỆU CHỨNG HẰNG NGÀY                           */}
      {/* ==================================================================== */}
      {showDailyLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-xl w-full p-6 rounded-2xl border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-[#0f1c38] border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-600" />
                  <span>Cập Nhật Triệu Chứng & Sức Khỏe Hôm Nay</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Người ghi nhận: <strong>{currentAccount.name}</strong> ({currentAccount.role})
                </span>
              </div>
              <button onClick={() => setShowDailyLogModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const newLog: DailyHealthLog = {
                  id: `hl-${Date.now()}`,
                  patientId: selectedPatientForLog.id,
                  patientName: selectedPatientForLog.name,
                  roomName: selectedPatientForLog.room,
                  facility: selectedPatientForLog.facility,
                  date: new Date().toISOString().split('T')[0],
                  time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                  recordedBy: currentAccount.name,
                  recorderRole: currentAccount.role as 'Bác Sĩ' | 'Điều Dưỡng' | 'Y Tá',
                  symptoms: logSymptoms,
                  painScore: logPainScore,
                  vitals: {
                    bp: logBP,
                    hr: logHR,
                    spo2: logSpO2,
                    temp: logTemp,
                    bloodSugar: logBloodSugar
                  },
                  mobilityState: logMobility,
                  dietIntake: logDiet,
                  mentalState: 'Tỉnh táo, hợp tác',
                  clinicalNotes: logNotes || 'Bệnh nhân ổn định',
                  treatmentInstructions: logInstructions || 'Tiếp tục theo dõi'
                };

                setHealthLogs(prev => [newLog, ...prev]);

                // Also update patient vitals
                setPatients(prev =>
                  prev.map(p =>
                    p.id === selectedPatientForLog.id
                      ? { ...p, vitals: newLog.vitals }
                      : p
                  )
                );

                // Commit Daily Vital Signs to Blockchain Ledger
                mineAndCommitBlock(
                  `Cập nhật sinh hiệu & Triệu chứng [BP:${logBP}, HR:${logHR}, SpO2:${logSpO2}%] bởi ${currentAccount.name}`,
                  selectedPatientForLog.code,
                  selectedPatientForLog.name,
                  `Node ${currentAccount.role} Authority`
                );

                setShowDailyLogModal(false);
                showToast(`Đã lưu bản tin sức khỏe BN ${selectedPatientForLog.name} và đóng khối Blockchain!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold block mb-1">Chọn Bệnh Nhân:</label>
                <select
                  value={selectedPatientForLog.id}
                  onChange={e => {
                    const pat = patients.find(p => p.id === e.target.value);
                    if (pat) setSelectedPatientForLog(pat);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.room} - {p.code})</option>
                  ))}
                </select>
              </div>

              {/* Vitals Form Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Huyết Áp (mmHg):</label>
                  <input
                    type="text"
                    value={logBP}
                    onChange={e => setLogBP(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Nhịp Tim (bpm):</label>
                  <input
                    type="number"
                    value={logHR}
                    onChange={e => setLogHR(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">SpO2 (%):</label>
                  <input
                    type="number"
                    value={logSpO2}
                    onChange={e => setLogSpO2(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Nhiệt Độ (°C):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={logTemp}
                    onChange={e => setLogTemp(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Đường Huyết:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={logBloodSugar}
                    onChange={e => setLogBloodSugar(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-xs"
                  />
                </div>
              </div>

              {/* VAS Pain Scale */}
              <div>
                <label className="font-bold block mb-1">Thang Điểm Đau VAS (0 - 10): {logPainScore}/10</label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={logPainScore}
                  onChange={e => setLogPainScore(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Vận Động & Ăn Uống:</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={logMobility}
                    onChange={e => setLogMobility(e.target.value)}
                    placeholder="Vận động..."
                    className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                  />
                  <input
                    type="text"
                    value={logDiet}
                    onChange={e => setLogDiet(e.target.value)}
                    placeholder="Chế độ ăn..."
                    className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Y Lệnh Điều Trị & Dặn Dò Hôm Nay:</label>
                <textarea
                  rows={2}
                  value={logInstructions}
                  onChange={e => setLogInstructions(e.target.value)}
                  placeholder="Y lệnh của bác sĩ / ghi chú điều dưỡng..."
                  className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDailyLogModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  Lưu Báo Cáo Triệu Chứng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: CÀI ĐẶT & ĐỔI CHUÔNG CẤP CỨU SOS                             */}
      {/* ==================================================================== */}
      {showChimeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`max-w-2xl w-full p-6 rounded-2xl border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-[#0f1c38] border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Cài Đặt & Đổi Chuông Cấp Cứu SOS</h3>
                  <p className="text-xs text-slate-500">
                    Chọn 1 trong 6 kiểu âm sắc chuẩn y khoa, mô phỏng trực tiếp bằng Web Audio API không độ trễ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChimeModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control Bar */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>Âm Lượng Chuông Báo Động:</span>
                </span>
                <span className="font-mono font-bold text-blue-600 text-sm">
                  {Math.round(chimeVolume * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={chimeVolume}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setChimeVolume(v);
                  }}
                  className="flex-1 accent-blue-600 cursor-pointer"
                />
                <button
                  onClick={() => playSOSChimeById(selectedChimeId, chimeVolume)}
                  className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 text-xs font-semibold cursor-pointer shrink-0"
                >
                  ▶ Thử Âm Lượng
                </button>
              </div>
            </div>

            {/* List of 6 Chimes */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                DANH SÁCH 6 KIỂU CHUÔNG Y TẾ SẴN CÓ:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SOS_CHIME_OPTIONS.map(chime => {
                  const isSelected = selectedChimeId === chime.id;

                  return (
                    <div
                      key={chime.id}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-amber-400/10 border-amber-400 ring-1 ring-amber-400/30'
                            : 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-500/30'
                          : isDark
                          ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {chime.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                              chime.type === 'URGENT'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                : chime.type === 'MELODIC'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : chime.type === 'GENTLE'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {chime.badge}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-blue-600 dark:text-amber-400 mt-1 font-semibold">
                          Tần số: {chime.toneInfo}
                        </div>

                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {chime.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => playSOSChimeById(chime.id, chimeVolume)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-blue-500" />
                          <span>▶ Nghe Thử</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedChimeId(chime.id);
                            playSOSChimeById(chime.id, chimeVolume);
                            showToast(`Đã đổi chuông SOS sang: "${chime.name}"`);

                            // Audit log
                            setAuditLogs(prev => [
                              {
                                id: `audit-chime-${Date.now()}`,
                                timestamp: new Date().toLocaleTimeString('vi-VN'),
                                direction: 'INBOUND',
                                method: 'PUT',
                                endpoint: `/api/v1/emergency/settings/chime [${chime.id}]`,
                                statusCode: 200,
                                latencyMs: 8,
                                operator: `${currentAccount.name} (${currentAccount.role})`,
                                description: `Đổi chuông cấp cứu SOS sang "${chime.name}"`
                              },
                              ...prev
                            ]);
                          }}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isSelected ? 'Đang Dùng' : 'Chọn Chuông'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Chuông hiện tại: <strong>{SOS_CHIME_OPTIONS.find(c => c.id === selectedChimeId)?.name}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playSOSChimeById(selectedChimeId, chimeVolume);
                    showToast('Đang phát chuông SOS đang chọn!');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <BellRing className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                  <span>Thử Chuông SOS Đang Chọn</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowChimeModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs"
                >
                  Xong & Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
