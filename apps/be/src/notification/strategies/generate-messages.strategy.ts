export interface GenerateMessagesStrategy {
  generateSubject(): string;
  generateContent(): string;
}
