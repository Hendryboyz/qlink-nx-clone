export const NOOP = () => {}
export const API_PUBLIC_HOST = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0];

export const DEFAULT_MODELS = [
  { id: 1, title: 'AGRO 150' },
  { id: 2, title: 'AGRO 200' },
  { id: 3, title: 'AGRO-II 150' },
  { id: 4, title: 'CG 125-I' },
  { id: 5, title: 'CHAMPION 200' },
  { id: 6, title: 'CRUISER 125' },
  { id: 7, title: 'D-SUPER 150' },
  { id: 8, title: 'FIRE 150' },
  { id: 9, title: 'G12 125' },
  { id: 10, title: 'G13 125' },
  { id: 11, title: 'G8 125 Alloy' },
  { id: 12, title: 'G8 125 Spoke' },
  { id: 13, title: 'GD 110' },
  { id: 14, title: 'GUNNER-I 125' },
  { id: 15, title: 'LUCKY ULTRA 110' },
  { id: 16, title: 'MONSTER 150' },
  { id: 17, title: 'QG 125' },
  { id: 18, title: 'RACER 250' },
  { id: 19, title: 'RAPTOR 250' },
  { id: 20, title: 'RANGER 125' },
  { id: 21, title: 'RANGER 150' },
  { id: 22, title: 'REIZ 110' },
  { id: 23, title: 'RKT 200' },
  { id: 24, title: 'SPRINT 150' },
  { id: 25, title: 'SUPER RANGER 200' },
  { id: 26, title: 'TARGET 110' },
  { id: 27, title: 'TIGER 150' },
  { id: 28, title: 'TIGER 160' },
  { id: 29, title: 'TIGER 200' },
  { id: 30, title: 'UD ULTRA 110' },
  { id: 31, title: 'VELOCITY 110' },
  { id: 32, title: 'WISDOM 110' },
  { id: 33, title: 'XPREZ 125' },
];

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}
