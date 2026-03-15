import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        console.log("Checkout completed:", {
          userId,
          subscriptionId,
          customerId,
        });

        // TODO: Create or update the user's subscription in the database
        // await db.subscription.upsert({
        //   where: { userId },
        //   create: {
        //     userId,
        //     stripeCustomerId: customerId,
        //     stripeSubscriptionId: subscriptionId,
        //     status: "active",
        //   },
        //   update: {
        //     stripeCustomerId: customerId,
        //     stripeSubscriptionId: subscriptionId,
        //     status: "active",
        //   },
        // });

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        console.log("Invoice paid:", { subscriptionId });

        // TODO: Renew/update the subscription status in the database
        // await db.subscription.update({
        //   where: { stripeSubscriptionId: subscriptionId },
        //   data: {
        //     status: "active",
        //     currentPeriodEnd: new Date(invoice.lines.data[0]?.period?.end * 1000),
        //   },
        // });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("Subscription cancelled:", { subscriptionId: subscription.id });

        // TODO: Cancel the subscription in the database
        // await db.subscription.update({
        //   where: { stripeSubscriptionId: subscription.id },
        //   data: {
        //     status: "cancelled",
        //     plan: "free",
        //   },
        // });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
