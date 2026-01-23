/// <reference lib="deno.ns" />

import Stripe from "https://esm.sh/stripe@14.21.0";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const stripe = new Stripe(
  Deno.env.get("STRIPE_SECRET_KEY")!,
  { apiVersion: "2023-10-16" }
);

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const { planType, userId } = await req.json();

    if (!planType || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing planType or userId" }),
        { status: 400 }
      );
    }

    let priceId: string | null = null;
    let mode: "subscription" | "payment";

    // 🔥 MAPEAMENTO CORRETO DOS PLANOS
    if (planType === "premium") {
      priceId = Deno.env.get("STRIPE_PREMIUM_PRICE_ID")!;
      mode = "subscription";
    } else if (planType === "lifetime") {
      priceId = Deno.env.get("STRIPE_LIFETIME_PRICE_ID")!;
      mode = "payment";
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid planType" }),
        { status: 400 }
      );
    }

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "Missing priceId" }),
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "auraline://payment-success",
      cancel_url: "auraline://payment-cancel",
      metadata: {
        userId,
        planType,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Checkout error:", error);

    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500 }
    );
  }
});
