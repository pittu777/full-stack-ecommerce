import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { syncFromClerk, deleteUserByClerkId } from "@/services/user.service";

/**
 * Clerk Webhook Handler — `/api/webhooks/clerk`
 *
 * This is the MOST RELIABLE way to sync Clerk users into our database.
 * Clerk calls this endpoint whenever:
 *   - user.created  → new sign-up
 *   - user.updated  → profile update (name, email, image)
 *   - user.deleted  → account deletion
 *
 * SETUP:
 * 1. Go to Clerk Dashboard → Webhooks → Add Endpoint
 * 2. Set URL to: https://your-domain.com/api/webhooks/clerk
 *    (Use https://smee.io or clerk's local dev proxy for local testing)
 * 3. Subscribe to events: user.created, user.updated, user.deleted
 * 4. Copy the "Signing Secret" → paste into .env as CLERK_WEBHOOK_SECRET
 *
 * SECURITY: We ALWAYS verify the Svix signature before processing.
 * Never trust the payload without verification.
 */
export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error(
      "[clerk-webhook] CLERK_WEBHOOK_SECRET is not set in environment variables."
    );
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  // --- 1. Extract Svix headers for signature verification ---
  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Missing svix headers — request rejected", {
      status: 400,
    });
  }

  // --- 2. Verify the webhook signature ---
  const body = await request.text();
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[clerk-webhook] Signature verification failed:", err);
    return new NextResponse("Invalid webhook signature", { status: 400 });
  }

  // --- 3. Handle the verified event ---
  const eventType = event.type;
  console.log(`[clerk-webhook] Received event: ${eventType}`);

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url, primary_email_address_id } =
          event.data;

        const primaryEmail = email_addresses.find(
          (e) => e.id === primary_email_address_id
        );

        await syncFromClerk({
          clerkUserId: id,
          email: primaryEmail?.email_address ?? "",
          firstName: first_name ?? null,
          lastName: last_name ?? null,
          imageUrl: image_url ?? null,
        });

        console.log(
          `[clerk-webhook] Synced user ${id} (${eventType})`
        );
        break;
      }

      case "user.deleted": {
        const { id } = event.data;

        if (!id) {
          console.warn("[clerk-webhook] user.deleted event missing id — skipping");
          break;
        }

        await deleteUserByClerkId(id);
        console.log(`[clerk-webhook] Deleted user ${id}`);
        break;
      }

      default:
        // We received an event we're not subscribed to — ignore gracefully
        console.log(`[clerk-webhook] Unhandled event type: ${eventType}`);
    }

    // Clerk expects a 200 response to mark the webhook as delivered
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error(`[clerk-webhook] Error processing event ${eventType}:`, err);
    // Return 500 so Clerk retries the webhook
    return new NextResponse("Internal server error processing webhook", {
      status: 500,
    });
  }
}
