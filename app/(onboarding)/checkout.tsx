import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { supabase } from "@/services/supabase";
import Constants from "expo-constants";

type PlanType = "premium" | "lifetime";

const PLAN_CONFIG = {
  premium: {
    label: "Plano Premium",
    price: "R$ 29,90",
  },
  lifetime: {
    label: "Plano Vitalício",
    price: "R$ 299,90",
  },
};

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [plan, setPlan] = useState<PlanType>("premium");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadSelectedPlan();
  }, []);

  async function loadSelectedPlan() {
    const storedPlan =
      (await AsyncStorage.getItem("@selected_plan")) as PlanType;

    if (storedPlan === "premium" || storedPlan === "lifetime") {
      setPlan(storedPlan);
    }
  }

  async function handleCheckout() {
    try {
      setIsProcessing(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/(auth)/login");
        return;
      }

      const response = await fetch(
        "https://khgmjbsfblabpcktajea.supabase.co/functions/v1/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Constants.expoConfig?.extra?.supabaseAnonKey}`,

          },
          body: JSON.stringify({
            planType: plan,
            userId: user.id,
          }),
        }
      );

      const { url } = await response.json();

      if (!url) {
        throw new Error("URL de checkout não recebida.");
      }

      Linking.openURL(url);
    } catch (error) {
      console.log("Erro no checkout:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  const config = PLAN_CONFIG[plan];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO */}
      <View style={styles.content}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>
          Pagamento seguro via Stripe
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {config.label}
            </Text>
            <Text style={styles.summaryValue}>
              {config.price}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelTotal}>
              Total
            </Text>
            <Text style={styles.summaryValueTotal}>
              {config.price}
            </Text>
          </View>
        </View>
      </View>

      {/* FOOTER */}
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            isProcessing &&
              styles.checkoutButtonDisabled,
          ]}
          onPress={handleCheckout}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>
            {isProcessing
              ? "Redirecionando..."
              : "Finalizar Compra"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =========================
   🎨 STYLES (INTACTOS)
========================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { alignSelf: "flex-start" },
  backButtonText: { fontSize: 16, color: "#007AFF" },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 16, color: "#666666" },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },
  summaryLabelTotal: {
    fontSize: 18,
    fontWeight: "600",
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  checkoutButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonDisabled: { opacity: 0.6 },
  checkoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
