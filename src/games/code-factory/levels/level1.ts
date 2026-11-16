// CODE FACTORY — Level 1: Production Setup
// Focus: Decomposition, Sequence, Algorithm

import type { OrderData, ProgramBlock } from '../engine/types';

export const LEVEL_1_ORDERS: OrderData[] = [
  {
    id: '1.1',
    levelNumber: 1,
    orderNumber: 1,
    name: 'Papan Kayu Kemas',
    description: 'Produksi 1 papan kayu terpotong dan dikemas rapi untuk pelanggan pertama pabrik.',
    initialItems: [
      { material: 'kayu', color: 'polos' },
    ],
    targetSpecs: [
      { material: 'kayu', cut: true, packed: true },
    ],
    allowedMachines: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'],
    allowedBlocks: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'],
    requiredDecompositionMachines: ['CUTTING', 'PACKAGING'],
    parInstructions: 2,
    parResources: 3,
    parTimeTicks: 3,
    hints: [
      'Pecah pesanan ini menjadi dua tahap: pemotongan balok mentah lalu pengemasan.',
      'Perhatikan urutan stage mesin: CUTTING (stage 1) harus dijalankan sebelum PACKAGING (stage 4).',
      'Susunan program lengkap: CUTTING kemudian PACKAGING. Mesin lain seperti PAINTING atau ASSEMBLY tidak diperlukan.',
    ],
    ctConceptExplanation:
      'Dekomposisi (Decomposition) membantu kita memecah masalah besar (membuat pesanan jadi) menjadi sub-tugas yang terisolasi dan teratur.',
  },
  {
    id: '1.2',
    levelNumber: 1,
    orderNumber: 2,
    name: 'Mainan Kayu Biru',
    description: 'Pelanggan memesan mainan kayu berwarna biru. Jangan lupa potong sebelum dicat!',
    initialItems: [
      { material: 'kayu', color: 'polos' },
    ],
    targetSpecs: [
      { material: 'kayu', cut: true, color: 'biru', packed: true },
    ],
    allowedMachines: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'],
    allowedBlocks: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'],
    requiredDecompositionMachines: ['CUTTING', 'PAINTING', 'PACKAGING'],
    parInstructions: 3,
    parResources: 4,
    parTimeTicks: 6,
    hints: [
      'Identifikasi tiga tahap kerja: potong bahan kayu, beri lapisan warna biru, lalu kemas.',
      'Perhatikan aturan stage: CUTTING (stage 1) -> PAINTING(biru) (stage 2) -> PACKAGING (stage 4).',
      'Urutan instruksi: CUTTING -> PAINTING dengan parameter warna biru -> PACKAGING.',
    ],
    ctConceptExplanation:
      'Urutan (Sequence) dalam algoritma memastikan setiap langkah prasyarat selesai sebelum langkah berikutnya dijalankan.',
  },
  {
    id: '1.3',
    levelNumber: 1,
    orderNumber: 3,
    name: 'Rak Logam Merah',
    description: 'Pesanan furnitur industri dari logam. Membutuhkan pemotongan, pewarnaan merah, dan perakitan komponen.',
    initialItems: [
      { material: 'logam', color: 'polos' },
    ],
    targetSpecs: [
      { material: 'logam', cut: true, color: 'merah', assembled: true, packed: true },
    ],
    allowedMachines: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'],
    allowedBlocks: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'],
    requiredDecompositionMachines: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING'],
    parInstructions: 4,
    parResources: 6,
    parTimeTicks: 9,
    hints: [
      'Ada 4 tahap yang harus dilewati: potong logam, cat merah, pasang komponen braket (assembly), lalu kemas.',
      'ASSEMBLY akan mengambil 1 komponen tambahan dari gudang. Pastikan item sudah dicat sebelum dirakit.',
      'Susun program: CUTTING -> PAINTING(merah) -> ASSEMBLY -> PACKAGING.',
    ],
    ctConceptExplanation:
      'Perancangan Algoritma (Algorithm Design) menggabungkan pemahaman dekomposisi dan urutan untuk menyelesaikan alur produksi multi-tahap secara sempurna.',
  },
];

export const LEVEL_1_REFERENCES: Record<string, ProgramBlock[]> = {
  '1.1': [
    { id: 'b1', type: 'CUTTING', enabled: true },
    { id: 'b2', type: 'PACKAGING', enabled: true },
  ],
  '1.2': [
    { id: 'b1', type: 'CUTTING', enabled: true },
    { id: 'b2', type: 'PAINTING', colorParam: 'biru', enabled: true },
    { id: 'b3', type: 'PACKAGING', enabled: true },
  ],
  '1.3': [
    { id: 'b1', type: 'CUTTING', enabled: true },
    { id: 'b2', type: 'PAINTING', colorParam: 'merah', enabled: true },
    { id: 'b3', type: 'ASSEMBLY', enabled: true },
    { id: 'b4', type: 'PACKAGING', enabled: true },
  ],
};
