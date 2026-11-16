import React, { useState, useEffect, useRef, useCallback } from 'react';
import type {
  CommandBlock,
  GameSettings,
  LevelData,
  ProcedureDef,
} from '../types/game';
import { ProgramInterpreter } from '../core/interpreter';
import type { ExecutionSnapshot } from '../core/interpreter';
import { GridBoard } from './GridBoard';
import { CommandBuilder } from './CommandBuilder';
import { Controls } from './Controls';
import { ExecutionLog } from './ExecutionLog';
import { MissionCompleteModal } from './MissionCompleteModal';
import { HintModal } from './HintModal';
import { SettingsModal } from './SettingsModal';
import { sound } from '../utils/audio';
import { updateLevelCompletion } from '../utils/storage';
import { ArrowLeft, Lightbulb, Settings, Star } from 'lucide-react';

interface GameViewProps {
  level: LevelData;
  settings: GameSettings;
  onBackToLevelSelect: () => void;
  onNextLevel?: () => void;
  onUpdateSettings: (settings: GameSettings) => void;
  onResetAllProgress: () => void;
}

export const GameView: React.FC<GameViewProps> = ({
  level,
  settings,
  onBackToLevelSelect,
  onNextLevel,
  onUpdateSettings,
  onResetAllProgress,
}) => {
  // Programs and Procedures state
  const [program, setProgram] = useState<CommandBlock[]>([]);
  const [procedures, setProcedures] = useState<ProcedureDef[]>([
    { id: 'proc-1', name: 'PROSEDUR_1', blocks: [] },
  ]);

  // Interpreter instance ref
  const interpreterRef = useRef<ProgramInterpreter | null>(null);
  const [snapshot, setSnapshot] = useState<ExecutionSnapshot | null>(null);

  // Interval timer for RUN mode
  const runTimerRef = useRef<number | null>(null);

  // Modals state
  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [finalStars, setFinalStars] = useState<number>(1);

  // Track visited coordinates for neon ghost breadcrumb trail
  const [visitedPath, setVisitedPath] = useState<
    { x: number; y: number; step: number }[]
  >([{ x: level.robotStart.x, y: level.robotStart.y, step: 0 }]);

  // Execution speed map in milliseconds
  const speedDelays: Record<GameSettings['speed'], number> = {
    slow: 650,
    normal: 350,
    fast: 120,
  };

  // Helper to count total blocks
  const countBlocks = (blocks: CommandBlock[]): number => {
    let count = 0;
    for (const b of blocks) {
      count++;
      if (b.children) count += countBlocks(b.children);
      if (b.elseChildren) count += countBlocks(b.elseChildren);
    }
    return count;
  };

  const totalUsedBlocks =
    countBlocks(program) +
    procedures.reduce((acc, p) => acc + countBlocks(p.blocks), 0);

  // Initialize interpreter when level.id changes
  useEffect(() => {
    if (runTimerRef.current) {
      clearInterval(runTimerRef.current);
      runTimerRef.current = null;
    }
    const defaultProcs: ProcedureDef[] = [
      { id: 'proc-1', name: 'PROSEDUR_1', blocks: [] },
    ];
    setProgram([]);
    setProcedures(defaultProcs);
    setVisitedPath([
      { x: level.robotStart.x, y: level.robotStart.y, step: 0 },
    ]);

    const interp = new ProgramInterpreter(level, defaultProcs);
    interpreterRef.current = interp;
    setSnapshot(interp.getSnapshot());
    setShowCompleteModal(false);

    return () => {
      if (runTimerRef.current) {
        clearInterval(runTimerRef.current);
        runTimerRef.current = null;
      }
    };
  }, [level]);

  // Synchronize procedures with interpreter when procedures change
  useEffect(() => {
    if (interpreterRef.current) {
      interpreterRef.current.setProcedures(procedures);
    }
  }, [procedures]);

  // Play appropriate sound based on action
  const handlePlaySoundForAction = (
    prevSnap: ExecutionSnapshot | null,
    nextSnap: ExecutionSnapshot
  ) => {
    if (!prevSnap) return;

    if (nextSnap.status === 'FAILED') {
      sound.playError();
      return;
    }
    if (nextSnap.status === 'SUCCESS') {
      sound.playSuccess();
      return;
    }

    // Check movements
    if (
      prevSnap.robot.x !== nextSnap.robot.x ||
      prevSnap.robot.y !== nextSnap.robot.y
    ) {
      sound.playStep();
    } else if (prevSnap.robot.dir !== nextSnap.robot.dir) {
      sound.playTurn();
    }

    // Check key pickup
    if (
      nextSnap.robot.inventory.keys.length >
      prevSnap.robot.inventory.keys.length
    ) {
      sound.playPickup();
    }

    // Check switch toggle
    const prevSwitches = prevSnap.switches.filter((s) => s.isOn).length;
    const nextSwitches = nextSnap.switches.filter((s) => s.isOn).length;
    if (prevSwitches !== nextSwitches) {
      sound.playSwitch();
    }

    // Check generator activation
    const prevGens = prevSnap.generators.filter((g) => g.isActive).length;
    const nextGens = nextSnap.generators.filter((g) => g.isActive).length;
    if (prevGens !== nextGens) {
      sound.playGenerator();
    }
  };

  // Step execution logic
  const executeSingleStep = useCallback((): boolean => {
    if (!interpreterRef.current) return false;

    const prevSnap = interpreterRef.current.getSnapshot();
    const isContinuing = interpreterRef.current.step();
    const nextSnap = interpreterRef.current.getSnapshot();

    setSnapshot(nextSnap);
    handlePlaySoundForAction(prevSnap, nextSnap);

    // Track movement for breadcrumb trail
    if (
      prevSnap.robot.x !== nextSnap.robot.x ||
      prevSnap.robot.y !== nextSnap.robot.y
    ) {
      setVisitedPath((prev) => {
        const exists = prev.some(
          (p) => p.x === nextSnap.robot.x && p.y === nextSnap.robot.y
        );
        if (!exists) {
          return [
            ...prev,
            { x: nextSnap.robot.x, y: nextSnap.robot.y, step: prev.length },
          ];
        }
        return prev;
      });
    }

    if (nextSnap.status === 'SUCCESS') {
      // Calculate stars
      let stars = 1;
      if (totalUsedBlocks <= level.midEfficiencyBlocks) stars = 2;
      if (totalUsedBlocks <= level.maxEfficiencyBlocks) stars = 3;

      setFinalStars(stars);
      updateLevelCompletion(level.id, stars, totalUsedBlocks);

      // Delay modal opening slightly for animation
      setTimeout(() => {
        setShowCompleteModal(true);
      }, 700);

      return false;
    }

    if (nextSnap.status === 'FAILED') {
      return false;
    }

    return isContinuing;
  }, [level, totalUsedBlocks]);

  // RUN command handler
  const handleRun = () => {
    if (!interpreterRef.current || program.length === 0) return;
    sound.playClick();

    if (runTimerRef.current) clearInterval(runTimerRef.current);

    // If starting from idle or finished state, reload program fresh
    if (
      !snapshot ||
      snapshot.status === 'IDLE' ||
      snapshot.status === 'SUCCESS' ||
      snapshot.status === 'FAILED'
    ) {
      interpreterRef.current.loadProgram(program);
      setVisitedPath([
        { x: level.robotStart.x, y: level.robotStart.y, step: 0 },
      ]);
    }

    const initial = interpreterRef.current.getSnapshot();
    initial.status = 'RUNNING';
    setSnapshot(initial);

    const delay = speedDelays[settings.speed];
    runTimerRef.current = window.setInterval(() => {
      const continues = executeSingleStep();
      if (!continues) {
        if (runTimerRef.current) {
          clearInterval(runTimerRef.current);
          runTimerRef.current = null;
        }
      }
    }, delay);
  };

  // PAUSE command handler
  const handlePause = () => {
    sound.playClick();
    if (runTimerRef.current) {
      clearInterval(runTimerRef.current);
      runTimerRef.current = null;
    }
    if (snapshot) {
      setSnapshot({ ...snapshot, status: 'PAUSED' });
    }
  };

  // RESUME command handler
  const handleResume = () => {
    sound.playClick();
    if (runTimerRef.current) clearInterval(runTimerRef.current);

    if (snapshot) {
      setSnapshot({ ...snapshot, status: 'RUNNING' });
    }

    const delay = speedDelays[settings.speed];
    runTimerRef.current = window.setInterval(() => {
      const continues = executeSingleStep();
      if (!continues) {
        if (runTimerRef.current) {
          clearInterval(runTimerRef.current);
          runTimerRef.current = null;
        }
      }
    }, delay);
  };

  // STEP command handler
  const handleStep = () => {
    sound.playClick();
    if (runTimerRef.current) {
      clearInterval(runTimerRef.current);
      runTimerRef.current = null;
    }

    if (
      !snapshot ||
      snapshot.status === 'IDLE' ||
      snapshot.status === 'SUCCESS' ||
      snapshot.status === 'FAILED'
    ) {
      interpreterRef.current?.loadProgram(program);
      setVisitedPath([
        { x: level.robotStart.x, y: level.robotStart.y, step: 0 },
      ]);
    }

    executeSingleStep();
  };

  // RESET command handler (Preserves code, resets board)
  const handleReset = () => {
    sound.playClick();
    if (runTimerRef.current) {
      clearInterval(runTimerRef.current);
      runTimerRef.current = null;
    }
    if (interpreterRef.current) {
      interpreterRef.current.reset();
      setSnapshot(interpreterRef.current.getSnapshot());
      setVisitedPath([
        { x: level.robotStart.x, y: level.robotStart.y, step: 0 },
      ]);
    }
  };

  // CLEAR command handler (Clears player's program)
  const handleClear = () => {
    sound.playClick();
    handleReset();
    setProgram([]);
    setVisitedPath([
      { x: level.robotStart.x, y: level.robotStart.y, step: 0 },
    ]);
  };

  // Stable ref for latest action handlers to support keyboard shortcuts
  const handlersRef = useRef({
    handleRun,
    handlePause,
    handleResume,
    handleStep,
    handleReset,
    status: snapshot?.status,
    hasBlocks: program.length > 0,
  });

  useEffect(() => {
    handlersRef.current = {
      handleRun,
      handlePause,
      handleResume,
      handleStep,
      handleReset,
      status: snapshot?.status,
      hasBlocks: program.length > 0,
    };
  });

  // Global Keyboard Shortcuts (Space: Run/Pause, S: Step, R: Reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input/textarea or if any modal is active
      if (
        showCompleteModal ||
        showHintModal ||
        showSettingsModal ||
        (e.target as HTMLElement)?.tagName === 'INPUT' ||
        (e.target as HTMLElement)?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        const { status, hasBlocks, handleRun, handlePause, handleResume } =
          handlersRef.current;
        if (status === 'RUNNING') {
          handlePause();
        } else if (status === 'PAUSED') {
          handleResume();
        } else if (hasBlocks && status !== 'SUCCESS') {
          handleRun();
        }
      } else if (e.key === 's' || e.key === 'S') {
        const { status, hasBlocks, handleStep } = handlersRef.current;
        if (hasBlocks && status !== 'RUNNING' && status !== 'SUCCESS') {
          handleStep();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        handlersRef.current.handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCompleteModal, showHintModal, showSettingsModal]);

  if (!snapshot) return null;

  return (
    <div className="min-h-screen flex flex-col p-2 sm:p-4 w-full max-w-7xl mx-auto">
      {/* Level Header Bar */}
      <header className="flex items-center justify-between p-2.5 mb-2.5 rounded-xl glass-panel border border-slate-800/80 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToLevelSelect();
            }}
            className="btn-cyber btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5 text-slate-300"
            title="Kembali ke Pilihan Sektor"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Pilihan Sektor</span>
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>{level.title}</span>
            </h2>
            <div className="text-[11px] text-cyan font-mono">
              {level.subtitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Target 3 Stars pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Star size={13} className="text-yellow-400 fill-yellow-400" />
            <span className="text-slate-400">Target 3⭐:</span>
            <span className="text-white font-bold">≤{level.maxEfficiencyBlocks} Blok</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setShowHintModal(true);
            }}
            className="btn-cyber bg-cyan/10 border border-cyan/40 text-cyan hover:bg-cyan/20 text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Buka Petunjuk Level"
          >
            <Lightbulb size={14} />
            <span>Petunjuk</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowSettingsModal(true);
            }}
            className="p-2 rounded-lg glass-panel text-slate-400 hover:text-white"
            title="Pengaturan"
          >
            <Settings size={15} />
          </button>
        </div>
      </header>

      {/* Main Dual-Column Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 mb-2 items-start">
        {/* Left Column: Grid Board & Controls (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col gap-2.5 w-full">
          <GridBoard
            level={level}
            robot={snapshot.robot}
            doors={snapshot.doors}
            keys={snapshot.keys}
            switches={snapshot.switches}
            generators={snapshot.generators}
            errorReason={snapshot.errorReason}
            status={snapshot.status}
            visitedPath={visitedPath}
          />

          <Controls
            status={snapshot.status}
            hasBlocks={program.length > 0}
            settings={settings}
            onRun={handleRun}
            onPause={handlePause}
            onResume={handleResume}
            onStep={handleStep}
            onReset={handleReset}
            onClear={handleClear}
            onChangeSpeed={(spd) => onUpdateSettings({ ...settings, speed: spd })}
          />
        </div>

        {/* Right Column: Command Builder (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col h-full w-full">
          <CommandBuilder
            level={level}
            program={program}
            procedures={procedures}
            activeBlockId={snapshot.currentBlockId}
            isRunning={snapshot.status === 'RUNNING'}
            onUpdateProgram={(newProg) => setProgram(newProg)}
            onUpdateProcedures={(newProcs) => setProcedures(newProcs)}
          />
        </div>
      </div>

      {/* Bottom Row: Terminal Execution Log */}
      <div className="w-full">
        <ExecutionLog logs={snapshot.logs} />
      </div>

      {/* Modals */}
      {showCompleteModal && (
        <MissionCompleteModal
          level={level}
          stars={finalStars}
          blockCount={totalUsedBlocks}
          onRetry={() => {
            setShowCompleteModal(false);
            handleReset();
          }}
          onNextLevel={
            level.id < 3 && onNextLevel
              ? () => {
                  setShowCompleteModal(false);
                  onNextLevel();
                }
              : undefined
          }
          onSelectLevel={onBackToLevelSelect}
        />
      )}

      {showHintModal && (
        <HintModal level={level} onClose={() => setShowHintModal(false)} />
      )}

      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onResetAllProgress={onResetAllProgress}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
};
