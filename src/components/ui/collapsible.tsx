import { useState, type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type CollapsibleProps = PropsWithChildren<{ title: string }>;

export function Collapsible({ title, children }: CollapsibleProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" onPress={() => setExpanded(value => !value)}>
        <Text style={styles.title}>{expanded ? '−' : '+'} {title}</Text>
      </Pressable>
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  content: { paddingTop: 8 },
});
