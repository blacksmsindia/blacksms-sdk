import { HttpClient } from '../http.js';
import { OtpSendParams, OtpSendResponse } from '../types.js';

export class OtpService {
  constructor(private readonly http: HttpClient) {}

  private formatPayload(params: OtpSendParams): Record<string, unknown> {
    const senderId = params.senderId ?? params.sender_id;
    const variablesValues = params.variablesValues ?? params.variables_values ?? params.code;
    const numbers = Array.isArray(params.numbers) ? params.numbers.join(',') : params.numbers;

    const payload: Record<string, unknown> = {
      numbers,
      route: params.route ?? 1
    };

    if (senderId) {
      payload.sender_id = senderId;
    }

    if (variablesValues !== undefined) {
      payload.variables_values = variablesValues;
    }

    return payload;
  }

  /**
   * Send an OTP message via SMS.
   * Endpoint: `POST https://blacksms.in/sms`
   */
  public async sendSms(params: OtpSendParams): Promise<OtpSendResponse> {
    const payload = this.formatPayload(params);
    return this.http.post<OtpSendResponse>('/sms', payload);
  }

  /**
   * Send an OTP message via WhatsApp.
   * Endpoint: `POST https://blacksms.in/wasms`
   */
  public async sendWhatsApp(params: OtpSendParams): Promise<OtpSendResponse> {
    const payload = this.formatPayload(params);
    return this.http.post<OtpSendResponse>('/wasms', payload);
  }
}
