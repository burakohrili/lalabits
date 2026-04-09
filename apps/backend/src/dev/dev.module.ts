/**
 * DEV VERIFICATION ONLY — Batch 1.2 closeout
 * Remove this module (and its import in AppModule) before staging/production deployment.
 */
import { Module } from '@nestjs/common';
import { DevController } from './dev.controller';

@Module({
  controllers: [DevController],
})
export class DevModule {}
