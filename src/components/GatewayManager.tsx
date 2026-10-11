/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Share2,
  Key,
  Copy,
  Check,
  RefreshCw,
  Send,
  Radio,
  FileCode2,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { ApiKeyItem, WebhookLog } from '../types';

interface GatewayManagerProps {
  apiKeys: ApiKeyItem[];
  webhookLogs: WebhookLog[];
  onTriggerWebhook: (log: WebhookLog) => void;
  isDark: boolean;
  showToast: (msg: string) => void;
}

export const GatewayManager: React.FC<GatewayManagerProps> = ({
  apiKeys,
  webhookLogs,
  onTriggerWebhook,
  isDark,
  showToast
}) => {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<'DELIVERED' | 'TELEHEALTH' | 'IOT_VITALS'>('DELIVERED');
  const [simulating, setSimulating] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
    showToast(`Đã sao chép API Key: ${text}`);
  };

  const handleSimulateWebhook = () => {
    setSimulating(true);
    setTimeout(() => {
      let eventTitle = '';
      let sourceName: WebhookLog['source'] = 'Web 2 (Long Châu)';
      let payloadData: Record<string, unknown> = {};

      if (selectedEventType === 'DELIVERED') {
        eventTitle = 'PHARMACY_ORDER_DELIVERED';
        sourceName = 'Web 2 (Long Châu)';
        payloadData = {
          rxCode: 'RX-LC-8921-01',
          trackingNumber: 'FPT-LC-VN-7721',
          recipient: 'Trần Thị Thu Hà (Villa 101)',
          deliveredAt: new Date().toISOString(),
          status: 'SUCCESS'
        };
      } else if (selectedEventType === 'TELEHEALTH') {
        eventTitle = 'TELEHEALTH_SESSION_BOOKED';
        sourceName = 'Web 2 (An Khang)';
        payloadData = {
          appointmentCode: `TH-${Date.now().toString().slice(-4)}`,
          patientName: 'Huỳnh Mai',
          doctor: 'PGS. TS. Trần Vinh Quang',
          meetUrl: 'https://meet.google.com/gocare-tele-live',
          time: '2026-10-09 14:00'
        };
      } else {
        eventTitle = 'IOT_WEARABLE_HEART_RATE_ALERT';
        sourceName = 'IoT Wearable';
        payloadData = {
          patientCode: 'EHR-8902',
          deviceId: 'ECG-BIOPATCH-99',
          hr: 115,
          spo2: 95,
          alertLevel: 'HIGH_PRIORITY'
        };
      }

      const newLog: WebhookLog = {
        id: `wh-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN') + ' - Vừa xong',
        source: sourceName,
        event: eventTitle,
        payload: payloadData,
        statusCode: 200,
        responseMessage: 'OK: 2-Way Gateway đã tiếp nhận và cập nhật vào Core Database.'
      };

      onTriggerWebhook(newLog);
      setSimulating(false);
      showToast(`Đã bắn thành công Webhook sự kiện [${eventTitle}] sang Web 1!`);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Share2 className="w-5 h-5" />
            </span>
            <span>Cổng Quản Trị Liên Kết 2 Web (2-Web Gateway Manager)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý Master API Keys kết nối hệ thống & Bộ giả lập Webhook 2 chiều
          </p>
        </div>
      </div>

      {/* MASTER API KEYS MANAGEMENT */}
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <h2 className="text-base font-bold flex items-center gap-2 mb-3">
          <Key className="w-4 h-4 text-amber-500" />
          <span>Danh Sách Master API Keys Được Xác Thực (Production Tokens)</span>
        </h2>

        <div className="space-y-3">
          {apiKeys.map(k => (
            <div
              key={k.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{k.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                    {k.status}
                  </span>
                </div>
                <div className="text-slate-500">{k.targetService}</div>
                <div className="font-mono text-blue-600 dark:text-amber-400 font-bold bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 inline-block">
                  {k.key}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center">
                <button
                  onClick={() => handleCopy(k.id, k.key)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedKeyId === k.id ? 'Đã Chép' : 'Sao Chép Key'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WEBHOOK SIMULATOR */}
      <div
        className={`p-5 rounded-2xl border ${
          isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
              <span>Bộ Giả Lập Webhook (2-Web Event Dispatcher Simulator)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bắn thử các sự kiện thực tế từ Web 2 (Kho Dược / Telehealth / Thiết bị đeo) sang Web 1
            </p>
          </div>

          <button
            onClick={handleSimulateWebhook}
            disabled={simulating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs transition-colors disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${simulating ? 'animate-bounce' : ''}`} />
            <span>{simulating ? 'Đang Bắn Webhook...' : '⚡ Bắn Thử Webhook Sang Web 1'}</span>
          </button>
        </div>

        {/* Radio event selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 text-xs">
          {[
            { id: 'DELIVERED', label: '1. Giao Xong Thuốc Long Châu', desc: 'Web 2 ➔ Cập nhật trạng thái đơn thuốc đã giao đến phòng' },
            { id: 'TELEHEALTH', label: '2. Đặt Lịch Khám Telehealth', desc: 'Web 2 ➔ Tạo cuộc hẹn Google Meet mới cho bác sĩ' },
            { id: 'IOT_VITALS', label: '3. Đẩy Sinh Hiệu Bất Thường IoT', desc: 'Thiết bị đeo ➔ Phát cảnh báo nhịp tim nhanh cho điều dưỡng' }
          ].map(ev => (
            <div
              key={ev.id}
              onClick={() => setSelectedEventType(ev.id as any)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedEventType === ev.id
                  ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="font-bold text-slate-900 dark:text-slate-100">{ev.label}</div>
              <div className="text-[11px] text-slate-500 mt-1">{ev.desc}</div>
            </div>
          ))}
        </div>

        {/* Webhook Stream Logs */}
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
          Lịch Sử Bắn Webhook 2 Chiều Gần Đây
        </h3>

        <div className="space-y-2.5">
          {webhookLogs.map(log => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-xs font-mono space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-400">[{log.source}]</span>
                  <span className="text-white font-bold">{log.event}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                  HTTP {log.statusCode} OK
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Payload: {JSON.stringify(log.payload)}
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 flex justify-between">
                <span>{log.responseMessage}</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
