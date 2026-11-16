// TRACE: DIGITAL FORENSICS - Core Type Definitions

export type GameScreen = 'MENU' | 'CASE_SELECT' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'ARCHIVE' | 'SETTINGS';

export interface CaseProgress {
  caseId: number;
  completed: boolean;
  stars: number; // 0 to 3
  highScore: number;
  accuracy: number;
  logicQuality: number;
  efficiency: number;
  debugging: number;
  timestamp?: string;
  solutionSummary?: string;
}

export interface PlayerProfile {
  name: string;
  badgeNumber: string;
  cases: Record<number, CaseProgress>;
  settings: {
    soundEnabled: boolean;
    terminalSpeed: 'FAST' | 'NORMAL' | 'SLOW';
    crtFilter: boolean;
  };
}

// ==========================================
// LEVEL 1 TYPES: DATA ANOMALY
// ==========================================
export interface TransactionRecord {
  id: string; // e.g. "TXN-9041"
  timestamp: string; // "2026-10-24 03:14:22"
  amount: number; // in USD or IDR equivalent
  transactionFrequency: number; // txns per hour
  accountStatus: 'ACTIVE' | 'FLAGGED' | 'DORMANT' | 'NEW';
  category: 'E-COMMERCE' | 'WIRE_TRANSFER' | 'ATM_WITHDRAWAL' | 'CRYPTO_PURCHASE' | 'PAYROLL';
  deviceFingerprint: string;
  ipLocation: string;
  isAnomaly: boolean; // Ground truth
  anomalyReason?: string; // Ground truth explanation
}

export interface Level1AnalysisState {
  selectedRowIds: Set<string>;
  taggedAnomalyIds: Set<string>;
  taggedNormalIds: Set<string>;
  activeFilterCategory: string;
  activeFilterStatus: string;
  minAmountFilter: number;
  maxAmountFilter: number;
  sortBy: keyof TransactionRecord;
  sortDirection: 'asc' | 'desc';
  comparedRowIds: string[]; // up to 2 items to compare side by side
}

// ==========================================
// LEVEL 2 TYPES: RULES OF DETECTION
// ==========================================
export interface LoginEventLog {
  id: string; // "EVT-8821"
  timestamp: string;
  ipAddress: string;
  ipCountry: string;
  loginStatus: 'SUCCESS' | 'FAILED';
  failedAttemptCount: number;
  accountId: string;
  sessionDurationSec: number;
  deviceType: 'DESKTOP' | 'MOBILE' | 'API_KEY' | 'TOR_PROXY';
  isSuspicious: boolean; // Ground truth
  suspiciousReason?: string;
}

// Logic Rule AST
export type LogicComparator = 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'NOT_EQUALS';
export type LogicalOperator = 'AND' | 'OR';
export type RuleAction = 'MARK_SUSPICIOUS' | 'PASS' | 'SEND_REVIEW';

export interface LogicCondition {
  id: string;
  field: 'failedAttemptCount' | 'sessionDurationSec' | 'loginStatus' | 'deviceType';
  comparator: LogicComparator;
  value: string | number;
}

export interface LogicRuleBlock {
  id: string;
  type: 'IF_THEN' | 'IF_ELSE' | 'REPEAT';
  conditionGroup?: {
    operator: LogicalOperator;
    conditions: LogicCondition[];
  };
  thenAction: RuleAction;
  elseAction?: RuleAction;
  repeatTimes?: number; // for REPEAT block (capped at 5 to avoid infinite loop)
}

export interface RuleEvaluationResult {
  totalProcessed: number;
  truePositives: number; // Correctly caught threats
  falsePositives: number; // Innocent flagged as threat (Rule too strict)
  trueNegatives: number; // Correctly identified normal
  falseNegatives: number; // Threats missed (Rule too loose)
  accuracy: number; // (TP + TN) / Total
  precision: number;
  recall: number;
  f1Score: number;
  feedback: {
    status: 'EXCELLENT' | 'TOO_STRICT' | 'TOO_LOOSE' | 'SYNTAX_ERROR' | 'INCOMPLETE';
    title: string;
    description: string;
    tips: string[];
  };
  rowDecisions: Array<{
    recordId: string;
    action: RuleAction;
    expected: 'SUSPICIOUS' | 'NORMAL';
    isCorrect: boolean;
    reason: string;
  }>;
}

// ==========================================
// LEVEL 3 TYPES: SYSTEM FAILURE & DEBUGGING
// ==========================================
export interface SystemModuleRecord {
  id: string;
  userId: string;
  timestamp: string;
  loginModule: {
    loginIp: string;
    geoMismatched: boolean;
    mfaVerified: boolean;
    attemptCount: number;
  };
  activityModule: {
    bytesTransferred: number;
    privilegeEscalated: boolean;
    actionType: 'DATA_READ' | 'FILE_DELETION' | 'ADMIN_CHANGE' | 'MASS_EXPORT';
  };
  accessModule: {
    resourceTier: 'PUBLIC' | 'CONFIDENTIAL' | 'RESTRICTED' | 'ROOT_SYSTEM';
    authorized: boolean;
    accessHour: number; // 0 - 23
  };
  groundTruthVerdict: 'CRITICAL_THREAT' | 'WARNING' | 'SAFE';
  threatReason: string;
}

export type ProcedureName = 'CHECK_LOGIN' | 'ANALYZE_ACTIVITY' | 'VERIFY_ACCESS' | 'GENERATE_REPORT';

export interface ProcedureInstruction {
  id: string;
  procedure: ProcedureName;
  conditionField?: 'geoMismatched' | 'attemptCount' | 'privilegeEscalated' | 'resourceTier' | 'authorized' | 'always';
  conditionOp?: 'EQUALS' | 'GREATER_THAN';
  conditionVal?: string | number | boolean;
  enabled: boolean;
  comment?: string;
  hasBug?: boolean;
  bugDescription?: string;
}

export interface SystemExecutionStep {
  stepNumber: number;
  procedure: ProcedureName;
  inputRecordId: string;
  status: 'EXECUTED' | 'SKIPPED' | 'ERROR';
  log: string;
  contextState: Record<string, any>;
}

export interface Level3EvaluationResult {
  accuracy: number;
  bugsFixedCount: number;
  totalBugs: number;
  efficiencyRating: number; // based on instruction redundancy
  threatsDetected: number;
  falseAlarms: number;
  safePassed: number;
  verdictLogs: Array<{
    recordId: string;
    actualVerdict: 'CRITICAL_THREAT' | 'WARNING' | 'SAFE';
    expectedVerdict: 'CRITICAL_THREAT' | 'WARNING' | 'SAFE';
    isMatch: boolean;
  }>;
}

// ==========================================
// EVALUATION & SCORING SUMMARY
// ==========================================
export interface CaseFinalReport {
  caseId: number;
  caseTitle: string;
  caseSubtitle: string;
  stars: number; // 1 to 3 stars
  accuracyScore: number; // 0 - 100
  logicQualityScore: number; // 0 - 100
  efficiencyScore: number; // 0 - 100
  debuggingScore: number; // 0 - 100
  finalGrade: 'S' | 'A' | 'B' | 'C' | 'RETRY';
  feedbackTitle: string;
  feedbackBody: string;
  ctConcepts: {
    decomposition: string;
    patternRecognition: string;
    abstraction: string;
    algorithmDesign: string;
    debugging: string;
  };
}
