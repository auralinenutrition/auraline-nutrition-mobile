import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/services/supabase";
import { colors, spacing, typography, layout } from "@/theme";

type ProfileData = {
  objetivo: string;
  nivel_treino: string;
  frequencia_treino: string;
  rotina_trabalho: string[];
  dificuldade_principal: string[];
  peso_atual: number;
  peso_desejado: number;
  altura: number;
  genero: string;
  dia_nascimento: string;
  mes_nascimento: string;
  ano_nascimento: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();

    // 🔥 Intercepta botão físico de voltar
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        confirmLogout();
        return true; // impede comportamento padrão
      }
    );

    return () => backHandler.remove();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("quiz_responses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!error) {
      setData(data);
    }

    setLoading(false);
  }

  function confirmLogout() {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: handleLogout,
        },
      ]
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Nenhum dado encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Perfil</Text>

      <Section title="Objetivo">
        <Item label="Objetivo" value={data.objetivo} />
      </Section>

      <Section title="Corpo">
        <Item label="Peso atual" value={`${data.peso_atual} kg`} />
        <Item
          label="Peso desejado"
          value={`${data.peso_desejado} kg`}
        />
        <Item label="Altura" value={`${data.altura} cm`} />
      </Section>

      <Section title="Informações pessoais">
        <Item
          label="Nascimento"
          value={`${data.dia_nascimento} de ${data.mes_nascimento} de ${data.ano_nascimento}`}
        />
        <Item label="Sexo" value={data.genero} />
      </Section>

      <Section title="Rotina e hábitos">
        <Item label="Nível de treino" value={data.nivel_treino} />
        <Item
          label="Frequência"
          value={data.frequencia_treino}
        />
        <Item
          label="Rotina"
          value={data.rotina_trabalho.join(", ")}
        />
        <Item
          label="Dificuldades"
          value={data.dificuldade_principal.join(", ")}
        />
      </Section>
      <TouchableOpacity
  style={styles.managePlanButton}
  onPress={() => router.push("/(stack)/manage-plan")}
>
  <Text style={styles.managePlanText}>
    Gerenciar plano
  </Text>
      </TouchableOpacity>

      {/* 🔴 BOTÃO SAIR */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={confirmLogout}
      >
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* =========================
   COMPONENTES AUXILIARES
========================== */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Item({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  );
}

/* =========================
   STYLES
========================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
    textAlign: "center",
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  item: { marginBottom: spacing.sm },
  itemLabel: {
    ...typography.sm,
    color: colors.textSecondary,
  },
  itemValue: {
    ...typography.base,
    color: colors.textPrimary,
  },
  logoutButton: {
    marginTop: spacing.lg,
    backgroundColor: "#ffecec",
    borderRadius: layout.borderRadius.base,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  logoutText: {
    color: colors.error,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  managePlanButton: {
  backgroundColor: colors.white,
  borderRadius: layout.borderRadius.base,
  paddingVertical: spacing.md,
  alignItems: "center",
  marginTop: spacing.lg,
  borderWidth: 1,
  borderColor: colors.primary,
},
managePlanText: {
  color: colors.primary,
  fontWeight: "600",
},

});
