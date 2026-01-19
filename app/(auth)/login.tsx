import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/services/supabase";
import { colors, spacing, typography, layout } from "@/theme";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!email || !password) {
      setError("Preencha email e senha.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw error;

      router.replace("/(tabs)/home");
    } catch (err: any) {
      setError(err?.message ?? "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* 🔙 VOLTAR */}
      <TouchableOpacity
        onPress={() => router.replace("/")}
        style={styles.back}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      {/* 📝 FORMULÁRIO */}
        <Text style={styles.title}>Entrar</Text>

        {error && <Text style={styles.error}>{error}</Text>}

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
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  back: {
    position: "absolute",
    top: 48,
    left: spacing.lg,
    zIndex: 10,
  },
  backText: {
    fontSize: 22,
    color: colors.textPrimary,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
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
