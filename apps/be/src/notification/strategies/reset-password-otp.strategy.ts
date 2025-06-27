import { GenerateMessagesStrategy } from '$/notification/strategies/generate-messages.strategy';

type ResetPasswordOtpPayload = {
  username: string;
  code: string;
}

export class ResetPasswordOtpStrategy implements GenerateMessagesStrategy {
  constructor(private readonly payload: ResetPasswordOtpPayload) {
  }

  generateSubject(): string {
    return 'Reset your password in QLink APP'
  }

  generateContent(): string {
    const {username, code} = this.payload;
    return `Hello ${username}, this is your OTP code: ${code}`;
  }
}
