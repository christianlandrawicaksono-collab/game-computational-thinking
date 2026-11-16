import type { CommandBlock, ConditionType, ProcedureDef } from '../types/game';

function mapConditionToPython(cond: ConditionType): string {
  switch (cond) {
    case 'HAS_KEY':
      return 'robot.memiliki_kunci()';
    case 'WALL_AHEAD':
      return 'robot.depan_terhalang_dinding()';
    case 'AT_GENERATOR':
      return 'robot.di_depan_generator()';
    case 'AT_SWITCH':
      return 'robot.di_depan_sakelar()';
    case 'DOOR_AHEAD_LOCKED':
      return 'robot.pintu_depan_terkunci()';
    default:
      return 'True';
  }
}

function generateBlockLines(
  blocks: CommandBlock[],
  indent: number,
  proceduresMap: Record<string, ProcedureDef>
): string[] {
  const pad = '    '.repeat(indent);
  const lines: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'MOVE_FORWARD':
        lines.push(`${pad}robot.maju()`);
        break;
      case 'TURN_LEFT':
        lines.push(`${pad}robot.belok_kiri()`);
        break;
      case 'TURN_RIGHT':
        lines.push(`${pad}robot.belok_kanan()`);
        break;
      case 'PICK_KEY':
        lines.push(`${pad}robot.ambil_kunci()`);
        break;
      case 'ACTIVATE_SWITCH':
        lines.push(`${pad}robot.aktifkan_sakelar()`);
        break;
      case 'LOOP': {
        const n = block.iterations || 3;
        lines.push(`${pad}for step in range(${n}):`);
        if (block.children && block.children.length > 0) {
          lines.push(
            ...generateBlockLines(block.children, indent + 1, proceduresMap)
          );
        } else {
          lines.push(`${pad}    pass  # Loop kosong`);
        }
        break;
      }
      case 'IF': {
        const cond = mapConditionToPython(block.condition || 'HAS_KEY');
        lines.push(`${pad}if ${cond}:`);
        if (block.children && block.children.length > 0) {
          lines.push(
            ...generateBlockLines(block.children, indent + 1, proceduresMap)
          );
        } else {
          lines.push(`${pad}    pass`);
        }

        if (block.elseChildren && block.elseChildren.length > 0) {
          lines.push(`${pad}else:`);
          lines.push(
            ...generateBlockLines(block.elseChildren, indent + 1, proceduresMap)
          );
        }
        break;
      }
      case 'CALL_PROC': {
        const procName =
          (block.procedureId && proceduresMap[block.procedureId]?.name) ||
          'prosedur_khusus';
        const pyProcName = procName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
        lines.push(`${pad}${pyProcName}()`);
        break;
      }
    }
  }

  return lines;
}

export function generatePythonCode(
  program: CommandBlock[],
  procedures: ProcedureDef[] = []
): string {
  const procsMap: Record<string, ProcedureDef> = {};
  procedures.forEach((p) => {
    procsMap[p.id] = p;
  });

  const output: string[] = [
    '# ==========================================',
    '# LOGIC QUEST: PROTOKOL KENDALI UNIT-07',
    '# Translasi Real-Time: Visual Block -> Python',
    '# ==========================================',
    '',
    'from nexus_core import robot',
    '',
  ];

  // Generate procedure definitions
  const activeProcs = procedures.filter((p) => p.blocks.length > 0);
  if (activeProcs.length > 0) {
    output.push('# --- DEFINISI PROSEDUR MODULAR ---');
    for (const proc of activeProcs) {
      const pyName = proc.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      output.push(`def ${pyName}():`);
      const bodyLines = generateBlockLines(proc.blocks, 1, procsMap);
      if (bodyLines.length > 0) {
        output.push(...bodyLines);
      } else {
        output.push('    pass');
      }
      output.push('');
    }
  }

  // Generate main program
  output.push('# --- PROGRAM UTAMA ---');
  if (program.length === 0) {
    output.push('# (Program utama masih kosong)');
    output.push('pass');
  } else {
    output.push(...generateBlockLines(program, 0, procsMap));
  }

  return output.join('\n');
}
