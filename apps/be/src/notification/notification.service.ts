import { Injectable, Logger } from '@nestjs/common';
import { MSG_TEMPLATE } from '$/notification/notification.types';
import mailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { GenerateMessagesStrategy } from '$/notification/strategies/generate-messages.strategy';
import { SignupOtpStrategy } from '$/notification/strategies/signup-otp.strategy';
import { ResetPasswordOtpStrategy } from '$/notification/strategies/reset-password-otp.strategy';

@Injectable()
export class NotificationService {
  private logger = new Logger(this.constructor.name);
  private mailer: mailer.Transporter = undefined;
  constructor(
    private readonly config: ConfigService,
  ) {
    const mailerOptions = {
      host: this.config.get<string>('SMTP_SERVER'),
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASSWORD'),
      },
      port: +this.config.get<number>('SMTP_PORT'),
    };
    this.logger.debug(mailerOptions);
    this.mailer = mailer.createTransport(mailerOptions);
  }

  public async sendMail(
    receiver: string,
    messageTemplate: MSG_TEMPLATE,
    payload: any,
  ): Promise<void> {
    const messageGenerator: GenerateMessagesStrategy =
      this.createGenerateMessageFactory(messageTemplate, payload);
    try {
      const info = await this.mailer.sendMail({
        from: this.config.get<string>('SMTP_SENDER'),
        to: receiver,
        subject: messageGenerator.generateSubject(),
        html: messageGenerator.generateContent(),
      });
      this.logger.debug(`send ${messageTemplate.toString()} mail to ${receiver}: ${JSON.stringify(info)}`);
    } catch(e) {
      this.logger.error(`fail to send ${messageTemplate.toString()} mail to ${receiver}`, e.stack);
      throw e;
    }
  }

  private createGenerateMessageFactory(messageTemplate: MSG_TEMPLATE, payload: any): GenerateMessagesStrategy {
    if (messageTemplate === MSG_TEMPLATE.SIGNUP_OTP) {
      return new SignupOtpStrategy(payload);
    } else {
      return new ResetPasswordOtpStrategy(payload);
    }
  }

  public sendSMS(identifier: string, messageTemplate: MSG_TEMPLATE) {

  }
}
