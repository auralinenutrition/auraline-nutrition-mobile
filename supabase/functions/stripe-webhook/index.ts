import Stripe from "https://esm.sh/stripe@14.0.0";
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(
  Deno.env.get("STRIPE_SECRET_KEY")!,
  { apiVersion: "2023-10-16" }
);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    return new Response("Webhook inválido", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const { userId, planType } = session.metadata;

    // 🔥 desativa plano anterior
    await supabase
      .from("user_plans")
      .update({ status: "inactive" })
      .eq("user_id", userId)
      .eq("status", "active");

    // 🔥 cria novo plano
    await supabase.from("user_plans").insert({
      user_id: userId,
      plan_type: planType,
      status: "active",
      payment_provider: "stripe",
      payment_reference: session.id,
    });
  }

  return new Response("ok");
});
