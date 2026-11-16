import { SystemModuleRecord, ProcedureInstruction } from '../types';

export const LEVEL_3_DATASET: SystemModuleRecord[] = [
  {
    id: "REC-301",
    userId: "USR-ALPHA",
    timestamp: "2026-10-26 09:12:00",
    loginModule: {
      loginIp: "192.168.1.10",
      geoMismatched: false,
      mfaVerified: true,
      attemptCount: 1
    },
    activityModule: {
      bytesTransferred: 45000,
      privilegeEscalated: false,
      actionType: "DATA_READ"
    },
    accessModule: {
      resourceTier: "PUBLIC",
      authorized: true,
      accessHour: 9
    },
    groundTruthVerdict: "SAFE",
    threatReason: "Aktivitas kerja normal, MFA valid, hak akses resmi."
  },
  {
    id: "REC-302",
    userId: "USR-INTRUDER",
    timestamp: "2026-10-26 02:44:19",
    loginModule: {
      loginIp: "45.142.122.9",
      geoMismatched: true,
      mfaVerified: false,
      attemptCount: 7
    },
    activityModule: {
      bytesTransferred: 980000000, // 980 MB
      privilegeEscalated: true,
      actionType: "MASS_EXPORT"
    },
    accessModule: {
      resourceTier: "RESTRICTED",
      authorized: false,
      accessHour: 2
    },
    groundTruthVerdict: "CRITICAL_THREAT",
    threatReason: "Penyusupan nyata: Geo-mismatch, eskalasi privilese tanpa izin, eksfiltrasi data massal pada jam 02:00."
  },
  {
    id: "REC-303",
    userId: "USR-DEV-09",
    timestamp: "2026-10-26 14:20:11",
    loginModule: {
      loginIp: "103.20.14.88",
      geoMismatched: false,
      mfaVerified: true,
      attemptCount: 2
    },
    activityModule: {
      bytesTransferred: 1200000,
      privilegeEscalated: false,
      actionType: "ADMIN_CHANGE"
    },
    accessModule: {
      resourceTier: "CONFIDENTIAL",
      authorized: true,
      accessHour: 14
    },
    groundTruthVerdict: "SAFE",
    threatReason: "Perubahan konfigurasi resmi oleh developer berlisensi dengan autentikasi penuh."
  },
  {
    id: "REC-304",
    userId: "USR-SUSPECT-B",
    timestamp: "2026-10-26 23:15:40",
    loginModule: {
      loginIp: "185.190.22.4",
      geoMismatched: true,
      mfaVerified: false,
      attemptCount: 4
    },
    activityModule: {
      bytesTransferred: 450000,
      privilegeEscalated: false,
      actionType: "DATA_READ"
    },
    accessModule: {
      resourceTier: "CONFIDENTIAL",
      authorized: false,
      accessHour: 23
    },
    groundTruthVerdict: "WARNING",
    threatReason: "Mencoba membaca data rahasia pada malam hari tanpa otorisasi resmi, perlu investigasi lanjut."
  },
  {
    id: "REC-305",
    userId: "USR-ROGUE-ROOT",
    timestamp: "2026-10-26 03:05:00",
    loginModule: {
      loginIp: "193.111.4.2",
      geoMismatched: true,
      mfaVerified: false,
      attemptCount: 9
    },
    activityModule: {
      bytesTransferred: 520000000,
      privilegeEscalated: true,
      actionType: "FILE_DELETION"
    },
    accessModule: {
      resourceTier: "ROOT_SYSTEM",
      authorized: false,
      accessHour: 3
    },
    groundTruthVerdict: "CRITICAL_THREAT",
    threatReason: "Sabotase sistem: Upaya penghapusan file inti sistem (ROOT_SYSTEM) setelah memaksakan login 9x."
  },
  {
    id: "REC-306",
    userId: "USR-MARKETING",
    timestamp: "2026-10-26 11:30:22",
    loginModule: {
      loginIp: "114.124.12.3",
      geoMismatched: false,
      mfaVerified: true,
      attemptCount: 1
    },
    activityModule: {
      bytesTransferred: 15000,
      privilegeEscalated: false,
      actionType: "DATA_READ"
    },
    accessModule: {
      resourceTier: "PUBLIC",
      authorized: true,
      accessHour: 11
    },
    groundTruthVerdict: "SAFE",
    threatReason: "Akses rutin ke dokumen materi promosi publik."
  },
  {
    id: "REC-307",
    userId: "USR-LATE-NIGHT",
    timestamp: "2026-10-26 19:40:10",
    loginModule: {
      loginIp: "180.244.11.2",
      geoMismatched: false,
      mfaVerified: true,
      attemptCount: 1
    },
    activityModule: {
      bytesTransferred: 80000,
      privilegeEscalated: false,
      actionType: "DATA_READ"
    },
    accessModule: {
      resourceTier: "CONFIDENTIAL",
      authorized: true,
      accessHour: 19
    },
    groundTruthVerdict: "SAFE",
    threatReason: "Karyawan lembur terverifikasi mengakses dokumen internal. Bukan ancaman meskipun di luar jam 18:00."
  },
  {
    id: "REC-308",
    userId: "USR-INSIDER",
    timestamp: "2026-10-26 16:55:00",
    loginModule: {
      loginIp: "192.168.1.55",
      geoMismatched: false,
      mfaVerified: true,
      attemptCount: 1
    },
    activityModule: {
      bytesTransferred: 750000000, // 750MB
      privilegeEscalated: true,
      actionType: "MASS_EXPORT"
    },
    accessModule: {
      resourceTier: "ROOT_SYSTEM",
      authorized: false,
      accessHour: 16
    },
    groundTruthVerdict: "CRITICAL_THREAT",
    threatReason: "Insider Threat: Pegawai dari jaringan internal menaikkan hak akses ilegal dan mencuri 750MB basis data root."
  }
];

