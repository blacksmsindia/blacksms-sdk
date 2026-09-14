/**
 * BlackSMS SDK Configuration Options
 */
export interface BlackSMSClientOptions {
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
export interface OtpSendParams {
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
export interface OtpSendResponse {
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
export interface QuickSmsSendParams {
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
export interface QuickSmsSendResponse {
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
export interface BulkSmsCampaignParams {
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
export interface BulkSmsCampaignResponse {
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
