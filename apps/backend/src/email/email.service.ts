import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private readonly provider: string;
  private readonly fromAddress: string;
  private readonly fromName: string;

  private resend: Resend | null = null;
  private smtpTransport: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    this.provider = this.config.get<string>('EMAIL_PROVIDER', 'smtp');
    this.fromAddress = this.config.get<string>(
      'EMAIL_FROM_ADDRESS',
      'noreply@lalabits.art',
    );
    this.fromName = this.config.get<string>('EMAIL_FROM_NAME', 'lalabits.art');
  }

  onModuleInit(): void {
    if (this.provider === 'resend') {
      const apiKey = this.config.getOrThrow<string>('EMAIL_API_KEY');
      this.resend = new Resend(apiKey);
      this.logger.log('Email provider: Resend');
    } else {
      const host = this.config.get<string>('EMAIL_SMTP_HOST', 'localhost');
      const port = this.config.get<number>('EMAIL_SMTP_PORT', 1025);
      this.smtpTransport = nodemailer.createTransport({
        host,
        port,
        secure: false,
        ignoreTLS: true,
      });
      this.logger.log(`Email provider: SMTP (${host}:${port})`);
    }
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const wrappedHtml = this.wrapInBaseTemplate(subject, html);
    const from = `${this.fromName} <${this.fromAddress}>`;

    if (this.provider === 'resend' && this.resend) {
      const { error } = await this.resend.emails.send({
        from,
        to,
        subject,
        html: wrappedHtml,
      });
      if (error) {
        this.logger.error(`Email delivery failed to ${to}: ${error.message}`);
        throw new Error(`Email delivery failed: ${error.message}`);
      }
    } else if (this.smtpTransport) {
      await this.smtpTransport.sendMail({
        from,
        to,
        subject,
        html: wrappedHtml,
      });
    }

    this.logger.log(`Email sent to ${to}: ${subject}`);
  }

  private wrapInBaseTemplate(subject: string, body: string): string {
    return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8F9FA; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; }
    .header { background: #008080; padding: 24px 32px; }
    .header a { color: #FFFFFF; font-size: 18px; font-weight: 700; text-decoration: none; letter-spacing: -0.3px; }
    .body { padding: 32px; color: #212121; font-size: 15px; line-height: 1.6; }
    .footer { padding: 20px 32px; background: #F8F9FA; color: #6B7280; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="https://lalabits.art">lalabits.art</a>
    </div>
    <div class="body">
      ${body}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} lalabits.art &mdash; Tüm hakları saklıdır.
    </div>
  </div>
</body>
</html>`.trim();
  }
}
