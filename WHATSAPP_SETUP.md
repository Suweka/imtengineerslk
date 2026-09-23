# WhatsApp Order Notification Setup

Documents how the WhatsApp order/service-request owner-notification
feature is wired up, and the account/template setup it depends on.

## How the feature works

1. Customer submits an order (`/checkout`) or a service request
   (`/services/[type]`).
2. The API route (`src/app/api/orders/route.ts` or
   `src/app/api/service-requests/route.ts`) saves the record to the
   database, then calls `sendOrderNotification` /
   `sendServiceRequestNotification`.
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

## Current status

**Orders: live on Meta WhatsApp Business Cloud API.**
`src/app/api/orders/route.ts` and the admin retry endpoint import
`sendOrderNotification` from `src/lib/whatsapp.ts`, which sends via
the approved `neworderrecieved` template. Confirmed working end to
end (DB write → WhatsApp send → `whatsappStatus: "sent"`).

**Service requests: still on CallMeBot (interim).**
`src/app/api/service-requests/route.ts` imports from
`src/lib/callmebot.ts` because no service-request template has been
created/approved yet — see "Next step" below to finish the migration.

### Account structure (Meta)

Everything is set up under the **Ceylon Web House** Business Manager,
which owns multiple WhatsApp Business Accounts (WABAs). The one
actually in use is:

- WABA name: **IMT Engineers LK**
- WABA ID: `2148042532756375`
- Sender number: `+94 71 310 5075`
- Phone Number ID: `1351385294722016`
- Meta app: **IMT Engineers** (app ID `2113761125891940`)
- Token: permanent System User token, scope
  `whatsapp_business_messaging` + `whatsapp_business_management`

There are other WABAs under the same business (a plain "Ceylon Web
House" WABA, and a "Test WhatsApp Business Account" using Meta's free
test number) — these are not used by the app. If you're debugging
account/permission issues, double-check which WABA a given phone
number ID actually belongs to before assuming it's this one — an app
can only send through a WABA its System User has been explicitly
granted access to as an asset, even if the UI shows the number under
a different WABA it can merely read.

### Templates (must be created per-WABA, not per-app)

Templates aren't visible/usable across WABAs even under the same
Business Manager or app — each WABA needs its own approved copy.

| Template | WABA `2148042532756375` (IMT Engineers LK, in use) |
|---|---|
| `neworderrecieved` | ✅ Approved |
| `service_request_confirmation` | ❌ Not created yet |

`neworderrecieved` body (7 variables — customer, order number, items,
total, fulfillment, installation, phone):

```
📦 New Order Received

A new order has just been placed on the IMT Engineers website.

Customer: {{1}}
Order Number: {{2}}
Items Ordered: {{3}}
Order Total: {{4}}
Delivery Method: {{5}}
Installation Requested: {{6}}
Customer Phone: {{7}}

Please review and process this order as soon as possible.
```

### Next step: approve a service-request template

To move service requests off CallMeBot and onto Meta too:

1. In Meta Business Suite → **WhatsApp Manager** → select the
   **IMT Engineers LK** account → **Message Templates** → Create
   Template.
2. Name it `service_request_confirmation`, category **Utility**,
   language English. Body needs static text at both ends and enough
   context per variable (Meta rejects templates that are mostly
   variables) — match the 4 params `sendServiceRequestNotification`
   in `src/lib/whatsapp.ts` already sends (type, customer, phone,
   address, preferred date — check that function for the exact order
   before wording the template).
3. Submit and wait for approval (usually minutes to a few hours for
   Utility templates).
4. Once approved, swap the import in
   `src/app/api/service-requests/route.ts` from
   `@/lib/callmebot` to `@/lib/whatsapp`.
5. Re-test with the curl command below before relying on it.

## CallMeBot fallback (service requests only, for now)

`src/lib/callmebot.ts` sends plain-text messages via CallMeBot's free
API — no Meta template/approval needed, but IMT's number must opt in
once: WhatsApp `I allow callmebot to send me messages` to
`+34 644 51 95 23` from `766653639`, then the API key it replies with
goes in `.env.local` as `CALLMEBOT_API_KEY`. Keep this only as a
stopgap; the Meta path is the permanent one once the template above is
approved.

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
recipient allow-list, permissions, etc). Common ones seen while
setting this up:

- `code 190` — token expired/invalid.
- `code 132001` "Template name does not exist in the translation" —
  right template name, wrong WABA (or wrong language code).
- `code 100` "Authorization Error" — token can read the phone number
  but its System User hasn't been granted send access to that WABA as
  an asset; generate a fresh token and make sure the correct WABA is
  included in its asset access.
