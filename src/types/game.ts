export type Direction = 0 | 1 | 2 | 3; // 0: North, 1: East, 2: South, 3: West

export const DIRECTION_NAMES: Record<Direction, string> = {
  0: 'UTARA',
  1: 'TIMUR',
  2: 'SELATAN',
  3: 'BARAT',
};

export const DIRECTION_DELTAS: Record<Direction, { dx: number; dy: number }> = {
  0: { dx: 0, dy: -1 }, // North is -Y in grid
  1: { dx: 1, dy: 0 },  // East is +X
  2: { dx: 0, dy: 1 },  // South is +Y
  3: { dx: -1, dy: 0 }, // West is -X
};

export type BlockType =
  | 'MOVE_FORWARD'
  | 'TURN_LEFT'
  | 'TURN_RIGHT'
  | 'PICK_KEY'
  | 'ACTIVATE_SWITCH'
  | 'LOOP'
  | 'IF'
  | 'CALL_PROC';

export type ConditionType =
  | 'HAS_KEY'
  | 'WALL_AHEAD'
  | 'AT_GENERATOR'
  | 'AT_SWITCH'
  | 'DOOR_AHEAD_LOCKED';

export const CONDITION_LABELS: Record<ConditionType, string> = {
  HAS_KEY: 'Memiliki Kunci Akses',
  WALL_AHEAD: 'Depan Terhalang Dinding',
  AT_GENERATOR: 'Berada di Depan Generator',
  AT_SWITCH: 'Berada di Depan Sakelar',
  DOOR_AHEAD_LOCKED: 'Depan Ada Pintu Terkunci',
};

export interface CommandBlock {
  id: string;
  type: BlockType;
  // For LOOP:
  iterations?: number;
  children?: CommandBlock[];
  // For IF:
  condition?: ConditionType;
  elseChildren?: CommandBlock[];
  // For CALL_PROC:
  procedureId?: string;
}

export interface ProcedureDef {
  id: string;
  name: string;
  blocks: CommandBlock[];
}

export interface Position {
  x: number;
  y: number;
}

export interface RobotState {
  x: number;
  y: number;
  dir: Direction;
  inventory: {
    keys: string[]; // key ids
  };
}

export interface DoorObject {
  id: string;
  x: number;
  y: number;
  isOpen: boolean;
  requiredKeyId?: string;
  connectedSwitchId?: string;
}

export interface KeyObject {
  id: string;
  x: number;
  y: number;
  isCollected: boolean;
}

export interface SwitchObject {
  id: string;
  x: number;
  y: number;
  isOn: boolean;
  targetsDoorId?: string;
}

export interface GeneratorObject {
  id: string;
  x: number;
  y: number;
  isActive: boolean;
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  conceptFocus: string;
  story: string;
  hint: string;
  gridSize: { width: number; height: number };
  robotStart: { x: number; y: number; dir: Direction };
  targetTerminal: Position;
  walls: Position[];
  doors?: DoorObject[];
  keys?: KeyObject[];
  switches?: SwitchObject[];
  generators?: GeneratorObject[];
  allowedBlocks: BlockType[];
  maxEfficiencyBlocks: number; // <= this for 3 stars
  midEfficiencyBlocks: number; // <= this for 2 stars
  maxRecommendedBlocks?: number;
  allowProcedures?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'ACTION' | 'SUCCESS' | 'ERROR' | 'WARNING';
  message: string;
  step?: number;
  blockId?: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  soundVolume: number;
  bgmEnabled: boolean;
  bgmVolume: number;
  speed: 'slow' | 'normal' | 'fast'; // slow: 700ms, normal: 380ms, fast: 150ms
}

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 - 3
  bestBlockCount?: number;
}

export interface UserProgress {
  levels: Record<number, LevelProgress>;
}
