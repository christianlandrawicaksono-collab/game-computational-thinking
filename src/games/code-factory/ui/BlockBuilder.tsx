import React, { useState } from 'react';
import type {
  BlockType,
  ColorType,
  ConditionField,
  OrderData,
  ProgramBlock,
} from '../engine/types';
import {
  Scissors,
  PaintBucket,
  Wrench,
  Box,
  GitFork,
  Repeat,
  HelpCircle,
  Code2,
  PhoneCall,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface BlockBuilderProps {
  order: OrderData;
  program: ProgramBlock[];
  onChange: (newProgram: ProgramBlock[]) => void;
  activeBlockId: string | null;
  readOnly?: boolean;
}

const BLOCK_COLORS: Record<BlockType, { bg: string; border: string; text: string; label: string }> = {
  CUTTING: { bg: 'bg-amber-950/40', border: 'border-amber-600/70', text: 'text-amber-300', label: 'CUTTING' },
  PAINTING: { bg: 'bg-sky-950/40', border: 'border-sky-500/70', text: 'text-sky-300', label: 'PAINTING' },
  ASSEMBLY: { bg: 'bg-emerald-950/40', border: 'border-emerald-600/70', text: 'text-emerald-300', label: 'ASSEMBLY' },
  PACKAGING: { bg: 'bg-blue-950/40', border: 'border-blue-600/70', text: 'text-blue-300', label: 'PACKAGING' },
  SORTING: { bg: 'bg-purple-950/40', border: 'border-purple-600/70', text: 'text-purple-300', label: 'SORTING' },
  REPEAT: { bg: 'bg-indigo-950/40', border: 'border-indigo-500/70', text: 'text-indigo-300', label: 'REPEAT' },
  IF: { bg: 'bg-orange-950/40', border: 'border-orange-500/70', text: 'text-orange-300', label: 'IF' },
  PROCEDURE: { bg: 'bg-teal-950/40', border: 'border-teal-500/70', text: 'text-teal-300', label: 'PROCEDURE' },
  CALL: { bg: 'bg-cyan-950/40', border: 'border-cyan-500/70', text: 'text-cyan-300', label: 'CALL' },
};

const BLOCK_ICONS: Record<BlockType, React.ReactNode> = {
  CUTTING: <Scissors className="w-4 h-4 text-amber-400" />,
  PAINTING: <PaintBucket className="w-4 h-4 text-sky-400" />,
  ASSEMBLY: <Wrench className="w-4 h-4 text-emerald-400" />,
  PACKAGING: <Box className="w-4 h-4 text-blue-400" />,
  SORTING: <GitFork className="w-4 h-4 text-purple-400" />,
  REPEAT: <Repeat className="w-4 h-4 text-indigo-400" />,
  IF: <HelpCircle className="w-4 h-4 text-orange-400" />,
  PROCEDURE: <Code2 className="w-4 h-4 text-teal-400" />,
  CALL: <PhoneCall className="w-4 h-4 text-cyan-400" />,
};

let blockIdSequence = 1000;
const generateId = (type: BlockType) => `block-${type.toLowerCase()}-${Date.now()}-${blockIdSequence++}`;

// Count total blocks in AST
const countTotalBlocks = (blocks: ProgramBlock[]): number => {
  let count = 0;
  for (const b of blocks) {
    count++;
    if (b.children) count += countTotalBlocks(b.children);
    if (b.elseChildren) count += countTotalBlocks(b.elseChildren);
  }
  return count;
};

export const BlockBuilder: React.FC<BlockBuilderProps> = ({
  order,
  program,
  onChange,
  activeBlockId,
  readOnly = false,
}) => {
  const [selectedContainerId, setSelectedContainerId] = useState<string>('root');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalBlocks = countTotalBlocks(program);
  const MAX_BLOCKS = 60;

  // Create default block instance
  const createNewBlock = (type: BlockType): ProgramBlock => {
    switch (type) {
      case 'PAINTING':
        return { id: generateId(type), type, enabled: true, colorParam: 'biru' };
      case 'SORTING':
        return { id: generateId(type), type, enabled: true, laneParam: 'A' };
      case 'REPEAT':
        return { id: generateId(type), type, enabled: true, repeatCount: 3, children: [] };
      case 'IF':
        return {
          id: generateId(type),
          type,
          enabled: true,
          condition: { field: 'warna', operator: '==', value: 'merah' },
          children: [],
        };
      case 'PROCEDURE':
        return { id: generateId(type), type, enabled: true, procedureName: 'P1', children: [] };
      case 'CALL':
        return { id: generateId(type), type, enabled: true, procedureName: 'P1' };
      default:
        return { id: generateId(type), type, enabled: true };
    }
  };

  // Helper to deep insert a block into target container
  const insertBlockIntoTree = (
    tree: ProgramBlock[],
    targetContainerId: string,
    newBlock: ProgramBlock
  ): ProgramBlock[] => {
    if (targetContainerId === 'root') {
      return [...tree, newBlock];
    }

    return tree.map((block) => {
      // Check if target is this block's children
      if (`${block.id}-children` === targetContainerId || block.id === targetContainerId) {
        return {
          ...block,
          children: [...(block.children || []), newBlock],
        };
      }
      // Check if target is this block's elseChildren
      if (`${block.id}-else` === targetContainerId) {
        return {
          ...block,
          elseChildren: [...(block.elseChildren || []), newBlock],
        };
      }

      // Recurse into children
      let updatedBlock = block;
      if (block.children) {
        updatedBlock = {
          ...updatedBlock,
          children: insertBlockIntoTree(block.children, targetContainerId, newBlock),
        };
      }
      if (block.elseChildren) {
        updatedBlock = {
          ...updatedBlock,
          elseChildren: insertBlockIntoTree(block.elseChildren, targetContainerId, newBlock),
        };
      }
      return updatedBlock;
    });
  };

  // Add block to selected container
  const handleAddBlock = (type: BlockType) => {
    if (readOnly) return;
    if (totalBlocks >= MAX_BLOCKS) {
      setErrorMessage(`Batas program maksimal ${MAX_BLOCKS} blok tercapai.`);
      return;
    }

    // Validation: Prevent PROCEDURE inside another PROCEDURE or inside REPEAT/IF
    if (type === 'PROCEDURE' && selectedContainerId !== 'root') {
      setErrorMessage('Definisi PROCEDURE hanya dapat ditempatkan di root program.');
      return;
    }

    setErrorMessage(null);
    const newBlock = createNewBlock(type);
    const updated = insertBlockIntoTree(program, selectedContainerId, newBlock);
    onChange(updated);
  };

  // Deep update a block by id
  const updateBlockInTree = (
    tree: ProgramBlock[],
    id: string,
    updater: (block: ProgramBlock) => ProgramBlock
  ): ProgramBlock[] => {
    return tree.map((block) => {
      if (block.id === id) {
        return updater(block);
      }
      let updated = block;
      if (block.children) {
        updated = {
          ...updated,
          children: updateBlockInTree(block.children, id, updater),
        };
      }
      if (block.elseChildren) {
        updated = {
          ...updated,
          elseChildren: updateBlockInTree(block.elseChildren, id, updater),
        };
      }
      return updated;
    });
  };

  // Deep delete a block by id
  const deleteBlockInTree = (tree: ProgramBlock[], id: string): ProgramBlock[] => {
    return tree
      .filter((block) => block.id !== id)
      .map((block) => {
        let updated = block;
        if (block.children) {
          updated = {
            ...updated,
            children: deleteBlockInTree(block.children, id),
          };
        }
        if (block.elseChildren) {
          updated = {
            ...updated,
            elseChildren: deleteBlockInTree(block.elseChildren, id),
          };
        }
        return updated;
      });
  };

  // Deep move block up or down within its sibling array
  const moveBlockInTree = (
    tree: ProgramBlock[],
    id: string,
    direction: 'up' | 'down'
  ): ProgramBlock[] => {
    const idx = tree.findIndex((b) => b.id === id);
    if (idx !== -1) {
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx >= 0 && targetIdx < tree.length) {
        const copy = [...tree];
        const [removed] = copy.splice(idx, 1);
        copy.splice(targetIdx, 0, removed);
        return copy;
      }
      return tree;
    }

    return tree.map((block) => {
      let updated = block;
      if (block.children) {
        updated = {
          ...updated,
          children: moveBlockInTree(block.children, id, direction),
        };
      }
      if (block.elseChildren) {
        updated = {
          ...updated,
          elseChildren: moveBlockInTree(block.elseChildren, id, direction),
        };
      }
      return updated;
    });
  };

  // Find all defined procedure names
  const getDefinedProcedures = (blocks: ProgramBlock[]): string[] => {
    const names: string[] = [];
    for (const b of blocks) {
      if (b.type === 'PROCEDURE' && b.procedureName) {
        names.push(b.procedureName);
      }
    }
    return names;
  };

  const definedProcs = getDefinedProcedures(program);

  // Render a single block and its children recursively
  const renderBlockNode = (block: ProgramBlock, depth = 0, parentProcedureName?: string) => {
    const style = BLOCK_COLORS[block.type] || BLOCK_COLORS.CUTTING;
    const isCurrentActive = activeBlockId === block.id;
    const isDisabled = !block.enabled;

    // Check invalid recursion or non-existent CALL
    const isRecursiveCall =
      block.type === 'CALL' && parentProcedureName && block.procedureName === parentProcedureName;
    const isUndefinedCall =
      block.type === 'CALL' && block.procedureName && !definedProcs.includes(block.procedureName);

    return (
      <div
        key={block.id}
        className={`relative my-1 rounded-lg border transition-all ${
          isDisabled
            ? 'opacity-60 bg-slate-900/60 border-slate-700/60'
            : `${style.bg} ${style.border}`
        } ${
          isCurrentActive
            ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-[1.01] shadow-lg'
            : ''
        }`}
        style={{ marginLeft: `${depth * 16}px` }}
      >
        {/* Block Header / Main Bar */}
        <div className="flex flex-wrap items-center justify-between p-2 gap-2 text-xs">
          {/* Left: Icon, Type, Parameters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-1 rounded bg-slate-900/80 border border-slate-700">
              {BLOCK_ICONS[block.type]}
            </div>

            <span className={`font-mono font-bold ${style.text}`}>
              {block.type}
            </span>

            {isDisabled && (
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                [NONAKTIF]
              </span>
            )}

            {/* PAINTING Param */}
            {block.type === 'PAINTING' && (
              <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                <span className="text-[10px] text-slate-400">Warna:</span>
                <select
                  disabled={readOnly}
                  value={block.colorParam || 'biru'}
                  onChange={(e) => {
                    const val = e.target.value as ColorType;
                    onChange(updateBlockInTree(program, block.id, (b) => ({ ...b, colorParam: val })));
                  }}
                  className="bg-transparent text-sky-300 font-bold focus:outline-none text-[11px] cursor-pointer"
                >
                  <option value="polos" className="bg-slate-900 text-white">polos</option>
                  <option value="merah" className="bg-slate-900 text-white">merah</option>
                  <option value="biru" className="bg-slate-900 text-white">biru</option>
                  <option value="hijau" className="bg-slate-900 text-white">hijau</option>
                </select>
              </div>
            )}

            {/* SORTING Param */}
            {block.type === 'SORTING' && (
              <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                <span className="text-[10px] text-slate-400">Jalur:</span>
                <select
                  disabled={readOnly}
                  value={block.laneParam || 'A'}
                  onChange={(e) => {
                    const val = e.target.value as 'A' | 'B' | 'C';
                    onChange(updateBlockInTree(program, block.id, (b) => ({ ...b, laneParam: val })));
                  }}
                  className="bg-transparent text-purple-300 font-bold focus:outline-none text-[11px] cursor-pointer"
                >
                  <option value="A" className="bg-slate-900 text-white">Jalur A</option>
                  <option value="B" className="bg-slate-900 text-white">Jalur B</option>
                  <option value="C" className="bg-slate-900 text-white">Jalur C</option>
                </select>
              </div>
            )}

            {/* REPEAT Param */}
            {block.type === 'REPEAT' && (
              <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                <span className="text-[10px] text-slate-400">Ulang:</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  disabled={readOnly}
                  value={block.repeatCount ?? 1}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1));
                    onChange(updateBlockInTree(program, block.id, (b) => ({ ...b, repeatCount: val })));
                  }}
                  className="w-12 bg-transparent text-indigo-300 font-bold text-center focus:outline-none border-b border-indigo-500/50"
                />
                <span className="text-[10px] text-slate-400">kali</span>
              </div>
            )}

            {/* IF Param */}
            {block.type === 'IF' && (
              <div className="flex flex-wrap items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                <select
                  disabled={readOnly}
                  value={block.condition?.field || 'warna'}
                  onChange={(e) => {
                    const field = e.target.value as ConditionField;
                    const defaultVal = field === 'warna' ? 'merah' : 'kayu';
                    onChange(
                      updateBlockInTree(program, block.id, (b) => ({
                        ...b,
                        condition: { field, operator: '==', value: defaultVal },
                      }))
                    );
                  }}
                  className="bg-transparent text-orange-300 font-bold focus:outline-none text-[11px] cursor-pointer"
                >
                  <option value="warna" className="bg-slate-900 text-white">warna</option>
                  <option value="material" className="bg-slate-900 text-white">material</option>
                </select>
                <span className="text-slate-400 font-mono">==</span>
                <select
                  disabled={readOnly}
                  value={block.condition?.value || 'merah'}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    onChange(
                      updateBlockInTree(program, block.id, (b) => ({
                        ...b,
                        condition: {
                          field: b.condition?.field || 'warna',
                          operator: '==',
                          value: val,
                        },
                      }))
                    );
                  }}
                  className="bg-transparent text-orange-200 font-bold focus:outline-none text-[11px] cursor-pointer"
                >
                  {block.condition?.field === 'material' ? (
                    <>
                      <option value="kayu" className="bg-slate-900 text-white">kayu</option>
                      <option value="logam" className="bg-slate-900 text-white">logam</option>
                      <option value="plastik" className="bg-slate-900 text-white">plastik</option>
                    </>
                  ) : (
                    <>
                      <option value="polos" className="bg-slate-900 text-white">polos</option>
                      <option value="merah" className="bg-slate-900 text-white">merah</option>
                      <option value="biru" className="bg-slate-900 text-white">biru</option>
                      <option value="hijau" className="bg-slate-900 text-white">hijau</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* PROCEDURE Param */}
            {block.type === 'PROCEDURE' && (
              <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                <span className="text-[10px] text-slate-400">Nama:</span>
                <select
                  disabled={readOnly}
                  value={block.procedureName || 'P1'}
                  onChange={(e) => {
                    const val = e.target.value as 'P1' | 'P2' | 'P3';
                    onChange(updateBlockInTree(program, block.id, (b) => ({ ...b, procedureName: val })));
                  }}
                  className="bg-transparent text-teal-300 font-bold focus:outline-none text-[11px] cursor-pointer"
                >
                  <option value="P1" className="bg-slate-900 text-white">P1</option>
                  <option value="P2" className="bg-slate-900 text-white">P2</option>
                  <option value="P3" className="bg-slate-900 text-white">P3</option>
                </select>
              </div>
            )}

            {/* CALL Param */}
            {block.type === 'CALL' && (
              <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                <span className="text-[10px] text-slate-400">Panggil:</span>
                <select
                  disabled={readOnly}
                  value={block.procedureName || 'P1'}
                  onChange={(e) => {
                    const val = e.target.value as 'P1' | 'P2' | 'P3';
                    onChange(updateBlockInTree(program, block.id, (b) => ({ ...b, procedureName: val })));
                  }}
                  className="bg-transparent text-cyan-300 font-bold focus:outline-none text-[11px] cursor-pointer"
                >
                  <option value="P1" className="bg-slate-900 text-white">P1</option>
                  <option value="P2" className="bg-slate-900 text-white">P2</option>
                  <option value="P3" className="bg-slate-900 text-white">P3</option>
                </select>
              </div>
            )}

            {/* Warnings for CALL errors */}
            {isRecursiveCall && (
              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Rekursi Ditolak!
              </span>
            )}
            {isUndefinedCall && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Prosedur belum didefinisikan
              </span>
            )}
          </div>

          {/* Right Action Tools: Enable toggle, Move up/down, Delete */}
          {!readOnly && (
            <div className="flex items-center gap-1">
              {/* Active Toggle */}
              <button
                type="button"
                onClick={() =>
                  onChange(updateBlockInTree(program, block.id, (b) => ({ ...b, enabled: !b.enabled })))
                }
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title={block.enabled ? 'Nonaktifkan Blok' : 'Aktifkan Blok'}
              >
                {block.enabled ? (
                  <ToggleRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {/* Move Up */}
              <button
                type="button"
                onClick={() => onChange(moveBlockInTree(program, block.id, 'up'))}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Pindah ke Atas"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>

              {/* Move Down */}
              <button
                type="button"
                onClick={() => onChange(moveBlockInTree(program, block.id, 'down'))}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Pindah ke Bawah"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => onChange(deleteBlockInTree(program, block.id))}
                className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                title="Hapus Blok"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Nested Children for REPEAT, PROCEDURE, and IF (THEN) */}
        {(block.type === 'REPEAT' || block.type === 'PROCEDURE' || block.type === 'IF') && (
          <div className="px-3 pb-2 pt-1 border-t border-slate-800/80 bg-slate-950/40 rounded-b-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {block.type === 'IF' ? 'Cabang THEN (Jika Benar):' : 'Instruksi di Dalamnya:'}
              </span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => setSelectedContainerId(`${block.id}-children`)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                    selectedContainerId === `${block.id}-children`
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Plus className="w-3 h-3" /> Tambah ke Sini
                </button>
              )}
            </div>

            {block.children && block.children.length > 0 ? (
              block.children.map((child) =>
                renderBlockNode(
                  child,
                  depth + 1,
                  block.type === 'PROCEDURE' ? block.procedureName : parentProcedureName
                )
              )
            ) : (
              <div className="py-2 px-3 border border-dashed border-slate-800 rounded text-slate-500 text-[11px] italic text-center">
                Belum ada instruksi di dalam. Pilih "Tambah ke Sini" lalu klik blok dari Palet.
              </div>
            )}
          </div>
        )}

        {/* Optional ELSE Branch for IF */}
        {block.type === 'IF' && (
          <div className="px-3 pb-2 pt-1 border-t border-dashed border-orange-500/30 bg-slate-950/60 rounded-b-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                Cabang ELSE (Jika Tidak Sesuai):
              </span>
              {!readOnly && (
                <div className="flex items-center gap-1.5">
                  {!block.elseChildren ? (
                    <button
                      type="button"
                      onClick={() =>
                        onChange(
                          updateBlockInTree(program, block.id, (b) => ({ ...b, elseChildren: [] }))
                        )
                      }
                      className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40 hover:bg-orange-500/30 transition-colors"
                    >
                      + Aktifkan ELSE
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedContainerId(`${block.id}-else`)}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                          selectedContainerId === `${block.id}-else`
                            ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        <Plus className="w-3 h-3" /> Tambah ke ELSE
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onChange(
                            updateBlockInTree(program, block.id, (b) => ({
                              ...b,
                              elseChildren: undefined,
                            }))
                          )
                        }
                        className="text-[10px] text-slate-500 hover:text-rose-400"
                        title="Hapus Cabang ELSE"
                      >
                        Hapus ELSE
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {block.elseChildren ? (
              block.elseChildren.length > 0 ? (
                block.elseChildren.map((child) =>
                  renderBlockNode(child, depth + 1, parentProcedureName)
                )
              ) : (
                <div className="py-2 px-3 border border-dashed border-slate-800 rounded text-slate-500 text-[11px] italic text-center">
                  Cabang ELSE aktif. Pilih "Tambah ke ELSE" lalu klik blok dari Palet.
                </div>
              )
            ) : (
              <span className="text-[10px] text-slate-500 italic">
                (Tanpa cabang ELSE — item yang tidak cocok langsung lanjut ke blok berikutnya)
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      {/* Palette Panel (Left, 4 cols) */}
      <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" /> Palet Blok
            </span>
            <span className="text-[10px] text-slate-400">Klik / Tap untuk Tambah</span>
          </div>

          <div className="text-[11px] text-slate-400 mb-2">
            Target Posisi:{' '}
            <button
              type="button"
              onClick={() => setSelectedContainerId('root')}
              className={`font-mono px-2 py-0.5 rounded text-[10px] border transition-colors ${
                selectedContainerId === 'root'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Root Utama
            </button>
          </div>

          {/* Block Palette List */}
          <div className="space-y-1.5">
            {order.allowedBlocks.map((type) => {
              const info = BLOCK_COLORS[type];
              return (
                <button
                  key={type}
                  type="button"
                  disabled={readOnly || totalBlocks >= MAX_BLOCKS}
                  onClick={() => handleAddBlock(type)}
                  className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition-all active:scale-[0.98] ${
                    readOnly || totalBlocks >= MAX_BLOCKS
                      ? 'opacity-50 cursor-not-allowed bg-slate-900 border-slate-800'
                      : 'hover:brightness-125 hover:shadow-md cursor-pointer'
                  } ${info.bg} ${info.border}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-slate-950/80 border border-slate-800">
                      {BLOCK_ICONS[type]}
                    </div>
                    <div>
                      <span className={`font-mono text-xs font-bold ${info.text}`}>
                        {type}
                      </span>
                      <div className="text-[9px] text-slate-400">
                        {type === 'REPEAT' && 'Loop berulang 1-20x'}
                        {type === 'IF' && 'Kondisi warna/material'}
                        {type === 'PROCEDURE' && 'Kumpulan blok fungsi'}
                        {type === 'CALL' && 'Panggil prosedur P1-P3'}
                        {type === 'SORTING' && 'Selesaikan ke Jalur A/B/C'}
                        {type === 'PACKAGING' && 'Kemas & selesaikan item'}
                        {type === 'CUTTING' && 'Potong bahan (Tahap 1)'}
                        {type === 'PAINTING' && 'Warnai bahan (Tahap 2)'}
                        {type === 'ASSEMBLY' && 'Rakit komponen (Tahap 3)'}
                      </div>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Palette Footer: Error & Block Counter */}
        <div className="mt-3 pt-2 border-t border-slate-800">
          {errorMessage && (
            <div className="bg-rose-950/30 border border-rose-500/40 text-rose-300 text-[11px] p-2 rounded mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kapasitas Program:</span>
            <span
              className={`font-mono font-bold ${
                totalBlocks > 50 ? 'text-rose-400' : 'text-slate-300'
              }`}
            >
              {totalBlocks} / {MAX_BLOCKS} blok
            </span>
          </div>
        </div>
      </div>

      {/* Program Canvas (Right, 8 cols) */}
      <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Area Program (Instruction Canvas)
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Urutan eksekusi mengalir dari atas ke bawah
            </div>
          </div>

          {/* Program Blocks Container */}
          <div className="space-y-1 overflow-y-auto max-h-[380px] min-h-[220px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {program.length === 0 ? (
              <div className="h-44 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center p-6 text-center text-slate-500">
                <Code2 className="w-8 h-8 mb-2 text-slate-700" />
                <p className="text-xs font-medium text-slate-400">Program masih kosong.</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Klik blok di Palet sebelah kiri untuk menyusun instruksi proses produksi.
                </p>
              </div>
            ) : (
              program.map((block) => renderBlockNode(block, 0))
            )}
          </div>
        </div>

        {/* Canvas Footer Summary */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            {program.length} blok terdaftar di root
          </span>
          <span className="text-slate-500">
            Gunakan tombol panah untuk mengatur urutan blok
          </span>
        </div>
      </div>
    </div>
  );
};
