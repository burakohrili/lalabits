import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalDocumentVersion, LegalDocumentType } from './entities/legal-document-version.entity';

@Injectable()
export class LegalService {
  constructor(
    @InjectRepository(LegalDocumentVersion)
    private readonly legalDocumentVersionRepository: Repository<LegalDocumentVersion>,
  ) {}

  async getCurrent(documentType: LegalDocumentType): Promise<{
    document_type: string;
    version_identifier: string;
    effective_date: string;
    is_current: boolean;
  }> {
    const version = await this.legalDocumentVersionRepository.findOne({
      where: { document_type: documentType, is_current: true },
    });

    if (!version) {
      throw new NotFoundException(`No current version found for ${documentType}`);
    }

    return {
      document_type: version.document_type,
      version_identifier: version.version_identifier,
      effective_date: version.effective_date,
      is_current: version.is_current,
    };
  }
}
