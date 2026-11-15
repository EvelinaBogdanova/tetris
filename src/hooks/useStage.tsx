import { createStage, type Cell, type Stage } from '@/utils/GameHelpers';
import { useEffect, useReducer } from 'react';
import type { PlayerState } from './usePlayer';

type StageState = {
    stage: Stage;
    rowsCleared: number;
};

type StageAction =
    | { type: 'update'; player: PlayerState }
    | { type: 'reset'; stage: Stage };

const initialState: StageState = {
    stage: createStage(),
    rowsCleared: 0,
};

function stageReducer(state: StageState, action: StageAction): StageState {
    if (action.type === 'reset') {
        return { stage: action.stage, rowsCleared: 0 };
    }

    const { player } = action;
    const nextStage = state.stage.map(row =>
        row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] as Cell : cell)),
    );

    player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 0) return;

            const targetY = y + player.pos.y;
            const targetX = x + player.pos.x;
            if (nextStage[targetY]?.[targetX]) {
                nextStage[targetY][targetX] = [value, player.collided ? 'merged' : 'clear'];
            }
        });
    });

    if (!player.collided) {
        return { ...state, stage: nextStage };
    }

    let clearedNow = 0;
    const sweptStage = nextStage.reduce<Stage>((rows, row) => {
        if (row.every(cell => cell[0] !== 0)) {
            clearedNow += 1;
            rows.unshift(Array.from({ length: row.length }, () => [0, 'clear'] as Cell));
        } else {
            rows.push(row);
        }
        return rows;
    }, []);

    return {
        stage: sweptStage,
        rowsCleared: state.rowsCleared + clearedNow,
    };
}

export const useStage = (player: PlayerState, resetPlayer: () => void) => {
    const [state, dispatch] = useReducer(stageReducer, initialState);

    useEffect(() => {
        dispatch({ type: 'update', player });
        if (player.collided) resetPlayer();
    }, [player, resetPlayer]);

    const setStage = (stage: Stage) => dispatch({ type: 'reset', stage });

    return [state.stage, setStage, state.rowsCleared] as const;
};
