import { supabase } from "@/services/supabase";

/* ======================================================
   🔧 HELPERS
====================================================== */

/**
 * Extrai respostas de perguntas MULTIPLE
 * Aceita:
 *  - { selected: string[], other?: string }
 *  - string[]
 * Retorna SEMPRE string[]
 */
function extractMultiple(value: any): string[] {
  if (!value) return [];

  if (typeof value === "object" && Array.isArray(value.selected)) {
    return value.selected;
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [];
}

/**
 * Extrai campo "other" quando existir
 */
function extractOther(value: any): string | null {
  if (value && typeof value === "object" && typeof value.other === "string") {
    const trimmed = value.other.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
}

/**
 * Meses por extenso em PT-BR
 */
const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/* ======================================================
   🧠 QUIZ → BANCO
====================================================== */

export async function saveQuizResponses(answers: Record<string, any>) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Usuário não autenticado");
  }

  /* =========================
     🎯 SINGLE
  ========================== */

  const objetivo = answers["1"];
  const nivelTreino = answers["2"];
  const frequenciaTreino = answers["3"];
  const tentouDieta = answers["4"];
  const horarioTreino = answers["5"];
  const refeicoesDia = answers["7"];
  const alimentacaoAtual = answers["8"];
  const genero = answers["9"];
  const nivelDisciplina = answers["14"];
  const horarioDificil = answers["16"];
  const agua = answers["17"];
  const sono = answers["18"];
  const expectativa = answers["19"];
  const prazoResultado = answers["20"];

  /* =========================
     🧠 MULTIPLE (ARRAY LIMPO)
     IDs: 6, 15, 21
  ========================== */

  const rotinaTrabalho = extractMultiple(answers["6"]); // ID 6
  const dificuldadePrincipal = extractMultiple(answers["15"]); // ID 15

  // 🥗 ALERGIAS — ID 21
  const alergiasRaw = answers["21"];
  const alergias = extractMultiple(alergiasRaw);
  const outrasAlergias = extractOther(alergiasRaw);

  /* =========================
     📏 NUMÉRICOS
  ========================== */

  const altura = answers["11"];
  const pesoAtual = answers["12"];
  const pesoDesejado = answers["13"];

  /* =========================
     🎂 DATA DE NASCIMENTO
  ========================== */

  const birthRaw = answers["10"];

  const birthDate =
    birthRaw instanceof Date
      ? birthRaw
      : typeof birthRaw === "string"
      ? new Date(birthRaw)
      : null;

  const diaNascimento = birthDate
    ? String(birthDate.getDate()).padStart(2, "0")
    : null;

  const mesNascimento = birthDate
    ? MONTHS_PT[birthDate.getMonth()] // 🔥 POR EXTENSO
    : null;

  const anoNascimento = birthDate
    ? String(birthDate.getFullYear())
    : null;

  /* =========================
     💾 INSERT
  ========================== */

  const { error } = await supabase.from("quiz_responses").insert({
    user_id: user.id,

    objetivo,
    nivel_treino: nivelTreino,
    frequencia_treino: frequenciaTreino,
    horario_treino: horarioTreino,
    alimentacao_atual: alimentacaoAtual,
    refeicoes_dia: refeicoesDia,

    rotina_trabalho: rotinaTrabalho,
    nivel_disciplina: nivelDisciplina,
    dificuldade_principal: dificuldadePrincipal,

    horario_dificil: horarioDificil,
    agua,
    sono,
    tentou_dieta: tentouDieta,
    expectativa,
    prazo_resultado: prazoResultado,

    peso_atual: pesoAtual,
    altura,
    peso_desejado: pesoDesejado,

    alergias,
    outras_alergias: outrasAlergias,

    dia_nascimento: diaNascimento,
    mes_nascimento: mesNascimento,
    ano_nascimento: anoNascimento,
    genero,
  });

  if (error) {
    console.error("Erro ao salvar quiz:", error);
    throw error;
  }
}
