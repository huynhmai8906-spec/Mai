/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bed, Plus, Search, MapPin, Bell, Activity, X } from 'lucide-react';
import { RoomItem, RoomStatus } from '../types';

interface RoomsMasterProps {
  rooms: RoomItem[];
  onSetStatus: (roomId: string, status: RoomStatus) => void;
  onAddRoom: (newRoom: RoomItem) => void;
  onTriggerSOS: (room: RoomItem) => void;
  onOpenDailyLog: (room: RoomItem) => void;
  isDark: boolean;
  showToast: (msg: string) => void;
}

export const RoomsMaster: React.FC<RoomsMasterProps> = ({
  rooms,
  onSetStatus,
  onAddRoom,
  onTriggerSOS,
  onOpenDailyLog,
  isDark,
  showToast
}) => {
  const [selectedFacility, setSelectedFacility] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form State
  const [roomName, setRoomName] = useState('');
  const [facility, setFacility] = useState('GoCare Sala');
  const [building, setBuilding] = useState('Khu Villa Sala');
  const [floor, setFloor] = useState('Tầng 1');
  const [roomType, setRoomType] = useState('VIP Villa Đơn Lập');

  const filtered = rooms.filter(r => {
    const matchFac = selectedFacility === 'ALL' || r.facility.includes(selectedFacility);
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.roomType.toLowerCase().includes(search.toLowerCase());
    return matchFac && matchSearch;
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    const newR: RoomItem = {
      id: `room-${Date.now()}`,
      name: roomName.trim(),
      facility,
      building,
      floor,
      roomType,
      status: 'TRONG',
      guestName: 'Chưa xếp khách',
      nurseInCharge: 'Kíp trực cơ sở',
      notes: 'Phòng mới bổ sung, kiểm tra tiện nghi lão khoa & giường điện đầy đủ.',
      coordinates: { x: 50, y: 50 }
    };

    onAddRoom(newR);
    setShowModal(false);
    setRoomName('');
    showToast(`Đã thêm phòng mới [${newR.name}] vào cơ sở ${facility}.`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Bed className="w-5 h-5" />
            </span>
            <span>Sơ Đồ Phòng Nghỉ Dưỡng & Giường Bệnh Lão Khoa</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý phòng nghỉ các khu Villa Sala, Premier Bạch Đằng, Thảo Điền • Thay đổi trạng thái nhanh
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm Phòng Nghỉ Mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'bg-[#0e1933] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1">Cơ sở:</span>
          {['ALL', 'Sala', 'Premier Bạch Đằng', 'Thảo Điền'].map(fac => (
            <button
              key={fac}
              onClick={() => setSelectedFacility(fac)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                selectedFacility === fac
                  ? isDark
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-blue-600 text-white font-bold'
                  : isDark
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {fac === 'ALL' ? 'Tất Cả Khu Nghỉ Dưỡng' : `Khu ${fac}`}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên phòng, khách nghỉ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-xs rounded-lg pl-8 pr-3 py-1.5 w-60 border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(room => {
          const isOccupied = room.status === 'CO_KHACH';
          const isVacant = room.status === 'TRONG';
          const isDisinfecting = room.status === 'KHU_KHUAN';

          return (
            <div
              key={room.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isDark ? 'bg-[#0f1c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{room.name}</h3>
                  {isOccupied && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                      CÓ KHÁCH
                    </span>
                  )}
                  {isVacant && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                      TRỐNG
                    </span>
                  )}
                  {isDisinfecting && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-blue-100 text-blue-800 border border-blue-300">
                      ĐANG KHỬ KHUẨN HEPA
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 flex-wrap">
                  <span>Cơ sở: <strong className="text-slate-700 dark:text-slate-300">{room.facility}</strong></span>
                  <span>•</span>
                  <span>{room.roomType}</span>
                </div>

                <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Định vị: {room.floor} ({room.building})</span>
                </div>

                {/* Box details */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400">Khách nghỉ: </span>
                      <strong className="text-slate-900 dark:text-slate-100">{room.guestName}</strong>
                    </div>
                    {isOccupied && (
                      <button
                        onClick={() => onTriggerSOS(room)}
                        className="px-2 py-0.5 rounded bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Bell className="w-3 h-3 text-red-600" />
                        <span>Bấm Chuông SOS</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>ĐD: {room.nurseInCharge}</span>
                    {room.vitals && isOccupied && (
                      <span className="font-mono text-emerald-600 font-bold">{room.vitals.bp} mmHg</span>
                    )}
                  </div>
                </div>

                {isOccupied && (
                  <button
                    onClick={() => onOpenDailyLog(room)}
                    className="w-full py-1.5 mb-3 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cập Nhật Triệu Chứng & Sức Khỏe Hôm Nay</span>
                  </button>
                )}
              </div>

              {/* 3 Status Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onSetStatus(room.id, 'TRONG')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer text-center ${
                    isVacant ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Trống
                </button>

                <button
                  onClick={() => onSetStatus(room.id, 'CO_KHACH')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer text-center ${
                    isOccupied ? 'bg-amber-500 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Có Khách
                </button>

                <button
                  onClick={() => onSetStatus(room.id, 'KHU_KHUAN')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer text-center ${
                    isDisinfecting ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Khử Khuẩn
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL Thêm phòng */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateRoom}
            className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#0f1c38] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base">Thêm Phòng Nghỉ Lão Khoa Mới</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Tên Phòng</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Villa Sen Vàng 105"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Cơ Sở</label>
                <select
                  value={facility}
                  onChange={e => setFacility(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                >
                  <option value="GoCare Sala">GoCare Sala</option>
                  <option value="GoCare Premier Bạch Đằng">GoCare Premier Bạch Đằng</option>
                  <option value="GoCare Thảo Điền">GoCare Thảo Điền</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Tòa Nhà / Khu</label>
                  <input
                    type="text"
                    value={building}
                    onChange={e => setBuilding(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Tầng</label>
                  <input
                    type="text"
                    value={floor}
                    onChange={e => setFloor(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Loại Phòng</label>
                <select
                  value={roomType}
                  onChange={e => setRoomType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                >
                  <option value="VIP Villa Đơn Lập">VIP Villa Đơn Lập</option>
                  <option value="VIP Suite Lão Khoa">VIP Suite Lão Khoa</option>
                  <option value="Phòng Đôi Tiêu Chuẩn">Phòng Đôi Tiêu Chuẩn</option>
                  <option value="Phòng Trị Liệu Thủy Sinh">Phòng Trị Liệu Thủy Sinh</option>
                </select>
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
                Thêm Phòng
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
