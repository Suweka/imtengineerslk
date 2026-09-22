# WhatsApp Order Notification Setup

This documents the current state of the WhatsApp order/service-request
notification feature, why it wasn't working, and what's left to finish it.

## How the feature works

1. Customer submits an order (`/checkout`) or a service request
   (`/services/[type]`).
2. The API route (`src/app/api/orders/route.ts` or
   `src/app/api/service-requests/route.ts`) saves the record to the
   database, then calls `sendOrderNotification` /
   `sendServiceRequestNotification` in `src/lib/whatsapp.ts`.
3. That function sends a WhatsApp **template message** via Meta's
   WhatsApp Business Cloud API to the number in `IMT_NOTIFY_NUMBER`.
4. The send result (`sent` / `failed` / `skipped`) is stored on the
   record as `whatsappStatus`. A failed send does **not** block the
   order/request from being saved.
5. Admins can retry a failed WhatsApp send from the admin orders page
   via `src/app/api/admin/orders/[id]/retry-whatsapp/route.ts`.

Env vars involved (`.env.local`):

```
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
IMT_NOTIFY_NUMBER=94766653639
WHATSAPP_ORDER_TEMPLATE=neworderrecieved
WHATSAPP_SERVICE_TEMPLATE=service_request_confirmation
```

## What was broken

- The original `WHATSAPP_API_TOKEN` had expired (Meta returned
  `Authentication Error`, code 190).
- The client (IMT Engineers) does not have their own Meta Business
  account set up for this, and is non-technical, so a fresh token
  couldn't be issued on their end.
- The developer (Suweka) already has a Meta app called **IMT
  Engineers** under their own **Ceylon Web House** Business Manager,
  with full admin access — this is where the original token came from.
- The client's real WhatsApp number (`766653639`) is already active
  on the regular WhatsApp Business mobile app, so it can't be directly
  re-registered to the Cloud API without migrating it first (which
  would disconnect it from the phone's WhatsApp app).

## Current approach: Meta's free test number

To unblock testing without migrating the client's live number or
requiring the client to do anything technical, we're using the free
test phone number Meta provisions automatically for every WhatsApp
app:

- Test number: `+1 (555) 202-9419`
- Phone Number ID: `1216458268226442`
- WhatsApp Business Account ID: `1616039806900915`

Limitations of the test number:

- It can only send **template messages**.
- It can only message phone numbers explicitly added to an **allowed
  recipient list** in the Meta app (API Setup → "To" → Manage phone
  number list). Each recipient must be verified via an OTP sent to
  their WhatsApp number.
- It has low daily/monthly sending limits — fine for verifying the
  feature works, not for production volume.

### Progress so far

1. ✅ Generated a new, working access token from the Ceylon Web House
   Meta app (confirmed via direct `curl` call to the Graph API — no
   more auth error).
2. ❌ Sending to `94766653639` (IMT's real number) currently fails
   with:
   ```
   (#131030) Recipient phone number not in allowed list
   ```
   because that number hasn't been added as an allowed test recipient
   yet.

### Next step

In the Meta app dashboard → **WhatsApp → API Setup**:

1. Under **"To"**, click **Manage phone number list** → **Add
   recipient phone number**.
2. Enter `+94 766653639`.
3. Meta sends an OTP to that WhatsApp number — whoever has access to
   that phone needs to read back the code to complete verification.
4. Once verified, re-run the test send (see `Testing` below) to
   confirm delivery.

## Long-term / production considerations

The test number is not meant for production:

- Sending is capped and requires manual allow-listing of every
  recipient, which doesn't scale to real customers receiving
  confirmations (if that's ever added) — though currently only the
  **owner notification** number needs to be allow-listed, since
  customers aren't sent WhatsApp messages by this flow.
- For the owner-notification use case specifically (only one
  recipient — IMT's number), the test number setup above is actually
  workable indefinitely once `766653639` is allow-listed, since Meta
  doesn't currently require production number verification just to
  message a single allow-listed number.
- If IMT's number ever needs to be the **sender** (e.g. for two-way
  customer chat via API, or to remove the "test number" branding from
  outgoing messages), it will need to be migrated from the WhatsApp
  Business mobile app to the Cloud API. This is done from the phone:
  **WhatsApp Business app → Settings → Business tools → Migrate to
  Cloud API**, selecting this Meta app/Business Manager as the
  destination. This disconnects the number from the mobile app
  afterward — confirmed with the client that this number is only used
  for automated alerts, not manual customer chats, so this is safe to
  do when needed.
- The permanent token should come from a **System User** (Business
  Settings → Users → System Users → generate token, no expiry,
  `whatsapp_business_messaging` permission) rather than a temporary
  24-hour token, so it doesn't need to be regenerated repeatedly.

## Testing manually with curl

Useful for isolating whether a failure is in the app code or the Meta
API/account itself:

```bash
TOKEN=$(grep WHATSAPP_API_TOKEN .env.local | cut -d'"' -f2)
PHONE_ID=$(grep WHATSAPP_PHONE_NUMBER_ID .env.local | cut -d'"' -f2)
TEMPLATE=$(grep WHATSAPP_ORDER_TEMPLATE .env.local | cut -d'"' -f2)

curl -s -X POST "https://graph.facebook.com/v20.0/${PHONE_ID}/messages" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "94766653639",
    "type": "template",
    "template": {
      "name": "'"${TEMPLATE}"'",
      "language": {"code": "en"},
      "components": [{
        "type": "body",
        "parameters": [
          {"type": "text", "text": "Test Customer"},
          {"type": "text", "text": "IMT-2026-TEST01"},
          {"type": "text", "text": "1x Test Product (Test Spec) - LKR 1000"},
          {"type": "text", "text": "LKR 1000"},
          {"type": "text", "text": "Home Delivery"},
          {"type": "text", "text": "None requested"},
          {"type": "text", "text": "94766653639"}
        ]
      }]
    }
  }'
```

A successful send returns a JSON body with a `messages` array
containing a `wamid...` message ID. An error returns an `error` object
with a `code` and `message` explaining what's wrong (auth, template,
recipient allow-list, etc).
