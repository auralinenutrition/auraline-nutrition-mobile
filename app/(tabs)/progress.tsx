import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";
import { colors, spacing, typography, layout } from "@/theme";
import { WeightProgressChart } from "@/components/pickers/WeightProgressChart";

type WeightRecord = {
  id: string;
  weight: number;
  created_at: string;
};

export default function ProgressScreen() {
  const [weight, setWeight] = useState("");
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTargetWeight();
    loadRecords();
  }, []);

  /* =========================
     🎯 META (QUIZ)
  ========================== */
  async function loadTargetWeight() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("quiz_responses")
      .select("peso_desejado")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!error && data?.peso_desejado) {
      setTargetWeight(Number(data.peso_desejado));
    }
  }

  /* =========================
     📈 HISTÓRICO
  ========================== */
  async function loadRecords() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("weight_records")
      .select("id, weight, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.log("Erro ao buscar pesos:", error);
      return;
    }

    if (data) {
      setRecords(data);
    }
  }

  /* =========================
     ➕ ADICIONAR PESO
  ========================== */
  async function handleAddWeight() {
    if (!weight) return;

    const numericWeight = Number(weight.replace(",", "."));
    if (isNaN(numericWeight)) {
      Alert.alert("Peso inválido", "Digite um valor válido.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("weight_records")
      .insert({
        user_id: user.id,
        weight: numericWeight,
        date: today,
      });

    setLoading(false);

    if (error) {
      console.log("Erro ao salvar peso:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar o peso. Tente novamente."
      );
      return;
    }

    setWeight("");
    loadRecords();
  }

  const weightValues = records.map((r) => r.weight);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Progresso</Text>

      {/* 📊 GRÁFICO */}
      {weightValues.length > 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Evolução do peso
          </Text>

          <WeightProgressChart
            weights={weightValues}
            target={targetWeight ?? undefined}
          />

          {targetWeight && (
            <Text style={styles.metaText}>
              Meta: {targetWeight} kg
            </Text>
          )}
        </View>
      )}

      {/* ➕ REGISTRAR PESO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Registrar peso atual
        </Text>

        <TextInput
          placeholder="Ex: 72.5"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleAddWeight}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Salvando..." : "Adicionar peso"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 📜 HISTÓRICO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Histórico de peso
        </Text>

        {records.length === 0 ? (
          <Text style={styles.empty}>
            Nenhum peso registrado ainda.
          </Text>
        ) : (
          <FlatList
            data={[...records].reverse()}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.record}>
                <Text style={styles.recordWeight}>
                  {item.weight} kg
                </Text>
                <Text style={styles.recordDate}>
                  {new Date(
                    item.created_at
                  ).toLocaleDateString("pt-BR")}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

/* =========================
   🎨 STYLES
========================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  scrollContent: {
    paddingBottom: 120, // espaço para tab bar
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  metaText: {
    marginTop: spacing.sm,
    textAlign: "center",
    color: colors.error,
    fontWeight: "600",
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
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.base,
    color: colors.white,
    fontWeight: "600",
  },
  empty: {
    ...typography.sm,
    color: colors.textSecondary,
  },
  record: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  recordWeight: {
    ...typography.base,
    color: colors.textPrimary,
  },
  recordDate: {
    ...typography.sm,
    color: colors.textSecondary,
  },
});
