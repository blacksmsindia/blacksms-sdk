# BlackSMS Python SDK (`blacksms`)

Official Python client library for the [BlackSMS API Platform](https://docs.blacksms.in/).

Easily send **SMS OTPs**, **WhatsApp OTPs**, **Quick SMS**, and manage **Bulk SMS Campaigns** in Python, Django, FastAPI, and Flask.

---

## Installation

```bash
pip install blacksms
```

---

## Quick Start

```python
from blacksms import BlackSMS, BlackSMSAPIError

# Initialize client with your API key
client = BlackSMS(api_key="YOUR_BLACKSMS_API_KEY")

# 1. Send SMS OTP
try:
    response = client.send_sms(
        sender_id=1,          # Your numeric Sender ID (e.g. 1, 2, 10)
        code="123456",        # OTP code
        numbers="9876543210", # Recipient number
        route=1
    )
    print("SMS OTP Sent:", response)
except BlackSMSAPIError as e:
    print("API Error:", e)

# 2. Send WhatsApp OTP
response = client.send_whatsapp(
    sender_id=1,
    code="123456",
    numbers="9876543210"
)

# 3. Send Quick SMS
response = client.send_quick_sms(
    sender_id=1,
    message="Welcome to BlackSMS!",
    numbers="9876543210"
)

# 4. Create Bulk SMS Campaign
campaign = client.create_bulk_sms_campaign(
    title="Promo Sale",
    message="Check out our special offers!",
    contacts=["9876543210", "9123456789"]
)
print("Campaign Created:", campaign)
```
