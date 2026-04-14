import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KvkkRequest, KvkkRequestStatus } from './entities/kvkk-request.entity';
import { CreateKvkkRequestDto } from './dto/create-kvkk-request.dto';
import { UpdateKvkkStatusDto } from './dto/update-kvkk-status.dto';

@Injectable()
export class KvkkService {
  constructor(
    @InjectRepository(KvkkRequest)
    private readonly kvkkRepository: Repository<KvkkRequest>,
  ) {}

  async createRequest(dto: CreateKvkkRequestDto, userId?: string): Promise<KvkkRequest> {
    const request = this.kvkkRepository.create({
      user_id: userId ?? null,
      full_name: dto.full_name,
      email: dto.email,
      request_type: dto.request_type,
      details: dto.details ?? null,
      status: KvkkRequestStatus.Pending,
    });
    return this.kvkkRepository.save(request);
  }

  async adminList(status?: KvkkRequestStatus, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const qb = this.kvkkRepository
      .createQueryBuilder('k')
      .orderBy('k.created_at', 'DESC')
      .skip(offset)
      .take(limit);

    if (status) {
      qb.where('k.status = :status', { status });
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async updateStatus(id: string, dto: UpdateKvkkStatusDto): Promise<KvkkRequest> {
    const request = await this.kvkkRepository.findOne({ where: { id } });
    if (!request) throw new NotFoundException('KVKK_REQUEST_NOT_FOUND');

    request.status = dto.status;
    if (dto.admin_notes !== undefined) request.admin_notes = dto.admin_notes;

    return this.kvkkRepository.save(request);
  }
}
