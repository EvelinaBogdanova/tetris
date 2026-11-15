import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Link href="/" style={styles.link}>Back to menu</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  link: {
    color: '#00d4ff',
  },
});
