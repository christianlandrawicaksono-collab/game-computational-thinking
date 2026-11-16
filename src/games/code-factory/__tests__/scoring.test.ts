import { describe, it, expect } from 'vitest';
import { calculateInstructionCount, evaluateOrderProduction, SCORING_CONSTANTS } from '../engine/scoring';
import type { OrderData, ProgramBlock, SimulationMetrics } from '../engine/types';

describe('Instruction Count Calculation (Rule 3.6)', () => {
  it('counts single blocks as 1', () => {
    const blocks: ProgramBlock[] = [
      { id: '1', type: 'CUTTING', enabled: true },
      { id: '2', type: 'PACKAGING', enabled: true },
    ];
    expect(calculateInstructionCount(blocks)).toBe(2);
  });

  it('counts REPEAT as 1 + inner children counted once', () => {
    const blocks: ProgramBlock[] = [
      {
        id: 'rep',
        type: 'REPEAT',
        repeatCount: 5,
        enabled: true,
        children: [
          { id: '1', type: 'CUTTING', enabled: true },
          { id: '2', type: 'PACKAGING', enabled: true },
        ],
      },
    ];
    // 1 (repeat) + 2 (inner) = 3
    expect(calculateInstructionCount(blocks)).toBe(3);
  });

  it('counts IF as 1 + then blocks + else header (1) + else blocks', () => {
    const blocks: ProgramBlock[] = [
      {
        id: 'if1',
        type: 'IF',
        enabled: true,
        children: [{ id: '1', type: 'SORTING', enabled: true }],
        elseChildren: [{ id: '2', type: 'SORTING', enabled: true }],
      },
    ];
    // 1 (if) + 1 (then) + 1 (else header) + 1 (else child) = 4
    expect(calculateInstructionCount(blocks)).toBe(4);
  });

  it('counts PROCEDURE header as free (0), only counting inner children', () => {
    const blocks: ProgramBlock[] = [
      {
        id: 'proc',
        type: 'PROCEDURE',
        procedureName: 'P1',
        enabled: true,
        children: [
          { id: '1', type: 'CUTTING', enabled: true },
          { id: '2', type: 'PAINTING', enabled: true },
        ],
      },
      { id: 'call', type: 'CALL', procedureName: 'P1', enabled: true },
    ];
    // PROCEDURE: 0 + 2 (inner) = 2. CALL: 1. Total = 3.
    expect(calculateInstructionCount(blocks)).toBe(3);
  });

  it('ignores disabled blocks completely', () => {
    const blocks: ProgramBlock[] = [
      { id: '1', type: 'CUTTING', enabled: true },
      { id: '2', type: 'PAINTING', enabled: false }, // Disabled!
      { id: '3', type: 'PACKAGING', enabled: true },
    ];
    expect(calculateInstructionCount(blocks)).toBe(2);
  });
});

describe('Scoring Formula & Star Thresholds', () => {
  const dummyOrder: OrderData = {
    id: '1.1',
    levelNumber: 1,
    orderNumber: 1,
    name: 'Papan Kayu Kemas',
    description: 'Test',
    initialItems: [{ material: 'kayu', color: 'polos' }],
    targetSpecs: [{ material: 'kayu', cut: true, packed: true }],
    allowedMachines: ['CUTTING', 'PACKAGING'],
    allowedBlocks: ['CUTTING', 'PACKAGING'],
    parInstructions: 2,
    parResources: 3,
    parTimeTicks: 3,
    hints: ['1', '2', '3'],
    ctConceptExplanation: 'Test',
  };

  it('gives 0 stars and failed status if accuracy < 100%', () => {
    const metrics: SimulationMetrics = {
      instructionCount: 2,
      resourceUsage: 3,
      executionTimeTicks: 3,
      productionAccuracy: 50, // Failed
      totalCompletedItems: 1,
      correctCompletedItems: 0,
      defectiveItemsCount: 1,
      unprocessedItemsCount: 0,
    };

    const res = evaluateOrderProduction(dummyOrder, metrics, null);
    expect(res.isSuccess).toBe(false);
    expect(res.stars).toBe(0);
    expect(res.efficiencyScore).toBe(0);
  });

  it('gives 3 stars and 100 efficiency score when matching par exactly', () => {
    const metrics: SimulationMetrics = {
      instructionCount: 2,
      resourceUsage: 3,
      executionTimeTicks: 3,
      productionAccuracy: 100,
      totalCompletedItems: 1,
      correctCompletedItems: 1,
      defectiveItemsCount: 0,
      unprocessedItemsCount: 0,
    };

    const res = evaluateOrderProduction(dummyOrder, metrics, null);
    expect(res.isSuccess).toBe(true);
    expect(res.efficiencyScore).toBe(100);
    expect(res.stars).toBe(3);
  });

  it('gives 2 stars when efficiency score is between 70 and 89', () => {
    // With higher instruction count, score drops
    const metrics: SimulationMetrics = {
      instructionCount: 4, // 2 / 4 = 0.5 -> 0.45 * 0.5 = 0.225
      resourceUsage: 3,    // 3 / 3 = 1.0 -> 0.30 * 1.0 = 0.300
      executionTimeTicks: 3, // 3 / 3 = 1.0 -> 0.25 * 1.0 = 0.250
      // Total = 0.225 + 0.300 + 0.250 = 0.775 -> score 77.5 -> 2 stars!
      productionAccuracy: 100,
      totalCompletedItems: 1,
      correctCompletedItems: 1,
      defectiveItemsCount: 0,
      unprocessedItemsCount: 0,
    };

    const res = evaluateOrderProduction(dummyOrder, metrics, null);
    expect(res.isSuccess).toBe(true);
    expect(res.efficiencyScore).toBe(77.5);
    expect(res.stars).toBe(2);
  });

  it('gives 1 star when efficiency score is below 70', () => {
    const metrics: SimulationMetrics = {
      instructionCount: 8,
      resourceUsage: 9,
      executionTimeTicks: 9,
      productionAccuracy: 100,
      totalCompletedItems: 1,
      correctCompletedItems: 1,
      defectiveItemsCount: 0,
      unprocessedItemsCount: 0,
    };

    const res = evaluateOrderProduction(dummyOrder, metrics, null);
    expect(res.isSuccess).toBe(true);
    expect(res.efficiencyScore).toBeLessThan(SCORING_CONSTANTS.STAR_2_THRESHOLD);
    expect(res.stars).toBe(1);
  });
});
