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

  const [name, setName] = useState(""); // 🔥 NOME
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    if (!name || !email || !password) {
      setError("Preencha nome, email e senha");
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
            data: {
              name, // 🔥 salva nome do usuário
            },
          },
        });

      if (authError) throw authError;

      /* =========================
         🧠 RECUPERA QUIZ
      ========================== */

      const rawQuiz = await AsyncStorage.getItem("@pending_quiz");

      if (rawQuiz) {
        const answers = JSON.parse(rawQuiz);
        await saveQuizResponses(answers);
        await AsyncStorage.removeItem("@pending_quiz");
      }

      /* =========================
         🚀 REDIRECIONA
      ========================== */

      router.replace("/(onboarding)/plans");
    } catch (err: any) {
      console.error("Erro ao registrar:", err);
      setError(err?.message ?? "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>
          Finalize seu cadastro para gerar seu plano
        </Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Senha"
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
            {loading ? "Criando conta..." : "Criar conta"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.md,
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
    paddingVertical: spacing.md + 4,
    alignItems: "center",
    marginTop: spacing.md,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    ...typography.base,
    color: colors.white,
    fontWeight: "600",
  },
});
