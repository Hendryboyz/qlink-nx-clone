import * as bcrypt from 'bcrypt';

export const ENTITY_PREFIX = {
  member: 'M',
  vehicle: 'VRD',
};

export function generateSalesForceId(
  entityPrefix: string,
  entityCount: number,
  isProduction: boolean = false,
) {
  const current = new Date();
  const month = ((current.getMonth() + 1) + "").padStart(2, "0");
  const year = (current.getFullYear() % 100) + "";
  const monthOfYear = `${year}${month}`
  const serial = (entityCount + "").padStart(5, "0");
  const leadingDigit = isProduction ? "0" : "1";
  return `${entityPrefix}-${monthOfYear}-${leadingDigit}${serial}`;
}

export async function hashPassword(password: string): Promise<string> {
  const PasswordSalt = 10;
  return await bcrypt.hash(password, PasswordSalt);
}
