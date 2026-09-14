# 🚀 BlackSMS Multi-Framework Integration Guide

Complete developer guide and ready-to-copy code snippets for integrating BlackSMS (**SMS OTP**, **WhatsApp OTP**, **Quick SMS**, and **Bulk SMS Campaigns**) in **NPM**, **React**, **Next.js**, **Laravel**, **PHP**, **Python**, **Vue**, **Flutter**, and **cURL**.

---

## Table of Contents
1. [Node.js & Express (NPM)](#1-nodejs--express-npm)
2. [Next.js (App Router / Server Actions)](#2-nextjs-app-router)
3. [React (Vite / CRA + Resend Timer Hook)](#3-react-vite--cra)
4. [Laravel (PHP Facade & ServiceProvider)](#4-laravel-php)
5. [Pure PHP (cURL / Native Script)](#5-pure-php)
6. [Python (Django / FastAPI / Flask)](#6-python)
7. [Vue 3 / Nuxt 3](#7-vue-3--nuxt-3)
8. [Flutter / Dart](#8-flutter--dart)
9. [cURL / REST API Direct Request](#9-curl--rest-api)

---

## 1. Node.js & Express (NPM)

### Installation
```bash
npm install blacksms
```

### Express Controller Example
```typescript
import express from 'express';
import { BlackSMS, BlackSMSAPIError } from 'blacksms';

const app = express();
app.use(express.json());

const blackSms = new BlackSMS({
  apiKey: process.env.BLACKSMS_API_KEY || 'YOUR_API_KEY'
});

// Route: Send OTP
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Send SMS OTP
    const result = await blackSms.otp.sendSms({
      senderId: 'MYBRAND',
      variablesValues: otpCode,
      numbers: phone,
      route: 1
    });

    res.json({ success: true, message: 'OTP sent successfully', data: result });
  } catch (error) {
    if (error instanceof BlackSMSAPIError) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## 2. Next.js (App Router)

### File: `app/api/otp/route.ts` (API Route)
```typescript
import { NextResponse } from 'next/server';
import { BlackSMS } from 'blacksms';

const client = new BlackSMS({
  apiKey: process.env.BLACKSMS_API_KEY!
});

export async function POST(request: Request) {
  const { phone, type } = await request.json();
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const response = type === 'whatsapp'
      ? await client.otp.sendWhatsApp({ senderId: 'MYBRAND', code, numbers: phone })
      : await client.otp.sendSms({ senderId: 'MYBRAND', code, numbers: phone });

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
```

---

## 3. React (Vite / CRA)

### Resend OTP Timer Hook Example
```tsx
import React, { useState } from 'react';
import { useOtpTimer } from 'blacksms/react';

export function OtpForm() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const { timeLeft, formattedTime, isActive, canResend, startTimer } = useOtpTimer({ seconds: 60 });

  const handleSendOtp = async () => {
    startTimer();
    await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
  };

  return (
    <div className="otp-container">
      <input
        type="tel"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      
      <button onClick={handleSendOtp} disabled={isActive}>
        {isActive ? `Resend in ${formattedTime}` : 'Send OTP'}
      </button>

      {canResend && <p>Didn't receive code? Click resend above.</p>}
    </div>
  );
}
```

---

## 4. Laravel (PHP)

### Step 1: Add to `composer.json` or path
```bash
composer require blacksms/laravel
```

### Step 2: Set `.env` Variables
```env
BLACKSMS_API_KEY=your_secret_api_key_here
BLACKSMS_DEFAULT_SENDER_ID=MYBRAND
```

### Step 3: Publish Configuration (Optional)
```bash
php artisan vendor:publish --tag=blacksms-config
```

### Step 4: Controller Usage (`app/Http/Controllers/OtpController.php`)
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use BlackSMS;

class OtpController extends Controller
{
    public function sendSmsOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string'
        ]);

        $otp = rand(100000, 999999);

        // 1. Send SMS OTP via Facade
        $result = BlackSMS::sendSms([
            'sender_id' => 'MYBRAND',
            'variables_values' => (string)$otp,
            'numbers' => $request->phone,
            'route' => 1
        ]);

        return response()->json(['status' => 'success', 'data' => $result]);
    }

    public function sendWhatsAppOtp(Request $request)
    {
        // 2. Send WhatsApp OTP via Facade
        $result = BlackSMS::sendWhatsApp([
            'variables_values' => '654321',
            'numbers' => $request->phone
        ]);

        return response()->json(['status' => 'success', 'data' => $result]);
    }

    public function sendBulkCampaign(Request $request)
    {
        // 3. Create Bulk SMS Campaign
        $campaign = BlackSMS::createBulkSmsCampaign([
            'title' => 'Festival Flash Sale',
            'message' => 'Get 30% OFF using code SALE30!',
            'contacts' => ['9876543210', '9123456789']
        ]);

        return response()->json($campaign);
    }
}
```

---

## 5. Pure PHP

```php
<?php
require_once __DIR__ . '/vendor/autoload.php';

use BlackSMS\BlackSMS;

$blackSms = new BlackSMS('YOUR_BLACKSMS_API_KEY');

// Send Quick SMS
$response = $blackSms->sendQuickSms([
    'sender_id' => 'MYBRAND',
    'message' => 'Welcome to our platform!',
    'numbers' => '9876543210'
]);

print_r($response);
```

---

## 6. Python

```python
from blacksms import BlackSMS, BlackSMSAPIError

client = BlackSMS(api_key="YOUR_BLACKSMS_API_KEY")

# Send SMS OTP
try:
    response = client.send_sms(
        sender_id="MYBRAND",
        code="998877",
        numbers="9876543210"
    )
    print("OTP Response:", response)
except BlackSMSAPIError as e:
    print("API Failed:", e)
```

---

## 7. Vue 3 / Nuxt 3

### Nuxt 3 Server Route (`server/api/otp.post.ts`)
```typescript
import { BlackSMS } from 'blacksms';

const client = new BlackSMS({
  apiKey: useRuntimeConfig().blacksmsApiKey
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await client.otp.sendSms({
    senderId: 'MYBRAND',
    code: '123456',
    numbers: body.phone
  });
});
```

---

## 8. Flutter / Dart

```dart
import 'package:http/http.dart' as http;
import 'convert.dart';

Future<void> sendBlackSmsOtp(String phone, String otp) async {
  final url = Uri.parse('https://blacksms.in/sms');
  final response = await http.post(
    url,
    headers: {
      'Authorization': 'YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      'sender_id': 'MYBRAND',
      'variables_values': otp,
      'numbers': phone,
      'route': 1,
    }),
  );

  print('Response: ${response.body}');
}
```

---

## 9. cURL / REST API

### Send SMS OTP
```bash
curl -X POST https://blacksms.in/sms \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sender_id": "MYBRAND",
    "variables_values": "123456",
    "numbers": "9876543210",
    "route": 1
  }'
```

### Send WhatsApp OTP
```bash
curl -X POST https://blacksms.in/wasms \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sender_id": "MYBRAND",
    "variables_values": "123456",
    "numbers": "9876543210",
    "route": 1
  }'
```

### Create Bulk SMS Campaign
```bash
curl -X POST https://blacksms.in/endpoints/v1/bulk-sms \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Promo Campaign",
    "message": "Check out our services!",
    "contacts": ["9876543210", "9123456789"]
  }'
```
