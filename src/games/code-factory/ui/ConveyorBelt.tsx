import React, { useState } from 'react';
import type { FactoryItem, MachineType, OrderData, SortingLane } from '../engine/types';
import { MACHINES } from '../engine/machines';
import {
  Scissors,
  PaintBucket,
  Wrench,
  Box,
  GitFork,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ConveyorBeltProps {
  order: OrderData;
  inputBelt: FactoryItem[];
  activeItem: FactoryItem | null;
  completedItems: FactoryItem[];
  activeMachineType: MachineType | null;
  componentsUsed: number;
}

const MATERIAL_COLORS: Record<string, string> = {
  kayu: 'from-amber-700 to-amber-900 border-amber-600 text-amber-100',
  logam: 'from-slate-400 to-slate-600 border-slate-300 text-slate-100',
  plastik: 'from-sky-500 to-cyan-600 border-cyan-400 text-cyan-50',
};

const COLOR_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  polos: { bg: 'bg-stone-500/30 text-stone-200 border-stone-500/40', text: 'Polos', label: 'Polos' },
  merah: { bg: 'bg-red-500/40 text-red-200 border-red-500/60', text: 'Merah', label: 'Merah' },
  biru: { bg: 'bg-blue-500/40 text-blue-200 border-blue-500/60', text: 'Biru', label: 'Biru' },
  hijau: { bg: 'bg-emerald-500/40 text-emerald-200 border-emerald-500/60', text: 'Hijau', label: 'Hijau' },
};

