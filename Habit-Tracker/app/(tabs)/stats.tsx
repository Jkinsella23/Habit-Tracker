import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Stats</Text>
    </SafeAreaView>
  );
}