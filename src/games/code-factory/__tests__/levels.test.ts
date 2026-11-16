import { describe, it, expect } from 'vitest';
import { FactoryInterpreter } from '../engine/interpreter';
import { ALL_ORDERS, ALL_REFERENCES, getOrderById, checkLevel33BugsFixed } from '../levels';
import type { ProgramBlock } from '../engine/types';

describe('Level Reference Solutions Verification (All 9 Orders)', () => {
  ALL_ORDERS.forEach((order) => {
    it(`Order ${order.id}: ${order.name} achieves 100% accuracy, score 100, and 3 stars`, () => {
      const refSolution = ALL_REFERENCES[order.id];
      expect(refSolution).toBeDefined();

      const interpreter = new FactoryInterpreter(order);
      interpreter.loadProgram(refSolution);
      interpreter.runToCompletion();

      expect(interpreter.getStatus()).toBe('HALTED_SUCCESS');
      expect(interpreter.getErrorMessage()).toBeNull();

      const metrics = interpreter.getMetrics();

      // Check simulated metrics against designed pars
      expect(metrics.instructionCount).toBe(order.parInstructions);
      expect(metrics.resourceUsage).toBe(order.parResources);
      expect(metrics.executionTimeTicks).toBe(order.parTimeTicks);
      expect(metrics.productionAccuracy).toBe(100);

      const evaluation = interpreter.evaluateResult();
      expect(evaluation.isSuccess).toBe(true);
      expect(evaluation.efficiencyScore).toBe(100);
      expect(evaluation.stars).toBe(3);
    });
  });
});

describe('Special Level Cases', () => {
  it('Level 3.3 buggy initial program produces a failure', () => {
    const order33 = getOrderById('3.3');
    expect(order33).toBeDefined();
    expect(order33?.initialProgram).toBeDefined();

    const interpreter = new FactoryInterpreter(order33!);
    interpreter.loadProgram(order33!.initialProgram!);
    interpreter.runToCompletion();

    // The buggy program should halt with error (e.g. sequence error or bahan habis due to repeat 8)
    const metrics = interpreter.getMetrics();
    const evalResult = interpreter.evaluateResult();

    expect(evalResult.isSuccess).toBe(false);
    expect(evalResult.stars).toBe(0);

    // Initial bug count should be 0 fixed
    const bugCheck = checkLevel33BugsFixed(order33!.initialProgram!);
    expect(bugCheck.fixedCount).toBe(0);
  });

  it('Level 3.3 reference solution fixes all 5 bugs', () => {
    const ref33 = ALL_REFERENCES['3.3'];
    expect(ref33).toBeDefined();

    const bugCheck = checkLevel33BugsFixed(ref33);
    expect(bugCheck.fixedCount).toBe(5);
    expect(bugCheck.bugDetails.every((b) => b.fixed)).toBe(true);
  });

  it('Level 2.1 alternative solution without loop succeeds but with lower stars', () => {
    const order21 = getOrderById('2.1')!;
    // Without loop: 5 times of CUTTING, PACKAGING (10 blocks instead of 3)
    const unrolledProgram: ProgramBlock[] = [
      { id: '1', type: 'CUTTING', enabled: true },
      { id: '2', type: 'PACKAGING', enabled: true },
      { id: '3', type: 'CUTTING', enabled: true },
      { id: '4', type: 'PACKAGING', enabled: true },
      { id: '5', type: 'CUTTING', enabled: true },
      { id: '6', type: 'PACKAGING', enabled: true },
      { id: '7', type: 'CUTTING', enabled: true },
      { id: '8', type: 'PACKAGING', enabled: true },
      { id: '9', type: 'CUTTING', enabled: true },
      { id: '10', type: 'PACKAGING', enabled: true },
    ];

    const interpreter = new FactoryInterpreter(order21);
    interpreter.loadProgram(unrolledProgram);
    interpreter.runToCompletion();

    expect(interpreter.getStatus()).toBe('HALTED_SUCCESS');
    const evalResult = interpreter.evaluateResult();

    expect(evalResult.isSuccess).toBe(true);
    expect(evalResult.metrics.instructionCount).toBe(10); // 10 > par 3
    expect(evalResult.efficiencyScore).toBeLessThan(90); // Less than 3 stars
    expect(evalResult.stars).toBeLessThanOrEqual(2);
  });
});