export const ConveyorBelt: React.FC<ConveyorBeltProps> = ({
  order,
  inputBelt,
  activeItem,
  completedItems,
  activeMachineType,
  componentsUsed,
}) => {
  const [selectedMachineInfo, setSelectedMachineInfo] = useState<MachineType | null>(null);

  // Group completed items by lane
  const laneA = completedItems.filter((i) => i.completedLane === 'A');
  const laneB = completedItems.filter((i) => i.completedLane === 'B');
  const laneC = completedItems.filter((i) => i.completedLane === 'C');
  const rejectLane = completedItems.filter((i) => i.defective || i.completedLane === 'REJECT');
  const normalOutput = completedItems.filter(
    (i) => !i.defective && (!i.completedLane || i.completedLane === 'A') && !order.targetLanes
  );

  const renderItemCard = (item: FactoryItem, isCurrentActive = false) => {
    const matClass = MATERIAL_COLORS[item.material] || 'from-slate-700 to-slate-800';
    const colorInfo = COLOR_BADGES[item.color] || COLOR_BADGES.polos;

    return (
      <div
        key={item.id}
        className={`relative flex flex-col items-center justify-between p-2 rounded-lg border shadow-md transition-all ${
          isCurrentActive
            ? 'scale-105 ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 bg-slate-900 border-cyan-500'
            : 'bg-slate-900/80 border-slate-700/80'
        } ${item.defective ? 'border-rose-500 bg-rose-950/30' : ''}`}
        style={{ minWidth: '95px', minHeight: '105px' }}
      >
        {/* Defective badge */}
        {item.defective && (
          <div className="absolute -top-2 -right-1 bg-rose-600 text-white rounded-full p-0.5 shadow-md flex items-center gap-0.5 text-[9px] px-1 font-bold animate-pulse">
            <AlertTriangle className="w-3 h-3" /> CACAT
          </div>
        )}

        {/* Item Material block */}
        <div
          className={`w-12 h-10 rounded-md bg-gradient-to-br ${matClass} border flex items-center justify-center shadow-inner relative overflow-hidden`}
        >
          {item.cut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-amber-200/80 transform rotate-12 shadow" />
            </div>
          )}
          {item.assembled && (
            <div className="absolute bottom-0.5 right-0.5 text-emerald-300">
              <Wrench className="w-3 h-3" />
            </div>
          )}
          {item.packed && (
            <div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-400 flex items-center justify-center">
              <Box className="w-4 h-4 text-blue-300" />
            </div>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider drop-shadow">
            {item.material.substring(0, 3)}
          </span>
        </div>

        {/* Item specs summary */}
        <div className="w-full flex flex-col gap-0.5 mt-1 text-[10px]">
          <div className="flex items-center justify-between">
            <span className={`px-1 py-0.2 rounded border text-[9px] font-semibold ${colorInfo.bg}`}>
              {colorInfo.label}
            </span>
            <span className="text-slate-400 text-[9px]">S:{item.stage}</span>
          </div>

          <div className="flex flex-wrap gap-0.5 justify-center mt-0.5 text-[9px] text-slate-300">
            {item.cut && <span className="text-amber-400 font-medium">Cut</span>}
            {item.assembled && <span className="text-emerald-400 font-medium">+Asm</span>}
            {item.packed && <span className="text-blue-400 font-medium">Pack</span>}
          </div>
        </div>
      </div>
    );
  };

  const machinesList: MachineType[] = ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-2xl relative overflow-hidden">
      {/* Industrial ambient styling background lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      {/* Header Info Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
          <span className="font-bold text-slate-300 tracking-wider uppercase">Lantai Produksi (Factory Floor)</span>
        </div>

        {/* Resources & Components Warehouse */}
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bahan di Antrean:</span>
            <strong className="text-cyan-300 font-mono text-sm">{inputBelt.length}</strong>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span>Komponen Terpakai:</span>
            <strong className="text-emerald-300 font-mono text-sm">{componentsUsed}</strong>
          </div>
        </div>
      </div>

      {/* Main Floor: Belt & Machines */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 my-2">
        {/* Left Section: Incoming Raw Queue (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900/90 rounded-lg p-3 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              Input Belt
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {inputBelt.length} unit
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 min-h-[115px] items-center">
            {inputBelt.length > 0 ? (
              inputBelt.map((item, idx) => (
                <div key={item.id} className="relative">
                  {renderItemCard(item, idx === 0)}
                  {idx === 0 && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-cyan-400 uppercase whitespace-nowrap">
                      ▶ Item Aktif
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full text-center py-6 text-slate-500 text-xs italic">
                Semua bahan sudah diproses
              </div>
            )}
          </div>
        </div>

        {/* Center Section: Active Processing Bay & Machines (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/60 rounded-lg p-3 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Ruang Pemrosesan Aktif
            </span>
            <span className="text-[11px] text-slate-400">Klik ikon mesin untuk info stage</span>
          </div>

          {/* Machine Icons Row */}
          <div className="grid grid-cols-5 gap-1.5 my-2">
            {machinesList.map((type) => {
              const machine = MACHINES[type];
              const isActive = activeMachineType === type;
              const isAllowed = order.allowedMachines.includes(type);

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedMachineInfo(selectedMachineInfo === type ? null : type)}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    isActive
                      ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400/60 shadow-lg scale-105'
                      : isAllowed
                      ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                      : 'bg-slate-950 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                  }`}
                  title={`${machine.name} (Tahap ${machine.targetStage})`}
                >
                  <div className="mb-1">
                    {type === 'CUTTING' && <Scissors className={`w-4 h-4 ${isActive ? 'animate-bounce text-amber-300' : ''}`} />}
                    {type === 'PAINTING' && <PaintBucket className={`w-4 h-4 ${isActive ? 'animate-pulse text-cyan-300' : ''}`} />}
                    {type === 'ASSEMBLY' && <Wrench className={`w-4 h-4 ${isActive ? 'animate-spin text-emerald-300' : ''}`} />}
                    {type === 'PACKAGING' && <Box className={`w-4 h-4 ${isActive ? 'animate-pulse text-blue-300' : ''}`} />}
                    {type === 'SORTING' && <GitFork className={`w-4 h-4 ${isActive ? 'animate-bounce text-purple-300' : ''}`} />}
                  </div>
                  <span className="text-[10px] font-bold">{type}</span>
                  <span className="text-[9px] text-slate-400">{machine.durationTicks}t</span>
                </button>
              );
            })}
          </div>

          {/* Machine Info Tooltip / Banner */}
          {selectedMachineInfo && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 mt-2 flex items-start gap-2 shadow-lg animate-in fade-in">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between font-bold text-cyan-300">
                  <span>{MACHINES[selectedMachineInfo].name}</span>
                  <span className="text-[10px] text-slate-400">
                    Durasi: {MACHINES[selectedMachineInfo].durationTicks} ticks | Tahap:{' '}
                    {MACHINES[selectedMachineInfo].targetStage === 99
                      ? 'Bebas'
                      : MACHINES[selectedMachineInfo].targetStage}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  {MACHINES[selectedMachineInfo].description}
                </p>
                <div className="text-[10px] text-amber-300 mt-1">
                  Aturan: Stage mesin harus &gt; Stage item aktif saat ini.
                </div>
              </div>
            </div>
          )}

          {/* Conveyor Belt visual track */}
          <div className="relative mt-3 p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center min-h-[90px]">
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-3 bg-slate-800 rounded border-y border-dashed border-slate-700 pointer-events-none" />
            {activeItem ? (
              <div className="relative z-10 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">Sedang Diproses:</span>
                {renderItemCard(activeItem, true)}
                <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
            ) : (
              <span className="relative z-10 text-xs text-slate-500 italic">
                Tidak ada item yang sedang dikerjakan di stasiun
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Output Chutes & Lanes (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900/90 rounded-lg p-3 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Hasil Produksi
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {completedItems.length} selesai
            </span>
          </div>

          {/* Conditional display: Lanes A, B, C for Level 3, or Standard Output for Levels 1-2 */}
          {order.targetLanes ? (
            <div className="space-y-2">
              {(['A', 'B', 'C'] as ('A' | 'B' | 'C')[]).map((lane) => {
                const laneItems = completedItems.filter((i) => i.completedLane === lane);
                return (
                  <div key={lane} className="bg-slate-950/80 p-2 rounded border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-purple-300">Jalur {lane}</span>
                      <span className="text-[10px] text-slate-400">{laneItems.length} item</span>
                    </div>
                    <div className="flex gap-1 overflow-x-auto py-1">
                      {laneItems.length > 0 ? (
                        laneItems.map((item) => (
                          <div
                            key={item.id}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold ${
                              COLOR_BADGES[item.color]?.bg || 'bg-slate-700'
                            }`}
                          >
                            {item.color[0].toUpperCase()}
                          </div>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">Kosong</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 min-h-[90px] flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Output Selesai: {normalOutput.length}
              </span>
              <div className="flex gap-1.5 overflow-x-auto py-1.5 scrollbar-thin">
                {normalOutput.length > 0 ? (
                  normalOutput.map((item) => (
                    <div
                      key={item.id}
                      className="w-8 h-8 rounded border border-emerald-500/40 bg-emerald-950/40 flex items-center justify-center text-[10px] text-emerald-300 font-bold"
                    >
                      ✓
                    </div>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-600 italic py-2">Belum ada item selesai</span>
                )}
              </div>
            </div>
          )}

          {/* Reject Lane indicator */}
          <div className="mt-2 bg-rose-950/20 border border-rose-900/50 rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="font-semibold text-[11px]">Jalur Cacat (Reject):</span>
            </div>
            <span
              className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                rejectLane.length > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {rejectLane.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
