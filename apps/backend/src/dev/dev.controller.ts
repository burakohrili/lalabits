/**
 * DEV VERIFICATION ONLY — Batch 1.2 closeout
 * Remove this module before any staging or production deployment.
 *
 * Endpoints:
 *   GET /dev/storage-check  — presigned PUT + signed GET round-trip test
 *   GET /dev/email-check    — test email delivered to local Mailpit inbox
 */
import { Controller, Get, Query } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { EmailService } from '../email/email.service';

const TEST_KEY = 'dev-verify/batch-1.2-test.txt';

@Controller('dev')
export class DevController {
  constructor(
    private readonly storage: StorageService,
    private readonly email: EmailService,
  ) {}

  @Get('storage-check')
  async storageCheck() {
    const putUrl = await this.storage.getPresignedPutUrl(
      TEST_KEY,
      'text/plain',
    );
    const getUrl = await this.storage.getSignedGetUrl(TEST_KEY);
    return {
      note: 'Step 1: PUT a file using putUrl. Step 2: GET the file using getUrl.',
      putUrl,
      getUrl,
    };
  }

  @Get('email-check')
  async emailCheck(@Query('to') to: string = 'dev@lalabits.local') {
    await this.email.sendMail(
      to,
      '[Batch 1.2 Verify] Test Email',
      '<p>Email delivery verified. lalabits.art local stack is operational.</p>',
    );
    return { sent: true, to };
  }
}
