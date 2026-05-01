// code adapted from IS4447 tutorial for habit tracker app
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
};

export default function ScreenHeader({ title, subtitle, showLogo = false }: Props) {
  return (
    <View style={styles.container}>
      {showLogo && (
        <Image
          source={require('@/assets/logo.png')}          
          style={styles.logo}
          resizeMode="contain"
        />
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
});