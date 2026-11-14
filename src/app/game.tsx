import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, PanResponder } from 'react-native';
import Board from '@/components/Board';
import { checkCollision, createStage } from '@/utils/GameHelpers';
import { usePlayer } from '@/hooks/usePlayer';
import { useStage } from '@/hooks/useStage';
import { useInterval } from '../hooks/useInterval';

export default function Game() {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
  const [stage, setStage] = useStage(player, resetPlayer);
  const playerRef = useRef(player);
  const stageRef = useRef(stage);
  const isMoving = useRef(false);
  const isResetting = useRef(false);

  useEffect(() => { playerRef.current = player; }, [player]);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => {
    setDropTime(1000);
    resetPlayer();
  }, [resetPlayer]);

  const movePlayer = useCallback((dir: number) => {
    if (gameOver || isResetting.current) return;
    updatePlayerPos({ x: dir, y: 0, collided: false, stage: stageRef.current });
  }, [gameOver, updatePlayerPos]);

  const drop = useCallback(() => {
    if (gameOver || isResetting.current || playerRef.current.collided) return;

    const willCollideY = checkCollision(playerRef.current, stageRef.current, { x: 0, y: 1 });

    if (!willCollideY) {
      updatePlayerPos({ x: 0, y: 1, collided: false, stage: stageRef.current });
    } else {
      if (playerRef.current.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
        return;
      }
      
      isResetting.current = true;
      updatePlayerPos({ x: 0, y: 0, collided: true, stage: stageRef.current });
      
      setTimeout(() => {
        isResetting.current = false;
      }, 150);
    }
  }, [gameOver, updatePlayerPos]);

  const hardDrop = useCallback(() => {
    if (gameOver || isResetting.current || playerRef.current.collided) return;

    let dragY = 0;
    while (!checkCollision(playerRef.current, stageRef.current, { x: 0, y: dragY + 1 })) {
      dragY++;
    }

    if (dragY > 0) {
      isResetting.current = true;
      updatePlayerPos({ x: 0, y: dragY, collided: true, stage: stageRef.current });
      
      setTimeout(() => {
        isResetting.current = false;
      }, 200);
    }
  }, [gameOver, updatePlayerPos]);

  useInterval(() => {
    drop();
  }, dropTime);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isMoving.current = false;
      },
      onPanResponderMove: (_, gesture) => {
        if (isResetting.current) return;
        const { dx, dy, vy } = gesture;

        if (Math.abs(dx) > 25) {
          isMoving.current = true;
          movePlayer(dx > 0 ? 1 : -1);
          gesture.dx = 0;
        }

        if (vy > 1.2 || dy > 100) {
          isMoving.current = true;
          hardDrop();
          gesture.dy = 0;
          gesture.vy = 0;
        } else if (dy > 40) {
          isMoving.current = true;
          drop();
          gesture.dy = 0;
          gesture.vy = 0;
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (!isMoving.current && Math.abs(gesture.dx) < 10 && Math.abs(gesture.dy) < 10) {
          playerRotate(stageRef.current);
        }
        isMoving.current = false;
      },
    })
  ).current; 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameArea} {...panResponder.panHandlers}>
        <View style={styles.header}>
          <Text style={styles.title}>TETRIS</Text>
          <Text style={styles.neonText}>NEON EDITION</Text>
        </View>
        
        <View style={styles.boardWrapper}>
          <Board stage={stage} />
        </View>

        {gameOver && (
          <View style={styles.gameOver}>
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <Text style={styles.restartText} onPress={() => {
              setStage(createStage());
              setGameOver(false);
              setDropTime(1000);
              resetPlayer();
            }}>Toque para reiniciar</Text>
          </View>
        )}

        <View style={styles.controlsHint}>
          <Text style={styles.hint}>ARRASTE PARA MOVER | TOQUE PARA GIRAR</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center' 
  },
  gameArea: { 
    alignItems: 'center', 
    flex: 1, 
    justifyContent: 'center' 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  title: { 
    fontSize: 40, 
    color: '#fff', 
    fontWeight: '900', 
    letterSpacing: 10 
  },
  neonText: { 
    color: '#00d4ff', 
    fontSize: 12, 
    fontWeight: 'bold', 
    letterSpacing: 2, 
    marginTop: -5 
  },
  boardWrapper: {
    padding: 4,
    borderWidth: 2,
    borderColor: '#00d4ff',
    borderRadius: 10,
    backgroundColor: '#050505',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  gameOver: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 30,
    borderRadius: 15,
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#ff4444',
    alignItems: 'center',
  },
  gameOverText: { 
    color: '#ff4444', 
    fontSize: 36, 
    fontWeight: 'bold' 
  },
  restartText: { 
    color: '#fff', 
    marginTop: 15, 
    fontSize: 16, 
    textDecorationLine: 'underline' 
  },
  controlsHint: { 
    marginTop: 40, 
    alignItems: 'center' 
  },
  hint: { 
    color: '#444', 
    fontSize: 11, 
    fontWeight: 'bold', 
    marginVertical: 3, 
    letterSpacing: 1 
  },
});
