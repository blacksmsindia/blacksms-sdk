/**
 * BlackSMS SDK Configuration Options
 */
interface BlackSMSClientOptions {
    /**
     * Your BlackSMS API key from the dashboard.
     */
    apiKey: string;
    /**
     * Base URL for BlackSMS endpoints.
     * @default "https://blacksms.in"
     */
    baseUrl?: string;
    /**
     * Request timeout in milliseconds.
     * @default 15000
     */
    timeoutMs?: number;
    /**
     * Optional custom HTTP headers to include in every request.
     */
    headers?: Record<string, string>;
    /**
     * Optional custom fetch implementation.
     */
    fetch?: typeof fetch;
}
/**
 * Parameters for sending an SMS OTP or WhatsApp OTP.
 */
interface OtpSendParams {
    /**
     * Registered Sender ID in your BlackSMS account (e.g. 1, 2, 10 or string ID).
     */
    senderId?: string | number;
    /**
     * Raw parameter alias for senderId.
     */
    sender_id?: string | number;
    /**
     * The variable values / OTP code (e.g., "123456").
     */
    variablesValues?: string;
    /**
     * Raw parameter alias for variablesValues.
     */
    variables_values?: string;
    /**
     * Short alias for OTP code.
     */
    code?: string;
    /**
     * Recipient phone number or comma-separated list of numbers.
     */
    numbers: string | string[];
    /**
     * SMS routing option.
     * @default 1
     */
    route?: number;
}
/**
 * Response structure for SMS OTP and WhatsApp OTP endpoints.
 */
interface OtpSendResponse {
    /**
     * Status indicator (1 for success, 0 for failure).
     */
    status: number;
    /**
     * Status description or error message from server.
     */
    message: string;
    /**
     * Any additional properties returned by the server.
     */
    [key: string]: unknown;
}
/**
 * Parameters for sending Quick SMS.
 */
interface QuickSmsSendParams {
    /**
     * Registered Sender ID in your BlackSMS account (e.g. 1, 2, 10 or string ID).
     */
    senderId?: string | number;
    /**
     * Raw parameter alias for senderId.
     */
    sender_id?: string | number;
    /**
     * SMS text message content.
     */
    message: string;
    /**
     * Recipient mobile number(s).
     */
    numbers: string | string[];
    /**
     * Route selection.
     */
    route?: number;
}
/**
 * Response structure for Quick SMS.
 */
interface QuickSmsSendResponse {
    /**
     * Status code or indicator (1 for success, 0 for failure).
     */
    status?: number;
    /**
     * Boolean success status.
     */
    success?: boolean;
    /**
     * Server response message.
     */
    message: string;
    /**
     * Any additional fields returned by the endpoint.
     */
    [key: string]: unknown;
}
/**
 * Parameters for creating a Bulk SMS campaign.
 */
interface BulkSmsCampaignParams {
    /**
     * Title / Name of the campaign.
     */
    title: string;
    /**
     * Campaign SMS message text.
     */
    message: string;
    /**
     * Array of recipient contact phone numbers.
     */
    contacts: string[];
}
/**
 * Response structure for Bulk SMS campaign creation.
 */
interface BulkSmsCampaignResponse {
    /**
     * Success boolean status.
     */
    success: boolean;
    /**
     * Human readable response message.
     */
    message: string;
    /**
     * Created campaign identifier on BlackSMS.
     */
    campaign_id?: number;
    /**
     * Provider reference campaign ID.
     */
    provider_campaign_id?: string;
    /**
     * Count of total contact numbers processed.
     */
    total_contacts?: number;
    /**
     * Number of SMS parts per message.
     */
    sms_parts?: number;
    /**
     * Total cost calculated for campaign.
     */
    total_cost?: number;
    /**
     * URL to track campaign stats.
     */
    tracking_url?: string;
    /**
     * Number of invalid numbers ignored.
     */
    invalid_ignored?: number;
    /**
     * List of invalid numbers.
     */
    invalid_list?: string[];
    /**
     * Any additional response attributes.
     */
    [key: string]: unknown;
}

declare class HttpClient {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly timeoutMs;
    private readonly customHeaders;
    private readonly fetchImpl;
    constructor(options: BlackSMSClientOptions);
    post<T>(path: string, body: Record<string, unknown>): Promise<T>;
}

declare class OtpService {
    private readonly http;
    constructor(http: HttpClient);
    private formatPayload;
    /**
     * Send an OTP message via SMS.
     * Endpoint: `POST https://blacksms.in/sms`
     */
    sendSms(params: OtpSendParams): Promise<OtpSendResponse>;
    /**
     * Send an OTP message via WhatsApp.
     * Endpoint: `POST https://blacksms.in/wasms`
     */
    sendWhatsApp(params: OtpSendParams): Promise<OtpSendResponse>;
}

declare class QuickSmsService {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Send a Quick SMS message.
     * Endpoint: `POST https://blacksms.in/quick-sms`
     */
    send(params: QuickSmsSendParams): Promise<QuickSmsSendResponse>;
}

declare class BulkSmsService {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Create a new Bulk SMS campaign.
     * Endpoint: `POST https://blacksms.in/endpoints/v1/bulk-sms`
     */
    createCampaign(params: BulkSmsCampaignParams): Promise<BulkSmsCampaignResponse>;
}

/**
 * Main SDK client for BlackSMS platform APIs.
 */
declare class BlackSMS {
    private readonly http;
    /**
     * Service for sending SMS OTP and WhatsApp OTP.
     */
    readonly otp: OtpService;
    /**
     * Service for sending Quick SMS messages.
     */
    readonly quickSms: QuickSmsService;
    /**
     * Service for creating Bulk SMS campaigns.
     */
    readonly bulkSms: BulkSmsService;
    /**
     * Initialize a new BlackSMS SDK client instance.
     * @param options Configuration options containing your API key.
     */
    constructor(options: BlackSMSClientOptions);
}

/**
 * Base class for all errors thrown by the BlackSMS SDK.
 */
declare class BlackSMSError extends Error {
    constructor(message: string);
}
/**
 * Exception thrown when the BlackSMS API returns a non-2xx status code
 * or a payload containing error indicators (`status: 0` or `success: false`).
 */
declare class BlackSMSAPIError extends BlackSMSError {
    /**
     * HTTP status code (e.g. 400, 401, 500) if available.
     */
    readonly statusCode?: number;
    /**
     * The parsed response body from the BlackSMS API.
     */
    readonly response?: unknown;
    constructor(message: string, statusCode?: number, response?: unknown);
}
/**
 * Exception thrown when a network failure or request timeout occurs.
 */
declare class BlackSMSNetworkError extends BlackSMSError {
    readonly cause?: Error;
    constructor(message: string, cause?: Error);
}

export { BlackSMS, BlackSMSAPIError, type BlackSMSClientOptions, BlackSMSError, BlackSMSNetworkError, type BulkSmsCampaignParams, type BulkSmsCampaignResponse, BulkSmsService, HttpClient, type OtpSendParams, type OtpSendResponse, OtpService, type QuickSmsSendParams, type QuickSmsSendResponse, QuickSmsService };
