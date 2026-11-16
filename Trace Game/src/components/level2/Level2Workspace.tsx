import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, StepForward, RotateCcw, Trash2, Plus, 
  HelpCircle, ShieldAlert, CheckCircle2, AlertOctagon, Activity, ArrowRight, CornerDownRight, Sparkles
} from 'lucide-react';
import { LEVEL_2_DATASET } from '../../data/level2Data';
import { LogicRuleBlock, LogicCondition, RuleAction, CaseFinalReport, RuleEvaluationResult } from '../../types';
import { executeRules, validateRuleBlocks } from '../../engine/level2Interpreter';
import { CASES_METADATA } from '../../data/caseDetails';
import { TerminalLog, LogEntry } from '../common/TerminalLog';
import { HintModal } from '../common/HintModal';
import { DetectiveMascot } from '../common/DetectiveMascot';
import { cyberAudio } from '../../engine/audio';

interface Level2WorkspaceProps {
  onCaseComplete: (report: CaseFinalReport) => void;
  onExit: () => void;
}

export const Level2Workspace: React.FC<Level2WorkspaceProps> = ({ onCaseComplete, onExit }) => {
  // Logic Rule Blocks AST
  const [ruleBlocks, setRuleBlocks] = useState<LogicRuleBlock[]>([
    {
      id: "block-1",
      type: "IF_ELSE",
      conditionGroup: {
        operator: "AND",
        conditions: [
          {
            id: "cond-1",
            field: "failedAttemptCount",
            comparator: "GREATER_THAN",
            value: 4
          }
        ]
      },
      thenAction: "MARK_SUSPICIOUS",
      elseAction: "PASS"
    }
  ]);

  // Simulation execution state
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simSpeedMs, setSimSpeedMs] = useState<number>(300);
  const [evaluationResult, setEvaluationResult] = useState<RuleEvaluationResult | null>(null);
  const [hintOpen, setHintOpen] = useState<boolean>(false);
  const [selectedLogTab, setSelectedLogTab] = useState<'DATA' | 'MATRIX'>('DATA');

  // Terminal Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "log-1",
      timestamp: new Date().toLocaleTimeString(),
      type: "INFO",
      message: "Studio Desain Aturan Deteksi siap. Rakit blok logika penyaring siber!"
    },
    {
      id: "log-2",
      timestamp: new Date().toLocaleTimeString(),
      type: "INFO",
      message: "26 baris rekaman login siap diuji terhadap aturan buatanmu."
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

  // Run simulation loop
  useEffect(() => {
    let timer: any;
    if (isSimulating) {
      timer = setInterval(() => {
        setActiveStepIndex(prev => {
          if (prev >= LEVEL_2_DATASET.length - 1) {
            setIsSimulating(false);
            cyberAudio.playSuccess();
            addLog("SUCCESS", "Simulasi selesai! Menghitung skor akurasi & matriks deteksi.");
            const res = executeRules(ruleBlocks, LEVEL_2_DATASET);
            setEvaluationResult(res);
            return prev;
          }
          const next = prev + 1;
          cyberAudio.playPop();
          const rec = LEVEL_2_DATASET[next];
          addLog("INFO", `[LOG #${next + 1}] Memeriksa Event: ${rec.id} (${rec.accountId})`);
          return next;
        });
      }, simSpeedMs);
    }
    return () => clearInterval(timer);
  }, [isSimulating, simSpeedMs, ruleBlocks]);

  // Block Manipulation Handlers
  const handleAddCondition = (blockId: string) => {
    cyberAudio.playPop();
    setRuleBlocks(prev => prev.map(block => {
      if (block.id !== blockId) return block;
      const conditions = block.conditionGroup?.conditions || [];
      const newCond: LogicCondition = {
        id: `cond-${Date.now()}`,
        field: "deviceType",
        comparator: "EQUALS",
        value: "TOR_PROXY"
      };
      return {
        ...block,
        conditionGroup: {
          operator: block.conditionGroup?.operator || "AND",
          conditions: [...conditions, newCond]
        }
      };
    }));
    addLog("INFO", "Menambahkan kondisi pembanding baru ke blok.");
  };

  const handleUpdateCondition = (
    blockId: string, 
    condId: string, 
    field: LogicCondition['field'], 
    comparator: LogicCondition['comparator'], 
    value: string | number
  ) => {
    setRuleBlocks(prev => prev.map(block => {
      if (block.id !== blockId || !block.conditionGroup) return block;
      return {
        ...block,
        conditionGroup: {
          ...block.conditionGroup,
          conditions: block.conditionGroup.conditions.map(c => 
            c.id === condId ? { ...c, field, comparator, value } : c
          )
        }
      };
    }));
  };

  const handleRemoveCondition = (blockId: string, condId: string) => {
    cyberAudio.playClick();
    setRuleBlocks(prev => prev.map(block => {
      if (block.id !== blockId || !block.conditionGroup) return block;
      return {
        ...block,
        conditionGroup: {
          ...block.conditionGroup,
          conditions: block.conditionGroup.conditions.filter(c => c.id !== condId)
        }
      };
    }));
  };

  const handleToggleOperator = (blockId: string) => {
    cyberAudio.playPop();
    setRuleBlocks(prev => prev.map(block => {
      if (block.id !== blockId || !block.conditionGroup) return block;
      const nextOp = block.conditionGroup.operator === 'AND' ? 'OR' : 'AND';
      addLog("INFO", `Operator logika diubah ke: ${nextOp}`);
      return {
        ...block,
        conditionGroup: {
          ...block.conditionGroup,
          operator: nextOp
        }
      };
    }));
  };

  const handleUpdateAction = (blockId: string, type: 'then' | 'else', action: RuleAction) => {
    cyberAudio.playPop();
    setRuleBlocks(prev => prev.map(block => {
      if (block.id !== blockId) return block;
      return type === 'then'
        ? { ...block, thenAction: action }
        : { ...block, elseAction: action };
    }));
  };

  const handleAddRuleBlock = () => {
    cyberAudio.playPop();
    const newBlock: LogicRuleBlock = {
      id: `block-${Date.now()}`,
      type: "IF_ELSE",
      conditionGroup: {
        operator: "OR",
        conditions: [
          {
            id: `cond-${Date.now()}`,
            field: "deviceType",
            comparator: "EQUALS",
            value: "TOR_PROXY"
          }
        ]
      },
      thenAction: "MARK_SUSPICIOUS",
      elseAction: "PASS"
    };
    setRuleBlocks(prev => [...prev, newBlock]);
    addLog("INFO", "Menambahkan blok aturan IF-ELSE baru.");
  };

  const handleRemoveBlock = (blockId: string) => {
    cyberAudio.playClick();
    if (ruleBlocks.length <= 1) {
      addLog("WARN", "Minimal satu blok aturan logika harus tetap ada.");
      return;
    }
    setRuleBlocks(prev => prev.filter(b => b.id !== blockId));
    addLog("INFO", "Blok aturan dihapus.");
  };

  // Execution Controls
  const handleRunAll = () => {
    const val = validateRuleBlocks(ruleBlocks);
    if (!val.isValid) {
      cyberAudio.playError();
      addLog("DANGER", val.error || "Validasi blok gagal!");
      return;
    }
    cyberAudio.playScan();
    setIsSimulating(false);
    setActiveStepIndex(LEVEL_2_DATASET.length - 1);
    const result = executeRules(ruleBlocks, LEVEL_2_DATASET);
    setEvaluationResult(result);
    setSelectedLogTab('MATRIX');
    addLog("SUCCESS", `Eksekusi selesai! Akurasi: ${result.accuracy}%, TP: ${result.truePositives}, FP: ${result.falsePositives}`);
  };

  const handleStartStepSim = () => {
    const val = validateRuleBlocks(ruleBlocks);
    if (!val.isValid) {
      cyberAudio.playError();
      addLog("DANGER", val.error || "Validasi blok gagal!");
      return;
    }
    cyberAudio.playPop();
    setActiveStepIndex(-1);
    setIsSimulating(true);
    addLog("INFO", "Memulai simulasi visual per baris...");
  };

  const handleSingleStep = () => {
    if (activeStepIndex >= LEVEL_2_DATASET.length - 1) {
      setActiveStepIndex(0);
    } else {
      setActiveStepIndex(prev => prev + 1);
    }
    cyberAudio.playPop();
    const curIdx = Math.min(activeStepIndex + 1, LEVEL_2_DATASET.length - 1);
    const rec = LEVEL_2_DATASET[curIdx];
    addLog("INFO", `[STEP] Memeriksa Event: ${rec.id} (Gagal: ${rec.failedAttemptCount}x, Dev: ${rec.deviceType})`);
    
    const partialDataset = LEVEL_2_DATASET.slice(0, curIdx + 1);
    const res = executeRules(ruleBlocks, partialDataset);
    setEvaluationResult(res);
  };

  const handleResetSim = () => {
    cyberAudio.playClick();
    setIsSimulating(false);
    setActiveStepIndex(-1);
    setEvaluationResult(null);
    addLog("INFO", "Simulasi direset.");
  };

  const handleClearBlocks = () => {
    cyberAudio.playClick();
    setRuleBlocks([
      {
        id: `block-${Date.now()}`,
        type: "IF_THEN",
        conditionGroup: {
          operator: "AND",
          conditions: [
            {
              id: `cond-${Date.now()}`,
              field: "failedAttemptCount",
              comparator: "GREATER_THAN",
              value: 5
            }
          ]
        },
        thenAction: "MARK_SUSPICIOUS"
      }
    ]);
    handleResetSim();
    addLog("INFO", "Editor dikembalikan ke blok dasar.");
  };

  // Submit Final Case Report
  const handleSubmitLevel2 = () => {
    const evalRes = evaluationResult || executeRules(ruleBlocks, LEVEL_2_DATASET);
    const { accuracy, truePositives, falsePositives, trueNegatives, falseNegatives } = evalRes;

    const logicQuality = Math.min(100, Math.round(((truePositives * 10) + (trueNegatives * 5))));
    let efficiency = 100 - (Math.max(0, ruleBlocks.length - 2) * 15);
    efficiency = Math.max(30, efficiency);

    const debuggingScore = Math.round(((truePositives + trueNegatives) / LEVEL_2_DATASET.length) * 100);

    let stars = 1;
    if (accuracy >= 90 && falsePositives <= 1) {
      stars = 3;
    } else if (accuracy >= 75) {
      stars = 2;
    }

    let grade: CaseFinalReport['finalGrade'] = 'B';
    if (stars === 3) grade = 'S';
    else if (stars === 2) grade = 'A';
    else if (accuracy < 60) grade = 'RETRY';

    const report: CaseFinalReport = {
      caseId: 2,
      caseTitle: CASES_METADATA[2].title,
      caseSubtitle: CASES_METADATA[2].subtitle,
      stars,
      accuracyScore: accuracy,
      logicQualityScore: logicQuality,
      efficiencyScore: efficiency,
      debuggingScore,
      finalGrade: grade,
      feedbackTitle: evalRes.feedback.title,
      feedbackBody: evalRes.feedback.description,
      ctConcepts: CASES_METADATA[2].ctLearningTakeaway
    };

    onCaseComplete(report);
  };

  return (
    <div className="min-h-screen py-4 px-3 sm:px-6 max-w-7xl mx-auto space-y-4 animate-fadeIn">
      {/* Playful Detective Mascot Greeting */}
      <DetectiveMascot
        mood="curious"
        message="Detektif! Susun aturan IF-THEN-ELSE di bawah. Misalnya: JIKA Failed Attempt Count > 4 ATAU Device Type == TOR_PROXY, MAKA tandai sebagai ANCAMAN!"
        subtext="Jangan lupa sediakan cabang ELSE untuk meloloskan staf normal, biar gak salah tangkap orang baik!"
        onHelpClick={() => setHintOpen(true)}
      />

      {/* Main Grid: Left Visual Rule Builder, Right Log Dataset & Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Visual Rule Builder (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Builder Controls Header */}
          <div className="bg-[#15193b] p-3.5 rounded-2xl border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧩</span>
              <div>
                <span className="text-sm font-game font-bold text-white tracking-wide">
                  BLOK LOGIKA PENYARING SIBER
                </span>
                <div className="text-[11px] text-slate-400 font-ui">
                  {ruleBlocks.length} Puzzle Aturan Terpasang
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddRuleBlock}
                className="btn-fun btn-fun-cyan text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> TAMBAH BLOK IF
              </button>
              <button
                onClick={handleClearBlocks}
                className="text-xs font-game text-slate-400 hover:text-pink-400 px-2 py-1 transition-colors"
              >
                BERSIHKAN
              </button>
            </div>
          </div>

          {/* Rule Blocks List (Colorful Puzzle Blocks) */}
          <div className="space-y-4">
            {ruleBlocks.map((block, bIdx) => (
              <div
                key={block.id}
                className="bg-[#15193b] rounded-2xl border-2 border-indigo-500/40 p-4 space-y-3 shadow-lg relative overflow-hidden"
              >
                {/* Block Header Tab */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl text-xs font-game font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm">
                      PUZZLE ATURAN #{bIdx + 1}
                    </span>
                    <span className="text-xs font-game text-slate-300">
                      JIKA (KONDISI) ➜ MAKA (AKSI)
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveBlock(block.id)}
                    className="p-1.5 text-slate-400 hover:text-pink-400 rounded-lg hover:bg-white/5 transition-colors"
                    title="Hapus Blok Aturan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Conditions Container (Snap-fit look) */}
                <div className="space-y-2 bg-[#0e1231] p-3.5 rounded-xl border border-indigo-500/30">
                  <div className="flex items-center justify-between text-xs font-game text-slate-300 mb-1">
                    <span>SYARAT KONDISI:</span>
                    {block.conditionGroup && block.conditionGroup.conditions.length > 1 && (
                      <button
                        onClick={() => handleToggleOperator(block.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-game font-bold bg-amber-400/20 border border-amber-400/50 text-amber-300 hover:bg-amber-400/30 transition-all"
                      >
                        HUBUNGAN: {block.conditionGroup.operator} (KLIK GANTI)
                      </button>
                    )}
                  </div>

                  {block.conditionGroup?.conditions.map((cond, cIdx) => (
                    <div key={cond.id} className="flex flex-wrap items-center gap-2 text-xs font-ui">
                      {cIdx > 0 && (
                        <span className="text-xs font-game font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {block.conditionGroup?.operator}
                        </span>
                      )}

                      {/* Field Dropdown */}
                      <select
                        value={cond.field}
                        onChange={(e) => handleUpdateCondition(
                          block.id, 
                          cond.id, 
                          e.target.value as LogicCondition['field'], 
                          cond.comparator, 
                          e.target.value === 'deviceType' ? 'TOR_PROXY' : e.target.value === 'loginStatus' ? 'FAILED' : cond.value
                        )}
                        className="bg-[#15193b] border border-cyan-400/40 rounded-xl px-2.5 py-1.5 text-cyan-300 font-game focus:outline-none"
                      >
                        <option value="failedAttemptCount">Percobaan Gagal (Failed Count)</option>
                        <option value="sessionDurationSec">Durasi Sesi (detik)</option>
                        <option value="deviceType">Jenis Perangkat (Device)</option>
                        <option value="loginStatus">Status Login</option>
                      </select>

                      {/* Comparator Dropdown */}
                      <select
                        value={cond.comparator}
                        onChange={(e) => handleUpdateCondition(
                          block.id, 
                          cond.id, 
                          cond.field, 
                          e.target.value as LogicCondition['comparator'], 
                          cond.value
                        )}
                        className="bg-[#15193b] border border-emerald-400/40 rounded-xl px-2.5 py-1.5 text-emerald-300 font-game focus:outline-none"
                      >
                        <option value="GREATER_THAN">&gt; (Lebih Dari)</option>
                        <option value="LESS_THAN">&lt; (Kurang Dari)</option>
                        <option value="EQUALS">== (Sama Dengan)</option>
                        <option value="NOT_EQUALS">!= (Tidak Sama)</option>
                      </select>

                      {/* Value Input */}
                      {cond.field === 'deviceType' ? (
                        <select
                          value={String(cond.value)}
                          onChange={(e) => handleUpdateCondition(block.id, cond.id, cond.field, cond.comparator, e.target.value)}
                          className="bg-[#15193b] border border-pink-400/40 rounded-xl px-2.5 py-1.5 text-pink-300 font-game focus:outline-none"
                        >
                          <option value="TOR_PROXY">TOR_PROXY (Anonim)</option>
                          <option value="API_KEY">API_KEY (Bot API)</option>
                          <option value="DESKTOP">DESKTOP</option>
                          <option value="MOBILE">MOBILE</option>
                        </select>
                      ) : cond.field === 'loginStatus' ? (
                        <select
                          value={String(cond.value)}
                          onChange={(e) => handleUpdateCondition(block.id, cond.id, cond.field, cond.comparator, e.target.value)}
                          className="bg-[#15193b] border border-pink-400/40 rounded-xl px-2.5 py-1.5 text-pink-300 font-game focus:outline-none"
                        >
                          <option value="FAILED">FAILED (Gagal)</option>
                          <option value="SUCCESS">SUCCESS (Berhasil)</option>
                        </select>
                      ) : (
                        <input
                          type="number"
                          value={cond.value}
                          onChange={(e) => handleUpdateCondition(block.id, cond.id, cond.field, cond.comparator, Number(e.target.value))}
                          className="w-20 bg-[#15193b] border border-pink-400/40 rounded-xl px-2.5 py-1.5 text-pink-300 font-code font-bold focus:outline-none text-center"
                        />
                      )}

                      {block.conditionGroup && block.conditionGroup.conditions.length > 1 && (
                        <button
                          onClick={() => handleRemoveCondition(block.id, cond.id)}
                          className="text-slate-400 hover:text-pink-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="pt-2">
                    <button
                      onClick={() => handleAddCondition(block.id)}
                      className="text-xs font-game text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Syarat Lagi (AND / OR)
                    </button>
                  </div>
                </div>

                {/* Actions: THEN and ELSE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-game pt-1">
                  {/* THEN Action */}
                  <div className="p-3 bg-[#0e1231] rounded-xl border border-pink-500/30 space-y-1.5">
                    <span className="font-bold text-pink-400 flex items-center gap-1.5">
                      <ArrowRight className="w-4 h-4" /> JIKA BENAR (THEN):
                    </span>
                    <select
                      value={block.thenAction}
                      onChange={(e) => handleUpdateAction(block.id, 'then', e.target.value as RuleAction)}
                      className="w-full bg-[#15193b] border border-pink-400/40 rounded-xl px-3 py-1.5 text-pink-300 font-bold focus:outline-none"
                    >
                      <option value="MARK_SUSPICIOUS">🚨 TANDAI PENYUSUP (SUSPICIOUS)</option>
                      <option value="SEND_REVIEW">⚠️ KIRIM TINJAUAN (REVIEW)</option>
                      <option value="PASS">✅ LOLOSKAN AMAN (PASS)</option>
                    </select>
                  </div>

                  {/* ELSE Action */}
                  <div className="p-3 bg-[#0e1231] rounded-xl border border-emerald-500/30 space-y-1.5">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CornerDownRight className="w-4 h-4" /> JIKA SALAH (ELSE):
                    </span>
                    <select
                      value={block.elseAction || 'PASS'}
                      onChange={(e) => handleUpdateAction(block.id, 'else', e.target.value as RuleAction)}
                      className="w-full bg-[#15193b] border border-emerald-400/40 rounded-xl px-3 py-1.5 text-emerald-300 font-bold focus:outline-none"
                    >
                      <option value="PASS">✅ LOLOSKAN AMAN (PASS)</option>
                      <option value="SEND_REVIEW">⚠️ KIRIM TINJAUAN (REVIEW)</option>
                      <option value="MARK_SUSPICIOUS">🚨 TANDAI PENYUSUP (SUSPICIOUS)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Execution Bar (Tactile 3D Buttons) */}
          <div className="bg-[#15193b] p-4 rounded-2xl border border-indigo-500/20 space-y-3 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Simulation control buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleRunAll}
                  className="btn-fun btn-fun-cyan text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-current" /> RUN SEMUA
                </button>

                {isSimulating ? (
                  <button
                    onClick={() => setIsSimulating(false)}
                    className="btn-fun btn-fun-pink text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <Pause className="w-4 h-4" /> PAUSE
                  </button>
                ) : (
                  <button
                    onClick={handleStartStepSim}
                    className="btn-fun btn-fun-purple text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <Play className="w-4 h-4" /> SIMULASI STEP
                  </button>
                )}

                <button
                  onClick={handleSingleStep}
                  disabled={isSimulating}
                  className="btn-fun btn-fun-dark text-xs py-2 px-3.5 flex items-center gap-1.5 disabled:opacity-40"
                >
                  <StepForward className="w-4 h-4" /> STEP
                </button>

                <button
                  onClick={handleResetSim}
                  className="p-2 rounded-xl bg-[#0e1231] text-slate-400 hover:text-white border border-indigo-500/30 transition-colors"
                  title="Reset status simulasi"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Complete Case Button */}
              <button
                onClick={handleSubmitLevel2}
                className="btn-fun btn-fun-lime text-xs py-2.5 px-5 flex items-center gap-1.5 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" /> SELESAIKAN MISI
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dataset & Confusion Matrix (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Navigation Tabs */}
          <div className="flex rounded-2xl bg-[#15193b] p-1.5 border border-indigo-500/20 text-xs font-game">
            <button
              onClick={() => setSelectedLogTab('DATA')}
              className={`flex-1 py-2 rounded-xl transition-all text-center ${
                selectedLogTab === 'DATA' ? 'bg-cyan-400 text-slate-900 font-bold shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              DATA LOG LOGIN ({LEVEL_2_DATASET.length})
            </button>
            <button
              onClick={() => setSelectedLogTab('MATRIX')}
              className={`flex-1 py-2 rounded-xl transition-all text-center ${
                selectedLogTab === 'MATRIX' ? 'bg-emerald-400 text-slate-900 font-bold shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              HASIL DETEKSI (MATRIX)
            </button>
          </div>

          {/* TAB 1: Log Dataset */}
          {selectedLogTab === 'DATA' && (
            <div className="bg-[#15193b] rounded-2xl border border-indigo-500/20 overflow-hidden shadow-md">
              <div className="p-3 bg-[#0e1231] border-b border-indigo-500/20 flex items-center justify-between text-xs font-game">
                <span className="text-cyan-300 font-bold">REKAMAN LOG MASUK</span>
                <span className="text-[11px] text-slate-400 font-ui">
                  {activeStepIndex >= 0 ? `Meneliti baris ke-${activeStepIndex + 1}` : 'Menunggu eksekusi'}
                </span>
              </div>

              <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5 font-ui text-xs">
                {LEVEL_2_DATASET.map((log, idx) => {
                  const isActive = activeStepIndex === idx;
                  const decision = evaluationResult?.rowDecisions.find(d => d.recordId === log.id);

                  return (
                    <div
                      key={log.id}
                      className={`p-3 transition-colors ${
                        isActive
                          ? 'bg-cyan-950/40 border-l-4 border-l-cyan-400'
                          : decision && !decision.isCorrect
                          ? 'bg-pink-950/20'
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-code font-bold text-white">{log.id}</span>
                          <span className="text-[11px] text-slate-400">({log.accountId})</span>
                        </div>
                        {decision ? (
                          <span className={`text-[10px] font-game font-bold px-2 py-0.5 rounded-lg ${
                            decision.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-pink-500/20 text-pink-300'
                          }`}>
                            {decision.action}
                          </span>
                        ) : (
                          <span className="text-[10px] font-game text-slate-500">BELUM DIUJI</span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300 mt-1.5 font-ui">
                        <div>Gagal: <strong className={log.failedAttemptCount >= 5 ? 'text-pink-400 font-code' : 'text-white font-code'}>{log.failedAttemptCount}x</strong></div>
                        <div>Perangkat: <strong className={log.deviceType === 'TOR_PROXY' ? 'text-pink-400 font-game' : 'text-cyan-300 font-game'}>{log.deviceType}</strong></div>
                        <div>Durasi: <strong className="text-white font-code">{log.sessionDurationSec}s</strong></div>
                        <div>IP: <strong className="text-slate-400 font-code">{log.ipAddress}</strong></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Relatable Confusion Matrix */}
          {selectedLogTab === 'MATRIX' && (
            <div className="bg-[#15193b] rounded-2xl border border-indigo-500/20 p-4 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-game font-bold text-emerald-300 uppercase">
                  PAPAN SKOR DETEKSI FORENSIK
                </span>
                {evaluationResult && (
                  <span className="text-xs font-game font-bold text-cyan-300">
                    AKURASI: {evaluationResult.accuracy}%
                  </span>
                )}
              </div>

              {evaluationResult ? (
                <>
                  {/* 4 Cards Confusion Matrix */}
                  <div className="grid grid-cols-2 gap-2.5 text-center font-ui text-xs">
                    {/* True Positive */}
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
                      <div className="text-xs font-game font-bold text-emerald-300 flex items-center justify-center gap-1">
                        <span>🎯</span> <span>Deteksi Jitu</span>
                      </div>
                      <div className="text-2xl font-game font-black text-emerald-400 my-1">
                        {evaluationResult.truePositives}
                      </div>
                      <div className="text-[10px] text-slate-400">Penyusup tertangkap (TP)</div>
                    </div>

                    {/* False Positive */}
                    <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-500/40">
                      <div className="text-xs font-game font-bold text-pink-300 flex items-center justify-center gap-1">
                        <span>🤦</span> <span>Salah Tuduh</span>
                      </div>
                      <div className="text-2xl font-game font-black text-pink-400 my-1">
                        {evaluationResult.falsePositives}
                      </div>
                      <div className="text-[10px] text-slate-400">Orang baik dituduh (FP)</div>
                    </div>

                    {/* False Negative */}
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40">
                      <div className="text-xs font-game font-bold text-amber-300 flex items-center justify-center gap-1">
                        <span>🥷</span> <span>Penyusup Lolos</span>
                      </div>
                      <div className="text-2xl font-game font-black text-amber-400 my-1">
                        {evaluationResult.falseNegatives}
                      </div>
                      <div className="text-[10px] text-slate-400">Serangan lolos (FN)</div>
                    </div>

                    {/* True Negative */}
                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
                      <div className="text-xs font-game font-bold text-cyan-300 flex items-center justify-center gap-1">
                        <span>😇</span> <span>Lolos Aman</span>
                      </div>
                      <div className="text-2xl font-game font-black text-cyan-400 my-1">
                        {evaluationResult.trueNegatives}
                      </div>
                      <div className="text-[10px] text-slate-400">Staf normal aman (TN)</div>
                    </div>
                  </div>

                  {/* Feedback Card */}
                  <div className="p-3.5 rounded-xl bg-[#0e1231] border border-indigo-500/30 space-y-1.5 font-ui text-xs">
                    <div className="font-game font-bold text-white flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-amber-400" />
                      {evaluationResult.feedback.title}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {evaluationResult.feedback.description}
                    </p>
                    {evaluationResult.feedback.tips.map((tip, idx) => (
                      <div key={idx} className="text-[11px] text-cyan-300 font-game flex items-center gap-1">
                        <span>💡</span> <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-xs font-ui text-slate-400 space-y-2">
                  <Activity className="w-8 h-8 mx-auto text-cyan-400 animate-bounce" />
                  <p>Tekan tombol <strong>RUN SEMUA</strong> untuk menguji aturanmu dan melihat Matriks Deteksi!</p>
                </div>
              )}
            </div>
          )}

          {/* Terminal Console */}
          <TerminalLog
            logs={logs}
            onClear={() => setLogs([])}
            maxHeight="220px"
            title="LOG SISTEM KERNEL"
          />
        </div>
      </div>

      {/* Hint Modal */}
      <HintModal
        caseId={2}
        isOpen={hintOpen}
        onClose={() => setHintOpen(false)}
      />
    </div>
  );
};
