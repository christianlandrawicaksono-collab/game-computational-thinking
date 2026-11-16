import {
  DIRECTION_DELTAS,
  DIRECTION_NAMES,
} from '../types/game';
import type {
  CommandBlock,
  ConditionType,
  DoorObject,
  GeneratorObject,
  KeyObject,
  LevelData,
  LogEntry,
  ProcedureDef,
  RobotState,
  SwitchObject,
} from '../types/game';

export interface ExecutionSnapshot {
  robot: RobotState;
  doors: DoorObject[];
  keys: KeyObject[];
  switches: SwitchObject[];
  generators: GeneratorObject[];
  currentBlockId: string | null;
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'SUCCESS' | 'FAILED';
  stepCount: number;
  logs: LogEntry[];
  errorReason: string | null;
}

interface StackFrame {
  blocks: CommandBlock[];
  index: number;
  loopCounter?: number;
  loopMax?: number;
  isLoop?: boolean;
  loopBlockId?: string;
  isProc?: boolean;
  procName?: string;
}

export class ProgramInterpreter {
  private level: LevelData;
  private procedures: Record<string, ProcedureDef>;
  private snapshot: ExecutionSnapshot;
  private stack: StackFrame[] = [];
  private totalStepsExecuted = 0;
  private maxSteps = 400; // Protection against infinite loops

  constructor(
    level: LevelData,
    procedures: ProcedureDef[] = []
  ) {
    this.level = level;
    this.procedures = {};
    procedures.forEach((p) => {
      this.procedures[p.id] = p;
    });

    this.snapshot = this.createInitialSnapshot();
  }

  public createInitialSnapshot(): ExecutionSnapshot {
    return {
      robot: {
        x: this.level.robotStart.x,
        y: this.level.robotStart.y,
        dir: this.level.robotStart.dir,
        inventory: { keys: [] },
      },
      doors: (this.level.doors || []).map((d) => ({ ...d })),
      keys: (this.level.keys || []).map((k) => ({ ...k })),
      switches: (this.level.switches || []).map((s) => ({ ...s })),
      generators: (this.level.generators || []).map((g) => ({ ...g })),
      currentBlockId: null,
      status: 'IDLE',
      stepCount: 0,
      logs: [
        {
          id: 'log-init-' + Date.now(),
          timestamp: this.formatTime(),
          type: 'INFO',
          message: `Sistem diinisialisasi. UNIT-07 siap di posisi (${this.level.robotStart.x}, ${this.level.robotStart.y}) menghadap ${DIRECTION_NAMES[this.level.robotStart.dir]}.`,
        },
      ],
      errorReason: null,
    };
  }

  public getSnapshot(): ExecutionSnapshot {
    return {
      ...this.snapshot,
      robot: {
        ...this.snapshot.robot,
        inventory: { keys: [...this.snapshot.robot.inventory.keys] },
      },
      doors: this.snapshot.doors.map((d) => ({ ...d })),
      keys: this.snapshot.keys.map((k) => ({ ...k })),
      switches: this.snapshot.switches.map((s) => ({ ...s })),
      generators: this.snapshot.generators.map((g) => ({ ...g })),
      logs: [...this.snapshot.logs],
    };
  }

  public setProcedures(procedures: ProcedureDef[]) {
    this.procedures = {};
    procedures.forEach((p) => {
      this.procedures[p.id] = p;
    });
  }

  public loadProgram(blocks: CommandBlock[]) {
    this.stack = [
      {
        blocks: [...blocks],
        index: 0,
      },
    ];
    this.totalStepsExecuted = 0;
    this.snapshot = this.createInitialSnapshot();
    this.snapshot.status = 'IDLE';
  }

  public reset() {
    this.stack = [];
    this.totalStepsExecuted = 0;
    this.snapshot = this.createInitialSnapshot();
  }

