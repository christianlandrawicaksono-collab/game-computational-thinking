import React, { useState } from 'react';
import { 
  Play, StepForward, RotateCcw, Wrench, Bug, CheckCircle2, 
  HelpCircle, ArrowUp, ArrowDown, Power, Trash2, Sparkles, Layers
} from 'lucide-react';
import { LEVEL_3_DATASET, INITIAL_BUGGY_PIPELINE } from '../../data/level3Data';
import { ProcedureInstruction, CaseFinalReport } from '../../types';
import { simulateSystemPipeline, SimulationTrace } from '../../engine/level3Simulator';
import { CASES_METADATA } from '../../data/caseDetails';
import { TerminalLog, LogEntry } from '../common/TerminalLog';
import { HintModal } from '../common/HintModal';
import { DetectiveMascot } from '../common/DetectiveMascot';
import { cyberAudio } from '../../engine/audio';

interface Level3WorkspaceProps {
  onCaseComplete: (report: CaseFinalReport) => void;
  onExit: () => void;
}

export const Level3Workspace: React.FC<Level3WorkspaceProps> = ({ onCaseComplete, onExit }) => {
  const [pipeline, setPipeline] = useState<ProcedureInstruction[]>(INITIAL_BUGGY_PIPELINE);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(-1);
  const [simTrace, setSimTrace] = useState<SimulationTrace | null>(null);
  const [hintOpen, setHintOpen] = useState<boolean>(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('REC-302');

  // Terminal Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "log-1",
      timestamp: new Date().toLocaleTimeString(),
      type: "WARN",
      message: "BENGKEL SISTEM SIAP: Terdeteksi 4 bug logika pada pipeline pemantauan!"
    },
    {
      id: "log-2",
      timestamp: new Date().toLocaleTimeString(),
      type: "DANGER",
      message: "Penyusup berhasil lolos karena ada modul mati dan urutan terbalik. Yuk bereskan!"
    }
  ]);

  const addLog = (type: LogEntry['type'], message: string) => {
    setLogs(prev => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        type,
        message
      }
    ]);
  };

  // Move instruction up or down
  const moveInstruction = (index: number, direction: 'up' | 'down') => {
    cyberAudio.playPop();
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= pipeline.length) return;

    const copy = [...pipeline];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    setPipeline(copy);
    addLog("INFO", `Menggeser urutan [${temp.procedure}] ke posisi #${newIdx + 1}`);
  };

  // Toggle procedure on/off
  const toggleEnable = (id: string) => {
    cyberAudio.playScan();
    setPipeline(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nextState = !item.enabled;
      addLog("INFO", `Saklar modul ${item.procedure} diubah ke: ${nextState ? 'MENYALA (AKTIF) ⚡' : 'PADAM (NON-AKTIF)'}`);
      return { ...item, enabled: nextState };
    }));
  };

  // Remove redundant instruction
  const removeInstruction = (id: string) => {
    cyberAudio.playClick();
    const item = pipeline.find(p => p.id === id);
    setPipeline(prev => prev.filter(p => p.id !== id));
    addLog("WARN", `Membuang prosedur redundan [${item?.procedure}] untuk menghemat komputasi.`);
  };

  // Update procedure condition
  const updateConditionVal = (id: string, field: ProcedureInstruction['conditionField'], val: any) => {
    cyberAudio.playPop();
    setPipeline(prev => prev.map(item => {
      if (item.id !== id) return item;
      addLog("INFO", `Kondisi filter [${item.procedure}] diperbaiki ke: ${val}`);
      return { ...item, conditionField: field, conditionVal: val };
    }));
  };

  // Run full simulation
  const handleRunSimulation = () => {
    cyberAudio.playScan();
    const trace = simulateSystemPipeline(pipeline, LEVEL_3_DATASET);
    setSimTrace(trace);
    setActiveStepIdx(trace.steps.length - 1);

    addLog("SUCCESS", `Simulasi selesai! Akurasi: ${trace.evaluation.accuracy}%, Bug Tereliminasi: ${trace.evaluation.bugsFixedCount}/${trace.evaluation.totalBugs}`);
    if (trace.evaluation.bugsFixedCount === 4 && trace.evaluation.accuracy === 100) {
      cyberAudio.playSuccess();
      addLog("SUCCESS", "LUAR BIASA! Seluruh 4 bug berhasil dibasmi dan akurasi 100% sempurna!");
    }
  };

  // Step simulation
  const handleStepSimulation = () => {
    const trace = simulateSystemPipeline(pipeline, LEVEL_3_DATASET);
    setSimTrace(trace);
    cyberAudio.playPop();

    if (activeStepIdx >= trace.steps.length - 1) {
      setActiveStepIdx(0);
    } else {
      setActiveStepIdx(prev => prev + 1);
    }

    const currentStep = trace.steps[Math.min(activeStepIdx + 1, trace.steps.length - 1)];
    if (currentStep) {
      addLog("INFO", `[STEP ${currentStep.stepNumber}] ${currentStep.log}`);
    }
  };

  // Reset pipeline
  const handleResetToBuggy = () => {
    cyberAudio.playClick();
    setPipeline(INITIAL_BUGGY_PIPELINE);
    setSimTrace(null);
    setActiveStepIdx(-1);
    addLog("WARN", "Pipeline dikembalikan ke susunan awal yang bermasalah.");
  };

  // Submit Final Case Report
  const handleSubmitLevel3 = () => {
    const trace = simTrace || simulateSystemPipeline(pipeline, LEVEL_3_DATASET);
    const { accuracy, bugsFixedCount, totalBugs, efficiencyRating } = trace.evaluation;

    const debuggingScore = Math.round((bugsFixedCount / totalBugs) * 100);
    const logicQuality = accuracy;

    let stars = 1;
    if (bugsFixedCount === 4 && accuracy >= 90 && efficiencyRating >= 85) {
      stars = 3;
    } else if (bugsFixedCount >= 2 && accuracy >= 70) {
      stars = 2;
    }

    let grade: CaseFinalReport['finalGrade'] = 'B';
    if (stars === 3) grade = 'S';
    else if (stars === 2) grade = 'A';
    else if (accuracy < 60) grade = 'RETRY';

    const feedbackTitle = stars === 3
      ? "SISTEM BERHASIL DIPERBAIKI TOTAL! 🏆"
      : stars === 2
      ? "SISTEM BERFUNGSI SEBAGIAN ⭐"
      : "MASIH ADA BUG LOGIKA, TELITI LAGI! 🛠️";

    const feedbackBody = `Kamu berhasil memperbaiki ${bugsFixedCount} dari ${totalBugs} bug logika arsitektur. Akurasi pengawasan akhir: ${accuracy}%, Efisiensi Sistem: ${efficiencyRating}%.`;

    const report: CaseFinalReport = {
      caseId: 3,
      caseTitle: CASES_METADATA[3].title,
      caseSubtitle: CASES_METADATA[3].subtitle,
      stars,
      accuracyScore: accuracy,
      logicQualityScore: logicQuality,
      efficiencyScore: efficiencyRating,
      debuggingScore,
      finalGrade: grade,
      feedbackTitle,
      feedbackBody,
      ctConcepts: CASES_METADATA[3].ctLearningTakeaway
    };

    onCaseComplete(report);
  };

  const selectedRecord = LEVEL_3_DATASET.find(r => r.id === selectedRecordId) || LEVEL_3_DATASET[0];

  return (
    <div className="min-h-screen py-4 px-3 sm:px-6 max-w-7xl mx-auto space-y-4 animate-fadeIn">
      {/* Playful Detective Mascot Greeting */}
      <DetectiveMascot
        mood="alert"
        message="Detektif! Pipeline pemantauan ini kacau balau! Geser GENERATE_REPORT ke posisi paling bawah, hidupkan modul ANALYZE_ACTIVITY yang mati, hapus CHECK_LOGIN ganda, dan ubah kondisi VERIFY_ACCESS jadi ALL!"
        onHelpClick={() => setHintOpen(true)}
      />

      {/* Main Grid: Pipeline Sequence Builder (Left) & Multi-Module Inspector + Trace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Procedure Pipeline Builder (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Bar Header */}
          <div className="bg-[#15193b] p-3.5 rounded-2xl border border-indigo-500/20 flex flex-wrap items-center justify-between gap-2 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛠️</span>
              <div>
                <span className="text-sm font-game font-bold text-white tracking-wide">
                  BENGKEL RESTORASI ALUR SISTEM
                </span>
                <div className="text-[11px] text-slate-400 font-ui">
                  Atur urutan modul dan basmi 4 bug logika
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-game font-bold border ${
                simTrace && simTrace.evaluation.bugsFixedCount === 4
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-pink-500/20 text-pink-300 border-pink-500/40'
              }`}>
                {simTrace ? `${simTrace.evaluation.bugsFixedCount}/4 BUG DIBERESKAN` : '4 BUG PERLU DIBERESKAN'}
              </span>

              <button
                onClick={handleResetToBuggy}
                className="text-xs font-game text-slate-400 hover:text-white px-2 py-1"
              >
                RESET
              </button>
            </div>
          </div>

          {/* Procedure Instruction Cards */}
          <div className="space-y-3">
            {pipeline.map((item, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === pipeline.length - 1;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border-2 p-4 space-y-3 transition-all ${
                    !item.enabled
                      ? 'bg-[#15193b]/50 border-slate-700 opacity-60'
                      : item.hasBug
                      ? 'bg-[#15193b] border-pink-500/40 shadow-md'
                      : 'bg-[#15193b] border-emerald-500/40'
                  }`}
                >
                  {/* Card Title & Reordering Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 text-slate-900 flex items-center justify-center text-xs font-game font-black shadow-sm">
                        {idx + 1}
                      </span>
                      <span className="font-game font-extrabold text-base text-white">
                        {item.procedure}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg font-game font-bold ${
                        item.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.enabled ? '⚡ AKTIF' : '💤 MATI'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Move Up */}
                      <button
                        onClick={() => moveInstruction(idx, 'up')}
                        disabled={isFirst}
                        className="p-1.5 rounded-xl bg-[#0e1231] text-slate-300 hover:text-cyan-300 hover:scale-105 disabled:opacity-30 transition-all"
                        title="Geser ke Atas"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      {/* Move Down */}
                      <button
                        onClick={() => moveInstruction(idx, 'down')}
                        disabled={isLast}
                        className="p-1.5 rounded-xl bg-[#0e1231] text-slate-300 hover:text-cyan-300 hover:scale-105 disabled:opacity-30 transition-all"
                        title="Geser ke Bawah"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      {/* Toggle Saklar */}
                      <button
                        onClick={() => toggleEnable(item.id)}
                        className={`p-1.5 rounded-xl transition-all ${
                          item.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        } hover:scale-105`}
                        title={item.enabled ? "Klik untuk mematikan modul" : "Klik untuk menyalakan modul"}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      {/* Delete Redundant */}
                      <button
                        onClick={() => removeInstruction(item.id)}
                        className="p-1.5 rounded-xl bg-[#0e1231] text-slate-400 hover:text-pink-400 hover:scale-105 transition-all"
                        title="Hapus Modul Redundan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bug Callout Banner */}
                  {item.hasBug && item.bugDescription && (
                    <div className="p-2.5 rounded-xl bg-pink-950/30 border border-pink-500/30 text-xs font-ui text-pink-300 flex items-start gap-2">
                      <Bug className="w-4 h-4 shrink-0 text-pink-400 mt-0.5" />
                      <span>{item.bugDescription}</span>
                    </div>
                  )}

                  {/* Customizable Condition Controls per Procedure */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-ui bg-[#0e1231] p-3 rounded-xl border border-indigo-500/20">
                    <span className="font-game text-slate-300">Konfigurasi Modul:</span>

                    {item.procedure === 'VERIFY_ACCESS' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">resourceTier:</span>
                        <select
                          value={String(item.conditionVal)}
                          onChange={(e) => updateConditionVal(item.id, 'resourceTier', e.target.value)}
                          className={`bg-[#15193b] border rounded-xl px-3 py-1 font-game text-xs focus:outline-none ${
                            item.conditionVal === 'PUBLIC' ? 'border-pink-500 text-pink-300' : 'border-emerald-400 text-emerald-300'
                          }`}
                        >
                          <option value="PUBLIC">PUBLIC (Hanya Cek Berkas Biasa - BUG ❌)</option>
                          <option value="ALL">ALL (Periksa Semua Tier Termasuk ROOT & RESTRICTED ✅)</option>
                        </select>
                      </div>
                    ) : item.procedure === 'ANALYZE_ACTIVITY' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Pemeriksaan:</span>
                        <select
                          value={item.conditionField || 'always'}
                          onChange={(e) => updateConditionVal(item.id, e.target.value as any, true)}
                          className="bg-[#15193b] border border-cyan-400/40 rounded-xl px-3 py-1 text-cyan-300 font-game text-xs focus:outline-none"
                        >
                          <option value="always">ALWAYS (Analisis Semua Aktivitas Data)</option>
                          <option value="privilegeEscalated">Hanya Jika Eskalasi Privilese</option>
                        </select>
                      </div>
                    ) : (
                      <span className="text-emerald-300 font-game text-xs">
                        [Berjalan otomatis memeriksa seluruh event]
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Execution Bar */}
          <div className="bg-[#15193b] p-4 rounded-2xl border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunSimulation}
                className="btn-fun btn-fun-cyan text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" /> RUN SIMULASI PIPELINE
              </button>
              <button
                onClick={handleStepSimulation}
                className="btn-fun btn-fun-purple text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <StepForward className="w-4 h-4" /> STEP
              </button>
            </div>

            <button
              onClick={handleSubmitLevel3}
              className="btn-fun btn-fun-lime text-xs py-2.5 px-5 flex items-center gap-1.5 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" /> SELESAIKAN MISI
            </button>
          </div>
        </div>

        {/* Right: Multi-Module Inspector & Evaluation Trace (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Module Record Inspector */}
          <div className="bg-[#15193b] rounded-2xl border border-indigo-500/20 p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-game font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> 3 MODUL DATA TERINTEGRASI
              </span>
              <select
                value={selectedRecordId}
                onChange={(e) => setSelectedRecordId(e.target.value)}
                className="bg-[#0e1231] border border-cyan-400/40 rounded-xl px-2.5 py-1 text-xs text-cyan-300 font-game focus:outline-none"
              >
                {LEVEL_3_DATASET.map(r => (
                  <option key={r.id} value={r.id}>{r.id} ({r.userId})</option>
                ))}
              </select>
            </div>

            {/* 3 Modules Accordion Display */}
            <div className="space-y-2 text-xs font-ui">
              {/* Module 1: Login */}
              <div className="p-3 bg-[#0e1231] rounded-xl border border-indigo-500/20 space-y-1">
                <div className="text-cyan-300 font-game font-bold text-xs">1. MODUL LOGIN EVENTS</div>
                <div className="text-slate-300 grid grid-cols-2 gap-1 text-[11px]">
                  <div>IP: <span className="text-white font-code">{selectedRecord.loginModule.loginIp}</span></div>
                  <div>GeoMismatch: <span className={selectedRecord.loginModule.geoMismatched ? 'text-pink-400 font-bold' : 'text-emerald-400'}>{String(selectedRecord.loginModule.geoMismatched)}</span></div>
                  <div>MFA: <span className={selectedRecord.loginModule.mfaVerified ? 'text-emerald-400' : 'text-pink-400'}>{String(selectedRecord.loginModule.mfaVerified)}</span></div>
                  <div>Percobaan: <span className={selectedRecord.loginModule.attemptCount >= 3 ? 'text-pink-400 font-bold' : 'text-white font-code'}>{selectedRecord.loginModule.attemptCount}x</span></div>
                </div>
              </div>

              {/* Module 2: Activity */}
              <div className="p-3 bg-[#0e1231] rounded-xl border border-indigo-500/20 space-y-1">
                <div className="text-emerald-300 font-game font-bold text-xs">2. MODUL USER ACTIVITY</div>
                <div className="text-slate-300 grid grid-cols-2 gap-1 text-[11px]">
                  <div>Aksi: <span className="text-white font-game">{selectedRecord.activityModule.actionType}</span></div>
                  <div>Eskalasi: <span className={selectedRecord.activityModule.privilegeEscalated ? 'text-pink-400 font-bold' : 'text-emerald-400'}>{String(selectedRecord.activityModule.privilegeEscalated)}</span></div>
                  <div className="col-span-2">Transfer: <span className="text-white font-code">{Math.round(selectedRecord.activityModule.bytesTransferred / 1024 / 1024)} MB</span></div>
                </div>
              </div>

              {/* Module 3: Access */}
              <div className="p-3 bg-[#0e1231] rounded-xl border border-indigo-500/20 space-y-1">
                <div className="text-pink-300 font-game font-bold text-xs">3. MODUL ACCESS RECORDS</div>
                <div className="text-slate-300 grid grid-cols-2 gap-1 text-[11px]">
                  <div>Tier: <span className="text-white font-bold">{selectedRecord.accessModule.resourceTier}</span></div>
                  <div>Terotorisasi: <span className={selectedRecord.accessModule.authorized ? 'text-emerald-400' : 'text-pink-400 font-bold'}>{String(selectedRecord.accessModule.authorized)}</span></div>
                  <div>Jam Akses: <span className="text-white font-code">{selectedRecord.accessModule.accessHour}:00</span></div>
                  <div>Vonis Nyata: <span className="text-cyan-300 font-bold">{selectedRecord.groundTruthVerdict}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Card */}
          {simTrace && (
            <div className="bg-[#15193b] rounded-2xl border border-emerald-500/30 p-4 space-y-3 font-ui text-xs shadow-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-game font-bold text-emerald-300 uppercase">HASIL EVALUASI BENGKEL</span>
                <span className="font-game font-bold text-cyan-300">AKURASI: {simTrace.evaluation.accuracy}%</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-[#0e1231] border border-indigo-500/20">
                  <div className="text-[10px] font-game text-slate-400">BUG TERBASMI</div>
                  <div className="text-2xl font-game font-black text-emerald-400 mt-1">
                    {simTrace.evaluation.bugsFixedCount} / 4
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#0e1231] border border-indigo-500/20">
                  <div className="text-[10px] font-game text-slate-400">EFISIENSI SISTEM</div>
                  <div className="text-2xl font-game font-black text-amber-400 mt-1">
                    {simTrace.evaluation.efficiencyRating}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terminal Console */}
          <TerminalLog
            logs={logs}
            onClear={() => setLogs([])}
            maxHeight="200px"
            title="TRACE DIAGNOSTIK SISTEM"
          />
        </div>
      </div>

      {/* Hint Modal */}
      <HintModal
        caseId={3}
        isOpen={hintOpen}
        onClose={() => setHintOpen(false)}
      />
    </div>
  );
};
