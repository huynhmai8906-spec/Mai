/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Truck,
  CheckCircle2,
  Package,
  Clock,
  ExternalLink,
  Search,
  Filter,
  X,
  Building2
} from 'lucide-react';
import { Patient, PrescriptionOrder } from '../types';

interface PharmacyHubProps {
  prescriptions: PrescriptionOrder[];
  patients: Patient[];
  onAddPrescription: (newOrder: PrescriptionOrder) => void;
  onUpdateStatus: (orderId: string, status: PrescriptionOrder['status']) => void;
  isDark: boolean;
  showToast: (msg: string) => void;
}

export const PharmacyHub: React.FC<PharmacyHubProps> = ({
  prescriptions,
  patients,
  onAddPrescription,
  onUpdateStatus,
  isDark,
  showToast
}) => {
  const [filterPharma, setFilterPharma] = useState<'ALL' | 'FPT Long Châu' | 'Nhà Thuốc An Khang'>('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [pharmacyChoice, setPharmacyChoice] = useState<'FPT Long Châu' | 'Nhà Thuốc An Khang'>('FPT Long Châu');
  const [drugName, setDrugName] = useState('Coversyl Plus Arginine 5mg/1.25mg');
  const [dosage, setDosage] = useState('1 viên sau ăn sáng');
  const [quantity, setQuantity] = useState(30);

  const filteredOrders = prescriptions.filter(
    p => filterPharma === 'ALL' || p.pharmacy === filterPharma
  );

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
    if (!patient) return;

    const rxCode = pharmacyChoice === 'FPT Long Châu'
      ? `RX-LC-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-2)}`
      : `RX-AK-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-2)}`;

    const trackingNumber = pharmacyChoice === 'FPT Long Châu'
      ? `FPT-LC-VN-${Math.floor(1000 + Math.random() * 9000)}`
      : `AK-EXP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: PrescriptionOrder = {
      id: `rx-${Date.now()}`,
      rxCode,
      patientName: patient.name,
      patientCode: patient.code,
      doctorName: patient.doctor,
      prescribedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      pharmacy: pharmacyChoice,
      items: [
        {
          drugName,
          dosage,
          quantity: Number(quantity),
          unit: 'viên'
        }
      ],
      totalAmount: 380000 + Math.floor(Math.random() * 300000),
      status: 'PACKING',
      trackingNumber
    };

    onAddPrescription(newOrder);
    setShowModal(false);
    showToast(`Đã kê đơn thành công! Đơn ${rxCode} tự động chuyển sang kho ${pharmacyChoice}.`);
  };

  const getStatusBadge = (status: PrescriptionOrder['status']) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">Chờ Xác Nhận</span>;
      case 'PACKING':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">Đang Đóng Gói</span>;
      case 'SHIPPING':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1"><Truck className="w-3 h-3" /> Đang Vận Chuyển</span>;
      case 'DELIVERED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Đã Giao Bệnh Nhân</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <FileText className="w-5 h-5" />
            </span>
            <span>Kho Dược & Đơn Thuốc Long Châu / An Khang (Pharmacy Hub & Rx Bridge)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Liên thông tự động đơn thuốc từ Bác Sĩ tới chuỗi nhà thuốc FPT Long Châu và An Khang
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Kê Đơn Thuốc Mới Sang Kho Dược</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1">Kho Dược Liên Kết:</span>
        {(['ALL', 'FPT Long Châu', 'Nhà Thuốc An Khang'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterPharma(tab)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
              filterPharma === tab
                ? isDark
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-blue-600 text-white font-bold'
                : isDark
                ? 'bg-slate-800 text-slate-300'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {tab === 'ALL' ? 'Tất Cả Kho Dược' : tab}
          </button>
        ))}
      </div>

      {/* Prescription Orders List */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Mã Đơn / Tracking</th>
                <th className="py-3 px-4">Bệnh Nhân (EHR)</th>
                <th className="py-3 px-4">Kho Phân Phối</th>
                <th className="py-3 px-4">Thuốc & Liều Lượng</th>
                <th className="py-3 px-4">Bác Sĩ Kê</th>
                <th className="py-3 px-4">Trạng Thái Đơn Hàng</th>
                <th className="py-3 px-4">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">{order.rxCode}</span>
                    <span className="font-mono text-[10px] text-slate-400">{order.trackingNumber}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{order.patientName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{order.patientCode}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-500" />
                      {order.pharmacy}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {order.items.map((it, i) => (
                      <div key={i} className="text-slate-700 dark:text-slate-300">
                        <strong>{it.drugName}</strong> ({it.quantity} {it.unit} - {it.dosage})
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{order.doctorName}</td>
                  <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={e => {
                        onUpdateStatus(order.id, e.target.value as PrescriptionOrder['status']);
                        showToast(`Đã cập nhật trạng thái đơn ${order.rxCode} thành [${e.target.value}]`);
                      }}
                      className="text-[11px] p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent font-medium cursor-pointer"
                    >
                      <option value="PACKING" className="bg-slate-900 text-white">Đang Đóng Gói</option>
                      <option value="SHIPPING" className="bg-slate-900 text-white">Đang Vận Chuyển</option>
                      <option value="DELIVERED" className="bg-slate-900 text-white">Đã Giao Bệnh Nhân</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Kê đơn mới */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePrescription}
            className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0f1c38] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base">Kê Đơn Thuốc Mới Sang Kho Dược</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Chọn Bệnh Nhân</label>
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name} ({p.code}) - {p.room}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Kho Dược Liên Thông Tiếp Nhận</label>
                <select
                  value={pharmacyChoice}
                  onChange={e => setPharmacyChoice(e.target.value as 'FPT Long Châu' | 'Nhà Thuốc An Khang')}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                >
                  <option value="FPT Long Châu" className="bg-slate-900 text-white">FPT Long Châu (Pharma ERP Bridge)</option>
                  <option value="Nhà Thuốc An Khang" className="bg-slate-900 text-white">Nhà Thuốc An Khang (Rx Direct)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Tên Thuốc & Hàm Lượng</label>
                <input
                  type="text"
                  required
                  value={drugName}
                  onChange={e => setDrugName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Số Lượng (Viên)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Liều Dùng & Hướng Dẫn</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={e => setDosage(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                </div>
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
                className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white cursor-pointer"
              >
                Xác Nhận Kê Đơn
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
