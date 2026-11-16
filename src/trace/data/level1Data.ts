import { TransactionRecord } from '../types';

export const LEVEL_1_DATASET: TransactionRecord[] = [
  {
    id: "TXN-1001",
    timestamp: "2026-10-24 08:14:02",
    amount: 120.50,
    transactionFrequency: 2,
    accountStatus: "ACTIVE",
    category: "E-COMMERCE",
    deviceFingerprint: "DEV-WIN-9821",
    ipLocation: "Jakarta, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1002",
    timestamp: "2026-10-24 08:32:15",
    amount: 98500.00,
    transactionFrequency: 38,
    accountStatus: "NEW",
    category: "CRYPTO_PURCHASE",
    deviceFingerprint: "DEV-TOR-0012",
    ipLocation: "Unknown Proxy",
    isAnomaly: true,
    anomalyReason: "Lonjakan frekuensi transaksi ekstrem (38/jam) dan nominal raksasa ($98,500) pada akun yang baru dibuat (Status: NEW)."
  },
  {
    id: "TXN-1003",
    timestamp: "2026-10-24 09:05:40",
    amount: 45.00,
    transactionFrequency: 1,
    accountStatus: "ACTIVE",
    category: "E-COMMERCE",
    deviceFingerprint: "DEV-AND-4431",
    ipLocation: "Surabaya, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1004",
    timestamp: "2026-10-24 09:12:11",
    amount: 1.50,
    transactionFrequency: 52,
    accountStatus: "DORMANT",
    category: "E-COMMERCE",
    deviceFingerprint: "DEV-BOT-9912",
    ipLocation: "Frankfurt, DE",
    isAnomaly: true,
    anomalyReason: "Pola serangan Card Testing / Bot: Akun DORMANT tiba-tiba melakukan 52 transaksi mikro/jam dengan nilai $1.50."
  },
  {
    id: "TXN-1005",
    timestamp: "2026-10-24 09:45:00",
    amount: 2500.00,
    transactionFrequency: 1,
    accountStatus: "ACTIVE",
    category: "PAYROLL",
    deviceFingerprint: "DEV-MAC-1190",
    ipLocation: "Bandung, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1006",
    timestamp: "2026-10-24 10:15:33",
    amount: 250.00,
    transactionFrequency: 3,
    accountStatus: "ACTIVE",
    category: "ATM_WITHDRAWAL",
    deviceFingerprint: "DEV-ATM-0412",
    ipLocation: "Jakarta, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1007",
    timestamp: "2026-10-24 10:30:19",
    amount: 78000.00,
    transactionFrequency: 29,
    accountStatus: "DORMANT",
    category: "WIRE_TRANSFER",
    deviceFingerprint: "DEV-UNK-8841",
    ipLocation: "Panama City, PA",
    isAnomaly: true,
    anomalyReason: "Akun DORMANT (lama tidak aktif) mendadak mentransfer dana besar ($78,000) dengan frekuensi tinggi ke rekening luar negeri."
  },
  {
    id: "TXN-1008",
    timestamp: "2026-10-24 11:02:44",
    amount: 320.00,
    transactionFrequency: 2,
    accountStatus: "ACTIVE",
    category: "E-COMMERCE",
    deviceFingerprint: "DEV-WIN-3320",
    ipLocation: "Semarang, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1009",
    timestamp: "2026-10-24 11:45:10",
    amount: 85.00,
    transactionFrequency: 1,
    accountStatus: "ACTIVE",
    category: "E-COMMERCE",
    deviceFingerprint: "DEV-IOS-7721",
    ipLocation: "Yogyakarta, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1010",
    timestamp: "2026-10-24 12:10:05",
    amount: 64000.00,
    transactionFrequency: 41,
    accountStatus: "FLAGGED",
    category: "ATM_WITHDRAWAL",
    deviceFingerprint: "DEV-ATM-9901",
    ipLocation: "Kyiv, UA",
    isAnomaly: true,
    anomalyReason: "Akun dengan status FLAGGED melakukan penarikan ATM beruntun dengan nilai $64,000 dan frekuensi 41/jam (Jackpotting anomaly)."
  },
  {
    id: "TXN-1011",
    timestamp: "2026-10-24 12:30:45",
    amount: 1500.00,
    transactionFrequency: 2,
    accountStatus: "ACTIVE",
    category: "WIRE_TRANSFER",
    deviceFingerprint: "DEV-WIN-4481",
    ipLocation: "Jakarta, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1012",
    timestamp: "2026-10-24 13:00:20",
    amount: 18.90,
    transactionFrequency: 1,
    accountStatus: "ACTIVE",
    category: "E-COMMERCE",
    deviceFingerprint: "DEV-AND-6612",
    ipLocation: "Medan, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1013",
    timestamp: "2026-10-24 13:40:12",
    amount: 2.10,
    transactionFrequency: 60,
    accountStatus: "DORMANT",
    category: "E-COMMERCE",
    deviceFingerprint: "DEV-BOT-9912",
    ipLocation: "Frankfurt, DE",
    isAnomaly: true,
    anomalyReason: "Kelanjutan serangan otomatisasi (Bot): 60 transaksi/jam dari perangkat terinfeksi pada akun tidak aktif."
  },
  {
    id: "TXN-1014",
    timestamp: "2026-10-24 14:15:00",
    amount: 3500.00,
    transactionFrequency: 1,
    accountStatus: "ACTIVE",
    category: "PAYROLL",
    deviceFingerprint: "DEV-MAC-1190",
    ipLocation: "Bandung, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1015",
    timestamp: "2026-10-24 14:50:33",
    amount: 450.00,
    transactionFrequency: 2,
    accountStatus: "ACTIVE",
    category: "ATM_WITHDRAWAL",
    deviceFingerprint: "DEV-ATM-1201",
    ipLocation: "Bali, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1016",
    timestamp: "2026-10-24 15:22:18",
    amount: 92000.00,
    transactionFrequency: 45,
    accountStatus: "NEW",
    category: "CRYPTO_PURCHASE",
    deviceFingerprint: "DEV-TOR-0012",
    ipLocation: "Unknown Proxy",
    isAnomaly: true,
    anomalyReason: "Transaksi Crypto masif kedua ($92,000) lewat Tor Network dari akun baru yang sama."
  },
  {
    id: "TXN-1017",
    timestamp: "2026-10-24 15:45:00",
    amount: 60.00,
    transactionFrequency: 1,
    accountStatus: "ACTIVE",
    category: "E-COMMERCE",
    deviceFingerprint: "DEV-WIN-7711",
    ipLocation: "Makassar, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1018",
    timestamp: "2026-10-24 16:10:20",
    amount: 750.00,
    transactionFrequency: 2,
    accountStatus: "ACTIVE",
    category: "WIRE_TRANSFER",
    deviceFingerprint: "DEV-WIN-5544",
    ipLocation: "Jakarta, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1019",
    timestamp: "2026-10-24 16:30:15",
    amount: 110.00,
    transactionFrequency: 3,
    accountStatus: "ACTIVE",
    category: "E-COMMERCE",
    deviceFingerprint: "DEV-AND-3399",
    ipLocation: "Malang, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1020",
    timestamp: "2026-10-24 17:05:40",
    amount: 51200.00,
    transactionFrequency: 34,
    accountStatus: "FLAGGED",
    category: "WIRE_TRANSFER",
    deviceFingerprint: "DEV-VPN-4001",
    ipLocation: "Belize City, BZ",
    isAnomaly: true,
    anomalyReason: "Akun berstatus FLAGGED melakukan transfer cepat berturut-turut ($51,200) melalui server VPN anonim."
  },
  {
    id: "TXN-1021",
    timestamp: "2026-10-24 17:25:00",
    amount: 2800.00,
    transactionFrequency: 1,
    accountStatus: "ACTIVE",
    category: "PAYROLL",
    deviceFingerprint: "DEV-MAC-1190",
    ipLocation: "Bandung, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1022",
    timestamp: "2026-10-24 17:50:11",
    amount: 95.00,
    transactionFrequency: 1,
    accountStatus: "ACTIVE",
    category: "E-COMMERCE",
    deviceFingerprint: "DEV-IOS-2211",
    ipLocation: "Jakarta, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1023",
    timestamp: "2026-10-24 18:15:22",
    amount: 500.00,
    transactionFrequency: 2,
    accountStatus: "ACTIVE",
    category: "ATM_WITHDRAWAL",
    deviceFingerprint: "DEV-ATM-8833",
    ipLocation: "Surabaya, ID",
    isAnomaly: false
  },
  {
    id: "TXN-1024",
    timestamp: "2026-10-24 18:40:05",
    amount: 35.00,
    transactionFrequency: 2,
    accountStatus: "ACTIVE",
    category: "E-COMMERCE",
    deviceFingerprint: "DEV-AND-5511",
    ipLocation: "Bogor, ID",
    isAnomaly: false
  }
];

export const LEVEL_1_GROUND_TRUTH_ANOMALIES = LEVEL_1_DATASET
  .filter(item => item.isAnomaly)
  .map(item => item.id);
