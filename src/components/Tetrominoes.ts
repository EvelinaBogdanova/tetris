export type TetrominoShape = number[][];

const TETROMINOES: TetrominoShape[] = [
  [[0, 0, 0], [1, 1, 1], [0, 1, 0]], [[0, 2, 0], [0, 2, 0], [0, 2, 2]],
  [[0, 3, 0], [0, 3, 0], [3, 3, 0]], [[4, 4], [4, 4]],
  [[0, 5, 5], [5, 5, 0], [0, 0, 0]], [[0, 6, 0], [0, 6, 0], [0, 6, 0], [0, 6, 0]],
  [[7, 7, 0], [0, 7, 7], [0, 0, 0]],
];

export function randomTetromino(): { shape: TetrominoShape } {
  const shape = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  return { shape: shape.map((row) => [...row]) };
}
