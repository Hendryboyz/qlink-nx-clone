import { GenerateMessagesStrategy } from '$/notification/strategies/generate-messages.strategy';

type ResetPasswordOtpPayload = {
  username: string;
  code: string;
}

export class ResetPasswordOtpStrategy implements GenerateMessagesStrategy {
  constructor(payload: ResetPasswordOtpPayload) {
  }

  generateSubject(): string {
    return 'Reset your password in QLink APP'
  }

  generateContent(): string {
    throw new Error('Method not implemented.');
  }
}
