import { describe, it, expect } from 'vitest';
import { FactoryInterpreter } from '../engine/interpreter';
import { applyMachineToItem } from '../engine/machines';
import type { FactoryItem, OrderData, ProgramBlock } from '../engine/types';

describe('Factory Machines & Sequence Rules', () => {
  it('applies CUTTING correctly to raw item', () => {
    const raw: FactoryItem = {
      id: 'item-1',
      material: 'kayu',
      color: 'polos',
      stage: 0,
      cut: false,
      painted: null,
      assembled: false,
      packed: false,
      defective: false,
    };

    const res = applyMachineToItem('CUTTING', raw);
    expect(res.updatedItem.cut).toBe(true);
    expect(res.updatedItem.stage).toBe(1);
    expect(res.ticksConsumed).toBe(2);
    expect(res.isDefectiveTriggered).toBe(false);
  });

  it('marks item defective if sequence order is invalid (e.g. CUTTING after PAINTING)', () => {
    const paintedItem: FactoryItem = {
      id: 'item-1',
      material: 'kayu',
      color: 'merah',
      stage: 2, // Already stage 2
      cut: true,
      painted: 'merah',
      assembled: false,
      packed: false,
      defective: false,
    };

    // Attempting CUTTING (stage 1) when item is at stage 2
    const res = applyMachineToItem('CUTTING', paintedItem);
    expect(res.updatedItem.defective).toBe(true);
    expect(res.isDefectiveTriggered).toBe(true);
    expect(res.updatedItem.defectiveReason).toContain('Urutan salah');
  });

  it('consumes component during ASSEMBLY', () => {
    const cutItem: FactoryItem = {
      id: 'item-1',
      material: 'logam',
      color: 'polos',
      stage: 1,
      cut: true,
      painted: null,
      assembled: false,
      packed: false,
      defective: false,
    };

    const res = applyMachineToItem('ASSEMBLY', cutItem);
    expect(res.updatedItem.assembled).toBe(true);
    expect(res.componentsConsumed).toBe(1);
    expect(res.ticksConsumed).toBe(3);
  });
});

