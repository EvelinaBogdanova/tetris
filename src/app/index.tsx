import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Menu() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tetris</Text>
        <View style={styles.separator} />
        <Text style={styles.subtitle}>mobile</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
        style={styles.button}
         onPress={() => router.push('/game')}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 70,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#00d4ff',
    letterSpacing: 10,
    fontWeight: 'bold',
  },
  separator: {
    width: 100,
    height: 4,
    backgroundColor: '#00d4ff',
    marginVertical: 10,
  },
  buttonContainer: {
    width: '80%',
    gap: 20,
  },
  button: {
    backgroundColor: '#00d4ff',
    paddingVertical: 18,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#00d4ff',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    color: '#333',
    fontSize: 12,
  }
});
