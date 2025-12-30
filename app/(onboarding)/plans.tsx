import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlansScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSelectPlan = (planType: 'free' | 'premium' | 'lifetime') => {
    if (planType === 'free') {
      router.push('/(auth)/register');
    } else {
      router.push('/(onboarding)/checkout');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Escolha seu Plano</Text>
        <Text style={styles.headerSubtitle}>
          Selecione o plano ideal para sua jornada
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.planCard}
          onPress={() => handleSelectPlan('free')}
          activeOpacity={0.8}
        >
          <Text style={styles.planName}>Gratuito</Text>
          <Text style={styles.planPrice}>R$ 0,00</Text>
          <Text style={styles.planPeriod}>/mês</Text>
          <View style={styles.featuresContainer}>
            <Text style={styles.feature}>✓ Acesso básico</Text>
            <Text style={styles.feature}>✓ Receitas limitadas</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planCard, styles.planCardPremium]}
          onPress={() => handleSelectPlan('premium')}
          activeOpacity={0.8}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Popular</Text>
          </View>
          <Text style={styles.planName}>Premium</Text>
          <Text style={styles.planPrice}>R$ 29,90</Text>
          <Text style={styles.planPeriod}>/mês</Text>
          <View style={styles.featuresContainer}>
            <Text style={styles.feature}>✓ Acesso completo</Text>
            <Text style={styles.feature}>✓ Receitas ilimitadas</Text>
            <Text style={styles.feature}>✓ Acompanhamento avançado</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.planCard}
          onPress={() => handleSelectPlan('lifetime')}
          activeOpacity={0.8}
        >
          <Text style={styles.planName}>Vitalício</Text>
          <Text style={styles.planPrice}>R$ 299,90</Text>
          <Text style={styles.planPeriod}>único</Text>
          <View style={styles.featuresContainer}>
            <Text style={styles.feature}>✓ Acesso vitalício</Text>
            <Text style={styles.feature}>✓ Todos os recursos</Text>
            <Text style={styles.feature}>✓ Atualizações futuras</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    gap: 16,
  },
  planCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  planCardPremium: {
    backgroundColor: '#f0f7ff',
    borderColor: '#007AFF',
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  featuresContainer: {
    gap: 12,
  },
  feature: {
    fontSize: 16,
    color: '#1a1a1a',
  },
});

