/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Patient,
  RoomItem,
  PrescriptionOrder,
  Doctor,
  TelehealthAppointment,
  AmbulanceDispatch,
  DijkstraNode,
  DijkstraEdge,
  ApiKeyItem,
  WebhookLog,
  AuditRequestLog,
  DailyHealthLog,
  GoogleAccount
} from './types';

export const INITIAL_GOOGLE_ACCOUNTS: GoogleAccount[] = [
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
    roleTitle: 'Chủ Tịch Hội Đồng Y Khoa Toàn Viện',
    department: 'Ban Giám Đốc Chuyên Môn'
  },
  {
    name: 'TS. BS. Lê Hồng Hùng',
    email: 'hung.le@gocare.med.vn',
    avatar: 'HH',
    role: 'Bác Sĩ',
    roleTitle: 'Tiến Sĩ Bác Sĩ Tim Mạch Can Thiệp',
    department: 'Viện Tim Mạch GoCare'
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

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p1',
    code: 'EHR-8921',
    name: 'Trần Thị Thu Hà',
    age: 78,
    gender: 'Nữ',
    room: 'Villa Sen Vàng 101',
    facility: 'GoCare Sala',
    doctor: 'Huỳnh Mai (Bạn)',
    nurse: 'ĐĐ. Lê Thu Trang',
    admissionDate: '01/10/2026',
    diagnosis: 'Tăng huyết áp vô căn, Đái tháo đường Type 2 kiểm soát tốt',
    dietPlan: 'Chế độ ăn Dưỡng Sinh Lão Khoa - Ít Natri, Giàu Chất Xơ',
    fhirResourceId: 'Patient/fhir-vn-8921-2026',
    vitals: { bp: '125/80', hr: 74, spo2: 98, temp: 36.6, bloodSugar: 6.2 },
    allergies: ['Penicillin', 'Hải sản vỏ cứng'],
    medications: [
      { name: 'Coversyl Plus 5mg/1.25mg', dosage: '1 viên', frequency: 'Sáng sau ăn', source: 'Kho FPT Long Châu' },
      { name: 'Glucophage XR 750mg', dosage: '1 viên', frequency: 'Tối sau ăn', source: 'Kho FPT Long Châu' },
      { name: 'Omega-3 Dược Phẩm', dosage: '1 viên', frequency: 'Trưa sau ăn', source: 'Nhà Thuốc An Khang' }
    ]
  },
  {
    id: 'p2',
    code: 'EHR-8944',
    name: 'Huỳnh Mai',
    age: 69,
    gender: 'Nữ',
    room: 'Villa Sen Vàng 204',
    facility: 'GoCare Sala',
    doctor: 'BSCKII. Vũ Thị Mai',
    nurse: 'ĐĐ. Phạm Thảo Nhi',
    admissionDate: '03/10/2026',
    diagnosis: 'Phục hồi chức năng sau phẫu thuật thay khớp gối nhân tạo',
    dietPlan: 'Chế độ giàu Canxi & Collagen thủy phân',
    fhirResourceId: 'Patient/fhir-vn-8944-2026',
    vitals: { bp: '118/75', hr: 70, spo2: 99, temp: 36.5, bloodSugar: 5.4 },
    allergies: ['Không có'],
    medications: [
      { name: 'Celebrex 200mg', dosage: '1 viên', frequency: 'Sáng sau ăn', source: 'Kho FPT Long Châu' },
      { name: 'Osteocare Plus', dosage: '2 viên', frequency: 'Sáng - Chiều', source: 'Kho FPT Long Châu' }
    ]
  },
  {
    id: 'p3',
    code: 'EHR-8902',
    name: 'Nguyễn Văn Hùng',
    age: 82,
    gender: 'Nam',
    room: 'Sala Premier 302',
    facility: 'GoCare Premier Bạch Đằng',
    doctor: 'TS. BS. Lê Hồng Hùng',
    nurse: 'ĐĐ. Nguyễn Hoài Nam',
    admissionDate: '28/09/2026',
    diagnosis: 'Bệnh mạch vành mạn, suy tim nhẹ NYHA II',
    dietPlan: 'Thực đơn Lão Khoa Tim Mạch Nghiêm Ngặt',
    fhirResourceId: 'Patient/fhir-vn-8902-2026',
    vitals: { bp: '130/85', hr: 68, spo2: 97, temp: 36.7, bloodSugar: 5.8 },
    allergies: ['Aspirin (gây ợ nóng)'],
    medications: [
      { name: 'Concor 2.5mg', dosage: '1 viên', frequency: 'Sáng', source: 'Nhà Thuốc An Khang' },
      { name: 'Plavix 75mg', dosage: '1 viên', frequency: 'Trưa sau ăn', source: 'Kho FPT Long Châu' }
    ]
  }
];

