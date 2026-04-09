import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalDocumentVersion } from './entities/legal-document-version.entity';
import { ConsentRecord } from './entities/consent-record.entity';
import { LegalService } from './legal.service';
import { LegalController } from './legal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([LegalDocumentVersion, ConsentRecord]),
  ],
  providers: [LegalService],
  controllers: [LegalController],
  exports: [TypeOrmModule],
})
export class LegalModule {}