// Initial Buggy Procedure Sequence given to player
export const INITIAL_BUGGY_PIPELINE: ProcedureInstruction[] = [
  {
    id: "PROC-1",
    procedure: "CHECK_LOGIN",
    conditionField: "always",
    enabled: true,
    hasBug: false,
    comment: "Langkah 1: Verifikasi kredensial login awal."
  },
  {
    id: "PROC-2",
    procedure: "CHECK_LOGIN", // BUG 1: Redundant repetitive call (wasteful, lowers efficiency)
    conditionField: "always",
    enabled: true,
    hasBug: true,
    bugDescription: "BUG: Prosedur CHECK_LOGIN dipanggil 2x berturut-turut tanpa kebutuhan (Redundansi Sistem)."
  },
  {
    id: "PROC-3",
    procedure: "GENERATE_REPORT", // BUG 2: Wrong sequence! Report is generated before analyzing activity & verifying access!
    conditionField: "always",
    enabled: true,
    hasBug: true,
    bugDescription: "BUG: Urutan prosedur terbalik! Laporan dibuat sebelum aktivitas dan hak akses diperiksa."
  },
  {
    id: "PROC-4",
    procedure: "ANALYZE_ACTIVITY", // BUG 3: Disabled / uncalled procedure!
    conditionField: "privilegeEscalated",
    conditionOp: "EQUALS",
    conditionVal: true,
    enabled: false, // Disabled!
    hasBug: true,
    bugDescription: "BUG: Prosedur vital ANALYZE_ACTIVITY dalam status non-aktif (disabled), sehingga eskalasi privilese terabaikan!"
  },
  {
    id: "PROC-5",
    procedure: "VERIFY_ACCESS", // BUG 4: Flawed condition: checks if accessHour > 18 instead of unauthorized access
    conditionField: "resourceTier",
    conditionOp: "EQUALS",
    conditionVal: "PUBLIC", // Flawed: Only checks public tier, ignores RESTRICTED or ROOT!
    enabled: true,
    hasBug: true,
    bugDescription: "BUG: Kondisi filter salah: Hanya memverifikasi data PUBLIC, sedangkan RESTRICTED & ROOT terlewatkan!"
  }
];
