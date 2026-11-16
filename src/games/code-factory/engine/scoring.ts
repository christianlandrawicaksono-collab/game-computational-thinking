// CODE FACTORY — Scoring & Metric Calculations

import type { OrderData, OrderEvaluationResult, ProgramBlock, SimulationMetrics, FactoryItem } from './types';

// Scoring weights and thresholds constants
export const SCORING_CONSTANTS = {
  INSTRUCTION_WEIGHT: 0.45,
  RESOURCE_WEIGHT: 0.30,
  TIME_WEIGHT: 0.25,
  STAR_2_THRESHOLD: 70,
  STAR_3_THRESHOLD: 90,
};

/**
 * Calculate Instruction Count according to rule 3.6:
 * - Each active block = 1
 * - REPEAT = 1 + inner blocks (counted once)
 * - IF = 1 + inner THEN blocks (+ inner ELSE blocks if present)
 * - PROCEDURE: header is FREE (0), only inner blocks counted once
 * - CALL = 1
 * - Disabled blocks (enabled === false) do NOT count
 */
export function calculateInstructionCount(blocks: ProgramBlock[]): number {
  let count = 0;

  for (const block of blocks) {
    if (!block.enabled) continue;

    if (block.type === 'PROCEDURE') {
      // Header is free (0), only its inner blocks count
      if (block.children && block.children.length > 0) {
        count += calculateInstructionCount(block.children);
      }
    } else if (block.type === 'REPEAT') {
      count += 1;
      if (block.children && block.children.length > 0) {
        count += calculateInstructionCount(block.children);
      }
    } else if (block.type === 'IF') {
      count += 1;
      if (block.children && block.children.length > 0) {
        count += calculateInstructionCount(block.children);
      }
      if (block.elseChildren && block.elseChildren.length > 0) {
        // ELSE block header counts as 1 + its children
        count += 1 + calculateInstructionCount(block.elseChildren);
      }
    } else {
      // CUTTING, PAINTING, ASSEMBLY, PACKAGING, SORTING, CALL
      count += 1;
    }
  }

  return count;
}

/**
 * Validate whether a finished item matches the target specification.
 */
export function isItemMatchingSpec(
  item: FactoryItem,
  spec: {
    material: string;
    color?: string;
    cut?: boolean;
    assembled?: boolean;
    packed?: boolean;
    requiredLane?: 'A' | 'B' | 'C';
  }
): boolean {
  if (item.defective) return false;
  if (item.material !== spec.material) return false;

  if (spec.color !== undefined && item.color !== spec.color) return false;
  if (spec.cut !== undefined && item.cut !== spec.cut) return false;
  if (spec.assembled !== undefined && item.assembled !== spec.assembled) return false;
  if (spec.packed !== undefined && item.packed !== spec.packed) return false;

  if (spec.requiredLane !== undefined && item.completedLane !== spec.requiredLane) {
    return false;
  }

  return true;
}

/**
 * Evaluate production simulation outcome and calculate scores and stars.
 */
export function evaluateOrderProduction(
  order: OrderData,
  metrics: SimulationMetrics,
  errorMessage: string | null,
  repairedBugsCount?: number
): OrderEvaluationResult {
  const targetCount = order.initialItems.length;
  const isSuccess =
    errorMessage === null &&
    metrics.productionAccuracy === 100 &&
    metrics.correctCompletedItems === targetCount &&
    metrics.defectiveItemsCount === 0 &&
    metrics.unprocessedItemsCount === 0;

  if (!isSuccess) {
    return {
      isSuccess: false,
      errorMessage: errorMessage || (metrics.defectiveItemsCount > 0 ? 'Terdapat item cacat dalam produksi' : 'Hasil produksi belum memenuhi spesifikasi'),
      metrics,
      scoreInstruction: 0,
      scoreResource: 0,
      scoreTime: 0,
      efficiencyScore: 0,
      stars: 0,
      repairedBugsCount,
    };
  }

  // Calculate sub-scores (capped at 1.0)
  const scoreInstruction = metrics.instructionCount > 0
    ? Math.min(1.0, order.parInstructions / metrics.instructionCount)
    : 1.0;

  const scoreResource = metrics.resourceUsage > 0
    ? Math.min(1.0, order.parResources / metrics.resourceUsage)
    : 1.0;

  const scoreTime = metrics.executionTimeTicks > 0
    ? Math.min(1.0, order.parTimeTicks / metrics.executionTimeTicks)
    : 1.0;

  const rawScore = 100 * (
    SCORING_CONSTANTS.INSTRUCTION_WEIGHT * scoreInstruction +
    SCORING_CONSTANTS.RESOURCE_WEIGHT * scoreResource +
    SCORING_CONSTANTS.TIME_WEIGHT * scoreTime
  );

  const efficiencyScore = Math.round(rawScore * 10) / 10;

  let stars = 1;
  if (efficiencyScore >= SCORING_CONSTANTS.STAR_3_THRESHOLD) {
    stars = 3;
  } else if (efficiencyScore >= SCORING_CONSTANTS.STAR_2_THRESHOLD) {
    stars = 2;
  }

  return {
    isSuccess: true,
    errorMessage: null,
    metrics,
    scoreInstruction,
    scoreResource,
    scoreTime,
    efficiencyScore,
    stars,
    repairedBugsCount,
  };
}
