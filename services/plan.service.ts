import { supabase } from "@/services/supabase";

export async function saveUserPlan(
  userId: string,
  planType: "free" | "premium" | "lifetime"
) {
  const { error } = await supabase.from("user_plans").insert({
    user_id: userId,
    plan_type: planType,
    status: "active",
  });

  if (error) throw error;
}
