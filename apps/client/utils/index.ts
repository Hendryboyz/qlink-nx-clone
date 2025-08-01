export const NOOP = () => {}
export const API_PUBLIC_HOST = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0];

export const DEFAULT_MODELS = [
  { id: 1, title: 'AGRO 150', img: '/assets/vehicles/22.AGRO-150_BL.png' },
  { id: 2, title: 'AGRO 200', img: '/assets/vehicles/23.AGRO_200.png' },
  { id: 3, title: 'AGRO-II 150' },
  { id: 4, title: 'CG 125-I', img: '/assets/vehicles/2.CG125-I.png' },
  { id: 5, title: 'CHAMPION 200', img: '/assets/vehicles/7.Champion-200_red.png' },
  { id: 6, title: 'CRUISER 125', img: '/assets/vehicles/13.Cruiser.png' },
  { id: 7, title: 'D-SUPER 150', img: '/assets/vehicles/4.D-SUPER-150.png' },
  { id: 8, title: 'FIRE 150' },
  { id: 9, title: 'G12 125' },
  { id: 10, title: 'G13 125', img: '/assets/vehicles/12.QGL-125-G13.png' },
  { id: 11, title: 'G8 125 Alloy', img: '/assets/vehicles/9.QGL-125-G8.png' },
  { id: 12, title: 'G8 125 Spoke', img: '/assets/vehicles/9.QGL-125-G8.png' },
  { id: 13, title: 'GD 110', img: '/assets/vehicles/16.GD-110_BK.png' },
  { id: 14, title: 'GUNNER-I 125' },
  { id: 15, title: 'LUCKY ULTRA 110' },
  { id: 16, title: 'MONSTER 150', img: '/assets/vehicles/14.Monster 2.0.png' },
  { id: 17, title: 'QG 125', img: '/assets/vehicles/1.QG-125.png' },
  { id: 18, title: 'RACER 250' },
  { id: 19, title: 'RAPTOR 250' },
  { id: 20, title: 'RANGER 125' },
  { id: 21, title: 'RANGER 150' },
  { id: 22, title: 'REIZ 110', img: '/assets/vehicles/18.REIZ-110_BK.png' },
  { id: 23, title: 'RKT 200', img: '/assets/vehicles/8.RKT-200.png' },
  { id: 24, title: 'SPRINT 150', img: '/assets/vehicles/3.Sprint_150.png' },
  { id: 25, title: 'SUPER RANGER 200' },
  { id: 26, title: 'TARGET 110', img: '/assets/vehicles/21.Target 110_BK.png' },
  { id: 27, title: 'TIGER 150', img: '/assets/vehicles/5.TIGER-150.png' },
  { id: 28, title: 'TIGER 160' },
  { id: 29, title: 'TIGER 200', img: '/assets/vehicles/6.TIGER-200_BK.png' },
  { id: 30, title: 'UD ULTRA 110' },
  { id: 31, title: 'VELOCITY 110', img: '/assets/vehicles/19.VELOCITY_BK.png' },
  { id: 32, title: 'WISDOM 110', img: '/assets/vehicles/15.WISDOM-110-66.png' },
  { id: 33, title: 'XPREZ 125' },
];

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}
