export type Direction = keyof typeof DIRECTION;

export const DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;
