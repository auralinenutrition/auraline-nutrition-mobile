import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/services/supabase";
import { saveQuizToDatabase } from "@/services/quiz.service";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha email e senha.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        Alert.alert("Erro", error?.message || "Erro ao fazer login.");
        return;
      }

      const userId = data.user.id;

      // 2️⃣ Verifica quiz pendente
      const pendingQuiz = await AsyncStorage.getItem("@pending_quiz");

      if (pendingQuiz) {
        await saveQuizToDatabase(JSON.parse(pendingQuiz), userId);
        await AsyncStorage.removeItem("@pending_quiz");

        // marca onboarding como concluído
        await supabase
          .from("users")
          .update({ onboarding_done: true })
          .eq("id", userId);
      }

      // 3️⃣ Verifica status do onboarding
      const { data: userRow } = await supabase
        .from("users")
        .select("onboarding_done")
        .eq("id", userId)
        .single();

      if (!userRow?.onboarding_done) {
        router.replace("/(onboarding)/quiz");
        return;
      }

      // 4️⃣ Usuário completo → home
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Erro inesperado ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
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
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