export const INITIAL_ROOMS: RoomItem[] = [
  {
    id: '101',
    name: 'Villa Sen Vàng 101',
    facility: 'GoCare Sala',
    building: 'Khu Villa Sala Đơn Lập',
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
    building: 'Khu Villa Sala Lão Khoa',
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
    building: 'Tòa Nhà Premier Bạch Đằng',
    floor: 'Tầng 3 (Tim Mạch & Lão Khoa)',
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
    building: 'Tòa Nhà Premier Bạch Đằng',
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
    building: 'Sanctuary Thảo Điền Riverside',
    floor: 'Tầng 4 (Khu Thủy Trị Liệu)',
    roomType: 'Phòng Trị Liệu Thủy Sinh',
    status: 'KHU_KHUAN',
    guestName: 'Chưa xếp khách',
    nurseInCharge: 'Đội Khử Khuẩn HEPA',
    notes: 'Đang chạy chu trình khử trùng khí dung UV-C & màng lọc HEPA áp lực dương. Hoàn tất lúc 16:00.',
    coordinates: { x: 30, y: 70 }
  }
];

export const INITIAL_PRESCRIPTIONS: PrescriptionOrder[] = [
  {
    id: 'rx-1',
    rxCode: 'RX-LC-8921-01',
    patientName: 'Trần Thị Thu Hà',
    patientCode: 'EHR-8921',
    doctorName: 'Huỳnh Mai (Bạn)',
    prescribedAt: '2026-10-08 08:30',
    pharmacy: 'FPT Long Châu',
    items: [
      { drugName: 'Coversyl Plus Arginine 5mg/1.25mg', dosage: '1 viên sáng', quantity: 30, unit: 'viên' },
      { drugName: 'Glucophage XR 750mg', dosage: '1 viên tối', quantity: 30, unit: 'viên' }
    ],
    totalAmount: 485000,
    status: 'SHIPPING',
    trackingNumber: 'FPT-LC-VN-7721'
  },
  {
    id: 'rx-2',
    rxCode: 'RX-AK-8944-02',
    patientName: 'Huỳnh Mai',
    patientCode: 'EHR-8944',
    doctorName: 'BSCKII. Vũ Thị Mai',
    prescribedAt: '2026-10-08 09:15',
    pharmacy: 'Nhà Thuốc An Khang',
    items: [
      { drugName: 'Celebrex 200mg Pfizer', dosage: '1 viên sau ăn trưa', quantity: 20, unit: 'viên' },
      { drugName: 'Osteocare Plus Liquid', dosage: '10ml sáng - chiều', quantity: 2, unit: 'chai' }
    ],
    totalAmount: 620000,
    status: 'DELIVERED',
    trackingNumber: 'AK-EXPRESS-4419'
  },
  {
    id: 'rx-3',
    rxCode: 'RX-LC-8902-03',
    patientName: 'Nguyễn Văn Hùng',
    patientCode: 'EHR-8902',
    doctorName: 'TS. BS. Lê Hồng Hùng',
    prescribedAt: '2026-10-08 07:45',
    pharmacy: 'FPT Long Châu',
    items: [
      { drugName: 'Concor Cor 2.5mg Merck', dosage: '1 viên sáng', quantity: 30, unit: 'viên' },
      { drugName: 'Plavix 75mg Sanofi', dosage: '1 viên trưa sau ăn', quantity: 30, unit: 'viên' }
    ],
    totalAmount: 790000,
    status: 'PACKING',
    trackingNumber: 'FPT-LC-VN-9082'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    title: 'PGS. TS.',
    name: 'Trần Vinh Quang',
    specialty: 'Chủ Tịch Hội Đồng Lão Khoa & Tim Mạch',
    degree: 'Tiến Sĩ Y Khoa ĐH Y Dược TP.HCM • Tu nghiệp Paris • 35 năm kinh nghiệm',
    status: 'ON_DUTY',
    shifts: 'Trực Điều Hành Trưởng - 24/7',
    patientsCount: 18
  },
  {
    id: 'doc-2',
    title: 'TS. BS.',
    name: 'Lê Hồng Hùng',
    specialty: 'Tim Mạch Can Thiệp & Cấp Cứu Lão Khoa',
    degree: 'Tiến Sĩ Y Khoa • Nguyên Phó Trưởng Khoa Tim Mạch Can Thiệp BV Chợ Rẫy',
    status: 'ON_DUTY',
    shifts: 'Trực Ban Can Thiệp & Cấp Cứu ICU',
    patientsCount: 14
  },
  {
    id: 'doc-3',
    title: 'Bác Sĩ',
    name: 'Huỳnh Mai (Bạn)',
    specialty: 'Nội Lão Khoa & Phục Hồi Chức Năng',
    degree: 'Bác Sĩ Chuyên Khoa • Đại học Y Dược TP.HCM',
    status: 'ON_DUTY',
    shifts: 'Trực Chuyên Môn Chính - Khu Villa Sala',
    patientsCount: 12
  },
  {
    id: 'doc-4',
    title: 'BSCKII.',
    name: 'Vũ Thị Mai',
    specialty: 'Cơ Xương Khớp & Y Học Tái Tạo Lão Khoa',
    degree: 'Bác sĩ Chuyên Khoa II • Chuyên gia Phục Hồi Chức Năng Sau Phẫu Thuật',
    status: 'CONSULTING',
    shifts: 'Ca Sáng - Chiều (07:30 - 17:00)',
    patientsCount: 8
  },
  {
    id: 'doc-5',
    title: 'ThS. BS.',
    name: 'Lê Hoàng Long',
    specialty: 'Hồi Sức Cấp Cứu & Can Thiệp Khẩn Cấp',
    degree: 'Thạc sĩ Cấp cứu Đa khoa • Chứng chỉ Quốc tế ACLS / ATLS',
    status: 'ON_DUTY',
    shifts: 'Đội Trực Xe Cứu Thương ICU GoCare',
    patientsCount: 6
  }
];

