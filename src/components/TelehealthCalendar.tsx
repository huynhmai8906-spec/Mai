/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Video,
  Clock,
  ExternalLink,
  CheckCircle2,
  X,
  Share2
} from 'lucide-react';
import { TelehealthAppointment, Patient } from '../types';

interface TelehealthCalendarProps {
  appointments: TelehealthAppointment[];
  patients: Patient[];
  onAddAppointment: (newAppt: TelehealthAppointment) => void;
  onSyncGoogleCalendar: (id: string) => void;
  isDark: boolean;
  showToast: (msg: string) => void;
}

export const TelehealthCalendar: React.FC<TelehealthCalendarProps> = ({
  appointments,
  patients,
  onAddAppointment,
  onSyncGoogleCalendar,
  isDark,
  showToast
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState(patients[0]?.name || 'Trần Thị Thu Hà');
  const [doctorName, setDoctorName] = useState('PGS. TS. Trần Vinh Quang');
  const [specialty, setSpecialty] = useState('Hội Chẩn Tim Mạch & Đái Tháo Đường');
  const [dateTime, setDateTime] = useState('2026-10-09 10:00');
  const [roomAssign, setRoomAssign] = useState('Villa Sen Vàng 101');
  const [notes, setNotes] = useState('Tái khám định kỳ, theo dõi chỉ số huyết áp');

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    const code = `TH-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newAppt: TelehealthAppointment = {
      id: `tele-${Date.now()}`,
      code,
      patientName: selectedPatientName,
      doctorName,
      specialty,
      dateTime,
      roomAssign,
      status: 'CONFIRMED',
      meetUrl: `https://meet.google.com/gocare-${code.toLowerCase()}`,
      googleCalendarSynced: true,
      notes
    };

    onAddAppointment(newAppt);
    setShowModal(false);
    showToast(`Đã tạo lịch khám ${code} và tự động đồng bộ sang Google Calendar!`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Calendar className="w-5 h-5" />
            </span>
            <span>Quản Lý Lịch Khám & Hội Chẩn Telehealth</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi lịch hẹn khám chuyên khoa, phân phòng & tự động đồng bộ sang Google Calendar
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              showToast('Đã đồng bộ toàn bộ 3 lịch hẹn sang tài khoản Google Calendar của bạn!');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Đồng Bộ Google Calendar</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Đặt Lịch Khám Mới</span>
          </button>
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {appointments.map(appt => (
          <div
            key={appt.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  {appt.code}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Google Calendar
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
                {appt.specialty}
              </h3>

              <div className="text-xs text-slate-500 space-y-1 mb-3">
                <div>Bệnh nhân: <strong className="text-slate-800 dark:text-slate-200">{appt.patientName}</strong> ({appt.roomAssign})</div>
                <div>Bác sĩ chủ trì: <strong className="text-blue-600 dark:text-amber-400">{appt.doctorName}</strong></div>
                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-mono pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{appt.dateTime}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 italic">
                {appt.notes}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a
                href={appt.meetUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Vào Google Meet</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <span className="text-[11px] text-slate-400 font-medium">Phòng VIP</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Đặt lịch mới */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAppointment}
            className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0f1c38] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base">Đặt Lịch Khám & Hội Chẩn Telehealth</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Bệnh Nhân</label>
                <select
                  value={selectedPatientName}
                  onChange={e => setSelectedPatientName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.name} className="bg-slate-900 text-white">
                      {p.name} - {p.room}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Chuyên Khoa Khám</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Bác Sĩ Chủ Trì</label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Thời Gian (YYYY-MM-DD HH:mm)</label>
                  <input
                    type="text"
                    required
                    value={dateTime}
                    onChange={e => setDateTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Phòng Thực Hiện</label>
                  <input
                    type="text"
                    required
                    value={roomAssign}
                    onChange={e => setRoomAssign(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Ghi Chú Khám</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white cursor-pointer"
              >
                Đồng Bộ Google Calendar & Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
