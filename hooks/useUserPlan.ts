import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/services/supabase";

export type PlanType = "free" | "premium" | "lifetime";
export type PlanStatus = "active" | "inactive" | "canceled";

export type UserPlan = {
  plan_type: PlanType;
  status: PlanStatus;
  expires_at: string | null;
};

export function useUserPlan() {
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 🔐 Garante que o usuário SEMPRE tenha um plano ativo
   */
  const ensurePlanExists = async (
    userId: string
  ): Promise<UserPlan> => {
    // 1️⃣ Busca plano ativo
    const { data: activePlan } = await supabase
      .from("user_plans")
      .select("plan_type, status, expires_at")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (activePlan) {
      return activePlan;
    }

    // 2️⃣ Não tem plano ativo → cria FREE
    const { data: newPlan, error } = await supabase
      .from("user_plans")
      .insert({
        user_id: userId,
        plan_type: "free",
        status: "active",
      })
      .select("plan_type, status, expires_at")
      .single();

    if (error || !newPlan) {
      throw new Error("Erro ao criar plano free.");
    }

    return newPlan;
  };

  /**
   * 🔄 Carrega plano do usuário
   */
  const loadUserPlan = useCallback(async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPlan(null);
      setLoading(false);
      return;
    }

    try {
      const ensuredPlan = await ensurePlanExists(user.id);
      setPlan(ensuredPlan);
    } catch (error) {
      console.error("Erro ao garantir plano:", error);
      setPlan(null);
    }

    setLoading(false);
  }, []);

  /**
   * ⬆️ Upgrade / troca de plano
   */
  const upgradePlan = async (newPlan: PlanType) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // 1️⃣ Desativa plano atual
    await supabase
      .from("user_plans")
      .update({ status: "inactive" })
      .eq("user_id", user.id)
      .eq("status", "active");

    // 2️⃣ Cria novo plano
    await supabase.from("user_plans").insert({
      user_id: user.id,
      plan_type: newPlan,
      status: "active",
      expires_at:
        newPlan === "premium"
          ? new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString()
          : null,
    });

    await loadUserPlan();
  };

  /**
   * ❌ Cancelamento (volta para free)
   */
  const cancelPlan = async () => {
    await upgradePlan("free");
  };

  useEffect(() => {
    loadUserPlan();
  }, [loadUserPlan]);

  return {
    plan,
    loading,

    // helpers
    isFree: plan?.plan_type === "free",
    isPremium: plan?.plan_type === "premium",
    isLifetime: plan?.plan_type === "lifetime",

    // actions
    refreshPlan: loadUserPlan,
    upgradePlan,
    cancelPlan,
  };
}
