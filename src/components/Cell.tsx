import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TETROMINOS } from '../constants/tetrominos';

interface CellProps {
  type: string | number;
}

const { width } = Dimensions.get('window');
const CELL_SIZE = (width * 0.7) / 10; 

const Cell = ({ type }: CellProps) => {
  const piece = TETROMINOS[type as keyof typeof TETROMINOS] || TETROMINOS[0];
  const isNotEmpty = type !== 0;

  if (!isNotEmpty) {
    return <View style={styles.emptyCell} />;
  }

  const baseColor = `rgb(${piece.color})`;
  const highlightColor = `rgba(${piece.color}, 0.5)`;

  return (
    <View style={[styles.cellContainer, { borderColor: baseColor }]}>
      <LinearGradient
        colors={[baseColor, highlightColor, baseColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.innerReflex} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1.5,
    borderRadius: 4,
    margin: 0.5,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerReflex: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '30%',
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  emptyCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: '#151515',
    margin: 0.5,
  }
});

export default React.memo(Cell);
