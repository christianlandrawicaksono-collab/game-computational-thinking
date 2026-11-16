// CODE FACTORY — Level 3: Smart Factory
// Focus: Condition, Procedure, Debugging, Optimization

import type { OrderData, ProgramBlock } from '../engine/types';

export const LEVEL_3_ORDERS: OrderData[] = [
  {
    id: '3.1',
    levelNumber: 3,
    orderNumber: 1,
    name: 'Penyortiran Warna',
    description: 'Enam item dengan warna acak masuk ke conveyor belt. Arahkan item ke Jalur A (Merah), Jalur B (Biru), dan Jalur C (Hijau).',
    initialItems: [
      { material: 'kayu', color: 'merah' },
      { material: 'kayu', color: 'biru' },
      { material: 'kayu', color: 'hijau' },
      { material: 'kayu', color: 'biru' },
      { material: 'kayu', color: 'merah' },
      { material: 'kayu', color: 'hijau' },
    ],
    targetSpecs: [],
    targetLanes: {
      A: { material: 'kayu', color: 'merah' },
      B: { material: 'kayu', color: 'biru' },
      C: { material: 'kayu', color: 'hijau' },
    },
    allowedMachines: ['SORTING'],
    allowedBlocks: ['SORTING', 'REPEAT', 'IF'],
    requiredDecompositionMachines: ['SORTING'],
    parInstructions: 8,
    parResources: 12,
    parTimeTicks: 6,
    hints: [
      'Gunakan blok percabangan IF untuk memeriksa warna item aktif sebelum melakukan SORTING.',
      'Susun struktur ELSE IF: jika warna merah kirim ke A, selain itu periksa jika warna biru kirim ke B, selain itu kirim ke C.',
      'Bungkus struktur IF bertingkat tersebut di dalam REPEAT 6 kali.',
    ],
    ctConceptExplanation:
      'Logika Percabangan (Conditionals - IF/ELSE) memungkinkan sistem mengambil keputusan dinamis berdasarkan karakteristik objek yang sedang diproses saat runtime.',
  },
  {
    id: '3.2',
    levelNumber: 3,
    orderNumber: 2,
    name: 'Jadwal Tiga Pelanggan',
    description: 'Selesaikan 9 item kayu polos dalam tiga batch pesanan pelanggan menggunakan Prosedur modular P1.',
    initialItems: [
      // Batch 1 (3 items)
      { material: 'kayu', color: 'polos' },
      { material: 'kayu', color: 'polos' },
      { material: 'kayu', color: 'polos' },
      // Batch 2 (2 items)
      { material: 'kayu', color: 'polos' },
      { material: 'kayu', color: 'polos' },
      // Batch 3 (4 items)
      { material: 'kayu', color: 'polos' },
      { material: 'kayu', color: 'polos' },
      { material: 'kayu', color: 'polos' },
      { material: 'kayu', color: 'polos' },
    ],
    targetSpecs: [
      // Batch 1: cut, painted biru, packed
      { material: 'kayu', cut: true, color: 'biru', packed: true },
      { material: 'kayu', cut: true, color: 'biru', packed: true },
      { material: 'kayu', cut: true, color: 'biru', packed: true },
      // Batch 2: cut, painted biru, assembled, packed
      { material: 'kayu', cut: true, color: 'biru', assembled: true, packed: true },
      { material: 'kayu', cut: true, color: 'biru', assembled: true, packed: true },
      // Batch 3: cut, painted biru, packed
      { material: 'kayu', cut: true, color: 'biru', packed: true },
      { material: 'kayu', cut: true, color: 'biru', packed: true },
      { material: 'kayu', cut: true, color: 'biru', packed: true },
      { material: 'kayu', cut: true, color: 'biru', packed: true },
    ],
    allowedMachines: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'],
    allowedBlocks: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'REPEAT', 'PROCEDURE', 'CALL'],
    requiredDecompositionMachines: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING'],
    parInstructions: 12,
    parResources: 40,
    parTimeTicks: 60,
    hints: [
      'Ketiga batch memiliki kesamaan: semuanya memerlukan CUTTING dan PAINTING(biru). Kelompokkan kedua langkah ini ke dalam Prosedur P1.',
      'Batch 1 dan 3 hanya butuh CALL P1 lalu PACKAGING. Batch 2 membutuhkan CALL P1 lalu ASSEMBLY lalu PACKAGING.',
      'Susun: PROCEDURE P1 { CUTTING, PAINTING(biru) }, lalu REPEAT 3 { CALL P1, PACKAGING }, REPEAT 2 { CALL P1, ASSEMBLY, PACKAGING }, REPEAT 4 { CALL P1, PACKAGING }.',
    ],
    ctConceptExplanation:
      'Dekomposisi & Prosedur (Procedures & Subroutines) memungkinkan kita mengemas kumpulan instruksi ke dalam satu fungsi yang dapat digunakan kembali berkali-kali tanpa redundansi kode.',
  },
  {
    id: '3.3',
    levelNumber: 3,
    orderNumber: 3,
    name: 'Pabrik Kacau (Debugging)',
    description: 'Program jalur produksi mengalami 5 bug fatal dari manajer sebelumnya! Lacak error dengan STEP dan log eksekusi, lalu perbaiki bug tersebut.',
    initialItems: [
      { material: 'kayu', color: 'merah' },
      { material: 'kayu', color: 'biru' },
      { material: 'kayu', color: 'merah' },
      { material: 'kayu', color: 'hijau' },
      { material: 'kayu', color: 'biru' },
      { material: 'kayu', color: 'merah' },
    ],
    targetSpecs: [],
    targetLanes: {
      A: { material: 'kayu', color: 'merah', cut: true },
      B: { material: 'kayu', color: 'biru', cut: true, assembled: true },
      C: { material: 'kayu', color: 'hijau', cut: false, assembled: false, packed: false },
    },
    allowedMachines: ['CUTTING', 'PAINTING', 'ASSEMBLY', 'PACKAGING', 'SORTING'],
    allowedBlocks: ['CUTTING', 'ASSEMBLY', 'SORTING', 'REPEAT', 'IF', 'PROCEDURE', 'CALL'],
    requiredDecompositionMachines: ['CUTTING', 'ASSEMBLY', 'SORTING'],
    parInstructions: 12,
    parResources: 21,
    parTimeTicks: 22,
    initialProgram: [
      {
        id: 'buggy-proc-p1',
        type: 'PROCEDURE',
        procedureName: 'P1',
        enabled: true,
        children: [
          { id: 'bp-1', type: 'ASSEMBLY', enabled: true }, // BUG 1: Urutan terbalik (Assembly sebelum Cutting)
          { id: 'bp-2', type: 'CUTTING', enabled: true },
        ],
      },
      {
        id: 'buggy-repeat',
        type: 'REPEAT',
        repeatCount: 8, // BUG 4: Berulang 8 kali padahal item hanya 6 (menyebabkan Bahan Habis)
        enabled: true,
        children: [
          {
            id: 'buggy-if-merah',
            type: 'IF',
            condition: { field: 'warna', operator: '==', value: 'merah' },
            enabled: true,
            children: [
              { id: 'bp-3', type: 'CUTTING', enabled: false }, // BUG 3: Blok CUTTING dinonaktifkan
              { id: 'bp-4', type: 'SORTING', laneParam: 'A', enabled: true },
            ],
            elseChildren: [
              {
                id: 'buggy-if-hijau',
                type: 'IF',
                condition: { field: 'warna', operator: '==', value: 'hijau' }, // BUG 2: Kondisi keliru (seharusnya cek biru dulu)
                enabled: true,
                children: [
                  { id: 'bp-5', type: 'SORTING', laneParam: 'B', enabled: true }, // BUG 5: Prosedur P1 tidak pernah dipanggil
                ],
                elseChildren: [
                  { id: 'bp-6', type: 'SORTING', laneParam: 'C', enabled: true },
                ],
              },
            ],
          },
        ],
      },
    ],
    hints: [
      'Jalankan program awal menggunakan tombol STEP untuk mengamati baris yang memicu error pertama kali.',
      'Periksa urutan di Prosedur P1 (apakah bisa merakit sebelum dipotong?) dan periksa nilai REPEAT (berapa jumlah item sebenarnya di antrean?).',
      'Periksa juga toggle aktif pada blok CUTTING untuk merah, dan pastikan item biru memanggil Prosedur P1 sebelum disortir ke Jalur B.',
    ],
    ctConceptExplanation:
      'Pelacakan & Perbaikan Bug (Debugging & Tracing) adalah keterampilan komputasional krusial untuk menemukan deviasi antara perilaku aktual dan perilaku yang diharapkan dari suatu sistem.',
  },
];

