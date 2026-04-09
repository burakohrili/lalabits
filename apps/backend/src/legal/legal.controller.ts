import { Controller, Get } from '@nestjs/common';
import { LegalService } from './legal.service';
import { LegalDocumentType } from './entities/legal-document-version.entity';

@Controller('legal')
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  @Get('terms-of-service')
  getTermsOfService() {
    return this.legalService.getCurrent(LegalDocumentType.TermsOfService);
  }

  @Get('privacy-policy')
  getPrivacyPolicy() {
    return this.legalService.getCurrent(LegalDocumentType.PrivacyPolicy);
  }

  @Get('creator-agreement')
  getCreatorAgreement() {
    return this.legalService.getCurrent(LegalDocumentType.CreatorAgreement);
  }
}
