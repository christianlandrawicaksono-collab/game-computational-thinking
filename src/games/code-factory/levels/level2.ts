// CODE FACTORY — Level 2: Automated Production
// Focus: Pattern Recognition, Loop, Algorithm

import type { OrderData, ProgramBlock } from '../engine/types';

export const LEVEL_2_ORDERS: OrderData[] = [
  {
    id: '2.1',
    levelNumber: 2,
    orderNumber: 1,
    name: 'Papan Kayu ×5',
    description: 'Pabrik menerima pesanan massal 5 papan kayu. Gunakan blok REPEAT untuk mengotomatisasi pola pemrosesan.',
    initialItems: [
      { material: 'kayu', color: 'polos' },
      { material: 'kayu', color: 'polos' },
      { material: 'kayu', color: 'polos' },
      { material: 'kayu', color: 'polos' },
      { material: 'kayu', color: 'polos' },
    ],
    targetSpecs: [
      { material: 'kayu', cut: true, packed: true },
    ],
    allowedMachines: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'],
    allowedBlocks: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING', 'REPEAT'],
    requiredDecompositionMachines: ['CUTTING', 'PACKAGING'],
    parInstructions: 3,
    parResources: 15,
    parTimeTicks: 15,
    hints: [
      'Daripada menulis CUTTING dan PACKAGING berulang 5 kali, kenali pola perulangannya.',
      'Gunakan blok REPEAT dengan parameter jumlah 5.',
      'Susunan program optimal: REPEAT 5 kali { CUTTING, PACKAGING }.',
    ],
    ctConceptExplanation:
      'Pengenalan Pola (Pattern Recognition) memungkinkan kita mengidentifikasi instruksi berulang dan mengabstraksikannya menggunakan Perulangan (Loop) agar kode ringkas dan mudah dipelihara.',
  },
  {
    id: '2.2',
    levelNumber: 2,
    orderNumber: 2,
    name: 'Tray Plastik Hijau ×6',
    description: 'Pesanan wadah plastik hijau sebanyak 6 unit. Seluruh tray harus dipotong, dicat hijau, dan dikemas.',
    initialItems: [
      { material: 'plastik', color: 'polos' },
      { material: 'plastik', color: 'polos' },
      { material: 'plastik', color: 'polos' },
      { material: 'plastik', color: 'polos' },
      { material: 'plastik', color: 'polos' },
      { material: 'plastik', color: 'polos' },
    ],
    targetSpecs: [
      { material: 'plastik', cut: true, color: 'hijau', packed: true },
    ],
    allowedMachines: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'],
    allowedBlocks: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING', 'REPEAT'],
    requiredDecompositionMachines: ['CUTTING', 'PAINTING', 'PACKAGING'],
    parInstructions: 4,
    parResources: 24,
    parTimeTicks: 36,
    hints: [
      'Ada 6 item plastik di conveyor belt. Pola tiap item: potong, cat hijau, lalu kemas.',
      'Pastikan jumlah perulangan tepat 6. Jika kurang, sisa item tertinggal; jika berlebih, terjadi runtime error bahan habis.',
      'Susunan program: REPEAT 6 kali { CUTTING, PAINTING(hijau), PACKAGING }.',
    ],
    ctConceptExplanation:
      'Perulangan Terkendali (Bounded Loops) mengeksekusi blok kode sebanyak N kali sesuai jumlah data target yang tersedia.',
  },
  {
    id: '2.3',
    levelNumber: 2,
    orderNumber: 3,
    name: 'Rangka Logam Biru ×8',
    description: 'Produksi batch besar: 8 unit rangka logam biru dengan perakitan komponen lengkap.',
    initialItems: [
      { material: 'logam', color: 'polos' },
      { material: 'logam', color: 'polos' },
      { material: 'logam', color: 'polos' },
      { material: 'logam', color: 'polos' },
      { material: 'logam', color: 'polos' },
      { material: 'logam', color: 'polos' },
      { material: 'logam', color: 'polos' },
      { material: 'logam', color: 'polos' },
    ],
    targetSpecs: [
      { material: 'logam', cut: true, color: 'biru', assembled: true, packed: true },
    ],
    allowedMachines: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'],
    allowedBlocks: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING', 'REPEAT'],
    requiredDecompositionMachines: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING'],
    parInstructions: 5,
    parResources: 48,
    parTimeTicks: 72,
    hints: [
      'Terdapat 8 bahan logam polos. Setiap item melewati 4 mesin: CUTTING, PAINTING(biru), ASSEMBLY, dan PACKAGING.',
      'Masukkan keempat operasi mesin tersebut ke dalam satu blok REPEAT 8 kali.',
      'Susunan program: REPEAT 8 { CUTTING, PAINTING(biru), ASSEMBLY, PACKAGING }.',
    ],
    ctConceptExplanation:
      'Optimasi Efisiensi (Optimization) mengurangi kompleksitas penulisan instruksi manual dari puluhan baris menjadi satu struktur loop yang elegan.',
  },
];

export const LEVEL_2_REFERENCES: Record<string, ProgramBlock[]> = {
  '2.1': [
    {
      id: 'rep1',
      type: 'REPEAT',
      repeatCount: 5,
      enabled: true,
      children: [
        { id: 'b1', type: 'CUTTING', enabled: true },
        { id: 'b2', type: 'PACKAGING', enabled: true },
      ],
    },
  ],
  '2.2': [
    {
      id: 'rep1',
      type: 'REPEAT',
      repeatCount: 6,
      enabled: true,
      children: [
        { id: 'b1', type: 'CUTTING', enabled: true },
        { id: 'b2', type: 'PAINTING', colorParam: 'hijau', enabled: true },
        { id: 'b3', type: 'PACKAGING', enabled: true },
      ],
    },
  ],
  '2.3': [
    {
      id: 'rep1',
      type: 'REPEAT',
      repeatCount: 8,
      enabled: true,
      children: [
        { id: 'b1', type: 'CUTTING', enabled: true },
        { id: 'b2', type: 'PAINTING', colorParam: 'biru', enabled: true },
        { id: 'b3', type: 'ASSEMBLY', enabled: true },
        { id: 'b4', type: 'PACKAGING', enabled: true },
      ],
    },
  ],
};
