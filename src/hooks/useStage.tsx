import { createStage } from '@/utils/GameHelpers';
import { useEffect, useState } from 'react';
import { PlayerState } from './usePlayer';

type Cell = [number | string, string];
type Stage = Cell[][];

export const useStage = (player: PlayerState, resetPlayer: () => void) => {
    const [stage, setStage] = useState<Stage>(createStage() as Stage);
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        setRowsCleared(0);
        
        const sweepRows = (newStage: Stage): Stage => 
            newStage.reduce<Stage>((acc, row) => {
                if (row.every(cell => cell[0] !== 0)) {
                    setRowsCleared(prev => prev + 1);
                    acc.unshift(new Array(newStage[0].length).fill([0, 'clear']) as Cell[]);
                    return acc;
                }
                acc.push(row);
                return acc;
            }, []);

            const updateStage = (prevStage: Stage): Stage => {
            const newStage: Stage = prevStage.map(row => 
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] as Cell : cell)));

            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        const targetY = y + player.pos.y;
                        const targetX = x + player.pos.x;
                        if (newStage[targetY] && newStage[targetY][targetX]) {
                            newStage[targetY][targetX] = [value, player.collided ? 'merged' : 'clear'];
                        }
                    }  
                });
            });
            if (player.collided) {
                resetPlayer();
                return sweepRows(newStage);
            }
            return newStage;
        };
        setStage(prev => updateStage(prev));
    }, [player, resetPlayer]);

    return [stage, setStage, rowsCleared] as const;
};
