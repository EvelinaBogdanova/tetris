import { checkCollision, STAGE_WIDTH } from '@/utils/GameHelpers';
import { useCallback, useState } from 'react';
import { randomTetromino, TetrominoShape } from '../components/Tetrominoes';

export interface PlayerState {
    pos: { x: number; y: number };
    tetromino: TetrominoShape;
    collided: boolean;
}

const rotateMatrix = (matrix: TetrominoShape): TetrominoShape => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = Array.from({ length: cols }, () => new Array(rows).fill(0));

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            rotated[x][rows - 1 - y] = matrix[y][x];
        }
    }
    return rotated as TetrominoShape;
};

export const usePlayer = () => {
    const [player, setPlayer] = useState<PlayerState>(() => ({
        pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
        tetromino: randomTetromino().shape,
        collided: false,
    }));

    const updatePlayerPos = useCallback(
        ({ x, y, collided, stage }: { x: number; y: number; collided: boolean; stage?: any[][] }) =>
            setPlayer(prev => {
                if (stage && (x !== 0 || y !== 0)) {
                    const futurePos = {
                        ...prev,
                        pos: { x: prev.pos.x + x, y: prev.pos.y + y },
                    };
                    const willCollide = checkCollision(futurePos, stage, { x: 0, y: 0 });
                    if (willCollide && !collided) {
                        return prev;
                    }
                }
                return {
                    ...prev,
                    pos: { x: prev.pos.x + x, y: prev.pos.y + y },
                    collided,
                };
            }),
        []
    );

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            tetromino: randomTetromino().shape,
            collided: false,
        });
    }, []);

    const playerRotate = useCallback((stage: any[][]) => {
        setPlayer(prev => {
            const clonedPlayer: PlayerState = {
                ...prev,
                tetromino: rotateMatrix(prev.tetromino),
                pos: { ...prev.pos },
            };

            let offset = 1;
            while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
                clonedPlayer.pos.x += offset;
                offset = -(offset + (offset > 0 ? 1 : -1));
                if (offset > clonedPlayer.tetromino[0].length) {
                    return prev; // повернуть не удалось, оставляем как было
                }
            }

            return clonedPlayer;
        });
    }, []);

    return { player, updatePlayerPos, resetPlayer, playerRotate };
};