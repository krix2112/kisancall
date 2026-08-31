import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Queue & Status</Text>
      <Text style={styles.placeholder}>TODO: implement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  placeholder: { fontSize: 14, color: '#666' },
});
