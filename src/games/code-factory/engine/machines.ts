// CODE FACTORY — Machine Definitions & Operations

import type { FactoryItem, MachineConfig, MachineType, ColorType, SortingLane } from './types';

export const MACHINES: Record<MachineType, MachineConfig> = {
  CUTTING: {
    type: 'CUTTING',
    name: 'Mesin Pemotong (Cutting)',
    targetStage: 1,
    durationTicks: 2,
    description: 'Memotong bahan mentah menjadi dimensi yang sesuai spesifikasi. Menghasilkan cut = true.',
  },
  PAINTING: {
    type: 'PAINTING',
    name: 'Mesin Pengecatan (Painting)',
    targetStage: 2,
    durationTicks: 3,
    description: 'Memberi warna pada item yang sudah dipotong. Mengubah color dan painted.',
  },
  ASSEMBLY: {
    type: 'ASSEMBLY',
    name: 'Mesin Perakitan (Assembly)',
    targetStage: 3,
    durationTicks: 3,
    description: 'Merakit komponen tambahan ke item. Membutuhkan 1 komponen dari gudang.',
  },
  PACKAGING: {
    type: 'PACKAGING',
    name: 'Mesin Pengemasan (Packaging)',
    targetStage: 4,
    durationTicks: 1,
    description: 'Mengemas item jadi dan memindahkannya ke jalur Output.',
  },
  SORTING: {
    type: 'SORTING',
    name: 'Unit Penyortir (Sorting)',
    targetStage: 99, // Dapat dijalankan kapan saja untuk memilah ke jalur A/B/C
    durationTicks: 1,
    description: 'Mengarahkan item ke jalur spesifik (A, B, atau C) sesuai kriteria.',
  },
};

export interface MachineExecutionResult {
  updatedItem: FactoryItem;
  ticksConsumed: number;
  componentsConsumed: number;
  isItemCompleted: boolean;
  completedLane?: SortingLane;
  logMessage: string;
  isDefectiveTriggered: boolean;
}

/**
 * Execute machine operation on an active item according to simulation rules.
 */
export function applyMachineToItem(
  machineType: MachineType,
  item: FactoryItem,
  param?: { color?: ColorType; lane?: 'A' | 'B' | 'C' }
): MachineExecutionResult {
  const config = MACHINES[machineType];
  const updated: FactoryItem = { ...item };
  let ticks = config.durationTicks;
  let components = 0;
  let isCompleted = false;
  let lane: SortingLane | undefined = undefined;
  let log = '';
  let defectiveTriggered = false;

  // Check sequence rule for sequential machines (CUTTING, PAINTING, ASSEMBLY, PACKAGING)
  if (machineType !== 'SORTING') {
    if (updated.stage >= config.targetStage) {
      // Sequence error: item stage already equal or higher than machine stage
      updated.defective = true;
      defectiveTriggered = true;
      updated.defectiveReason = `Urutan salah: ${config.name} (stage ${config.targetStage}) dijalankan pada item stage ${updated.stage}`;
      log = `CACAT! ${updated.defectiveReason}`;
    } else {
      updated.stage = config.targetStage;
    }
  }

  switch (machineType) {
    case 'CUTTING':
      updated.cut = true;
      if (!defectiveTriggered) {
        log = `Item [${updated.material}] dipotong (cut = true) [2 tick]`;
      }
      break;

    case 'PAINTING': {
      const color = param?.color || 'merah';
      updated.color = color;
      updated.painted = color;
      if (!defectiveTriggered) {
        log = `Item dicat warna ${color.toUpperCase()} [3 tick]`;
      }
      break;
    }

    case 'ASSEMBLY':
      updated.assembled = true;
      components = 1;
      if (!defectiveTriggered) {
        log = `Item dirakit dengan 1 komponen tambahan [3 tick]`;
      }
      break;

    case 'PACKAGING':
      updated.packed = true;
      isCompleted = true;
      lane = updated.defective ? 'REJECT' : 'A'; // Defaults to lane A or Output
      updated.completedLane = lane;
      if (!defectiveTriggered) {
        log = updated.defective
          ? `Item cacat dikemas dan dialihkan ke jalur REJECT [1 tick]`
          : `Item selesai dikemas ke jalur Output [1 tick]`;
      }
      break;

    case 'SORTING': {
      const targetLane = param?.lane || 'A';
      isCompleted = true;
      lane = targetLane;
      updated.completedLane = targetLane;
      log = `Item disortir ke jalur ${targetLane} [1 tick]`;
      break;
    }
  }

  return {
    updatedItem: updated,
    ticksConsumed: ticks,
    componentsConsumed: components,
    isItemCompleted: isCompleted,
    completedLane: lane,
    logMessage: log,
    isDefectiveTriggered: defectiveTriggered,
  };
}
