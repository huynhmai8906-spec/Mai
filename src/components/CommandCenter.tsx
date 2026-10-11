/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Activity,
  ArrowLeftRight,
  Database,
  Lock,
  Radio,
  RefreshCw,
  Server,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { Patient, PrescriptionOrder, RoomItem } from '../types';

interface CommandCenterProps {
  patients: Patient[];
  prescriptions: PrescriptionOrder[];
  rooms: RoomItem[];
  isDark: boolean;
  onNavigateTab: (tabId: string) => void;
  onTriggerSync: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  patients,
  prescriptions,
  rooms,
  isDark,
  onNavigateTab,
  onTriggerSync
}) => {
  const [packetCount, setPacketCount] = useState<number>(18420);
  const [simulatingPacket, setSimulatingPacket] = useState<boolean>(false);
  const [lastPacketLog, setLastPacketLog] = useState<string>('SYNCHRONIZED: Webhook 2-way handshake verified.');

  const occupiedRooms = rooms.filter(r => r.status === 'CO_KHACH').length;
  const occupancyRate = Math.round((occupiedRooms / rooms.length) * 100);
  const activeRxShipping = prescriptions.filter(p => p.status === 'SHIPPING' || p.status === 'PACKING').length;

  const handleTestBridge = () => {
    setSimulatingPacket(true);
    setTimeout(() => {
      setPacketCount(prev => prev + 12);
      setLastPacketLog(`ACK: Packet ID #PKT-${Date.now().toString().slice(-6)} verified via TLS 1.3 / AES-256 (18ms).`);
      setSimulatingPacket(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Activity className="w-5 h-5" />
            </span>
            <span>Tổng Quan Command Center (Live Analytics)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Trung tâm điều hành dữ liệu y khoa thời gian thực & Cầu nối liên kết 2-Web
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerSync}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đồng Bộ Ngay (18ms)</span>
          </button>
        </div>
      </div>

      {/* KPI 5 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1 */}
        <div
          onClick={() => onNavigateTab('BENH_NHAN')}
          className={`p-4 rounded-xl border cursor-pointer hover:scale-[1.02] transition-all ${
            isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Bệnh Nhân Quản Lý</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {patients.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Hồ Sơ HL7/FHIR</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => onNavigateTab('KHO_DUOC')}
          className={`p-4 rounded-xl border cursor-pointer hover:scale-[1.02] transition-all ${
            isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Đơn Long Châu / An Khang</span>
            <Radio className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {activeRxShipping} / {prescriptions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Đang vận chuyển giao tận phòng
          </div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => onNavigateTab('PHONG_NGHI')}
          className={`p-4 rounded-xl border cursor-pointer hover:scale-[1.02] transition-all ${
            isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Lấp Đầy Phòng VIP</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {occupancyRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {occupiedRooms}/{rooms.length} phòng có khách
          </div>
        </div>

        {/* KPI 4 */}
        <div
          className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Độ Trễ Ping 2 Web</span>
            <Zap className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
            18 ms
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>WebSocket wss:// Active</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div
          className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Bảo Mật Giao Thức</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-base font-bold font-mono text-purple-600 dark:text-purple-400 mt-2">
            TLS 1.3 / AES-256
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Mã hóa đầu cuối E2EE
          </div>
        </div>
      </div>

      {/* BẢN ĐỒ TƯƠNG TÁC LUỒNG DỮ LIỆU 2 CHIỀU */}
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-blue-600" />
              <span>Bản Đồ Tương Tác Luồng Dữ Liệu 2 Chiều (REST & Webhook Bridge)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mô phỏng đường truyền thời gian thực giữa Web 1 (GoCare Cloud Admin) và Web 2 (Kho Dược Long Châu / An Khang)
            </p>
          </div>

          <button
            onClick={handleTestBridge}
            disabled={simulatingPacket}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs transition-colors disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${simulatingPacket ? 'animate-bounce' : ''}`} />
            <span>{simulatingPacket ? 'Đang gửi gói tin...' : 'Bắn Gói Tin Thử Nghiệm'}</span>
          </button>
        </div>

        {/* Visual Architecture Diagram */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Node 1: Web 1 */}
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 font-bold">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">Web 1: GoCare Cloud Core</h3>
            <span className="text-[11px] text-slate-500 block mt-0.5">Hồ sơ EHR • Sơ đồ phòng • Y lệnh</span>
            <div className="mt-3 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              API Port: 3000 / Express TS
            </div>
          </div>

          {/* Middle Bridge */}
          <div className="flex flex-col items-center justify-center p-3 text-center">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-1">
              <span>◀── REST & Webhook Bridge ──▶</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden my-1 relative">
              <div
                className={`bg-blue-600 h-full rounded-full transition-all duration-300 ${
                  simulatingPacket ? 'w-full animate-pulse' : 'w-4/5'
                }`}
              ></div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              Độ trễ: <strong className="text-emerald-600">18ms</strong> • Gói tin: <strong className="text-blue-600">{packetCount.toLocaleString()}</strong>
            </div>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono mt-0.5 flex items-center gap-1">
              <Lock className="w-3 h-3" /> TLS 1.3 / AES-256 E2EE
            </span>
          </div>

          {/* Node 2: Web 2 */}
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">Web 2: Long Châu & An Khang</h3>
            <span className="text-[11px] text-slate-500 block mt-0.5">Kho Dược ERP • Telehealth API</span>
            <div className="mt-3 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Gateway: LC-KEY-PHARMA-SYNC
            </div>
          </div>
        </div>

        {/* Live Packet Log Stream */}
        <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="text-slate-400">Live Traffic Stream:</span>
            <span className="text-emerald-400 truncate">{lastPacketLog}</span>
          </div>
          <span className="text-slate-500 text-[11px] shrink-0">200 OK • Inbound/Outbound Auto-ack</span>
        </div>
      </div>
    </div>
  );
};
