import type { LevelData } from '../types/game';

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: 'SEKTOR 01: SYSTEM BOOT',
    subtitle: 'Algoritma & Urutan Instruksi',
    conceptFocus: 'Sequencing & Debugging',
    story:
      'Ruang inisialisasi offline. Rangkai instruksi gerak dasar untuk memandu UNIT-07 melewati koridor isolasi menuju terminal pemulihan.',
    hint:
      'Pikirkan arah hadap robot sebelum melangkah. Perhatikan belokan dan hitung jumlah langkah sebelum belok kiri atau kanan.',
    gridSize: { width: 6, height: 5 },
    robotStart: { x: 1, y: 1, dir: 1 }, // (1,1) facing EAST (1)
    targetTerminal: { x: 4, y: 3 },
    walls: [
      // Outer perimeter borders
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 },
      // Obstacle walls defining the corridor
      { x: 1, y: 2 }, { x: 1, y: 3 },
      { x: 2, y: 2 }, { x: 2, y: 3 },
      { x: 4, y: 1 }, { x: 4, y: 2 },
    ],
    allowedBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT'],
    maxEfficiencyBlocks: 7, // 3 stars
    midEfficiencyBlocks: 10, // 2 stars
    maxRecommendedBlocks: 12,
  },
  {
    id: 2,
    title: 'SEKTOR 02: ENERGY LOOP',
    subtitle: 'Pengenalan Pola & Perulangan',
    conceptFocus: 'Pattern Recognition & Loops',
    story:
      'Generator sub-stasiun padam di ujung koridor berliku. Kenali pola belokan berulang dan manfaatkan blok perulangan agar memori program tetap hemat.',
    hint:
      'Amati ritme langkah robot: (Maju, Belok Kanan, Maju, Belok Kiri). Masukkan pola ini ke dalam blok ULANGI N KALI agar mendapat 3 bintang.',
    gridSize: { width: 7, height: 6 },
    robotStart: { x: 1, y: 1, dir: 1 }, // (1,1) facing EAST
    targetTerminal: { x: 5, y: 4 },
    generators: [
      { id: 'GEN-MAIN', x: 5, y: 4, isActive: false },
    ],
    walls: [
      // Outer borders
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 },
      // Step Pattern walls
      { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 },
      { x: 2, y: 3 }, { x: 2, y: 4 },
      { x: 3, y: 1 }, { x: 3, y: 4 },
      { x: 4, y: 1 }, { x: 4, y: 2 },
    ],
    allowedBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'LOOP'],
    maxEfficiencyBlocks: 6, // 3 stars
    midEfficiencyBlocks: 9, // 2 stars
    maxRecommendedBlocks: 8,
  },
  {
    id: 3,
    title: 'SEKTOR 03: CORE OVERRIDE',
    subtitle: 'Kondisi, Prosedur & Dekomposisi',
    conceptFocus: 'Conditionals & Decomposition',
    story:
      'NEXUS CORE terkunci rapat. Ambil kunci akses, hidupkan sakelar bypass pintu, dan aktifkan reaktor daya sebelum mengakses terminal utama.',
    hint:
      'Pecah misi menjadi sub-tugas: buat prosedur untuk mengambil kunci dan menghidupkan sakelar. Gunakan blok JIKA untuk memastikan kunci sudah ada sebelum mendekati pintu.',
    gridSize: { width: 8, height: 7 },
    robotStart: { x: 1, y: 5, dir: 0 }, // (1,5) facing NORTH
    targetTerminal: { x: 6, y: 1 },
    keys: [
      { id: 'KEY-ALPHA', x: 1, y: 1, isCollected: false },
    ],
    switches: [
      { id: 'SW-POWER', x: 4, y: 5, isOn: false, targetsDoorId: 'DOOR-MAIN' },
    ],
    generators: [
      { id: 'GEN-CORE', x: 6, y: 5, isActive: false },
    ],
    doors: [
      { id: 'DOOR-MAIN', x: 6, y: 3, isOpen: false, requiredKeyId: 'KEY-ALPHA', connectedSwitchId: 'SW-POWER' },
    ],
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 },
      { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 },
      { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 },
      { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 },
      { x: 7, y: 3 },
    ],
    allowedBlocks: [
      'MOVE_FORWARD',
      'TURN_LEFT',
      'TURN_RIGHT',
      'PICK_KEY',
      'ACTIVATE_SWITCH',
      'LOOP',
      'IF',
      'CALL_PROC',
    ],
    allowProcedures: true,
    maxEfficiencyBlocks: 14, // 3 stars
    midEfficiencyBlocks: 22, // 2 stars
    maxRecommendedBlocks: 20,
  },
];