export const INITIAL_TELEHEALTH: TelehealthAppointment[] = [
  {
    id: 'tele-1',
    code: 'TH-2026-001',
    patientName: 'Trần Thị Thu Hà',
    doctorName: 'PGS. TS. Trần Vinh Quang',
    specialty: 'Hội Chẩn Tim Mạch - Nội Tiết Lão Khoa',
    dateTime: '2026-10-08 14:30',
    roomAssign: 'Villa Sen Vàng 101',
    status: 'CONFIRMED',
    meetUrl: 'https://meet.google.com/gocare-tele-8921',
    googleCalendarSynced: true,
    notes: 'Đánh giá nguy cơ tim mạch sau điều chỉnh Coversyl Plus, kiểm tra đường huyết đói.'
  },
  {
    id: 'tele-2',
    code: 'TH-2026-002',
    patientName: 'Huỳnh Mai',
    doctorName: 'BSCKII. Vũ Thị Mai',
    specialty: 'Vật Lý Trị Liệu Thủy Sinh & Khớp Gối',
    dateTime: '2026-10-08 15:30',
    roomAssign: 'Villa Sen Vàng 204',
    status: 'CONFIRMED',
    meetUrl: 'https://meet.google.com/gocare-tele-8944',
    googleCalendarSynced: true,
    notes: 'Đo biên độ gập duỗi thụ động qua camera AI 3D, hướng dẫn bài tập dưới nước.'
  },
  {
    id: 'tele-3',
    code: 'TH-2026-003',
    patientName: 'Nguyễn Văn Hùng',
    doctorName: 'TS. BS. Lê Hồng Hùng',
    specialty: 'Đánh Giá Holter Điện Tâm Đồ 24 Giờ',
    dateTime: '2026-10-09 09:00',
    roomAssign: 'Sala Premier 302',
    status: 'CONFIRMED',
    meetUrl: 'https://meet.google.com/gocare-tele-8902',
    googleCalendarSynced: true,
    notes: 'Phân tích biến thiên nhịp tim (HRV) và các đoạn ST chênh xuống thoáng qua.'
  }
];

