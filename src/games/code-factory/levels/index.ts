// CODE FACTORY — Levels Registry

import type { OrderData, ProgramBlock } from '../engine/types';
import { LEVEL_1_ORDERS, LEVEL_1_REFERENCES } from './level1';
import { LEVEL_2_ORDERS, LEVEL_2_REFERENCES } from './level2';
import { LEVEL_3_ORDERS, LEVEL_3_REFERENCES, checkLevel33BugsFixed } from './level3';

export { LEVEL_1_ORDERS, LEVEL_2_ORDERS, LEVEL_3_ORDERS, checkLevel33BugsFixed };

export const ALL_ORDERS: OrderData[] = [
  ...LEVEL_1_ORDERS,
  ...LEVEL_2_ORDERS,
  ...LEVEL_3_ORDERS,
];

export const ALL_REFERENCES: Record<string, ProgramBlock[]> = {
  ...LEVEL_1_REFERENCES,
  ...LEVEL_2_REFERENCES,
  ...LEVEL_3_REFERENCES,
};

export function getOrderById(id: string): OrderData | undefined {
  return ALL_ORDERS.find((o) => o.id === id);
}

export function getOrdersForLevel(level: 1 | 2 | 3): OrderData[] {
  return ALL_ORDERS.filter((o) => o.levelNumber === level);
}

export function getReferenceSolution(id: string): ProgramBlock[] | undefined {
  return ALL_REFERENCES[id];
}
