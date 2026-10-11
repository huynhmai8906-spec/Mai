/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Download,
  Activity,
  Heart,
  FileCode2,
  X,
  Check,
  Search,
  Radio,
  FileText
} from 'lucide-react';
import { Patient, Vitals } from '../types';

interface PatientEHRMasterProps {
  patients: Patient[];
  onAddPatient: (newPatient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
  onUpdateVitals: (patientId: string, vitals: Vitals) => void;
  isDark: boolean;
  showToast: (msg: string) => void;
}

export const PatientEHRMaster: React.FC<PatientEHRMasterProps> = ({
  patients,
  onAddPatient,
  onDeletePatient,
  onUpdateVitals,
  isDark,
  showToast
}) => {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFhirModal, setShowFhirModal] = useState(false);

  // New Patient Form State
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(72);
  const [newGender, setNewGender] = useState<'Nam' | 'Nữ'>('Nữ');
  const [newRoom, setNewRoom] = useState('Villa Sen Vàng 102');
  const [newFacility, setNewFacility] = useState('GoCare Sala');
  const [newDoctor, setNewDoctor] = useState('PGS. TS. Trần Vinh Quang');
  const [newDiagnosis, setNewDiagnosis] = useState('Tăng huyết áp độ 2, Thoái hóa khớp gối');
  const [newDiet, setNewDiet] = useState('Chế độ dưỡng sinh ít muối, giàu canxi');

