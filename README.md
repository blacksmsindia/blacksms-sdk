# BlackSMS Node.js / TypeScript SDK (`blacksms`)

Official zero-dependency TypeScript & Node.js client library for the [BlackSMS API Platform](https://docs.blacksms.in/).

Easily send **SMS OTPs**, **WhatsApp OTPs**, **Quick SMS**, and manage **Bulk SMS Campaigns** from Node.js, Bun, Deno, and Edge environments.

---

## Features

- ⚡ **Zero External Runtime Dependencies** — Native `fetch` support.
- 📘 **First-Class TypeScript Support** — Auto-completion and strict typing for requests & responses.
- 📦 **Dual ESM & CommonJS Bundles** — Works seamlessly with `import` and `require`.
- 🔐 **Secure Header Authentication** — Automated API Key injection.
- 🛡️ **Comprehensive Error Handling** — Custom error classes for API errors and network timeouts.

---

## Installation

```bash
npm install blacksms
```
or with yarn / pnpm / bun:
```bash
pnpm add blacksms
yarn add blacksms
bun add blacksms
```

---

## Quick Start

Initialize the SDK client with your API key from the [BlackSMS Dashboard](https://blacksms.in/login):

```typescript
import { BlackSMS } from 'blacksms';

const client = new BlackSMS({
  apiKey: 'YOUR_BLACKSMS_API_KEY'
});
```

---

## Usage Examples

### 1. Send SMS OTP

```typescript
const response = await client.otp.sendSms({
  senderId: 1, // Your numeric Sender ID from BlackSMS dashboard (e.g., 1, 2, 10)
  variablesValues: '482910', // OTP code
  numbers: '9876543210',
  route: 1
});

console.log(response);
// Output: { status: 1, message: 'OTP Sent' }
```

### 2. Send WhatsApp OTP

```typescript
const response = await client.otp.sendWhatsApp({
  senderId: 1,
  variablesValues: '482910',
  numbers: '9876543210',
  route: 1
});

console.log(response);
// Output: { status: 1, message: 'OTP Sent' }
```

### 3. Send Quick SMS

```typescript
const response = await client.quickSms.send({
  senderId: 'MYBRAND',
  message: 'Your order #1042 has been shipped!',
  numbers: '9876543210'
});

console.log(response);
```

### 4. Create Bulk SMS Campaign

```typescript
const campaign = await client.bulkSms.createCampaign({
  title: 'Weekend Promo Sale',
  message: 'Get 20% off all items today! Visit https://example.com',
  contacts: ['9876543210', '9123456789']
});

console.log(campaign);
/*
Output:
{
  success: true,
  message: 'Bulk SMS Campaign created successfully.',
  campaign_id: 12,
  provider_campaign_id: '98124',
  total_contacts: 2,
  sms_parts: 1,
  total_cost: 0.4,
  tracking_url: 'https://blacksms.in/bulk-sms/campaign/12',
  invalid_ignored: 0,
  invalid_list: []
}
*/
```

---

## Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `apiKey` | `string` | **Required** | Your secret BlackSMS API key. |
| `baseUrl` | `string` | `"https://blacksms.in"` | Custom API base URL if needed. |
| `timeoutMs` | `number` | `15000` | Request timeout in milliseconds. |
| `headers` | `Record<string, string>` | `{}` | Optional custom HTTP headers. |

---

## Error Handling

The SDK throws structured error instances:

```typescript
import { BlackSMS, BlackSMSAPIError, BlackSMSNetworkError } from 'blacksms';

try {
  await client.otp.sendSms({
    numbers: '9876543210',
    variablesValues: '123456'
  });
} catch (error) {
  if (error instanceof BlackSMSAPIError) {
    console.error('API Error:', error.message);
    console.error('HTTP Status:', error.statusCode);
    console.error('API Response Payload:', error.response);
  } else if (error instanceof BlackSMSNetworkError) {
    console.error('Network or Timeout Error:', error.message);
  } else {
    console.error('Unexpected Error:', error);
  }
}
```

---

## License

[MIT](LICENSE)
