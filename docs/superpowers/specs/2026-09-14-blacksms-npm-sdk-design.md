# BlackSMS NPM SDK Design Specification

- **Date**: 2026-09-14
- **Package Name**: `blacksms`
- **Target Runtime**: Node.js 18+, Bun, Deno, Edge, Browser (fetch-compatible)

## 1. Overview
`blacksms` is a lightweight, zero-dependency Node.js and TypeScript client wrapper for the BlackSMS API platform (https://docs.blacksms.in/). It allows developers to send SMS OTPs, WhatsApp OTPs, Quick SMS messages, and manage Bulk SMS campaigns with typed options and error handling.

## 2. API Endpoints & Request Mapping

| Service Method | HTTP Method | Endpoint Path | API Request Body / Query |
| :--- | :--- | :--- | :--- |
| `client.otp.sendSms(params)` | POST | `https://blacksms.in/sms` | `{"sender_id", "variables_values", "numbers", "route"}` |
| `client.otp.sendWhatsApp(params)` | POST | `https://blacksms.in/wasms` | `{"sender_id", "variables_values", "numbers", "route"}` |
| `client.quickSms.send(params)` | POST / GET | `https://blacksms.in/quick-sms` | `{"sender_id", "message", "numbers"}` |
| `client.bulkSms.createCampaign(params)` | POST | `https://blacksms.in/endpoints/v1/bulk-sms` | `{"title", "message", "contacts"}` |

Authentication Header: `Authorization: <YOUR_API_KEY>`

## 3. Data Flow & Class Structure

```mermaid
graph TD
    UserApp[User Application] -->|import { BlackSMS }| Client[BlackSMS Client]
    Client --> OTP[OtpService]
    Client --> Quick[QuickSmsService]
    Client --> Bulk[BulkSmsService]
    OTP --> HTTP[HttpClient]
    Quick --> HTTP
    Bulk --> HTTP
    HTTP -->|fetch API| BlackSMSAPI[https://blacksms.in]
```

## 4. Error Handling Strategy

- `BlackSMSError`: Base class for all SDK errors.
- `BlackSMSAPIError`: Thrown when API returns failure payload e.g. `{ status: 0, message: "..." }` or `{ success: false, message: "..." }` or HTTP status code is non-2xx. Includes `statusCode` and raw `response`.
- `BlackSMSNetworkError`: Thrown on request timeout, DNS/network connection error.
