import { Injectable, OnModuleInit, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require('iyzipay');

export interface IyzicoCheckoutFormResult {
  status: string;                   // 'success' | 'failure'
  errorCode?: string;
  errorMessage?: string;
  paymentId?: string;
  paidPrice?: string;
  price?: string;
  currency?: string;
  conversationId?: string;
  cardUserKey?: string;
  binNumber?: string;
  lastFourDigits?: string;
  cardAssociation?: string;
  cardFamily?: string;
  cardType?: string;
}

export interface IyzicoCheckoutFormInit {
  status: string;
  errorCode?: string;
  errorMessage?: string;
  checkoutFormContent?: string;   // HTML to embed
  token?: string;
  tokenExpireTime?: number;
}

export interface IyzicoSubscriptionCheckoutInit {
  status: string;
  errorCode?: string;
  errorMessage?: string;
  checkoutFormContent?: string;
  token?: string;
}

export interface IyzicoSubscriptionCheckoutResult {
  status: string;
  errorCode?: string;
  errorMessage?: string;
  referenceCode?: string;               // subscription reference at gateway
  parentReferenceCode?: string;
  pricingPlanReferenceCode?: string;
  subscriptionStatus?: string;          // ACTIVE | PASSIVE | CANCELED | ...
  startDate?: string;
  endDate?: string;
  trialStartDate?: string;
  trialEndDate?: string;
  customer?: { referenceCode: string; email: string };
}

export interface IyzicoSubscriptionDetails {
  status: string;
  errorCode?: string;
  errorMessage?: string;
  data?: {
    referenceCode: string;
    parentReferenceCode: string;
    subscriptionStatus: string;         // ACTIVE | PASSIVE | CANCELED | UPGRADED
    pricingPlanReferenceCode: string;
    startDate: string;
    endDate: string;
    trialEndDate?: string;
    customer: { referenceCode: string; email: string };
  };
}

export interface IyzicoSubscriptionCancelResult {
  status: string;
  errorCode?: string;
  errorMessage?: string;
}

@Injectable()
export class IyzicoService implements OnModuleInit {
  private readonly logger = new Logger(IyzicoService.name);
  private client: any;
  private enabled: boolean;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('IYZICO_API_KEY', '');
    const secretKey = this.configService.get<string>('IYZICO_SECRET_KEY', '');
    const baseUrl = this.configService.get<string>(
      'IYZICO_BASE_URL',
      'https://sandbox.iyzipay.com',
    );

    this.enabled = this.configService.get<string>('PAYMENT_ENABLED', 'false') === 'true';

    if (this.enabled) {
      if (!apiKey || !secretKey) {
        throw new InternalServerErrorException(
          'IYZICO_API_KEY and IYZICO_SECRET_KEY must be set when PAYMENT_ENABLED=true',
        );
      }
      this.client = new Iyzipay({ apiKey, secretKey, uri: baseUrl });
      this.logger.log(`İyzico client initialized — base: ${baseUrl}`);
    } else {
      this.logger.log('İyzico client skipped — PAYMENT_ENABLED=false (mock mode)');
    }
  }

  get isEnabled(): boolean {
    return this.enabled;
  }

  // ── One-time checkout form ───────────────────────────────────────────────

  initializeCheckoutForm(request: object): Promise<IyzicoCheckoutFormInit> {
    return new Promise((resolve, reject) => {
      this.client.checkoutFormInitialize.create(request, (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result as IyzicoCheckoutFormInit);
      });
    });
  }

  retrieveCheckoutFormResult(request: object): Promise<IyzicoCheckoutFormResult> {
    return new Promise((resolve, reject) => {
      this.client.checkoutFormRetrieve.retrieve(request, (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result as IyzicoCheckoutFormResult);
      });
    });
  }

  // ── Subscription checkout form (LD-2: hosted /checkoutform path) ─────────

  initializeSubscriptionCheckoutForm(request: object): Promise<IyzicoSubscriptionCheckoutInit> {
    return new Promise((resolve, reject) => {
      this.client.subscriptionCheckoutForm.initialize(request, (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result as IyzicoSubscriptionCheckoutInit);
      });
    });
  }

  retrieveSubscriptionCheckoutFormResult(request: object): Promise<IyzicoSubscriptionCheckoutResult> {
    return new Promise((resolve, reject) => {
      this.client.subscriptionCheckoutForm.retrieve(request, (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result as IyzicoSubscriptionCheckoutResult);
      });
    });
  }

  // ── Subscription management ───────────────────────────────────────────────

  // LD-3: Called after webhook event to confirm gateway state before local update
  getSubscriptionDetails(referenceCode: string): Promise<IyzicoSubscriptionDetails> {
    return new Promise((resolve, reject) => {
      this.client.subscription.retrieve(
        { subscriptionReferenceCode: referenceCode },
        (err: any, result: any) => {
          if (err) reject(err);
          else resolve(result as IyzicoSubscriptionDetails);
        },
      );
    });
  }

  cancelSubscription(referenceCode: string): Promise<IyzicoSubscriptionCancelResult> {
    return new Promise((resolve, reject) => {
      this.client.subscription.cancel(
        { subscriptionReferenceCode: referenceCode },
        (err: any, result: any) => {
          if (err) reject(err);
          else resolve(result as IyzicoSubscriptionCancelResult);
        },
      );
    });
  }
}