export const INITIAL_DISPATCHES: AmbulanceDispatch[] = [
  {
    id: 'amb-1',
    code: 'ICU-02',
    driver: 'Nguyễn Văn Đạt (10 năm lái xe cấp cứu)',
    doctorOnBoard: 'TS. BS. Lê Hồng Hùng',
    nurseOnBoard: 'ĐĐ. Nguyễn Hoài Nam',
    status: 'DISPATCHED',
    currentLocation: 'Đường Nguyễn Cơ Thạch, Sala Thủ Thiêm',
    destination: 'GoCare Premier Bạch Đằng',
    etaMinutes: 4.2,
    priority: 'EMERGENCY_RED',
    vitalTelemetry: {
      bp: '142/90',
      hr: 88,
      spo2: 96
    }
  },
  {
    id: 'amb-2',
    code: 'ICU-04',
    driver: 'Trần Đình Trọng (Kíp trực phản ứng nhanh)',
    doctorOnBoard: 'ThS. BS. Lê Hoàng Long',
    nurseOnBoard: 'ĐĐ. Lê Thu Trang',
    status: 'STANDBY',
    currentLocation: 'Trạm Cấp Cứu Trung Tâm GoCare Sala',
    destination: 'Sẵn sàng điều phối trong bán kính 15km',
    etaMinutes: 0,
    priority: 'ROUTINE',
    vitalTelemetry: {
      bp: '120/80',
      hr: 72,
      spo2: 99
    }
  }
];

// Dijkstra Graph Representation for Optimal Route Finding
export const DIJKSTRA_NODES: DijkstraNode[] = [
  { id: 'SALA', name: 'Trạm GoCare Sala (Xuất phát)', type: 'STATION', x: 20, y: 70 },
  { id: 'THU_THIEM_TUNNEL', name: 'Hầm Thủ Thiêm / Cầu TT1', type: 'INTERSECTION', x: 40, y: 60 },
  { id: 'MAI_CHI_THO', name: 'Đại lộ Mai Chí Thọ', type: 'INTERSECTION', x: 55, y: 75 },
  { id: 'BACH_DANG', name: 'GoCare Premier Bạch Đằng (Đích 1)', type: 'HOSPITAL', x: 75, y: 35 },
  { id: 'THAO_DIEN', name: 'GoCare Thảo Điền (Đích 2)', type: 'HOSPITAL', x: 85, y: 75 },
  { id: 'SAI_GON_BRIDGE', name: 'Cầu Sài Gòn (Nút giao cao tốc)', type: 'INTERSECTION', x: 65, y: 55 }
];

export const DIJKSTRA_EDGES: DijkstraEdge[] = [
  { from: 'SALA', to: 'THU_THIEM_TUNNEL', distanceKm: 2.1, trafficLevel: 'CLEAR', weightMinutes: 2.2 },
  { from: 'SALA', to: 'MAI_CHI_THO', distanceKm: 3.0, trafficLevel: 'CLEAR', weightMinutes: 3.1 },
  { from: 'THU_THIEM_TUNNEL', to: 'BACH_DANG', distanceKm: 3.5, trafficLevel: 'MODERATE', weightMinutes: 4.8 },
  { from: 'MAI_CHI_THO', to: 'SAI_GON_BRIDGE', distanceKm: 4.2, trafficLevel: 'CLEAR', weightMinutes: 3.9 },
  { from: 'SAI_GON_BRIDGE', to: 'BACH_DANG', distanceKm: 2.0, trafficLevel: 'HEAVY', weightMinutes: 6.5 },
  { from: 'SAI_GON_BRIDGE', to: 'THAO_DIEN', distanceKm: 2.8, trafficLevel: 'CLEAR', weightMinutes: 3.0 }
];

