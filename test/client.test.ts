import { describe, it, expect, vi } from 'vitest';
import { BlackSMS, BlackSMSAPIError, BlackSMSError } from '../src/index.js';

describe('BlackSMS SDK Client', () => {
  it('throws BlackSMSError if initialized without an API key', () => {
    // @ts-expect-error testing invalid argument
    expect(() => new BlackSMS({})).toThrow(BlackSMSError);
    // @ts-expect-error testing invalid argument
    expect(() => new BlackSMS({ apiKey: '' })).toThrow('initialized without an API key');
  });

  it('sends SMS OTP with authorization header and formatted payload', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ status: 1, message: 'OTP Sent' })
    });

    const client = new BlackSMS({
      apiKey: 'test-api-key-123',
      fetch: mockFetch as unknown as typeof fetch
    });

    const res = await client.otp.sendSms({
      senderId: 1,
      variablesValues: '654321',
      numbers: '9876543210',
      route: 1
    });

    expect(res).toEqual({ status: 1, message: 'OTP Sent' });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://blacksms.in/sms');
    expect(init.headers['Authorization']).toBe('test-api-key-123');
    expect(init.headers['Content-Type']).toBe('application/json');

    const body = JSON.parse(init.body);
    expect(body).toEqual({
      sender_id: 1,
      variables_values: '654321',
      numbers: '9876543210',
      route: 1
    });
  });

  it('sends WhatsApp OTP payload to /wasms', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ status: 1, message: 'WhatsApp OTP Sent' })
    });

    const client = new BlackSMS({
      apiKey: 'wa-api-key',
      fetch: mockFetch as unknown as typeof fetch
    });

    const res = await client.otp.sendWhatsApp({
      sender_id: 'WASENDER',
      code: '888999',
      numbers: ['9876543210', '9123456789']
    });

    expect(res.status).toBe(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://blacksms.in/wasms');
    const body = JSON.parse(init.body);
    expect(body).toEqual({
      sender_id: 'WASENDER',
      variables_values: '888999',
      numbers: '9876543210,9123456789',
      route: 1
    });
  });

  it('sends Quick SMS to /quick-sms', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ status: 1, message: 'Quick SMS Sent' })
    });

    const client = new BlackSMS({
      apiKey: 'quick-key',
      fetch: mockFetch as unknown as typeof fetch
    });

    await client.quickSms.send({
      senderId: 'QUICKS',
      message: 'Hello testing quick sms',
      numbers: '9998887770'
    });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://blacksms.in/quick-sms');
    const body = JSON.parse(init.body);
    expect(body).toEqual({
      sender_id: 'QUICKS',
      message: 'Hello testing quick sms',
      numbers: '9998887770'
    });
  });

  it('creates Bulk SMS Campaign at /endpoints/v1/bulk-sms', async () => {
    const mockResponse = {
      success: true,
      message: 'Bulk SMS Campaign created successfully.',
      campaign_id: 42,
      provider_campaign_id: '98124',
      total_contacts: 2,
      sms_parts: 1,
      total_cost: 0.4,
      tracking_url: 'https://blacksms.in/bulk-sms/campaign/42',
      invalid_ignored: 0,
      invalid_list: []
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(mockResponse)
    });

    const client = new BlackSMS({
      apiKey: 'bulk-key',
      fetch: mockFetch as unknown as typeof fetch
    });

    const res = await client.bulkSms.createCampaign({
      title: 'Promo Flash Sale',
      message: 'Exclusive deal today!',
      contacts: ['9876543210', '9123456789']
    });

    expect(res).toEqual(mockResponse);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://blacksms.in/endpoints/v1/bulk-sms');
    const body = JSON.parse(init.body);
    expect(body).toEqual({
      title: 'Promo Flash Sale',
      message: 'Exclusive deal today!',
      contacts: ['9876543210', '9123456789']
    });
  });

  it('throws BlackSMSAPIError on status: 0 server response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ status: 0, message: 'Invalid Route ID' })
    });

    const client = new BlackSMS({
      apiKey: 'key',
      fetch: mockFetch as unknown as typeof fetch
    });

    await expect(
      client.otp.sendSms({
        numbers: '9876543210',
        variablesValues: '1234'
      })
    ).rejects.toThrow(BlackSMSAPIError);
  });
});
