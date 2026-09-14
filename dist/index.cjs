"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BlackSMS: () => BlackSMS,
  BlackSMSAPIError: () => BlackSMSAPIError,
  BlackSMSError: () => BlackSMSError,
  BlackSMSNetworkError: () => BlackSMSNetworkError,
  BulkSmsService: () => BulkSmsService,
  HttpClient: () => HttpClient,
  OtpService: () => OtpService,
  QuickSmsService: () => QuickSmsService
});
module.exports = __toCommonJS(src_exports);

// src/errors.ts
var BlackSMSError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "BlackSMSError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
var BlackSMSAPIError = class extends BlackSMSError {
  /**
   * HTTP status code (e.g. 400, 401, 500) if available.
   */
  statusCode;
  /**
   * The parsed response body from the BlackSMS API.
   */
  response;
  constructor(message, statusCode, response) {
    super(message);
    this.name = "BlackSMSAPIError";
    this.statusCode = statusCode;
    this.response = response;
  }
};
var BlackSMSNetworkError = class extends BlackSMSError {
  cause;
  constructor(message, cause) {
    super(message);
    this.name = "BlackSMSNetworkError";
    this.cause = cause;
  }
};

// src/http.ts
var HttpClient = class {
  apiKey;
  baseUrl;
  timeoutMs;
  customHeaders;
  fetchImpl;
  constructor(options) {
    if (!options || typeof options.apiKey !== "string" || options.apiKey.trim() === "") {
      throw new BlackSMSError('BlackSMS SDK initialized without an API key. Please pass { apiKey: "YOUR_API_KEY" }.');
    }
    this.apiKey = options.apiKey.trim();
    this.baseUrl = (options.baseUrl || "https://blacksms.in").replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs ?? 15e3;
    this.customHeaders = options.headers || {};
    this.fetchImpl = options.fetch || globalThis.fetch;
    if (typeof this.fetchImpl !== "function") {
      throw new BlackSMSError(
        "No fetch implementation available in this environment. Please run on Node.js 18+ or pass a custom `fetch` function in client options."
      );
    }
  }
  async post(path, body) {
    const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const headers = {
      "Authorization": this.apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...this.customHeaders
    };
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), this.timeoutMs) : null;
    try {
      const response = await this.fetchImpl(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller?.signal
      });
      let json;
      const text = await response.text();
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = { raw: text };
      }
      if (!response.ok) {
        const errorMsg = typeof json === "object" && json !== null && "message" in json && typeof json.message === "string" ? json.message : `HTTP request failed with status ${response.status}`;
        throw new BlackSMSAPIError(errorMsg, response.status, json);
      }
      if (typeof json === "object" && json !== null) {
        const obj = json;
        if (obj.status === 0 || obj.success === false) {
          const message = typeof obj.message === "string" ? obj.message : "BlackSMS API request failed";
          throw new BlackSMSAPIError(message, response.status, json);
        }
      }
      return json;
    } catch (err) {
      if (err instanceof BlackSMSError) {
        throw err;
      }
      if (err instanceof Error && err.name === "AbortError") {
        throw new BlackSMSNetworkError(`Request timed out after ${this.timeoutMs}ms.`);
      }
      throw new BlackSMSNetworkError(
        err instanceof Error ? err.message : "An unknown network error occurred",
        err instanceof Error ? err : void 0
      );
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
};

// src/services/otp.ts
var OtpService = class {
  constructor(http) {
    this.http = http;
  }
  http;
  formatPayload(params) {
    const senderId = params.senderId ?? params.sender_id;
    const variablesValues = params.variablesValues ?? params.variables_values ?? params.code;
    const numbers = Array.isArray(params.numbers) ? params.numbers.join(",") : params.numbers;
    const payload = {
      numbers,
      route: params.route ?? 1
    };
    if (senderId) {
      payload.sender_id = senderId;
    }
    if (variablesValues !== void 0) {
      payload.variables_values = variablesValues;
    }
    return payload;
  }
  /**
   * Send an OTP message via SMS.
   * Endpoint: `POST https://blacksms.in/sms`
   */
  async sendSms(params) {
    const payload = this.formatPayload(params);
    return this.http.post("/sms", payload);
  }
  /**
   * Send an OTP message via WhatsApp.
   * Endpoint: `POST https://blacksms.in/wasms`
   */
  async sendWhatsApp(params) {
    const payload = this.formatPayload(params);
    return this.http.post("/wasms", payload);
  }
};

// src/services/quick-sms.ts
var QuickSmsService = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * Send a Quick SMS message.
   * Endpoint: `POST https://blacksms.in/quick-sms`
   */
  async send(params) {
    const senderId = params.senderId ?? params.sender_id;
    const numbers = Array.isArray(params.numbers) ? params.numbers.join(",") : params.numbers;
    const payload = {
      message: params.message,
      numbers
    };
    if (senderId) {
      payload.sender_id = senderId;
    }
    if (params.route !== void 0) {
      payload.route = params.route;
    }
    return this.http.post("/quick-sms", payload);
  }
};

// src/services/bulk-sms.ts
var BulkSmsService = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * Create a new Bulk SMS campaign.
   * Endpoint: `POST https://blacksms.in/endpoints/v1/bulk-sms`
   */
  async createCampaign(params) {
    const payload = {
      title: params.title,
      message: params.message,
      contacts: Array.isArray(params.contacts) ? params.contacts : [params.contacts]
    };
    return this.http.post("/endpoints/v1/bulk-sms", payload);
  }
};

// src/client.ts
var BlackSMS = class {
  http;
  /**
   * Service for sending SMS OTP and WhatsApp OTP.
   */
  otp;
  /**
   * Service for sending Quick SMS messages.
   */
  quickSms;
  /**
   * Service for creating Bulk SMS campaigns.
   */
  bulkSms;
  /**
   * Initialize a new BlackSMS SDK client instance.
   * @param options Configuration options containing your API key.
   */
  constructor(options) {
    this.http = new HttpClient(options);
    this.otp = new OtpService(this.http);
    this.quickSms = new QuickSmsService(this.http);
    this.bulkSms = new BulkSmsService(this.http);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlackSMS,
  BlackSMSAPIError,
  BlackSMSError,
  BlackSMSNetworkError,
  BulkSmsService,
  HttpClient,
  OtpService,
  QuickSmsService
});
//# sourceMappingURL=index.cjs.map