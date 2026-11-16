import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type {
  OrderData,
  ProgramBlock,
  MachineType,
  SimulationStatus,
  OrderEvaluationResult,
  FactoryItem,
  ExecutionLogEntry,
} from '../engine/types';
import { FactoryInterpreter } from '../engine/interpreter';
import { MACHINES } from '../engine/machines';
import { checkLevel33BugsFixed } from '../levels/level3';
import {
  loadProgress,
  recordOrderCompletion,
  markTutorialSeen,
  isTutorialSeen,
} from '../state/progress';
import { ConveyorBelt } from './ConveyorBelt';
import { BlockBuilder } from './BlockBuilder';
import { ControlsBar } from './ControlsBar';
import { ExecutionLogger } from './ExecutionLogger';
import { DecompositionView } from './DecompositionView';
import { ResultModal } from './ResultModal';
import { HintModal } from './HintModal';
import { TutorialOverlay } from './TutorialOverlay';
import {
  ArrowLeft,
  Target,
  Sparkles,
  Info,
  RotateCcw,
  CheckCircle2,
  Layers,
  Wrench,
  Clock,
  Zap,
} from 'lucide-react';

interface WorkspaceProps {
  order: OrderData;
  onBackToLevelSelect: () => void;
  onSelectNextOrder?: () => void;
  hasNextOrder?: boolean;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  order,
  onBackToLevelSelect,
  onSelectNextOrder,
  hasNextOrder = false,
}) => {
  // Interpreter instance
  const interpreter = useMemo(() => new FactoryInterpreter(order), [order]);

  // Program blocks in editor
  const [program, setProgram] = useState<ProgramBlock[]>(() => {
    // If order has initialProgram (like 3.3 debugging), clone it
    if (order.initialProgram) {
      return JSON.parse(JSON.stringify(order.initialProgram));
    }
    return [];
  });

  // UI state synchronized with interpreter
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('IDLE');
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [inputBelt, setInputBelt] = useState<FactoryItem[]>([]);
  const [activeItem, setActiveItem] = useState<FactoryItem | null>(null);
  const [completedItems, setCompletedItems] = useState<FactoryItem[]>([]);
  const [componentsUsed, setComponentsUsed] = useState<number>(0);
  const [logs, setLogs] = useState<ExecutionLogEntry[]>([]);
  const [activeMachineType, setActiveMachineType] = useState<MachineType | null>(null);

  // Speed (1x = 500ms, 2x = 250ms, 5x = 90ms, 999 = instant)
  const [speed, setSpeed] = useState<number>(2);

  // Phase: 'DECOMPOSITION' (planning screen for Level 1) or 'BUILDING' (workspace screen)
  type WorkspacePhase = 'DECOMPOSITION' | 'BUILDING';
  const [phase, setPhase] = useState<WorkspacePhase>(() =>
    order.levelNumber === 1 ? 'DECOMPOSITION' : 'BUILDING'
  );

  // Level 1 Decomposition validation gate
  const [isDecompositionValid, setIsDecompositionValid] = useState<boolean>(() => {
    return order.levelNumber !== 1;
  });

  // Modals
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<OrderEvaluationResult | null>(null);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  // Running interval ref
  const timerRef = useRef<number | null>(null);

  // Sync state from interpreter
  const syncWithInterpreter = useCallback(() => {
    setSimulationStatus(interpreter.getStatus());
    setActiveBlockId(interpreter.getCurrentBlockId());
    setInputBelt(interpreter.getInputBelt());
    setActiveItem(interpreter.getActiveItem());
    setCompletedItems(interpreter.getCompletedItems());
    setComponentsUsed(interpreter.getMetrics().resourceUsage);
    setLogs([...interpreter.getLogs()]);
  }, [interpreter]);

  // Subscribe to interpreter events
  useEffect(() => {
    const unsubscribe = interpreter.subscribe(() => {
      syncWithInterpreter();
    });
    syncWithInterpreter();
    return () => {
      unsubscribe();
    };
  }, [interpreter, syncWithInterpreter]);

  // Auto-show tutorial on order 1.1, 2.1, 3.1 if not seen yet
  useEffect(() => {
    const progress = loadProgress();
    if (order.orderNumber === 1 && !isTutorialSeen(order.levelNumber, progress)) {
      setShowTutorial(true);
    }
  }, [order.levelNumber, order.orderNumber]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Reset state when order changes
  useEffect(() => {
    setPhase(order.levelNumber === 1 ? 'DECOMPOSITION' : 'BUILDING');
    setIsDecompositionValid(order.levelNumber !== 1);
    setProgram(order.initialProgram ? JSON.parse(JSON.stringify(order.initialProgram)) : []);
    setHintsUsedCount(0);
    setShowResultModal(false);
    setEvaluationResult(null);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [order.id, order.levelNumber, order.initialProgram]);

  // Sync program changes to interpreter
  const handleProgramChange = (newProgram: ProgramBlock[]) => {
    setProgram(newProgram);
    interpreter.loadProgram(newProgram);
  };

  // Execution Step logic
  const handleStep = () => {
    if (!isDecompositionValid) return;
    interpreter.loadProgram(program);
    const hasMore = interpreter.step();
    syncWithInterpreter();

    // Check if machine operation just happened to highlight machine icon
    const currentLogs = interpreter.getLogs();
    const lastLog = currentLogs[currentLogs.length - 1];
    if (lastLog) {
      for (const m of ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'] as MachineType[]) {
        if (lastLog.message.includes(`Mesin ${m}`)) {
          setActiveMachineType(m);
          setTimeout(() => setActiveMachineType(null), 400);
          break;
        }
      }
    }

    if (!hasMore) {
      finishSimulation();
    }
  };

  // Conclude simulation and display results
  const finishSimulation = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const bugsFixed =
      order.id === '3.3' ? checkLevel33BugsFixed(program).fixedCount : undefined;
    const result = interpreter.evaluate(bugsFixed);
    setEvaluationResult(result);
    setShowResultModal(true);

    if (result.isSuccess && result.stars > 0) {
      recordOrderCompletion(order.id, result.stars, result.efficiencyScore, hintsUsedCount);
    }
  }, [interpreter, order.id, hintsUsedCount, program]);

  // Running loop
  const handleRun = () => {
    if (!isDecompositionValid) return;
    interpreter.loadProgram(program);

    if (speed === 999) {
      // Instant execution mode
      const bugsFixed =
        order.id === '3.3' ? checkLevel33BugsFixed(program).fixedCount : undefined;
      const result = interpreter.runToCompletion();
      result.repairedBugsCount = bugsFixed;
      syncWithInterpreter();
      setEvaluationResult(result);
      setShowResultModal(true);
      if (result.isSuccess && result.stars > 0) {
        recordOrderCompletion(order.id, result.stars, result.efficiencyScore, hintsUsedCount);
      }
      return;
    }

    // Step-by-step timed execution
    const intervalMs = speed === 1 ? 550 : speed === 2 ? 260 : 90;

    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      const hasMore = interpreter.step();
      syncWithInterpreter();

      if (!hasMore) {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        finishSimulation();
      }
    }, intervalMs);

    setSimulationStatus('RUNNING');
  };

  // Pause
  const handlePause = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    interpreter.pause();
    syncWithInterpreter();
  };

  // Reset simulation state
  const handleReset = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    interpreter.reset();
    syncWithInterpreter();
    setActiveMachineType(null);
  };

  // Clear or Reset Code
  const handleClear = () => {
    const confirmMsg =
      order.id === '3.3'
        ? 'Kembalikan program ke susunan kode rusak awal untuk memulai ulang perbaikan bug?'
        : 'Hapus semua instruksi dalam area program?';

    if (window.confirm(confirmMsg)) {
      handleReset();
      if (order.initialProgram) {
        const cloned = JSON.parse(JSON.stringify(order.initialProgram));
        setProgram(cloned);
        interpreter.loadProgram(cloned);
      } else {
        setProgram([]);
        interpreter.loadProgram([]);
      }
    }
  };

  if (phase === 'DECOMPOSITION' && order.levelNumber === 1) {
    return (
      <DecompositionView
        order={order}
        onComplete={() => {
          setIsDecompositionValid(true);
          setPhase('BUILDING');
        }}
        onBackToLevelSelect={onBackToLevelSelect}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Back & Order Info */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToLevelSelect}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Kembali ke Pilihan Level"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  PESANAN {order.id}
                </span>
                <h1 className="text-sm md:text-base font-extrabold text-white">
                  {order.name}
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xl">
                {order.description}
              </p>
            </div>
          </div>

          {/* Par Targets & Decomposition Badge */}
          <div className="flex items-center gap-3">
            {order.levelNumber === 1 && (
              <button
                type="button"
                onClick={() => setPhase('DECOMPOSITION')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
                title="Kembali ke layar briefing & dekomposisi mesin"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Dekomposisi</span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">[Ubah]</span>
              </button>
            )}

            <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
              <span className="text-[10px] text-slate-500 font-sans uppercase font-bold hidden sm:inline">
                Target Par:
              </span>
              <div className="flex items-center gap-1 text-slate-300" title="Par Instruksi">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{order.parInstructions} inst</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300" title="Par Resource">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>{order.parResources} res</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300" title="Par Waktu">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{order.parTimeTicks}t</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">
        {/* Order Specifications Banner */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Target Spesifikasi Produk:
            </span>
          </div>

          {/* Target items list / lane specs */}
          <div className="flex flex-wrap items-center gap-2">
            {order.targetLanes ? (
              <div className="flex items-center gap-3 text-[11px]">
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-purple-500/40 text-purple-300">
                  Jalur A: {order.targetLanes.A?.color || 'Merah'} (Cut)
                </span>
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-purple-500/40 text-purple-300">
                  Jalur B: {order.targetLanes.B?.color || 'Biru'} (Cut+Asm)
                </span>
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-purple-500/40 text-purple-300">
                  Jalur C: {order.targetLanes.C?.color || 'Hijau / Sisa'}
                </span>
              </div>
            ) : (
              order.targetSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 flex items-center gap-1.5 font-mono text-[11px]"
                >
                  <span className="font-bold capitalize text-amber-200">{spec.material}</span>
                  {spec.cut && <span className="text-amber-400">[Cut]</span>}
                  {spec.color && <span className="text-cyan-300">[{spec.color}]</span>}
                  {spec.assembled && <span className="text-emerald-400">[Rakit]</span>}
                  {spec.packed && <span className="text-blue-400">[Kemas]</span>}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Factory Floor (Conveyor Belt & Machines) */}
        <ConveyorBelt
          order={order}
          inputBelt={inputBelt}
          activeItem={activeItem}
          completedItems={completedItems}
          activeMachineType={activeMachineType}
          componentsUsed={componentsUsed}
        />

        {/* Controls Bar */}
        <ControlsBar
          status={simulationStatus}
          isDecompositionValid={isDecompositionValid}
          speed={speed}
          onRun={handleRun}
          onPause={handlePause}
          onStep={handleStep}
          onReset={handleReset}
          onClear={handleClear}
          onOpenHint={() => setShowHintModal(true)}
          onOpenTutorial={() => setShowTutorial(true)}
          onChangeSpeed={setSpeed}
          isLevel33={order.id === '3.3'}
        />

        {/* Instruction Builder Canvas & Logger */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Block Builder (8 cols in 12-col grid) */}
          <div className="xl:col-span-8">
            <BlockBuilder
              order={order}
              program={program}
              onChange={handleProgramChange}
              activeBlockId={activeBlockId}
              readOnly={simulationStatus === 'RUNNING'}
            />
          </div>

          {/* Execution Logger (4 cols) */}
          <div className="xl:col-span-4 min-h-[300px]">
            <ExecutionLogger logs={logs} onClearLogs={() => setLogs([])} />
          </div>
        </div>
      </main>

      {/* Result Modal */}
      {showResultModal && evaluationResult && (
        <ResultModal
          order={order}
          result={evaluationResult}
          program={program}
          onRetry={() => {
            setShowResultModal(false);
            handleReset();
          }}
          onNextOrder={() => {
            setShowResultModal(false);
            if (onSelectNextOrder) onSelectNextOrder();
          }}
          onBackToLevelSelect={() => {
            setShowResultModal(false);
            onBackToLevelSelect();
          }}
          hasNextOrder={hasNextOrder}
        />
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <HintModal
          order={order}
          onClose={() => setShowHintModal(false)}
          onHintUsed={(tier) => setHintsUsedCount((prev) => Math.max(prev, tier))}
        />
      )}

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay
          levelNumber={order.levelNumber}
          onClose={() => {
            setShowTutorial(false);
            markTutorialSeen(order.levelNumber);
          }}
        />
      )}
    </div>
  );
};
