import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

type StatusProps = {
  variant?: 'VERIFIED' | 'PENDING' | 'FAILED';
  text?: string;
};

const Status: FC<StatusProps> = ({ variant, text }) => {
  return (
    <span className="flex gap-2 items-center">
      <span
        className={twMerge(
          'size-3 flex-none rounded-full',
          (variant === 'VERIFIED' || !variant) && 'bg-success',
          variant === 'PENDING' && 'bg-warning',
          variant === 'FAILED' && 'bg-error'
        )}
      />
      <span className="text-text-str font-bold flex-none">
        {text || variant || 'VERIFIED'}
      </span>
    </span>
  );
  switch (variant) {
    default:
    case 'VERIFIED':
      return (
        <span className="flex gap-2 items-center">
          <span className="bg-success size-3 flex-none rounded-full" />
          <span className="text-text-str font-bold flex-none">
            {text || variant || 'VERIFIED'}
          </span>
        </span>
      );
    case 'PENDING':
      return <span style={{ color: 'orange' }}>{text || variant}</span>;
    case 'FAILED':
      return <span style={{ color: 'red' }}>{text || variant}</span>;
  }
};

export default Status;
