export const NOOP = () => {
  console.debug('this is dummy method');
}
export const API_PUBLIC_HOST = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0];

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}
