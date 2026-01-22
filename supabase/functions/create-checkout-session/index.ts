import Stripe from "https://esm.sh/stripe@14.0.0";
import { serve } from "https://deno.land/std/http/server.ts";

const stripe = new Stripe(
  Deno.env.get("STRIPE_SECRET_KEY")!,
  { apiVersion: "2023-10-16" }
);

serve(async (req) => {
  try {
    const { planType, userId } = await req.json();

    if (!planType || !userId) {
      return new Response("Dados inválidos", { status: 400 });
    }

    const priceId =
      planType === "premium"
        ? Deno.env.get("STRIPE_PREMIUM_PRICE_ID")
        : Deno.env.get("STRIPE_LIFETIME_PRICE_ID");

    const session = await stripe.checkout.sessions.create({
      mode: planType === "premium" ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "auraline://payment-success",
      cancel_url: "auraline://payment-cancel",
      metadata: { userId, planType },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500 }
    );
  }
});
