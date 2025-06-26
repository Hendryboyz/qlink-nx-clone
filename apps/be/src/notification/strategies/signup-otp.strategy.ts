import { GenerateMessagesStrategy } from '$/notification/strategies/generate-messages.strategy';

type SignupOtpPayload = {
  receiver: string;
  code: string;
}

export class SignupOtpStrategy implements GenerateMessagesStrategy {
  private receiver: string;
  private code: string;

  constructor(private readonly payload: SignupOtpPayload) {
    const {receiver, code} = payload;
    this.receiver = receiver;
    this.code = code;
  }
  generateSubject(): string {
    return 'Welcome to QLink APP'
  }

  generateContent(): string {
    return `Hello ${this.receiver}, this is your OTP code: ${this.code}`;
  }
}
