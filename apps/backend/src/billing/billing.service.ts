import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceType } from './entities/invoice.entity';
import { MembershipSubscription } from './entities/membership-subscription.entity';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(MembershipSubscription)
    private readonly subscriptionRepository: Repository<MembershipSubscription>,
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
  ) {}

  async listInvoices(userId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where: { fan_user_id: userId },
      order: { issued_at: 'DESC' },
      skip: offset,
      take: limit,
    });

    // Resolve creator name for subscription-linked invoices
    const subIds = invoices
      .filter((inv) => inv.membership_subscription_id)
      .map((inv) => inv.membership_subscription_id!);

    const subMap = new Map<string, { creator_display_name: string | null; creator_username: string | null }>();

    if (subIds.length > 0) {
      const subs = await this.subscriptionRepository
        .createQueryBuilder('sub')
        .leftJoinAndSelect('sub.creator_profile', 'creator')
        .where('sub.id IN (:...ids)', { ids: subIds })
        .getMany();

      for (const sub of subs) {
        const profile = sub.creator_profile as CreatorProfile | null;
        subMap.set(sub.id, {
          creator_display_name: profile?.display_name ?? null,
          creator_username: profile?.username ?? null,
        });
      }
    }

    const items = invoices.map((inv) => {
      const subInfo = inv.membership_subscription_id
        ? subMap.get(inv.membership_subscription_id) ?? null
        : null;

      return {
        id: inv.id,
        invoice_type: inv.invoice_type,
        label: this.resolveLabel(inv.invoice_type),
        amount_try: inv.amount_try,
        currency: inv.currency,
        status: inv.status,
        issued_at: inv.issued_at,
        paid_at: inv.paid_at,
        creator_display_name: subInfo?.creator_display_name ?? null,
        creator_username: subInfo?.creator_username ?? null,
      };
    });

    return { items, total, page, limit };
  }

  private resolveLabel(invoiceType: InvoiceType): string {
    switch (invoiceType) {
      case InvoiceType.SubscriptionCharge:
        return 'Üyelik Başlangıç';
      case InvoiceType.SubscriptionRenewal:
        return 'Üyelik Yenileme';
      case InvoiceType.OneTimePurchase:
        return 'Satın Alma';
      case InvoiceType.Refund:
        return 'İade';
      default:
        return 'Ödeme';
    }
  }
}
