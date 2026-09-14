<?php

namespace BlackSMS;

use Exception;

class BlackSMS
{
    protected string $apiKey;
    protected string $baseUrl;
    protected ?string $defaultSenderId;

    public function __construct(string $apiKey, string $baseUrl = 'https://blacksms.in', ?string $defaultSenderId = null)
    {
        if (empty($apiKey)) {
            throw new Exception('BlackSMS API key cannot be empty.');
        }

        $this->apiKey = trim($apiKey);
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->defaultSenderId = $defaultSenderId;
    }

    /**
     * Internal cURL request helper.
     */
    protected function request(string $endpoint, array $payload): array
    {
        $url = $this->baseUrl . '/' . ltrim($endpoint, '/');

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: ' . $this->apiKey,
            'Content-Type: application/json',
            'Accept: application/json'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        $response = curl_exec($ch);
        $error = curl_error($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($error) {
            throw new Exception("BlackSMS Network Error: {$error}");
        }

        $result = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $result = ['raw' => $response];
        }

        if ($statusCode >= 400) {
            $message = $result['message'] ?? "HTTP error status {$statusCode}";
            throw new Exception("BlackSMS API Error: {$message}");
        }

        return $result ?? [];
    }

    /**
     * Send SMS OTP.
     * Endpoint: POST /sms
     */
    public function sendSms(array $params): array
    {
        $payload = [
            'sender_id' => $params['sender_id'] ?? $params['senderId'] ?? $this->defaultSenderId,
            'variables_values' => $params['variables_values'] ?? $params['variablesValues'] ?? $params['code'] ?? '',
            'numbers' => is_array($params['numbers']) ? implode(',', $params['numbers']) : $params['numbers'],
            'route' => $params['route'] ?? 1
        ];

        return $this->request('/sms', $payload);
    }

    /**
     * Send WhatsApp OTP.
     * Endpoint: POST /wasms
     */
    public function sendWhatsApp(array $params): array
    {
        $payload = [
            'sender_id' => $params['sender_id'] ?? $params['senderId'] ?? $this->defaultSenderId,
            'variables_values' => $params['variables_values'] ?? $params['variablesValues'] ?? $params['code'] ?? '',
            'numbers' => is_array($params['numbers']) ? implode(',', $params['numbers']) : $params['numbers'],
            'route' => $params['route'] ?? 1
        ];

        return $this->request('/wasms', $payload);
    }

    /**
     * Send Quick SMS.
     * Endpoint: POST /quick-sms
     */
    public function sendQuickSms(array $params): array
    {
        $payload = [
            'sender_id' => $params['sender_id'] ?? $params['senderId'] ?? $this->defaultSenderId,
            'message' => $params['message'] ?? '',
            'numbers' => is_array($params['numbers']) ? implode(',', $params['numbers']) : $params['numbers']
        ];

        if (isset($params['route'])) {
            $payload['route'] = $params['route'];
        }

        return $this->request('/quick-sms', $payload);
    }

    /**
     * Create Bulk SMS Campaign.
     * Endpoint: POST /endpoints/v1/bulk-sms
     */
    public function createBulkSmsCampaign(array $params): array
    {
        $payload = [
            'title' => $params['title'] ?? 'Campaign',
            'message' => $params['message'] ?? '',
            'contacts' => is_array($params['contacts']) ? $params['contacts'] : [$params['contacts']]
        ];

        return $this->request('/endpoints/v1/bulk-sms', $payload);
    }
}
