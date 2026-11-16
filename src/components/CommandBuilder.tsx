import React, { useState } from 'react';
import { CONDITION_LABELS } from '../types/game';
import type {
  BlockType,
  CommandBlock,
  ConditionType,
  LevelData,
  ProcedureDef,
} from '../types/game';
import {
  ArrowUp,
  RotateCcw,
  RotateCw,
  Key,
  Power,
  Repeat,
  GitBranch,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  Code2,
  Terminal,
  Copy,
  Check,
  FileCode,
} from 'lucide-react';
import { generatePythonCode } from '../utils/codeGenerator';

interface CommandBuilderProps {
  level: LevelData;
  program: CommandBlock[];
  procedures: ProcedureDef[];
  activeBlockId: string | null;
  isRunning: boolean;
  onUpdateProgram: (newProgram: CommandBlock[]) => void;
  onUpdateProcedures: (newProcedures: ProcedureDef[]) => void;
}

export const CommandBuilder: React.FC<CommandBuilderProps> = ({
  level,
  program,
  procedures,
  activeBlockId,
  isRunning,
  onUpdateProgram,
  onUpdateProcedures,
}) => {
  const [activeTab, setActiveTab] = useState<'MAIN' | 'PROC'>('MAIN');
  const [selectedProcId, setSelectedProcId] = useState<string>(
    procedures[0]?.id || 'proc-1'
  );
  const [viewMode, setViewMode] = useState<'BLOCKS' | 'PYTHON'>('BLOCKS');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    const py = generatePythonCode(program, procedures);
    navigator.clipboard.writeText(py);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const createNewBlock = (type: BlockType): CommandBlock => {
    const id = `blk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    switch (type) {
      case 'LOOP':
        return {
          id,
          type: 'LOOP',
          iterations: 3,
          children: [],
        };
      case 'IF':
        return {
          id,
          type: 'IF',
          condition: 'HAS_KEY',
          children: [],
          elseChildren: [],
        };
      case 'CALL_PROC':
        return {
          id,
          type: 'CALL_PROC',
          procedureId: procedures[0]?.id || 'proc-1',
        };
      default:
        return { id, type };
    }
  };

  const handleAddBlock = (type: BlockType) => {
    if (isRunning) return;
    const newBlock = createNewBlock(type);

    if (activeTab === 'MAIN') {
      onUpdateProgram([...program, newBlock]);
    } else {
      const updated = procedures.map((p) => {
        if (p.id === selectedProcId) {
          return { ...p, blocks: [...p.blocks, newBlock] };
        }
        return p;
      });
      onUpdateProcedures(updated);
    }
  };

  const handleDeleteBlock = (id: string, inProc?: boolean) => {
    if (isRunning) return;
    if (!inProc) {
      const filterRecursive = (blocks: CommandBlock[]): CommandBlock[] => {
        return blocks
          .filter((b) => b.id !== id)
          .map((b) => ({
            ...b,
            children: b.children ? filterRecursive(b.children) : undefined,
            elseChildren: b.elseChildren
              ? filterRecursive(b.elseChildren)
              : undefined,
          }));
      };
      onUpdateProgram(filterRecursive(program));
    } else {
      const updated = procedures.map((p) => {
        if (p.id === selectedProcId) {
          const filterRecursive = (blocks: CommandBlock[]): CommandBlock[] => {
            return blocks
              .filter((b) => b.id !== id)
              .map((b) => ({
                ...b,
                children: b.children ? filterRecursive(b.children) : undefined,
                elseChildren: b.elseChildren
                  ? filterRecursive(b.elseChildren)
                  : undefined,
              }));
          };
          return { ...p, blocks: filterRecursive(p.blocks) };
        }
        return p;
      });
      onUpdateProcedures(updated);
    }
  };

  const handleMoveBlock = (
    index: number,
    direction: 'UP' | 'DOWN',
    inProc?: boolean
  ) => {
    if (isRunning) return;
    const targetList = inProc
      ? [...(procedures.find((p) => p.id === selectedProcId)?.blocks || [])]
      : [...program];

    const newIndex = direction === 'UP' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= targetList.length) return;

    const temp = targetList[index];
    targetList[index] = targetList[newIndex];
    targetList[newIndex] = temp;

    if (inProc) {
      const updated = procedures.map((p) =>
        p.id === selectedProcId ? { ...p, blocks: targetList } : p
      );
      onUpdateProcedures(updated);
    } else {
      onUpdateProgram(targetList);
    }
  };

  const handleAddChild = (
    parentId: string,
    type: BlockType,
    isElse = false,
    inProc = false
  ) => {
    if (isRunning) return;
    const child = createNewBlock(type);

    const appendChild = (blocks: CommandBlock[]): CommandBlock[] => {
      return blocks.map((b) => {
        if (b.id === parentId) {
          if (isElse) {
            return {
              ...b,
              elseChildren: [...(b.elseChildren || []), child],
            };
          }
          return {
            ...b,
            children: [...(b.children || []), child],
          };
        }
        return {
          ...b,
          children: b.children ? appendChild(b.children) : undefined,
          elseChildren: b.elseChildren ? appendChild(b.elseChildren) : undefined,
        };
      });
    };

    if (inProc) {
      const updated = procedures.map((p) =>
        p.id === selectedProcId ? { ...p, blocks: appendChild(p.blocks) } : p
      );
      onUpdateProcedures(updated);
    } else {
      onUpdateProgram(appendChild(program));
    }
  };

  const handleUpdateProps = (
    blockId: string,
    updates: Partial<CommandBlock>,
    inProc = false
  ) => {
    if (isRunning) return;
    const updateRecursive = (blocks: CommandBlock[]): CommandBlock[] => {
      return blocks.map((b) => {
        if (b.id === blockId) {
          return { ...b, ...updates };
        }
        return {
          ...b,
          children: b.children ? updateRecursive(b.children) : undefined,
          elseChildren: b.elseChildren
            ? updateRecursive(b.elseChildren)
            : undefined,
        };
      });
    };

    if (inProc) {
      const updated = procedures.map((p) =>
        p.id === selectedProcId
          ? { ...p, blocks: updateRecursive(p.blocks) }
          : p
      );
      onUpdateProcedures(updated);
    } else {
      onUpdateProgram(updateRecursive(program));
    }
  };

  const renderBlockItem = (
    b: CommandBlock,
    index: number,
    totalInList: number,
    inProc = false
  ) => {
    const isCurrent = activeBlockId === b.id;

    if (b.type === 'LOOP') {
      return (
        <div
          key={b.id}
          className={`relative p-3 rounded-xl border transition-all duration-200 mb-2.5 ${
            isCurrent
              ? 'border-purple bg-purple/20 shadow-lg shadow-purple/50'
              : 'border-purple/35 bg-purple/5 hover:border-purple/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-bold text-xs text-purple-300 px-2 py-0.5 rounded bg-purple/20 border border-purple/40">
                <Repeat size={14} /> ULANGI
              </span>
              <select
                disabled={isRunning}
                value={b.iterations || 3}
                onChange={(e) =>
                  handleUpdateProps(
                    b.id,
                    { iterations: parseInt(e.target.value) },
                    inProc
                  )
                }
                className="bg-slate-900 border border-purple/50 rounded px-2 py-0.5 text-xs text-purple-300 font-mono cursor-pointer"
              >
                {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} KALI
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={isRunning || index === 0}
                onClick={() => handleMoveBlock(index, 'UP', inProc)}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                title="Pindah ke Atas"
              >
                <ChevronUp size={14} />
              </button>
              <button
                disabled={isRunning || index === totalInList - 1}
                onClick={() => handleMoveBlock(index, 'DOWN', inProc)}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                title="Pindah ke Bawah"
              >
                <ChevronDown size={14} />
              </button>
              <button
                disabled={isRunning}
                onClick={() => handleDeleteBlock(b.id, inProc)}
                className="p-1 text-slate-400 hover:text-red-400 disabled:opacity-20 ml-1"
                title="Hapus"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Loop Inner Body */}
          <div className="pl-3 border-l-2 border-purple/40 ml-1.5 space-y-1.5 my-2.5 min-h-[36px]">
            {b.children && b.children.length > 0 ? (
              b.children.map((child, cIdx) =>
                renderBlockItem(child, cIdx, b.children!.length, inProc)
              )
            ) : (
              <div className="text-[11px] text-slate-500 italic py-2">
                (Isi loop masih kosong)
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-purple/20">
            <span className="text-[10px] text-slate-400 font-mono">Masuk ke loop:</span>
            {level.allowedBlocks
              .filter((bt) => bt !== 'LOOP' && bt !== 'IF')
              .map((bt) => (
                <button
                  key={bt}
                  disabled={isRunning}
                  onClick={() => handleAddChild(b.id, bt, false, inProc)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 disabled:opacity-30"
                >
                  + {getBlockLabel(bt)}
                </button>
              ))}
          </div>
        </div>
      );
    }

    if (b.type === 'IF') {
      return (
        <div
          key={b.id}
          className={`p-3 rounded-xl border transition-all duration-200 mb-2.5 ${
            isCurrent
              ? 'border-blue bg-blue/20 shadow-lg shadow-blue/50'
              : 'border-blue/35 bg-blue/5 hover:border-blue/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 font-bold text-xs text-blue px-2 py-0.5 rounded bg-blue/20 border border-blue/40">
                <GitBranch size={14} /> JIKA
              </span>
              <select
                disabled={isRunning}
                value={b.condition || 'HAS_KEY'}
                onChange={(e) =>
                  handleUpdateProps(
                    b.id,
                    { condition: e.target.value as ConditionType },
                    inProc
                  )
                }
                className="bg-slate-900 border border-blue/50 rounded px-2 py-0.5 text-xs text-blue-300 font-mono cursor-pointer"
              >
                {Object.entries(CONDITION_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={isRunning || index === 0}
                onClick={() => handleMoveBlock(index, 'UP', inProc)}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
              >
                <ChevronUp size={14} />
              </button>
              <button
                disabled={isRunning || index === totalInList - 1}
                onClick={() => handleMoveBlock(index, 'DOWN', inProc)}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
              >
                <ChevronDown size={14} />
              </button>
              <button
                disabled={isRunning}
                onClick={() => handleDeleteBlock(b.id, inProc)}
                className="p-1 text-slate-400 hover:text-red-400 disabled:opacity-20 ml-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* THEN Branch */}
          <div className="pl-3 border-l-2 border-blue/50 ml-1.5 space-y-1.5 my-2">
            <div className="text-[10px] text-blue-400 font-bold font-mono">
              MAKA:
            </div>
            {b.children && b.children.length > 0 ? (
              b.children.map((child, cIdx) =>
                renderBlockItem(child, cIdx, b.children!.length, inProc)
              )
            ) : (
              <div className="text-[11px] text-slate-500 italic py-1">
                (Kosong)
              </div>
            )}
            <div className="flex items-center gap-1 flex-wrap pt-1">
              {level.allowedBlocks
                .filter((bt) => bt !== 'LOOP' && bt !== 'IF')
                .map((bt) => (
                  <button
                    key={bt}
                    disabled={isRunning}
                    onClick={() => handleAddChild(b.id, bt, false, inProc)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    + {getBlockLabel(bt)}
                  </button>
                ))}
            </div>
          </div>

          {/* ELSE Branch */}
          <div className="pl-3 border-l-2 border-slate-700 ml-1.5 space-y-1.5 mt-2.5 pt-2 border-t border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold font-mono">
              LAINNYA (ELSE):
            </div>
            {b.elseChildren && b.elseChildren.length > 0 ? (
              b.elseChildren.map((child, cIdx) =>
                renderBlockItem(child, cIdx, b.elseChildren!.length, inProc)
              )
            ) : (
              <div className="text-[11px] text-slate-500 italic py-1">
                (Kosong)
              </div>
            )}
            <div className="flex items-center gap-1 flex-wrap pt-1">
              {level.allowedBlocks
                .filter((bt) => bt !== 'LOOP' && bt !== 'IF')
                .map((bt) => (
                  <button
                    key={bt}
                    disabled={isRunning}
                    onClick={() => handleAddChild(b.id, bt, true, inProc)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    + {getBlockLabel(bt)}
                  </button>
                ))}
            </div>
          </div>
        </div>
      );
    }

    // Normal Atomic Block
    return (
      <div
        key={b.id}
        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-150 mb-1.5 ${
          isCurrent
            ? 'border-cyan bg-cyan/20 shadow-md shadow-cyan/30 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {getBlockIcon(b.type)}
          <span className="font-mono text-xs font-semibold text-slate-200">
            {getBlockLabel(b.type)}
          </span>
          {b.type === 'CALL_PROC' && (
            <select
              disabled={isRunning}
              value={b.procedureId || procedures[0]?.id}
              onChange={(e) =>
                handleUpdateProps(b.id, { procedureId: e.target.value }, inProc)
              }
              className="bg-slate-950 border border-purple/40 rounded px-2 py-0.5 text-[11px] text-purple-300 font-mono ml-1"
            >
              {procedures.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={isRunning || index === 0}
            onClick={() => handleMoveBlock(index, 'UP', inProc)}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
            title="Pindah ke Atas"
          >
            <ChevronUp size={14} />
          </button>
          <button
            disabled={isRunning || index === totalInList - 1}
            onClick={() => handleMoveBlock(index, 'DOWN', inProc)}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
            title="Pindah ke Bawah"
          >
            <ChevronDown size={14} />
          </button>
          <button
            disabled={isRunning}
            onClick={() => handleDeleteBlock(b.id, inProc)}
            className="p-1 text-slate-400 hover:text-red-400 disabled:opacity-20 ml-1"
            title="Hapus"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  const getBlockLabel = (type: BlockType): string => {
    switch (type) {
      case 'MOVE_FORWARD':
        return 'MAJU';
      case 'TURN_LEFT':
        return 'BELOK KIRI';
      case 'TURN_RIGHT':
        return 'BELOK KANAN';
      case 'PICK_KEY':
        return 'AMBIL KUNCI';
      case 'ACTIVATE_SWITCH':
        return 'AKTIFKAN SAKELAR';
      case 'LOOP':
        return 'ULANGI N KALI';
      case 'IF':
        return 'JIKA / JIKA TIDAK';
      case 'CALL_PROC':
        return 'PANGGIL PROSEDUR';
      default:
        return type;
    }
  };

  const getBlockIcon = (type: BlockType) => {
    switch (type) {
      case 'MOVE_FORWARD':
        return <ArrowUp size={15} className="text-cyan" />;
      case 'TURN_LEFT':
        return <RotateCcw size={15} className="text-blue-400" />;
      case 'TURN_RIGHT':
        return <RotateCw size={15} className="text-blue-400" />;
      case 'PICK_KEY':
        return <Key size={15} className="text-yellow-400" />;
      case 'ACTIVATE_SWITCH':
        return <Power size={15} className="text-emerald-400" />;
      case 'LOOP':
        return <Repeat size={15} className="text-purple-400" />;
      case 'IF':
        return <GitBranch size={15} className="text-blue-400" />;
      case 'CALL_PROC':
        return <Code2 size={15} className="text-purple-400" />;
      default:
        return <Layers size={15} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full glass-panel p-3.5 border border-slate-800/80 bg-slate-950/70">
      {/* Editor Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-cyan" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
            EDITOR PROGRAM
          </h3>
          {/* Mode Switcher: BLOK vs PYTHON */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 ml-1">
            <button
              onClick={() => setViewMode('BLOCKS')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                viewMode === 'BLOCKS'
                  ? 'bg-cyan text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BLOK
            </button>
            <button
              onClick={() => setViewMode('PYTHON')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                viewMode === 'PYTHON'
                  ? 'bg-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Lihat sintaks kode Python resmi"
            >
              <FileCode size={11} />
              <span>PYTHON</span>
            </button>
          </div>
        </div>

        {/* Efficiency Counter */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Penggunaan:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              totalUsedBlocks <= level.maxEfficiencyBlocks
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                : totalUsedBlocks <= level.midEfficiencyBlocks
                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                : 'text-slate-300 bg-slate-800 border border-slate-700'
            }`}
          >
            {totalUsedBlocks} / ≤{level.maxEfficiencyBlocks} BLOK
          </span>
        </div>
      </div>

      {/* Procedure Tab (Level 3) */}
      {level.allowProcedures && (
        <div className="flex items-center gap-1 mb-3 p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('MAIN')}
            className={`flex-1 py-1 rounded text-xs font-mono font-bold transition-all ${
              activeTab === 'MAIN'
                ? 'bg-cyan/20 text-cyan border border-cyan/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PROGRAM UTAMA ({program.length})
          </button>
          <button
            onClick={() => setActiveTab('PROC')}
            className={`flex-1 py-1 rounded text-xs font-mono font-bold transition-all ${
              activeTab === 'PROC'
                ? 'bg-purple/20 text-purple-300 border border-purple/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PROSEDUR ({procedures.length})
          </button>
        </div>
      )}

      {/* Palette Toolbar */}
      <div className="mb-3">
        <div className="text-[10px] uppercase font-mono font-bold text-slate-400 mb-1.5">
          PALET PERINTAH
        </div>
        <div className="flex flex-wrap gap-1.5">
          {level.allowedBlocks.map((type) => (
            <button
              key={type}
              disabled={isRunning}
              onClick={() => handleAddBlock(type)}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan/70 hover:bg-slate-800/80 text-slate-200 transition-all shadow-sm active:scale-95 disabled:opacity-30"
            >
              {getBlockIcon(type)}
              <span>{getBlockLabel(type)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sequence List Area OR Python Code Viewer */}
      {viewMode === 'PYTHON' ? (
        <div className="flex-1 flex flex-col min-h-[260px] max-h-[380px] lg:max-h-[440px] border border-slate-800 rounded-xl overflow-hidden bg-slate-950/95 font-mono text-xs">
          {/* Python Header */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px]">
            <span className="text-purple-300 font-bold flex items-center gap-1.5">
              <FileCode size={13} className="text-purple-400" />
              <span>nexus_controller.py</span>
            </span>
            <button
              onClick={handleCopyCode}
              className="btn-cyber btn-ghost text-[10px] py-1 px-2.5 flex items-center gap-1.5"
              title="Salin skrip Python ke clipboard"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Salin Kode</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div className="flex-1 p-3 overflow-y-auto leading-relaxed select-text font-mono text-xs space-y-0.5">
            {generatePythonCode(program, procedures)
              .split('\n')
              .map((line, idx) => {
                const trimmed = line.trim();
                const isComment = trimmed.startsWith('#');
                const isDef = trimmed.startsWith('def ') || trimmed.startsWith('from ');
                const isControl =
                  trimmed.startsWith('for ') ||
                  trimmed.startsWith('if ') ||
                  trimmed.startsWith('else:');
                return (
                  <div key={idx} className="flex">
                    <span className="w-7 select-none text-slate-600 text-right pr-2.5 shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span
                      className={
                        isComment
                          ? 'text-slate-500 italic'
                          : isDef
                          ? 'text-purple-400 font-bold'
                          : isControl
                          ? 'text-cyan font-bold'
                          : trimmed.includes('robot.')
                          ? 'text-slate-200'
                          : 'text-slate-400'
                      }
                    >
                      {line}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 min-h-[220px] max-h-[380px] lg:max-h-[440px] border border-slate-800/80 rounded-xl p-2.5 bg-slate-950/80">
          {activeTab === 'MAIN' ? (
            program.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Terminal size={28} className="mb-2 text-slate-600 opacity-60" />
                <p className="text-xs font-mono text-slate-300 font-semibold">
                  Program Belum Disusun
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
                  Pilih blok perintah di atas untuk menggerakkan UNIT-07.
                </p>
              </div>
            ) : (
              program.map((b, idx) =>
                renderBlockItem(b, idx, program.length, false)
              )
            )
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
                <span className="text-xs text-purple-300 font-mono font-bold">
                  PROSEDUR: {procedures.find((p) => p.id === selectedProcId)?.name}
                </span>
                <select
                  value={selectedProcId}
                  onChange={(e) => setSelectedProcId(e.target.value)}
                  className="bg-slate-900 border border-purple/40 text-purple-300 text-xs rounded px-2 py-0.5 font-mono"
                >
                  {procedures.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {procedures.find((p) => p.id === selectedProcId)?.blocks.length ===
              0 ? (
                <div className="py-8 text-center text-slate-500 text-xs font-mono">
                  Prosedur masih kosong. Pilih blok di atas untuk mengisi.
                </div>
              ) : (
                procedures
                  .find((p) => p.id === selectedProcId)
                  ?.blocks.map((b, idx, arr) =>
                    renderBlockItem(b, idx, arr.length, true)
                  )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
