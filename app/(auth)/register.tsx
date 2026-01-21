import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "@/services/supabase";
import { saveQuizResponses } from "@/services/quiz.service";
import { colors, spacing, typography, layout } from "@/theme";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    if (!name || !email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      /* =========================
         🔐 CRIA USUÁRIO
      ========================== */
      const { error: authError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });

      if (authError) throw authError;

      /* =========================
         🧠 SALVA QUIZ
      ========================== */
      const rawQuiz = await AsyncStorage.getItem("@pending_quiz");
      if (rawQuiz) {
        await saveQuizResponses(JSON.parse(rawQuiz));
        await AsyncStorage.removeItem("@pending_quiz");
      }

      /* =========================
         💳 RECUPERA PLANO ESCOLHIDO
         (sem mudar layout)
      ========================== */
      const selectedPlan =
        (await AsyncStorage.getItem("@selected_plan")) ?? "free";

      // 🔥 FUTURO:
      // await saveUserPlan(user.id, selectedPlan);

      await AsyncStorage.removeItem("@selected_plan");

      /* =========================
         🚀 VAI PARA HOME
      ========================== */
      router.replace("/(tabs)/home");
    } catch (err: any) {
      setError(err?.message ?? "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Crie sua conta</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.label}>Nome*</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.label}>E-mail*</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text style={styles.label}>Senha*</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        disabled={loading}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>
          {loading ? "Criando conta..." : "Criar minha conta"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push("/(onboarding)/quiz")}
      >
        <Text style={styles.quizText}>
          Refazer o quiz antes de registrar-se
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

/* =========================
   🎨 STYLES — INTACTOS
========================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  quizText: {
    marginTop: spacing.md,
    color: colors.primary,
    textAlign: "center",
  },
  label: {
    ...typography.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.base,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.base,
    paddingVertical: spacing.md + 2,
    alignItems: "center",
    marginTop: spacing.md,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    ...typography.base,
    color: colors.white,
    fontWeight: "600",
  },
  error: {
    color: colors.error,
    marginBottom: spacing.md,
  },
});