export const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'GoCare Master Production Key',
    key: 'GC-KEY-2026-LIVE',
    targetService: 'GoCare Web 1 Internal Core REST & WebSocket',
    permissions: ['READ_EHR', 'WRITE_EHR', 'MANAGE_ROOMS', 'DISPATCH_SOS'],
    status: 'ACTIVE',
    createdAt: '2026-01-01',
    lastUsedAt: 'Vừa xong (12ms trước)'
  },
  {
    id: 'key-2',
    name: 'FPT Long Châu Pharmacy Bridge Key',
    key: 'LC-KEY-PHARMA-SYNC',
    targetService: 'Web 2 (FPT Long Châu ERP Gateway)',
    permissions: ['RECEIVE_RX', 'UPDATE_STOCK', 'DISPATCH_TRACKING'],
    status: 'ACTIVE',
    createdAt: '2026-02-15',
    lastUsedAt: '1 phút trước'
  },
  {
    id: 'key-3',
    name: 'An Khang Emergency & Telehealth Key',
    key: 'AK-KEY-EMERGENCY',
    targetService: 'Web 2 (Nhà Thuốc An Khang & Telehealth Partner)',
    permissions: ['ORDER_DISPATCH', 'VIDEO_MEET_CALLBACK'],
    status: 'ACTIVE',
    createdAt: '2026-03-01',
    lastUsedAt: '5 phút trước'
  }
];

export const INITIAL_WEBHOOK_LOGS: WebhookLog[] = [
  {
    id: 'wh-1',
    timestamp: '10:02:45 - Hôm nay',
    source: 'Web 2 (Long Châu)',
    event: 'PHARMACY_ORDER_SHIPPED',
    payload: {
      orderId: 'RX-LC-8921-01',
      trackingCode: 'FPT-LC-VN-7721',
      carrier: 'FPT Long Châu Pharma Express',
      recipient: 'Trần Thị Thu Hà (Villa 101)',
      status: 'SHIPPED',
      deliveredETA: '15 phút'
    },
    statusCode: 200,
    responseMessage: 'OK: Đã đồng bộ mã vận đơn vào EHR bệnh nhân.'
  },
  {
    id: 'wh-2',
    timestamp: '09:40:12 - Hôm nay',
    source: 'IoT Wearable',
    event: 'VITALS_ANOMALY_HEART_RATE',
    payload: {
      patientId: 'EHR-8902',
      deviceType: 'Holter ECG BioPatch-3',
      hr: 112,
      spo2: 95,
      alert: 'Tachycardia Warning - Spontaneous'
    },
    statusCode: 200,
    responseMessage: 'OK: Đã kích hoạt thông báo điều dưỡng phụ trách.'
  },
  {
    id: 'wh-3',
    timestamp: '08:15:30 - Hôm nay',
    source: 'Google Calendar',
    event: 'TELEHEALTH_MEET_CREATED',
    payload: {
      appointmentId: 'TH-2026-001',
      meetLink: 'https://meet.google.com/gocare-tele-8921',
      attendees: ['quang.tran@gocare.med.vn', 'huynhmai8906@gmail.com'],
      calendarEventId: 'cal_gocare_77810'
    },
    statusCode: 200,
    responseMessage: 'OK: Đã gắn link Google Meet vào lịch khám bệnh viện.'
  }
];

export const INITIAL_AUDIT_REQUESTS: AuditRequestLog[] = [
  {
    id: 'req-01',
    timestamp: '10:03:02',
    method: 'GET',
    endpoint: '/api/v1/patients/EHR-8921/vitals',
    clientIp: '10.24.8.112',
    sourceService: 'GoCare Web 1 Admin UI',
    httpStatus: 200,
    latencyMs: 14,
    protocol: 'TLS 1.3 / AES-256'
  },
  {
    id: 'req-02',
    timestamp: '10:02:45',
    method: 'POST',
    endpoint: '/api/v1/pharmacy/webhook/orders',
    clientIp: '118.69.182.44',
    sourceService: 'FPT Long Châu ERP Server',
    httpStatus: 200,
    latencyMs: 18,
    protocol: 'TLS 1.3 / AES-256'
  },
  {
    id: 'req-03',
    timestamp: '10:01:10',
    method: 'PUT',
    endpoint: '/api/v1/rooms/101/status',
    clientIp: '10.24.8.112',
    sourceService: 'GoCare Web 1 Admin UI',
    httpStatus: 200,
    latencyMs: 12,
    protocol: 'TLS 1.3 / AES-256'
  },
  {
    id: 'req-04',
    timestamp: '09:58:22',
    method: 'POST',
    endpoint: '/api/v1/emergency/dispatch/icu-02',
    clientIp: '10.24.2.1',
    sourceService: 'Emergency 115 Dispatch Service',
    httpStatus: 201,
    latencyMs: 19,
    protocol: 'TLS 1.3 / AES-256'
  },
  {
    id: 'req-05',
    timestamp: '09:55:04',
    method: 'GET',
    endpoint: '/api/v1/telehealth/calendar-sync',
    clientIp: '172.217.160.14',
    sourceService: 'Google Calendar API Gateway',
    httpStatus: 200,
    latencyMs: 24,
    protocol: 'TLS 1.3 / AES-256'
  }
];

