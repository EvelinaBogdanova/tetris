import { StyleSheet, View } from 'react-native';
import type { Stage } from '@/utils/GameHelpers';

type BoardProps = {
  stage: Stage;
};

const COLORS: Record<number, string> = {
  0: '#080d12',
  1: '#00d4ff',
  2: '#ffb800',
  3: '#a855f7',
  4: '#ffe600',
  5: '#22c55e',
  6: '#3b82f6',
  7: '#ef4444',
};

export default function Board({ stage }: BoardProps) {
  return (
    <View style={styles.board}>
      {stage.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map(([value], columnIndex) => (
            <View
              key={`cell-${rowIndex}-${columnIndex}`}
              style={[styles.cell, { backgroundColor: COLORS[Number(value)] ?? COLORS[0] }]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: 'min(88vw, 360px)',
    maxWidth: '100%',
    aspectRatio: 12 / 20,
    overflow: 'hidden',
    borderRadius: 4,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    margin: 1,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#14212b',
  },
});