  // Live Broadcast State
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const filteredPatients = patients.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.room.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const patientId = `p-${Date.now()}`;
    const code = `EHR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPatient: Patient = {
      id: patientId,
      code,
      name: newName.trim(),
      age: Number(newAge),
      gender: newGender,
      room: newRoom,
      facility: newFacility,
      doctor: newDoctor,
      nurse: 'ĐĐ. Ca Trực Lão Khoa',
      admissionDate: new Date().toISOString().split('T')[0],
      diagnosis: newDiagnosis,
      dietPlan: newDiet,
      fhirResourceId: `Patient/fhir-vn-${code}-2026`,
      vitals: {
        bp: '120/80',
        hr: 72,
        spo2: 98,
        temp: 36.6,
        bloodSugar: 5.5
      },
      allergies: ['Không có'],
      medications: [
        { name: 'Multivitamin Lão Khoa', dosage: '1 viên sáng', frequency: 'Hàng ngày', source: 'Kho FPT Long Châu' }
      ]
    };

    onAddPatient(newPatient);
    setSelectedPatient(newPatient);
    setShowAddModal(false);
    setNewName('');
    showToast(`Đã tạo hồ sơ bệnh nhân chuẩn HL7/FHIR: [${code}] ${newPatient.name}`);
  };

  const handleSimulateLiveTelemetry = (patientId: string) => {
    setIsBroadcasting(true);
    // Simulate real-time fluctuation
    setTimeout(() => {
      const randomHR = Math.floor(68 + Math.random() * 12);
      const randomSpO2 = Math.floor(97 + Math.random() * 3);
      const randomSys = Math.floor(118 + Math.random() * 14);
      const randomDia = Math.floor(75 + Math.random() * 10);
      const randomSugar = Number((5.2 + Math.random() * 0.8).toFixed(1));

      const updatedVitals: Vitals = {
        bp: `${randomSys}/${randomDia}`,
        hr: randomHR,
        spo2: randomSpO2,
        temp: 36.6,
        bloodSugar: randomSugar
      };

      onUpdateVitals(patientId, updatedVitals);
      setIsBroadcasting(false);
      showToast(`Đã phát sóng sinh hiệu trực tiếp lên GoCare Server & IoT Hub!`);
    }, 600);
  };

  const getFhirJson = (p: Patient) => {
    return JSON.stringify(
      {
        resourceType: 'Bundle',
        type: 'document',
        timestamp: new Date().toISOString(),
        standard: 'HL7 FHIR Release 4 (R4)',
        entry: [
          {
            fullUrl: `urn:uuid:${p.fhirResourceId}`,
            resource: {
              resourceType: 'Patient',
              id: p.code,
              identifier: [{ system: 'urn:oid:1.2.840.114350.1.13', value: p.code }],
              name: [{ family: p.name.split(' ').slice(-1)[0], given: p.name.split(' ').slice(0, -1) }],
              gender: p.gender === 'Nam' ? 'male' : 'female',
              birthDate: `${2026 - p.age}-01-01`,
              active: true,
              managingOrganization: { display: p.facility }
            }
          },
          {
            resourceType: 'Observation',
            code: { coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel' }] },
            valueQuantity: { value: p.vitals.bp, unit: 'mmHg' }
          },
          {
            resourceType: 'Observation',
            code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }] },
            valueQuantity: { value: p.vitals.hr, unit: 'bpm' }
          },
          {
            resourceType: 'Observation',
            code: { coding: [{ system: 'http://loinc.org', code: '2708-6', display: 'Oxygen saturation' }] },
            valueQuantity: { value: p.vitals.spo2, unit: '%' }
          }
        ]
      },
      null,
      2
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Users className="w-5 h-5" />
            </span>
            <span>Quản Lý Bệnh Nhân & Hồ Sơ EHR (Patient EHR Master)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hồ sơ bệnh án chuẩn y tế quốc tế HL7/FHIR • Phát sóng sinh hiệu thời gian thực
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm Bệnh Nhân Chuẩn HL7/FHIR</span>
        </button>
      </div>

      {/* Main Grid: Left List + Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Patient List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo mã EHR, họ tên, số phòng..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {filteredPatients.map(p => {
              const isSelected = selectedPatient?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                      : isDark
                      ? 'bg-[#0f1c38] border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{p.name}</span>
                    <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950">
                      {p.code}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                    <span>{p.room}</span>
                    <span>{p.age} tuổi • {p.gender}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    <Activity className="w-3 h-3" />
                    <span>{p.vitals.bp} mmHg • {p.vitals.hr} bpm • SpO2 {p.vitals.spo2}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed EHR Profile */}
        <div
          className={`lg:col-span-2 p-5 rounded-2xl border ${
            isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          {selectedPatient ? (
            <div className="space-y-5">
              {/* Patient Top Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedPatient.name}</h2>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                      {selectedPatient.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedPatient.room} ({selectedPatient.facility}) • Nhập viện: {selectedPatient.admissionDate} • BS: <strong>{selectedPatient.doctor}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFhirModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Xem Chuẩn HL7/FHIR</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ [${selectedPatient.code}] ${selectedPatient.name}?`)) {
                        onDeletePatient(selectedPatient.id);
                        setSelectedPatient(patients.find(p => p.id !== selectedPatient.id) || null);
                        showToast(`Đã xóa hồ sơ bệnh nhân ${selectedPatient.name}.`);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer"
                    title="Xóa hồ sơ bệnh nhân"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bộ đo & phát sóng sinh hiệu trực tiếp */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span className="font-bold text-xs">Bộ Đo & Phát Sóng Sinh Hiệu Trực Tiếp (Live Telemetry IoT)</span>
                  </div>
                  <button
                    onClick={() => handleSimulateLiveTelemetry(selectedPatient.id)}
                    disabled={isBroadcasting}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {isBroadcasting ? 'Đang phát sóng...' : '⚡ Bắt Đầu Phát Sóng Live'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block">Huyết Áp</span>
                    <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                      {selectedPatient.vitals.bp} mmHg
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block">Nhịp Tim</span>
                    <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 mt-1 block">
                      {selectedPatient.vitals.hr} bpm
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block">SpO2</span>
                    <span className="text-base font-bold font-mono text-blue-600 dark:text-blue-400 mt-1 block">
                      {selectedPatient.vitals.spo2}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block">Nhiệt Độ</span>
                    <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 mt-1 block">
                      {selectedPatient.vitals.temp}°C
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block">Đường Huyết</span>
                    <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400 mt-1 block">
                      {selectedPatient.vitals.bloodSugar} mmol/L
                    </span>
                  </div>
                </div>
              </div>

              {/* Diagnosis & Nutrition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
                  <strong className="block text-slate-500 mb-1">Chẩn Đoán Lâm Sàng:</strong>
                  <p className="text-slate-700 dark:text-slate-200">{selectedPatient.diagnosis}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
                  <strong className="block text-slate-500 mb-1">Thực Đơn Dinh Dưỡng Lão Khoa:</strong>
                  <p className="text-slate-700 dark:text-slate-200">{selectedPatient.dietPlan}</p>
                </div>
              </div>

              {/* Medications List */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <strong className="block text-slate-500 mb-2">Đơn Thuốc Hiện Tại:</strong>
                <div className="space-y-1.5">
                  {selectedPatient.medications.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900/60">
                      <div>
                        <span className="font-bold">{m.name}</span>
                        <span className="text-slate-500 ml-2 font-mono">({m.dosage} • {m.frequency})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {m.source}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
              Vui lòng chọn hoặc thêm bệnh nhân để xem chi tiết
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Thêm bệnh nhân mới chuẩn HL7/FHIR */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePatient}
            className={`max-w-lg w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0f1c38] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base">Thêm Bệnh Nhân Mới (Chuẩn HL7/FHIR)</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Họ Và Tên Bệnh Nhân</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Thị Mai Lan"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Tuổi</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={e => setNewAge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Giới tính</label>
                  <select
                    value={newGender}
                    onChange={e => setNewGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                  >
                    <option value="Nữ">Nữ</option>
                    <option value="Nam">Nam</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Phòng Chỉ Định</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={e => setNewRoom(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Cơ Sở</label>
                  <select
                    value={newFacility}
                    onChange={e => setNewFacility(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                  >
                    <option value="GoCare Sala">GoCare Sala</option>
                    <option value="GoCare Premier Bạch Đằng">GoCare Premier Bạch Đằng</option>
                    <option value="GoCare Thảo Điền">GoCare Thảo Điền</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Bác Sĩ Điều Trị</label>
                <input
                  type="text"
                  value={newDoctor}
                  onChange={e => setNewDoctor(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Chẩn Đoán Lâm Sàng</label>
                <textarea
                  rows={2}
                  value={newDiagnosis}
                  onChange={e => setNewDiagnosis(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white cursor-pointer"
              >
                Tạo Hồ Sơ HL7/FHIR
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Trình Xem Cấu Trúc HL7/FHIR JSON */}
      {showFhirModal && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full p-5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-700 shadow-2xl space-y-3 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Hồ Sơ Y Tế Chuẩn HL7/FHIR JSON (R4 Bundle)</h3>
              </div>
              <button onClick={() => setShowFhirModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 leading-relaxed">
              <pre>{getFhirJson(selectedPatient)}</pre>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getFhirJson(selectedPatient));
                  showToast('Đã sao chép FHIR JSON vào bộ nhớ tạm!');
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                Sao Chép JSON
              </button>
              <button
                onClick={() => setShowFhirModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
