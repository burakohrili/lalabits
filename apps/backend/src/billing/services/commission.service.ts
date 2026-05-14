import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatorEarning,
  EarningSourceType,
  EarningStatus,
} from '../entities/creator-earning.entity';

const DEFAULT_COMMISSION_RATE = 0.20;

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(CreatorEarning)
    private readonly earningRepository: Repository<CreatorEarning>,
  ) {}

  calculateEarning(grossAmountTry: number): {
    commission: number;
    net: number;
    rate: number;
  } {
    const commission = Math.round(grossAmountTry * DEFAULT_COMMISSION_RATE * 100) / 100;
    const net = Math.round((grossAmountTry - commission) * 100) / 100;
    return { commission, net, rate: DEFAULT_COMMISSION_RATE };
  }

  async recordEarning(opts: {
    creatorProfileId: string;
    sourceType: EarningSourceType;
    sourceId: string;
    grossAmountTry: number;
  }): Promise<CreatorEarning> {
    const { commission, net, rate } = this.calculateEarning(opts.grossAmountTry);
    const now = new Date();

    const earning = this.earningRepository.create({
      creator_profile_id: opts.creatorProfileId,
      source_type: opts.sourceType,
      source_id: opts.sourceId,
      gross_amount_try: opts.grossAmountTry,
      commission_rate: rate,
      commission_amount: commission,
      net_amount_try: net,
      currency: 'TRY',
      period_month: now.getUTCMonth() + 1,
      period_year: now.getUTCFullYear(),
      status: EarningStatus.Pending,
    });

    return this.earningRepository.save(earning);
  }
}
