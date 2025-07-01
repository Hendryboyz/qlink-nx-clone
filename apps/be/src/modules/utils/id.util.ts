export const ENTITY_PREFIX = {
  member: 'M',
  vehicle: 'VRD',
};

export function generateSalesForceId(entityPrefix: string, entityCount: number) {
  const current = new Date();
  const month = ((current.getMonth() + 1) + "").padStart(2, "0");
  const year = (current.getFullYear() % 100) + "";
  const monthOfYear = `${year}${month}`
  const serial = ((entityCount + 1) + "").padStart(6, "0");
  return `${entityPrefix}-${monthOfYear}-${serial}`;
}
