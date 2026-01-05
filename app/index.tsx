import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, layout } from '@/theme';

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Auraline Nutrition</Text>
        <Text style={styles.subtitle}>
          Descubra seu plano nutricional personalizado
        </Text>
      </View>

      <View style={[styles.actions, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(onboarding)/quiz')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Iniciar Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Entrar / Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },

  title: {
    ...typography.xl,
    fontSize: 32,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  subtitle: {
    ...typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  actions: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 4,
    borderRadius: layout.borderRadius.base,
    alignItems: 'center',
  },

  primaryButtonText: {
    ...typography.base,
    color: colors.white,
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.md + 4,
    borderRadius: layout.borderRadius.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },

  secondaryButtonText: {
    ...typography.base,
    color: colors.primary,
  },
});


