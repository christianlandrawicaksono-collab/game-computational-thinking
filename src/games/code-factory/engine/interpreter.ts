// CODE FACTORY — Core Simulation Engine & Interpreter
// Pure TypeScript engine without any UI/React dependencies.

import type {
  BlockType,
  FactoryItem,
  OrderData,
  ProgramBlock,
  SimulationMetrics,
  SimulationStatus,
  ExecutionLogEntry,
  OrderEvaluationResult,
  LogType,
} from './types';
import { applyMachineToItem, MACHINES } from './machines';
import { calculateInstructionCount, evaluateOrderProduction, isItemMatchingSpec } from './scoring';

interface StackFrame {
  blocks: ProgramBlock[];
  index: number;
  repeatRemaining?: number;
  procedureName?: string;
  sourceBlockId?: string;
}

export class FactoryInterpreter {
  private order: OrderData;
  private program: ProgramBlock[] = [];
  private procedures: Map<string, ProgramBlock[]> = new Map();

  // Simulation State
  private inputBelt: FactoryItem[] = [];
  private completedItems: FactoryItem[] = [];
  private itemsSeen: Set<string> = new Set();
  private machineOpsCount: number = 0;
  private componentsUsed: number = 0;
  private totalTicks: number = 0;
  private stepCounter: number = 0;
  private status: SimulationStatus = 'IDLE';
  private errorMessage: string | null = null;
  private currentBlockId: string | null = null;
  private logs: ExecutionLogEntry[] = [];
  private logIdCounter: number = 1;

  // Callstack for execution
  private callstack: StackFrame[] = [];

  // Active callstack procedures to detect recursion
  private activeCallProcedures: Set<string> = new Set();

  // Listeners for UI state changes
  private listeners: (() => void)[] = [];