export const LEVEL_3_REFERENCES: Record<string, ProgramBlock[]> = {
  '3.1': [
    {
      id: 'rep1',
      type: 'REPEAT',
      repeatCount: 6,
      enabled: true,
      children: [
        {
          id: 'if1',
          type: 'IF',
          condition: { field: 'warna', operator: '==', value: 'merah' },
          enabled: true,
          children: [
            { id: 'sA', type: 'SORTING', laneParam: 'A', enabled: true },
          ],
          elseChildren: [
            {
              id: 'if2',
              type: 'IF',
              condition: { field: 'warna', operator: '==', value: 'biru' },
              enabled: true,
              children: [
                { id: 'sB', type: 'SORTING', laneParam: 'B', enabled: true },
              ],
              elseChildren: [
                { id: 'sC', type: 'SORTING', laneParam: 'C', enabled: true },
              ],
            },
          ],
        },
      ],
    },
  ],
  '3.2': [
    {
      id: 'proc1',
      type: 'PROCEDURE',
      procedureName: 'P1',
      enabled: true,
      children: [
        { id: 'm1', type: 'CUTTING', enabled: true },
        { id: 'm2', type: 'PAINTING', colorParam: 'biru', enabled: true },
      ],
    },
    {
      id: 'rep1',
      type: 'REPEAT',
      repeatCount: 3,
      enabled: true,
      children: [
        { id: 'c1', type: 'CALL', procedureName: 'P1', enabled: true },
        { id: 'p1', type: 'PACKAGING', enabled: true },
      ],
    },
    {
      id: 'rep2',
      type: 'REPEAT',
      repeatCount: 2,
      enabled: true,
      children: [
        { id: 'c2', type: 'CALL', procedureName: 'P1', enabled: true },
        { id: 'a1', type: 'ASSEMBLY', enabled: true },
        { id: 'p2', type: 'PACKAGING', enabled: true },
      ],
    },
    {
      id: 'rep3',
      type: 'REPEAT',
      repeatCount: 4,
      enabled: true,
      children: [
        { id: 'c3', type: 'CALL', procedureName: 'P1', enabled: true },
        { id: 'p3', type: 'PACKAGING', enabled: true },
      ],
    },
  ],
  '3.3': [
    {
      id: 'proc-p1',
      type: 'PROCEDURE',
      procedureName: 'P1',
      enabled: true,
      children: [
        { id: 'ref-c', type: 'CUTTING', enabled: true },
        { id: 'ref-a', type: 'ASSEMBLY', enabled: true },
      ],
    },
    {
      id: 'rep-fixed',
      type: 'REPEAT',
      repeatCount: 6,
      enabled: true,
      children: [
        {
          id: 'if-merah',
          type: 'IF',
          condition: { field: 'warna', operator: '==', value: 'merah' },
          enabled: true,
          children: [
            { id: 'cut-m', type: 'CUTTING', enabled: true },
            { id: 'sort-a', type: 'SORTING', laneParam: 'A', enabled: true },
          ],
          elseChildren: [
            {
              id: 'if-biru',
              type: 'IF',
              condition: { field: 'warna', operator: '==', value: 'biru' },
              enabled: true,
              children: [
                { id: 'call-p1', type: 'CALL', procedureName: 'P1', enabled: true },
                { id: 'sort-b', type: 'SORTING', laneParam: 'B', enabled: true },
              ],
              elseChildren: [
                { id: 'sort-c', type: 'SORTING', laneParam: 'C', enabled: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Check how many of the 5 bugs have been fixed in Level 3.3.
 */
export function checkLevel33BugsFixed(program: ProgramBlock[]): { fixedCount: number; bugDetails: { id: number; name: string; fixed: boolean }[] } {
  // Bug 1: P1 has CUTTING before ASSEMBLY
  const p1 = program.find((b) => b.type === 'PROCEDURE' && b.procedureName === 'P1');
  let bug1Fixed = false;
  if (p1 && p1.children && p1.children.length >= 2) {
    const cuttingIdx = p1.children.findIndex((c) => c.type === 'CUTTING' && c.enabled);
    const assemblyIdx = p1.children.findIndex((c) => c.type === 'ASSEMBLY' && c.enabled);
    if (cuttingIdx !== -1 && assemblyIdx !== -1 && cuttingIdx < assemblyIdx) {
      bug1Fixed = true;
    }
  }

  // Bug 4: Outer REPEAT is 6 (not 8)
  const repeatBlock = program.find((b) => b.type === 'REPEAT');
  const bug4Fixed = repeatBlock?.repeatCount === 6;

  // Let's traverse tree for Bug 2, 3, 5
  let bug2Fixed = false; // condition checks warna == biru
  let bug3Fixed = false; // cutting in red branch is enabled
  let bug5Fixed = false; // P1 is called in blue branch

  function walk(blocks?: ProgramBlock[]) {
    if (!blocks) return;
    for (const b of blocks) {
      if (b.type === 'IF') {
        if (b.condition?.field === 'warna' && b.condition?.value === 'biru') {
          bug2Fixed = true;
          // Check if children contain CALL P1
          if (b.children?.some((c) => c.type === 'CALL' && c.procedureName === 'P1' && c.enabled)) {
            bug5Fixed = true;
          }
        }
        if (b.condition?.field === 'warna' && b.condition?.value === 'merah') {
          if (b.children?.some((c) => c.type === 'CUTTING' && c.enabled)) {
            bug3Fixed = true;
          }
        }
      }
      walk(b.children);
      walk(b.elseChildren);
    }
  }

  walk(program);

  const bugDetails = [
    { id: 1, name: 'Urutan Prosedur P1 Terbalik (Harus CUTTING sebelum ASSEMBLY)', fixed: bug1Fixed },
    { id: 2, name: 'Kondisi Logika Keliru (Cabang kedua harus memeriksa warna Biru)', fixed: bug2Fixed },
    { id: 3, name: 'Mesin CUTTING Dinonaktifkan pada Cabang Merah', fixed: bug3Fixed },
    { id: 4, name: 'Jumlah Perulangan Berlebih (Harus 6 kali sesuai jumlah item)', fixed: bug4Fixed },
    { id: 5, name: 'Prosedur P1 Tidak Dipanggil pada Jalur Biru', fixed: bug5Fixed },
  ];

  const fixedCount = bugDetails.filter((b) => b.fixed).length;

  return { fixedCount, bugDetails };
}
