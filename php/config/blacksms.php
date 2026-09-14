<?php

return [
    /*
    |--------------------------------------------------------------------------
    | BlackSMS API Key
    |--------------------------------------------------------------------------
    |
    | Your BlackSMS secret API key obtained from https://blacksms.in/dashboard.
    | Set `BLACKSMS_API_KEY` in your `.env` file.
    |
    */
    'api_key' => env('BLACKSMS_API_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | API Base URL
    |--------------------------------------------------------------------------
    |
    | Default endpoint base URL for BlackSMS services.
    |
    */
    'base_url' => env('BLACKSMS_BASE_URL', 'https://blacksms.in'),

    /*
    |--------------------------------------------------------------------------
    | Default Sender ID
    |--------------------------------------------------------------------------
    |
    | Default approved DLT Sender ID for your SMS & WhatsApp OTPs.
    |
    */
    'default_sender_id' => env('BLACKSMS_DEFAULT_SENDER_ID', ''),
];