  constructor(order: OrderData) {
    this.order = order;
    this.reset();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Reset simulation state back to beginning of order.
   * Keeps the player's program intact.
   */
  public reset(): void {
    this.inputBelt = this.order.initialItems.map((item, idx) => ({
      ...item,
      id: `item-${idx + 1}`,
      stage: 0,
      cut: false,
      painted: null,
      assembled: false,
      packed: false,
      defective: false,
    }));

    this.completedItems = [];
    this.itemsSeen.clear();
    this.machineOpsCount = 0;
    this.componentsUsed = 0;
    this.totalTicks = 0;
    this.stepCounter = 0;
    this.status = 'IDLE';
    this.errorMessage = null;
    this.currentBlockId = null;
    this.logs = [];
    this.callstack = [];
    this.activeCallProcedures.clear();

    // Mark the initial first item as seen if present
    if (this.inputBelt.length > 0) {
      this.itemsSeen.add(this.inputBelt[0].id);
    }

    this.addLog('INFO', `Simulasi diinisialisasi untuk Pesanan ${this.order.id}: ${this.order.name}`);
    this.notify();
  }

  /**
   * Load program blocks and extract procedure definitions.
   */
  public loadProgram(blocks: ProgramBlock[]): void {
    this.program = blocks;
    this.procedures.clear();

    for (const block of blocks) {
      if (block.type === 'PROCEDURE' && block.procedureName && block.children) {
        this.procedures.set(block.procedureName, block.children);
      }
    }
  }

  /**
   * Prepare callstack for running from start.
   */
  public prepareExecution(): void {
    this.reset();
    this.procedures.clear();

    // Register all procedures first
    for (const block of this.program) {
      if (block.type === 'PROCEDURE' && block.procedureName && block.children) {
        this.procedures.set(block.procedureName, block.children);
      }
    }

    // Filter out PROCEDURE declaration blocks from main execution stream
    const executableBlocks = this.program.filter((b) => b.type !== 'PROCEDURE');

    this.callstack = [
      {
        blocks: executableBlocks,
        index: 0,
      },
    ];

    this.status = 'RUNNING';
    this.notify();
  }

  /**
   * Execute exactly one step (single block).
   * Returns true if simulation is still continuing, false if halted/finished.
   */
  public step(): boolean {
    if (this.status === 'IDLE' || this.callstack.length === 0) {
      if (this.status === 'HALTED_SUCCESS' || this.status === 'HALTED_ERROR') {
        return false;
      }
      this.prepareExecution();
    }

    if (this.status === 'HALTED_SUCCESS' || this.status === 'HALTED_ERROR') {
      return false;
    }

    // Safety guard against infinite loops
    this.stepCounter++;
    if (this.stepCounter > 5000) {
      this.status = 'HALTED_ERROR';
      this.errorMessage = 'Batas pengaman 5000 langkah terlampaui (indikasi loop tak berujung)';
      this.addLog('ERROR', `Runtime Error: ${this.errorMessage}`);
      this.currentBlockId = null;
      this.notify();
      return false;
    }

    while (this.callstack.length > 0) {
      const top = this.callstack[this.callstack.length - 1];

      // If current frame has exhausted its blocks
      if (top.index >= top.blocks.length) {
        // If it's a REPEAT frame with iterations remaining
        if (top.repeatRemaining && top.repeatRemaining > 1) {
          top.repeatRemaining--;
          top.index = 0;
          continue;
        }

        // If it was a procedure call frame, free the procedure from active calls
        if (top.procedureName) {
          this.activeCallProcedures.delete(top.procedureName);
        }

        // Pop frame
        this.callstack.pop();
        continue;
      }

      // We have a block to execute in current frame
      const currentBlock = top.blocks[top.index];
      top.index++;
      this.currentBlockId = currentBlock.id;

      // Rule: Check if block is disabled
      if (!currentBlock.enabled) {
        this.addLog('INFO', `Blok [${currentBlock.type}] dinonaktifkan (dilewati)`, currentBlock.id);
        this.notify();
        return true;
      }

      // Execute based on block type
      const continueExecution = this.executeBlock(currentBlock);
      this.notify();
      return continueExecution;
    }

    // Callstack is completely empty -> Execution finished normally
    this.status = 'HALTED_SUCCESS';
    this.currentBlockId = null;
    this.addLog('SUCCESS', `Program selesai dieksekusi.`);
    this.notify();
    return false;
  }

  /**
   * Pause the active execution.
   */
  public pause(): void {
    if (this.status === 'RUNNING') {
      this.status = 'PAUSED';
      this.notify();
    }
  }

  /**
   * Run entire program to completion or error.
   */
  public runToCompletion(): OrderEvaluationResult {
    if (this.status !== 'RUNNING') {
      this.prepareExecution();
    }
    let keepsGoing = true;
    while (keepsGoing) {
      keepsGoing = this.step();
    }
    return this.evaluateResult();
  }

  /**
   * Alias for evaluateResult.
   */
  public evaluate(repairedBugsCount?: number): OrderEvaluationResult {
    return this.evaluateResult(repairedBugsCount);
  }

  /**
   * Internal execution of a single active block.
   */
  private executeBlock(block: ProgramBlock): boolean {
    const activeItem = this.getActiveItem();

    switch (block.type) {
      case 'CUTTING':
      case 'PAINTING':
      case 'ASSEMBLY':
      case 'PACKAGING':
      case 'SORTING': {
        // Machine blocks require an active item
        if (!activeItem) {
          this.status = 'HALTED_ERROR';
          this.errorMessage = 'Bahan habis';
          this.addLog(
            'ERROR',
            `Runtime Error: Bahan habis! Mesin ${block.type} dijalankan saat tidak ada item aktif di belt.`,
            block.id
          );
          return false;
        }

        // Mark active item as seen
        this.itemsSeen.add(activeItem.id);
        this.machineOpsCount++;

        const result = applyMachineToItem(block.type, activeItem, {
          color: block.colorParam,
          lane: block.laneParam,
        });

        this.totalTicks += result.ticksConsumed;
        this.componentsUsed += result.componentsConsumed;

        // Update item in input belt
        this.inputBelt[0] = result.updatedItem;

        if (result.isDefectiveTriggered) {
          this.addLog('WARNING', result.logMessage, block.id, activeItem.id);
        } else {
          this.addLog('INFO', result.logMessage, block.id, activeItem.id);
        }

        // If item completed (PACKAGING or SORTING)
        if (result.isItemCompleted) {
          const completed = this.inputBelt.shift()!;
          this.completedItems.push(completed);

          // Mark next item as seen if available
          if (this.inputBelt.length > 0) {
            this.itemsSeen.add(this.inputBelt[0].id);
          }
        }

        return true;
      }

      case 'REPEAT': {
        const count = block.repeatCount ?? 1;
        if (!block.children || block.children.length === 0) {
          this.addLog('INFO', `REPEAT ${count} kosong (dilewati)`, block.id);
          return true;
        }

        // Push new repeat stack frame
        this.callstack.push({
          blocks: block.children,
          index: 0,
          repeatRemaining: count,
          sourceBlockId: block.id,
        });
        return true;
      }

      case 'IF': {
        if (!activeItem) {
          this.status = 'HALTED_ERROR';
          this.errorMessage = 'Bahan habis';
          this.addLog(
            'ERROR',
            `Runtime Error: Bahan habis! Kondisi IF dijalankan saat tidak ada item aktif di belt.`,
            block.id
          );
          return false;
        }

        this.itemsSeen.add(activeItem.id);
        const isTrue = this.evaluateCondition(block, activeItem);

        if (isTrue) {
          this.addLog(
            'INFO',
            `Kondisi IF BENAR (${block.condition?.field} == ${block.condition?.value})`,
            block.id,
            activeItem.id
          );
          if (block.children && block.children.length > 0) {
            this.callstack.push({
              blocks: block.children,
              index: 0,
              sourceBlockId: block.id,
            });
          }
        } else {
          this.addLog(
            'INFO',
            `Kondisi IF SALAH (${block.condition?.field} != ${block.condition?.value})`,
            block.id,
            activeItem.id
          );
          if (block.elseChildren && block.elseChildren.length > 0) {
            this.callstack.push({
              blocks: block.elseChildren,
              index: 0,
              sourceBlockId: block.id,
            });
          }
        }
        return true;
      }

      case 'CALL': {
        const procName = block.procedureName;
        if (!procName) {
          this.addLog('WARNING', `CALL tanpa nama prosedur (dilewati)`, block.id);
          return true;
        }

        // Recursion guard
        if (this.activeCallProcedures.has(procName)) {
          this.status = 'HALTED_ERROR';
          this.errorMessage = `Panggilan rekursi terdeteksi pada prosedur ${procName}! Rekursi ditolak.`;
          this.addLog('ERROR', `Runtime Error: ${this.errorMessage}`, block.id);
          return false;
        }

        const procBlocks = this.procedures.get(procName);
        if (!procBlocks || procBlocks.length === 0) {
          this.addLog('WARNING', `Prosedur ${procName} kosong atau tidak ditemukan`, block.id);
          return true;
        }

        this.activeCallProcedures.add(procName);
        this.addLog('INFO', `Memanggil Prosedur ${procName}`, block.id);

        this.callstack.push({
          blocks: procBlocks,
          index: 0,
          procedureName: procName,
          sourceBlockId: block.id,
        });
        return true;
      }

      case 'PROCEDURE':
        // Definition blocks are handled during registration, skipped during execution
        return true;

      default:
        return true;
    }
  }

  private evaluateCondition(block: ProgramBlock, item: FactoryItem): boolean {
    if (!block.condition) return false;
    const { field, value } = block.condition;

    if (field === 'warna') {
      return item.color === value;
    }
    if (field === 'material') {
      return item.material === value;
    }
    return false;
  }

  public getActiveItem(): FactoryItem | null {
    return this.inputBelt.length > 0 ? this.inputBelt[0] : null;
  }

  public getInputBelt(): FactoryItem[] {
    return [...this.inputBelt];
  }

  public getCompletedItems(): FactoryItem[] {
    return [...this.completedItems];
  }

  public getStatus(): SimulationStatus {
    return this.status;
  }

  public getErrorMessage(): string | null {
    return this.errorMessage;
  }

  public getCurrentBlockId(): string | null {
    return this.currentBlockId;
  }

  public getLogs(): ExecutionLogEntry[] {
    return [...this.logs];
  }

  public getTotalTicks(): number {
    return this.totalTicks;
  }

  public getComponentsUsed(): number {
    return this.componentsUsed;
  }

  /**
   * Compute live or final simulation metrics.
   */
  public getMetrics(): SimulationMetrics {
    const targetCount = this.order.initialItems.length;
    let correctCount = 0;
    let defectiveCount = 0;

    for (let i = 0; i < this.completedItems.length; i++) {
      const item = this.completedItems[i];
      if (item.defective) {
        defectiveCount++;
        continue;
      }

      // Check against target spec
      let matches = false;
      if (this.order.targetLanes && item.completedLane) {
        const laneSpec = this.order.targetLanes[item.completedLane as 'A' | 'B' | 'C'];
        if (laneSpec) {
          matches = isItemMatchingSpec(item, { ...laneSpec, requiredLane: item.completedLane as 'A' | 'B' | 'C' });
        }
      } else if (this.order.targetSpecs && this.order.targetSpecs[i]) {
        matches = isItemMatchingSpec(item, this.order.targetSpecs[i]);
      } else if (this.order.targetSpecs && this.order.targetSpecs.length === 1) {
        matches = isItemMatchingSpec(item, this.order.targetSpecs[0]);
      }

      if (matches) {
        correctCount++;
      }
    }

    const accuracy = targetCount > 0
      ? Math.min(100, Math.round((correctCount / targetCount) * 100))
      : 0;

    return {
      instructionCount: calculateInstructionCount(this.program),
      resourceUsage: this.itemsSeen.size + this.machineOpsCount + this.componentsUsed,
      executionTimeTicks: this.totalTicks,
      productionAccuracy: accuracy,
      totalCompletedItems: this.completedItems.length,
      correctCompletedItems: correctCount,
      defectiveItemsCount: defectiveCount,
      unprocessedItemsCount: this.inputBelt.length,
    };
  }

  /**
   * Evaluate final order result.
   */
  public evaluateResult(repairedBugsCount?: number): OrderEvaluationResult {
    const metrics = this.getMetrics();
    return evaluateOrderProduction(this.order, metrics, this.errorMessage, repairedBugsCount);
  }

  private addLog(type: LogType, message: string, blockId?: string, itemId?: string): void {
    const entry: ExecutionLogEntry = {
      id: `log-${this.logIdCounter++}`,
      tick: this.totalTicks,
      stepIndex: this.stepCounter,
      type,
      message,
      blockId,
      itemId,
    };
    this.logs.push(entry);
  }
}
