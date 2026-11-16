// CODE FACTORY — Engine Type Definitions

export type MaterialType = 'kayu' | 'logam' | 'plastik';
export type ColorType = 'polos' | 'merah' | 'biru' | 'hijau';
export type SortingLane = 'A' | 'B' | 'C' | 'REJECT';

export interface FactoryItem {
  id: string;
  material: MaterialType;
  color: ColorType;
  stage: number; // 0 = mentah
  cut: boolean;
  painted: ColorType | null;
  assembled: boolean;
  packed: boolean;
  defective: boolean;
  defectiveReason?: string;
  completedLane?: SortingLane;
}

export type MachineType = 'CUTTING' | 'PAINTING' | 'ASSEMBLY' | 'PACKAGING' | 'SORTING';

export interface MachineConfig {
  type: MachineType;
  name: string;
  targetStage: number; // 1: CUTTING, 2: PAINTING, 3: ASSEMBLY, 4: PACKAGING, 99: SORTING
  durationTicks: number;
  description: string;
}

// Block programming AST definitions
export type ConditionField = 'warna' | 'material';
export type ConditionOperator = '==';

export interface Condition {
  field: ConditionField;
  operator: ConditionOperator;
  value: ColorType | MaterialType;
}

export type BlockType =
  | 'CUTTING'
  | 'PAINTING'
  | 'ASSEMBLY'
  | 'PACKAGING'
  | 'SORTING'
  | 'REPEAT'
  | 'IF'
  | 'PROCEDURE'
  | 'CALL';

export interface ProgramBlock {
  id: string;
  type: BlockType;
  enabled: boolean; // Toggle active / inactive
  colorParam?: ColorType; // for PAINTING
  laneParam?: 'A' | 'B' | 'C'; // for SORTING
  repeatCount?: number; // for REPEAT (1-20)
  condition?: Condition; // for IF
  procedureName?: 'P1' | 'P2' | 'P3'; // for PROCEDURE and CALL
  children?: ProgramBlock[]; // for REPEAT, IF (then branch), PROCEDURE
  elseChildren?: ProgramBlock[]; // for IF (else branch)
}

export type LogType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface ExecutionLogEntry {
  id: string;
  tick: number;
  stepIndex: number;
  type: LogType;
  message: string;
  blockId?: string;
  itemId?: string;
}

export type SimulationStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'HALTED_SUCCESS' | 'HALTED_ERROR';

export interface OrderItemSpec {
  material: MaterialType;
  color?: ColorType; // target color
  cut?: boolean;
  assembled?: boolean;
  packed?: boolean;
  requiredLane?: 'A' | 'B' | 'C'; // for Level 3 sorting specs
}

export interface OrderData {
  id: string; // e.g. "1.1", "1.2", etc.
  levelNumber: 1 | 2 | 3;
  orderNumber: 1 | 2 | 3;
  name: string;
  description: string;
  initialItems: Omit<FactoryItem, 'id' | 'stage' | 'cut' | 'painted' | 'assembled' | 'packed' | 'defective'>[];
  targetSpecs: OrderItemSpec[];
  targetLanes?: {
    A?: OrderItemSpec;
    B?: OrderItemSpec;
    C?: OrderItemSpec;
  };
  allowedMachines: MachineType[];
  allowedBlocks: BlockType[];
  parInstructions: number;
  parResources: number;
  parTimeTicks: number;
  initialProgram?: ProgramBlock[]; // For 3.3 debugging level
  hints: [string, string, string]; // 3-tier hints
  ctConceptExplanation: string;
  // Level 1 specific decomposition target machines
  requiredDecompositionMachines?: MachineType[];
}

export interface SimulationMetrics {
  instructionCount: number;
  resourceUsage: number;
  executionTimeTicks: number;
  productionAccuracy: number; // 0 - 100
  totalCompletedItems: number;
  correctCompletedItems: number;
  defectiveItemsCount: number;
  unprocessedItemsCount: number;
}

export interface OrderEvaluationResult {
  isSuccess: boolean;
  errorMessage: string | null;
  metrics: SimulationMetrics;
  scoreInstruction: number;
  scoreResource: number;
  scoreTime: number;
  efficiencyScore: number; // 0 - 100
  stars: number; // 0, 1, 2, 3
  repairedBugsCount?: number; // for 3.3 debugging
}
