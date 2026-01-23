import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const body = await req.json();

  // 🔐 validações mínimas
  if (body.type !== "checkout.session.completed") {
    return new Response("Ignored", { status: 200 });
  }

  const session = body.data?.object;
  const userId = session?.metadata?.userId;
  const planType = session?.metadata?.planType;

  if (!userId || !planType) {
    return new Response("Missing metadata", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 1️⃣ desativa TODOS os planos do usuário
await supabase
  .from("user_plans")
  .update({ status: "inactive" })
  .eq("user_id", userId);

// 2️⃣ cria o novo plano ATIVO
await supabase.from("user_plans").insert({
  user_id: userId,
  plan_type: planType,
  status: "active",
  payment_provider: "stripe",
  payment_reference: session.id,
  started_at: new Date().toISOString(),
});


  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
