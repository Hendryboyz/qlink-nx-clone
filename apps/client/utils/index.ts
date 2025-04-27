export const NOOP = () => {}
export const API_PUBLIC_HOST = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0];
export const DEFAULT_MODELS = [
  { id: 1, title: 'Ninja 400' },
  { id: 2, title: 'Duke 250' },
  { id: 3, title: 'Duke 390' },
];
