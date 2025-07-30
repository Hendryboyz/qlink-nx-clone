export default function buildUpdatingMap(updatingDto: object): {[key: string]: any} {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(updatingDto).filter(([_, v]) => v !== undefined)
  );
}