export const INITIAL_HEALTH_LOGS: DailyHealthLog[] = [
  {
    id: 'hl-1',
    patientId: 'p1',
    patientName: 'Trần Thị Thu Hà',
    roomName: 'Villa Sen Vàng 101',
    facility: 'GoCare Sala',
    date: '2026-10-08',
    time: '08:30',
    recordedBy: 'ĐĐ. Lê Thu Trang',
    recorderRole: 'Điều Dưỡng',
    symptoms: ['Tỉnh táo tốt', 'Hơi mỏi khớp gối', 'Ngủ ngon 6.5 tiếng', 'Ăn hết suất cháo yến'],
    painScore: 2,
    vitals: { bp: '125/80', hr: 74, spo2: 98, temp: 36.6, bloodSugar: 6.2 },
    mobilityState: 'Tự đi lại tốt quanh phòng',
    dietIntake: 'Ăn hết khẩu phần (Cháo yến hạt sen)',
    mentalState: 'Tỉnh táo, vui vẻ',
    clinicalNotes: 'Bệnh nhân tự ngồi dậy thoải mái. Huyết áp kiểm soát tốt sau liều Coversyl Plus.',
    treatmentInstructions: 'Cho uống đủ 1.5 lít nước ấm. Chiều đưa ra vườn thiền tắm nắng 20 phút.'
  },
  {
    id: 'hl-2',
    patientId: 'p2',
    patientName: 'Huỳnh Mai',
    roomName: 'Villa Sen Vàng 204',
    facility: 'GoCare Sala',
    date: '2026-10-08',
    time: '09:15',
    recordedBy: 'Huỳnh Mai (Bạn)',
    recorderRole: 'Bác Sĩ',
    symptoms: ['Khớp gối co duỗi 95 độ', 'Không sưng nóng đỏ', 'Đi lại có khung tập hỗ trợ'],
    painScore: 3,
    vitals: { bp: '118/75', hr: 70, spo2: 99, temp: 36.5, bloodSugar: 5.4 },
    mobilityState: 'Tự đi có khung hỗ trợ 50m',
    dietIntake: 'Ăn ngon miệng, đủ dinh dưỡng',
    mentalState: 'Tinh thần lạc quan, hợp tác tập luyện',
    clinicalNotes: 'Vết mổ khớp gối khô liền sẹo tốt. Độ gập duỗi đạt tiến độ tuần 3 sau phẫu thuật.',
    treatmentInstructions: 'Tiếp tục bài tập vật lý trị liệu bể bơi khoáng ấm 15:00. Uống Celebrex sau ăn trưa.'
  },
  {
    id: 'hl-3',
    patientId: 'p3',
    patientName: 'Nguyễn Văn Hùng',
    roomName: 'Sala Premier 302',
    facility: 'GoCare Premier Bạch Đằng',
    date: '2026-10-08',
    time: '07:45',
    recordedBy: 'TS. BS. Lê Hồng Hùng',
    recorderRole: 'Bác Sĩ',
    symptoms: ['Không khó thở khi nằm', 'Không phù hai chi dưới', 'Hơi nặng ngực thoáng qua khi gắng sức'],
    painScore: 1,
    vitals: { bp: '130/85', hr: 68, spo2: 97, temp: 36.7, bloodSugar: 5.8 },
    mobilityState: 'Đi lại nhẹ nhàng trong phòng',
    dietIntake: 'Ăn 80% khẩu phần ăn giảm muối',
    mentalState: 'Bình thản',
    clinicalNotes: 'Holter ECG ghi nhận nhịp xoang đều, không có cơn rung nhĩ. Tim T1 T2 rõ.',
    treatmentInstructions: 'Hạn chế leo cầu thang. Uống Concor 2.5mg lúc 08:00 sáng.'
  }
];
