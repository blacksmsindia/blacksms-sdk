import { HttpClient } from '../http.js';
import { BulkSmsCampaignParams, BulkSmsCampaignResponse } from '../types.js';

export class BulkSmsService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new Bulk SMS campaign.
   * Endpoint: `POST https://blacksms.in/endpoints/v1/bulk-sms`
   */
  public async createCampaign(params: BulkSmsCampaignParams): Promise<BulkSmsCampaignResponse> {
    const payload: Record<string, unknown> = {
      title: params.title,
      message: params.message,
      contacts: Array.isArray(params.contacts) ? params.contacts : [params.contacts]
    };

    return this.http.post<BulkSmsCampaignResponse>('/endpoints/v1/bulk-sms', payload);
  }
}
