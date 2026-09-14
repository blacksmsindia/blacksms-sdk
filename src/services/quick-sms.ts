import { HttpClient } from '../http.js';
import { QuickSmsSendParams, QuickSmsSendResponse } from '../types.js';

export class QuickSmsService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Send a Quick SMS message.
   * Endpoint: `POST https://blacksms.in/quick-sms`
   */
  public async send(params: QuickSmsSendParams): Promise<QuickSmsSendResponse> {
    const senderId = params.senderId ?? params.sender_id;
    const numbers = Array.isArray(params.numbers) ? params.numbers.join(',') : params.numbers;

    const payload: Record<string, unknown> = {
      message: params.message,
      numbers
    };

    if (senderId) {
      payload.sender_id = senderId;
    }

    if (params.route !== undefined) {
      payload.route = params.route;
    }

    return this.http.post<QuickSmsSendResponse>('/quick-sms', payload);
  }
}