  private formatTime(): string {
    const d = new Date();
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(d.getMilliseconds() / 100));
    return `${mm}:${ss}.${ms}`;
  }

  private addLog(type: LogEntry['type'], message: string, blockId?: string) {
    this.snapshot.logs.push({
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: this.formatTime(),
      type,
      message,
      step: this.snapshot.stepCount,
      blockId,
    });
  }

  private isFacingCell(x: number, y: number): boolean {
    const delta = DIRECTION_DELTAS[this.snapshot.robot.dir];
    return (
      this.snapshot.robot.x + delta.dx === x &&
      this.snapshot.robot.y + delta.dy === y
    );
  }

  private isAtOrFacing(x: number, y: number): boolean {
    if (this.snapshot.robot.x === x && this.snapshot.robot.y === y) return true;
    return this.isFacingCell(x, y);
  }

  private evaluateCondition(cond: ConditionType): boolean {
    const { robot, doors, switches, generators } = this.snapshot;
    const delta = DIRECTION_DELTAS[robot.dir];
    const frontX = robot.x + delta.dx;
    const frontY = robot.y + delta.dy;

    switch (cond) {
      case 'HAS_KEY':
        return robot.inventory.keys.length > 0;

      case 'WALL_AHEAD': {
        if (
          frontX < 0 ||
          frontX >= this.level.gridSize.width ||
          frontY < 0 ||
          frontY >= this.level.gridSize.height
        ) {
          return true;
        }
        return this.level.walls.some((w) => w.x === frontX && w.y === frontY);
      }

      case 'AT_GENERATOR':
        return generators.some((g) => this.isAtOrFacing(g.x, g.y));

      case 'AT_SWITCH':
        return switches.some((s) => this.isAtOrFacing(s.x, s.y));

      case 'DOOR_AHEAD_LOCKED': {
        const doorInFront = doors.find((d) => d.x === frontX && d.y === frontY);
        return !!doorInFront && !doorInFront.isOpen;
      }

      default:
        return false;
    }
  }

  /**
   * Performs exactly one step of execution.
   * Returns true if execution is still in progress, false if finished (success, error, or end).
   */
  public step(): boolean {
    if (
      this.snapshot.status === 'SUCCESS' ||
      this.snapshot.status === 'FAILED'
    ) {
      return false;
    }

    if (this.stack.length === 0) {
      // Program ended without reaching terminal
      this.checkEndConditions(true);
      return false;
    }

    this.totalStepsExecuted++;
    if (this.totalStepsExecuted > this.maxSteps) {
      this.snapshot.status = 'FAILED';
      this.snapshot.errorReason =
        'Batas maksimum eksekusi tercapai! Kemungkinan terjadi perulangan tanpa henti (Infinite Loop).';
      this.addLog(
        'ERROR',
        'BATAS EKSEKUSI TERLAMPAUI: Terdeteksi perulangan berlebih (> 400 langkah).'
      );
      return false;
    }

    const currentFrame = this.stack[this.stack.length - 1];

    // Check if current frame finished
    if (currentFrame.index >= currentFrame.blocks.length) {
      if (currentFrame.isLoop && currentFrame.loopCounter !== undefined && currentFrame.loopMax !== undefined) {
        currentFrame.loopCounter++;
        if (currentFrame.loopCounter < currentFrame.loopMax) {
          currentFrame.index = 0; // Restart loop block sequence
          return true;
        }
      }
      // Frame complete, pop it
      this.stack.pop();
      return true;
    }

    const block = currentFrame.blocks[currentFrame.index];
    currentFrame.index++;
    this.snapshot.currentBlockId = block.id;
    this.snapshot.stepCount++;

    return this.executeBlock(block);
  }

  private executeBlock(block: CommandBlock): boolean {
    switch (block.type) {
      case 'MOVE_FORWARD': {
        const delta = DIRECTION_DELTAS[this.snapshot.robot.dir];
        const nextX = this.snapshot.robot.x + delta.dx;
        const nextY = this.snapshot.robot.y + delta.dy;

        // Check grid boundary
        if (
          nextX < 0 ||
          nextX >= this.level.gridSize.width ||
          nextY < 0 ||
          nextY >= this.level.gridSize.height
        ) {
          this.snapshot.status = 'FAILED';
          this.snapshot.errorReason = `TABRAKAN BATAS SISTEM! UNIT-07 berusaha bergerak ke luar peta pada koordinat (${nextX}, ${nextY}).`;
          this.addLog(
            'ERROR',
            `Tabrakan batas pada (${nextX}, ${nextY})! Program dihentikan.`,
            block.id
          );
          return false;
        }

        // Check wall collision
        const isWall = this.level.walls.some(
          (w) => w.x === nextX && w.y === nextY
        );
        if (isWall) {
          this.snapshot.status = 'FAILED';
          this.snapshot.errorReason = `TABRAKAN DINDING! UNIT-07 menabrak rintangan firewall pada koordinat (${nextX}, ${nextY}).`;
          this.addLog(
            'ERROR',
            `Tabrakan di (${nextX}, ${nextY})! Dinding menghalangi jalan.`,
            block.id
          );
          return false;
        }

        // Check locked door collision
        const door = this.snapshot.doors.find(
          (d) => d.x === nextX && d.y === nextY
        );
        if (door && !door.isOpen) {
          this.snapshot.status = 'FAILED';
          this.snapshot.errorReason = `PINTU TERKUNCI! Pintu keamanan otomatis di (${nextX}, ${nextY}) tertutup. Butuh kunci atau sakelar untuk membukanya.`;
          this.addLog(
            'ERROR',
            `Pintu terkunci di (${nextX}, ${nextY})! Akses ditolak.`,
            block.id
          );
          return false;
        }

        // Move successful
        this.snapshot.robot.x = nextX;
        this.snapshot.robot.y = nextY;
        this.addLog(
          'ACTION',
          `UNIT-07 MAJU ke koordinat (${nextX}, ${nextY}).`,
          block.id
        );

        // Auto-activate generator if stepped on
        const genAtPos = this.snapshot.generators.find(
          (g) => g.x === nextX && g.y === nextY
        );
        if (genAtPos && !genAtPos.isActive) {
          genAtPos.isActive = true;
          this.addLog(
            'SUCCESS',
            `GENERATOR [${genAtPos.id}] DIAKTIFKAN! Arus daya mengalir.`,
            block.id
          );
        }

        // Check if stepped on goal terminal
        if (this.checkEndConditions(false)) {
          return false;
        }

        return true;
      }

      case 'TURN_LEFT': {
        this.snapshot.robot.dir = ((this.snapshot.robot.dir + 3) % 4) as 0 | 1 | 2 | 3;
        this.addLog(
          'ACTION',
          `UNIT-07 BELOK KIRI. Menghadap ${DIRECTION_NAMES[this.snapshot.robot.dir]}.`,
          block.id
        );
        return true;
      }

      case 'TURN_RIGHT': {
        this.snapshot.robot.dir = ((this.snapshot.robot.dir + 1) % 4) as 0 | 1 | 2 | 3;
        this.addLog(
          'ACTION',
          `UNIT-07 BELOK KANAN. Menghadap ${DIRECTION_NAMES[this.snapshot.robot.dir]}.`,
          block.id
        );
        return true;
      }

      case 'PICK_KEY': {
        const key = this.snapshot.keys.find(
          (k) => !k.isCollected && this.isAtOrFacing(k.x, k.y)
        );
        if (key) {
          key.isCollected = true;
          this.snapshot.robot.inventory.keys.push(key.id);
          this.addLog(
            'SUCCESS',
            `KUNCI DIAMBIL! Kunci akses [${key.id}] berhasil ditambahkan ke inventori.`,
            block.id
          );
        } else {
          this.addLog(
            'WARNING',
            'PERINGATAN: Tidak ada kunci akses di sekitar posisi UNIT-07.',
            block.id
          );
        }
        return true;
      }

      case 'ACTIVATE_SWITCH': {
        const sw = this.snapshot.switches.find((s) =>
          this.isAtOrFacing(s.x, s.y)
        );
        if (sw) {
          sw.isOn = !sw.isOn;
          this.addLog(
            'ACTION',
            `SAKELAR [${sw.id}] ${sw.isOn ? 'DIAKTIFKAN' : 'DIMATIKAN'}.`,
            block.id
          );

          if (sw.targetsDoorId) {
            const door = this.snapshot.doors.find(
              (d) => d.id === sw.targetsDoorId
            );
            if (door) {
              door.isOpen = sw.isOn;
              this.addLog(
                'SUCCESS',
                `PINTU [${door.id}] ${door.isOpen ? 'TERBUKA' : 'TERKUNCI'}.`,
                block.id
              );
            }
          }
        } else {
          // Check if facing generator to manually activate
          const gen = this.snapshot.generators.find((g) =>
            this.isAtOrFacing(g.x, g.y)
          );
          if (gen && !gen.isActive) {
            gen.isActive = true;
            this.addLog(
              'SUCCESS',
              `GENERATOR [${gen.id}] DIAKTIFKAN melalui interaksi manual!`,
              block.id
            );
          } else {
            this.addLog(
              'WARNING',
              'PERINGATAN: Tidak ada sakelar atau generator di depan UNIT-07.',
              block.id
            );
          }
        }
        return true;
      }

      case 'LOOP': {
        const iterations = Math.max(1, block.iterations || 2);
        const children = block.children || [];
        if (children.length === 0) return true;

        this.addLog(
          'INFO',
          `MEMULAI PERULANGAN: Jalankan blok ${iterations} kali.`,
          block.id
        );

        this.stack.push({
          blocks: [...children],
          index: 0,
          isLoop: true,
          loopCounter: 0,
          loopMax: iterations,
          loopBlockId: block.id,
        });
        return true;
      }

      case 'IF': {
        const condition = block.condition || 'HAS_KEY';
        const isTrue = this.evaluateCondition(condition);
        this.addLog(
          'INFO',
          `EVALUASI KONDISI [${condition}]: Hasil = ${isTrue ? 'BENAR (TRUE)' : 'SALAH (FALSE)'}.`,
          block.id
        );

        if (isTrue && block.children && block.children.length > 0) {
          this.stack.push({
            blocks: [...block.children],
            index: 0,
          });
        } else if (
          !isTrue &&
          block.elseChildren &&
          block.elseChildren.length > 0
        ) {
          this.stack.push({
            blocks: [...block.elseChildren],
            index: 0,
          });
        }
        return true;
      }

      case 'CALL_PROC': {
        if (!block.procedureId || !this.procedures[block.procedureId]) {
          this.addLog(
            'WARNING',
            `Prosedur tidak ditemukan atau belum didefinisikan!`,
            block.id
          );
          return true;
        }

        // Protect recursion stack depth
        const procCallCount = this.stack.filter((f) => f.isProc).length;
        if (procCallCount >= 8) {
          this.snapshot.status = 'FAILED';
          this.snapshot.errorReason =
            'STAMPILAN OVERFLOW! Terlalu banyak pemanggilan prosedur bersarang (Nested Procedures).';
          this.addLog(
            'ERROR',
            'Batas kedalaman prosedur terlampaui.',
            block.id
          );
          return false;
        }

        const proc = this.procedures[block.procedureId];
        this.addLog('INFO', `MEMANGGIL PROSEDUR: [${proc.name}]`, block.id);
        this.stack.push({
          blocks: [...proc.blocks],
          index: 0,
          isProc: true,
          procName: proc.name,
        });
        return true;
      }

      default:
        return true;
    }
  }

  private checkEndConditions(isEndOfCode: boolean): boolean {
    const { robot, generators } = this.snapshot;
    const atTerminal =
      robot.x === this.level.targetTerminal.x &&
      robot.y === this.level.targetTerminal.y;

    if (atTerminal) {
      // Check level-specific requirements
      if (this.level.id === 2) {
        const mainGen = generators.find((g) => g.id === 'GEN-MAIN');
        if (mainGen && !mainGen.isActive) {
          mainGen.isActive = true; // Stepping on terminal activates generator in Level 2
        }
      }

      if (this.level.id === 3) {
        const allGensActive = generators.every((g) => g.isActive);
        if (!allGensActive) {
          if (isEndOfCode) {
            this.snapshot.status = 'FAILED';
            this.snapshot.errorReason =
              'MISI BELUM SELESAI: Terminal utama tercapai, namun Generator Cadangan belum diaktifkan!';
            this.addLog(
              'ERROR',
              'Akses ditolak: Semua generator wajib aktif sebelum terminal dibuka.'
            );
          }
          return false;
        }
      }

      this.snapshot.status = 'SUCCESS';
      this.addLog(
        'SUCCESS',
        'MISI BERHASIL! Terminal NEXUS berhasil dipulihkan oleh UNIT-07.'
      );
      return true;
    }

    if (isEndOfCode && this.snapshot.status !== 'SUCCESS') {
      this.snapshot.status = 'FAILED';
      this.snapshot.errorReason =
        'EKSEKUSI SELESAI, TAPI TUJUAN BELUM TERCAPAI. UNIT-07 berhenti sebelum mencapai terminal tujuan.';
      this.addLog(
        'WARNING',
        `Program berakhir di (${robot.x}, ${robot.y}). Terminal berada di (${this.level.targetTerminal.x}, ${this.level.targetTerminal.y}).`
      );
      return false;
    }

    return false;
  }
}
