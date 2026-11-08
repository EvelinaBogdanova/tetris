import type { PlayerState } from '@/hooks/usePlayer';

export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;
export type Cell = [number | string, string];
export type Stage = Cell[][];

export function createStage(): Stage {
  return Array.from({ length: STAGE_HEIGHT }, () =>
    Array.from({ length: STAGE_WIDTH }, () => [0, 'clear'] as Cell),
  );
}

export function checkCollision(
  player: Pick<PlayerState, 'pos' | 'tetromino'>,
  stage: Stage,
  offset: { x: number; y: number },
): boolean {
  return player.tetromino.some((row, y) => row.some((value, x) => {
    if (value === 0) return false;
    const targetX = x + player.pos.x + offset.x;
    const targetY = y + player.pos.y + offset.y;
    return targetX < 0 || targetX >= STAGE_WIDTH || targetY >= STAGE_HEIGHT ||
      (targetY >= 0 && stage[targetY]?.[targetX]?.[0] !== 0);
  }));
}
