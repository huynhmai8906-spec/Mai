/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  PhoneCall,
  Navigation,
  Compass,
  Cpu,
  Truck,
  Activity,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { AmbulanceDispatch, DijkstraNode, DijkstraEdge } from '../types';
import { DIJKSTRA_NODES, DIJKSTRA_EDGES } from '../mockData';

interface EmergencyDijkstraProps {
  dispatches: AmbulanceDispatch[];
  onTriggerDispatch: (ambCode: string) => void;
  isDark: boolean;
  showToast: (msg: string) => void;
}

export const EmergencyDijkstra: React.FC<EmergencyDijkstraProps> = ({
  dispatches,
  onTriggerDispatch,
  isDark,
  showToast
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'BACH_DANG' | 'THAO_DIEN'>('BACH_DANG');
  const [dijkstraRunning, setDijkstraRunning] = useState(false);
  const [optimalPathResult, setOptimalPathResult] = useState<{
    path: string[];
    totalDistanceKm: number;
    estimatedMinutes: number;
    savedMinutes: number;
    nodesTraversed: string[];
  }>({
    path: ['Trạm GoCare Sala', 'Hầm Thủ Thiêm / Cầu TT1', 'GoCare Premier Bạch Đằng'],
    totalDistanceKm: 5.6,
    estimatedMinutes: 4.2,
    savedMinutes: 7.8,
    nodesTraversed: ['SALA', 'THU_THIEM_TUNNEL', 'BACH_DANG']
  });

  const handleRunDijkstra = () => {
    setDijkstraRunning(true);
    setTimeout(() => {
      if (selectedTarget === 'BACH_DANG') {
        setOptimalPathResult({
          path: ['Trạm GoCare Sala', 'Hầm Thủ Thiêm / Cầu TT1', 'GoCare Premier Bạch Đằng'],
          totalDistanceKm: 5.6,
          estimatedMinutes: 4.2,
          savedMinutes: 7.8,
          nodesTraversed: ['SALA', 'THU_THIEM_TUNNEL', 'BACH_DANG']
        });
      } else {
        setOptimalPathResult({
          path: ['Trạm GoCare Sala', 'Đại lộ Mai Chí Thọ', 'Cầu Sài Gòn', 'GoCare Thảo Điền Riverside'],
          totalDistanceKm: 7.8,
          estimatedMinutes: 6.1,
          savedMinutes: 8.9,
          nodesTraversed: ['SALA', 'MAI_CHI_THO', 'SAI_GON_BRIDGE', 'THAO_DIEN']
        });
      }
      setDijkstraRunning(false);
      showToast('Thuật toán Dijkstra đã giải ma trận trọng số: Tìm thấy lộ trình tối ưu né kẹt xe!');
    }, 700);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
              <PhoneCall className="w-5 h-5" />
            </span>
            <span>Trung Tâm Điều Phối Cấp Cứu GPS & Thuật Toán Dijkstra</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Điều phối kíp trực 115, xe cứu thương ICU-02 / ICU-04 & Giải thuật Dijkstra tìm đường tối ưu
          </p>
        </div>

        <button
          onClick={handleRunDijkstra}
          disabled={dijkstraRunning}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <Cpu className={`w-4 h-4 ${dijkstraRunning ? 'animate-spin' : ''}`} />
          <span>{dijkstraRunning ? 'Đang Giải Thuật Toán...' : '⚡ Chạy Thuật Toán Dijkstra Né Kẹt Xe'}</span>
        </button>
      </div>

      {/* Ambulance Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dispatches.map(amb => (
          <div
            key={amb.id}
            className={`p-5 rounded-2xl border transition-all ${
              amb.status === 'DISPATCHED'
                ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20 shadow-md'
                : isDark
                ? 'bg-[#0f1c38] border-slate-800'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 font-bold flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{amb.code} (ICU Mobile Unit)</h3>
                  <span className="text-xs text-slate-500">Tài xế: {amb.driver}</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  amb.status === 'DISPATCHED'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                }`}
              >
                {amb.status === 'DISPATCHED' ? 'Đang Di Chuyển Cấp Cứu' : 'Trực Sẵn Sàng 115'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 mb-3">
              <div>
                <span className="text-slate-400 text-[10px] block">Vị Trí Hiện Tại:</span>
                <strong className="text-slate-800 dark:text-slate-200">{amb.currentLocation}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Điểm Đến / Mục Tiêu:</span>
                <strong className="text-slate-800 dark:text-slate-200">{amb.destination}</strong>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] block">Bác Sĩ Kíp Trực:</span>
                <strong className="text-blue-600 dark:text-blue-400">{amb.doctorOnBoard}</strong>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] block">Thời Gian ETA Tối Ưu:</span>
                <strong className="text-red-600 dark:text-red-400 font-mono text-sm">
                  {amb.etaMinutes > 0 ? `${amb.etaMinutes} phút` : 'Sẵn sàng'}
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                Telemetry: {amb.vitalTelemetry.bp} • {amb.vitalTelemetry.hr} bpm • SpO2 {amb.vitalTelemetry.spo2}%
              </span>

              <button
                onClick={() => {
                  onTriggerDispatch(amb.code);
                  showToast(`Đã phát lệnh điều phối ưu tiên cao nhất cho kíp xe ${amb.code}!`);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs"
              >
                Phát Lệnh Điều Phối
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* THUẬT TOÁN DIJKSTRA GRAPH VISUALIZATION */}
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              <span>Mô Phỏng Thuật Toán Dijkstra Trên Ma Trận Đồ Thị Giao Thông (Graph Adjacency Matrix)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Định tuyến đường đi ngắn nhất giữa điểm xuất phát (Trạm Sala) đến các cơ sở y tế với trọng số thời gian thực
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Đích đến:</span>
            <select
              value={selectedTarget}
              onChange={e => setSelectedTarget(e.target.value as 'BACH_DANG' | 'THAO_DIEN')}
              className="text-xs p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent font-medium"
            >
              <option value="BACH_DANG" className="bg-slate-900 text-white">GoCare Premier Bạch Đằng</option>
              <option value="THAO_DIEN" className="bg-slate-900 text-white">GoCare Thảo Điền Riverside</option>
            </select>
          </div>
        </div>

        {/* Visual Graph View */}
        <div className="my-5 relative h-72 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden p-4 flex items-center justify-center">
          {/* Grid bg */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>

          {/* Nodes */}
          {DIJKSTRA_NODES.map(node => {
            const isTraversed = optimalPathResult.nodesTraversed.includes(node.id);
            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border text-center transition-all ${
                  isTraversed
                    ? 'bg-red-600 text-white border-red-400 shadow-lg scale-105 z-10'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <div className="text-[11px] font-bold whitespace-nowrap">{node.name}</div>
                <div className="text-[9px] font-mono opacity-80">
                  {node.type === 'STATION' ? 'START' : node.type === 'HOSPITAL' ? 'DESTINATION' : 'NODE'}
                </div>
              </div>
            );
          })}

          {/* Optimal Dijkstra Summary Banner */}
          <div className="absolute top-3 left-3 bg-slate-800/90 text-white p-3 rounded-xl border border-slate-700 text-xs space-y-1 shadow-lg">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Lộ Trình Tối Ưu Dijkstra:</span>
            </div>
            <div className="text-[11px] font-mono text-slate-200">
              {optimalPathResult.path.join(' ➔ ')}
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Khoảng cách: <strong>{optimalPathResult.totalDistanceKm} km</strong> • ETA: <strong className="text-red-400">{optimalPathResult.estimatedMinutes} phút</strong> • Tiết kiệm: <strong className="text-emerald-400">{optimalPathResult.savedMinutes} phút</strong> so với đường kẹt xe!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