describe('Interpreter Control Flow & Safety Guards', () => {
  const dummyOrder: OrderData = {
    id: 'test-1',
    levelNumber: 1,
    orderNumber: 1,
    name: 'Test Order',
    description: 'Test',
    initialItems: [
      { material: 'kayu', color: 'polos' },
      { material: 'kayu', color: 'polos' },
    ],
    targetSpecs: [{ material: 'kayu', cut: true, packed: true }],
    allowedMachines: ['CUTTING', 'PACKAGING'],
    allowedBlocks: ['CUTTING', 'PACKAGING', 'REPEAT', 'IF', 'PROCEDURE', 'CALL'],
    parInstructions: 2,
    parResources: 3,
    parTimeTicks: 3,
    hints: ['1', '2', '3'],
    ctConceptExplanation: 'Test',
  };

  it('REPEAT runs exactly N times and processes items sequentially', () => {
    const interpreter = new FactoryInterpreter(dummyOrder);
    const prog: ProgramBlock[] = [
      {
        id: 'rep',
        type: 'REPEAT',
        repeatCount: 2,
        enabled: true,
        children: [
          { id: 'b1', type: 'CUTTING', enabled: true },
          { id: 'b2', type: 'PACKAGING', enabled: true },
        ],
      },
    ];

    interpreter.loadProgram(prog);
    interpreter.runToCompletion();

    expect(interpreter.getStatus()).toBe('HALTED_SUCCESS');
    expect(interpreter.getCompletedItems().length).toBe(2);
    expect(interpreter.getInputBelt().length).toBe(0);
    expect(interpreter.getCompletedItems().every((i) => i.cut && i.packed)).toBe(true);
  });

  it('triggers "Bahan habis" runtime error if REPEAT count exceeds available items', () => {
    const interpreter = new FactoryInterpreter(dummyOrder); // only 2 items available
    const prog: ProgramBlock[] = [
      {
        id: 'rep',
        type: 'REPEAT',
        repeatCount: 3, // 3 > 2!
        enabled: true,
        children: [
          { id: 'b1', type: 'CUTTING', enabled: true },
          { id: 'b2', type: 'PACKAGING', enabled: true },
        ],
      },
    ];

    interpreter.loadProgram(prog);
    interpreter.runToCompletion();

    expect(interpreter.getStatus()).toBe('HALTED_ERROR');
    expect(interpreter.getErrorMessage()).toBe('Bahan habis');
  });

  it('leaves items on belt if REPEAT count is insufficient', () => {
    const interpreter = new FactoryInterpreter(dummyOrder); // 2 items
    const prog: ProgramBlock[] = [
      {
        id: 'rep',
        type: 'REPEAT',
        repeatCount: 1, // Only processes 1 item
        enabled: true,
        children: [
          { id: 'b1', type: 'CUTTING', enabled: true },
          { id: 'b2', type: 'PACKAGING', enabled: true },
        ],
      },
    ];

    interpreter.loadProgram(prog);
    interpreter.runToCompletion();

    expect(interpreter.getStatus()).toBe('HALTED_SUCCESS');
    expect(interpreter.getCompletedItems().length).toBe(1);
    expect(interpreter.getInputBelt().length).toBe(1); // 1 unprocessed item remaining
    const metrics = interpreter.getMetrics();
    expect(metrics.unprocessedItemsCount).toBe(1);
    expect(metrics.productionAccuracy).toBe(50); // 1 out of 2 = 50%
  });

  it('skips disabled blocks cleanly', () => {
    const interpreter = new FactoryInterpreter(dummyOrder);
    const prog: ProgramBlock[] = [
      { id: 'b1', type: 'CUTTING', enabled: false }, // Disabled!
      { id: 'b2', type: 'PACKAGING', enabled: true },
    ];

    interpreter.loadProgram(prog);
    interpreter.step(); // skips CUTTING
    interpreter.step(); // executes PACKAGING
    interpreter.step(); // ends

    const completed = interpreter.getCompletedItems();
    expect(completed.length).toBe(1);
    expect(completed[0].cut).toBe(false); // CUTTING was skipped
    expect(completed[0].packed).toBe(true);
  });

  it('handles IF and ELSE conditional branches correctly', () => {
    const colorOrder: OrderData = {
      ...dummyOrder,
      initialItems: [
        { material: 'kayu', color: 'merah' },
        { material: 'kayu', color: 'biru' },
      ],
      targetLanes: {
        A: { material: 'kayu', color: 'merah' },
        B: { material: 'kayu', color: 'biru' },
      },
    };

    const interpreter = new FactoryInterpreter(colorOrder);
    const prog: ProgramBlock[] = [
      {
        id: 'rep',
        type: 'REPEAT',
        repeatCount: 2,
        enabled: true,
        children: [
          {
            id: 'if1',
            type: 'IF',
            condition: { field: 'warna', operator: '==', value: 'merah' },
            enabled: true,
            children: [{ id: 'sA', type: 'SORTING', laneParam: 'A', enabled: true }],
            elseChildren: [{ id: 'sB', type: 'SORTING', laneParam: 'B', enabled: true }],
          },
        ],
      },
    ];

    interpreter.loadProgram(prog);
    interpreter.runToCompletion();

    expect(interpreter.getStatus()).toBe('HALTED_SUCCESS');
    const completed = interpreter.getCompletedItems();
    expect(completed.length).toBe(2);
    expect(completed[0].completedLane).toBe('A');
    expect(completed[1].completedLane).toBe('B');
  });

  it('detects and rejects recursive procedure calls', () => {
    const interpreter = new FactoryInterpreter(dummyOrder);
    const prog: ProgramBlock[] = [
      {
        id: 'proc1',
        type: 'PROCEDURE',
        procedureName: 'P1',
        enabled: true,
        children: [
          { id: 'call1', type: 'CALL', procedureName: 'P1', enabled: true }, // Recursion!
        ],
      },
      { id: 'mainCall', type: 'CALL', procedureName: 'P1', enabled: true },
    ];

    interpreter.loadProgram(prog);
    interpreter.runToCompletion();

    expect(interpreter.getStatus()).toBe('HALTED_ERROR');
    expect(interpreter.getErrorMessage()).toContain('rekursi');
  });
});
