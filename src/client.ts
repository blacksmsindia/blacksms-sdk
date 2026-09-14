import { HttpClient } from './http.js';
import { OtpService } from './services/otp.js';
import { QuickSmsService } from './services/quick-sms.js';
import { BulkSmsService } from './services/bulk-sms.js';
import { BlackSMSClientOptions } from './types.js';

/**
 * Main SDK client for BlackSMS platform APIs.
 */
export class BlackSMS {
  private readonly http: HttpClient;

  /**
   * Service for sending SMS OTP and WhatsApp OTP.
   */
  public readonly otp: OtpService;

  /**
   * Service for sending Quick SMS messages.
   */
  public readonly quickSms: QuickSmsService;

  /**
   * Service for creating Bulk SMS campaigns.
   */
  public readonly bulkSms: BulkSmsService;

  /**
   * Initialize a new BlackSMS SDK client instance.
   * @param options Configuration options containing your API key.
   */
  constructor(options: BlackSMSClientOptions) {
    this.http = new HttpClient(options);
    this.otp = new OtpService(this.http);
    this.quickSms = new QuickSmsService(this.http);
    this.bulkSms = new BulkSmsService(this.http);
  }
}
