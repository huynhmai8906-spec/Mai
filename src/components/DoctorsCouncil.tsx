/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Stethoscope, Plus, Award, Clock, Users, X, Check } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorsCouncilProps {
  doctors: Doctor[];
  onAddDoctor: (newDoctor: Doctor) => void;
  isDark: boolean;
  showToast: (msg: string) => void;
}

export const DoctorsCouncil: React.FC<DoctorsCouncilProps> = ({
  doctors,
  onAddDoctor,
  isDark,
  showToast
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('TS. BS.');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('Nội Lão Khoa & Hồi Sức Cấp Cứu');
  const [degree, setDegree] = useState('Tiến Sĩ Y Khoa • Đại Học Y Dược TP.HCM');

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      title,
      name: name.trim(),
      specialty,
      degree,
      status: 'ON_DUTY',
      shifts: 'Ca Trực Ban Ngày (07:30 - 17:30)',
      patientsCount: 8
    };

    onAddDoctor(newDoc);
    setShowModal(false);
    setName('');
    showToast(`Đã thêm chuyên gia ${newDoc.title} ${newDoc.name} vào Hội Đồng Y Khoa!`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Stethoscope className="w-5 h-5" />
            </span>
            <span>Đội Ngũ Bác Sĩ & Lịch Trực Hội Đồng Y Khoa</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý hồ sơ giáo sư, tiến sĩ, bác sĩ chuyên khoa & phân bổ ca trực 24/7
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm Bác Sĩ Cố Vấn Mới</span>
        </button>
      </div>

      {/* Grid of Doctors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map(doc => (
          <div
            key={doc.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-amber-300 font-bold flex items-center justify-center text-sm border border-blue-200 dark:border-slate-700">
                    {doc.name.split(' ').slice(-1)[0][0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {doc.title} {doc.name}
                    </h3>
                    <span className="text-xs font-semibold text-blue-600 dark:text-amber-400">
                      {doc.specialty}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    doc.status === 'ON_DUTY'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400'
                  }`}
                >
                  {doc.status === 'ON_DUTY' ? 'Đang Trực 24/7' : 'Đang Hội Chẩn'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <Award className="w-3.5 h-3.5 inline text-amber-500 mr-1.5" />
                {doc.degree}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {doc.shifts}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {doc.patientsCount} bệnh nhân theo dõi
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL Thêm bác sĩ */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDoctor}
            className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0f1c38] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base">Thêm Bác Sĩ Vào Hội Đồng Cố Vấn</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Học Hàm/Vị</label>
                  <select
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                  >
                    <option value="PGS. TS.">PGS. TS.</option>
                    <option value="TS. BS.">TS. BS.</option>
                    <option value="BSCKII.">BSCKII.</option>
                    <option value="ThS. BS.">ThS. BS.</option>
                    <option value="Bác Sĩ">Bác Sĩ</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 mb-1">Họ Và Tên</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Lê Hồng Hùng"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Chuyên Khoa Phụ Trách</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Bằng Cấp & Quá Trình Đào Tạo</label>
                <textarea
                  rows={2}
                  required
                  value={degree}
                  onChange={e => setDegree(e.target.value)}
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
                Xác Nhận Thêm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
