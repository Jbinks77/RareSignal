// ============================================================
// POST /api/webhooks/stripe — Handle Stripe webhook events
// ============================================================
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          await supabase.from("profiles").update({
            plan,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            updated_at: new Date().toISOString(),
          }).eq("id", userId);

          // Send notification
          await supabase.from("notifications").insert({
            user_id: userId,
            title: "Abonnement activé",
            message: `Votre plan ${plan.charAt(0).toUpperCase() + plan.slice(1)} est maintenant actif !`,
            type: "system",
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (profile) {
          const status = subscription.status;
          if (status === "canceled" || status === "unpaid") {
            await supabase.from("profiles").update({
              plan: "free",
              stripe_subscription_id: null,
              updated_at: new Date().toISOString(),
            }).eq("id", profile.id);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (profile) {
          await supabase.from("profiles").update({
            plan: "free",
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          }).eq("id", profile.id);

          await supabase.from("notifications").insert({
            user_id: profile.id,
            title: "Abonnement annulé",
            message: "Votre abonnement a été annulé. Vous êtes repassé au plan Free.",
            type: "system",
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", invoice.customer)
          .single();

        if (profile) {
          await supabase.from("notifications").insert({
            user_id: profile.id,
            title: "Échec de paiement",
            message: "Le paiement de votre abonnement a échoué. Veuillez mettre à jour vos informations de paiement.",
            type: "system",
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
