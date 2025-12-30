import { Fragment, type FC } from 'react';
import { twMerge } from 'tailwind-merge';

enum CircleStatus {
  Running = 'running',
  Finished = 'finished',
  Waiting = 'waiting',
}

const commonClassnames =
  'size-6 rounded-full text-base font-manrope-bold grid grid-cols-1 place-items-center flex-none';

const Circle = ({
  status,
  number,
}: {
  status: CircleStatus;
  number: string;
}) => {
  switch (status) {
    case CircleStatus.Running:
      return (
        <div className={twMerge(commonClassnames, 'bg-primary text-fill')}>
          {number}
        </div>
      );
    case CircleStatus.Waiting:
      return (
        <div
          className={twMerge(
            commonClassnames,
            'bg-white text-primary border border-primary'
          )}
        >
          {number}
        </div>
      );
    case CircleStatus.Finished:
      return (
        <div className={twMerge(commonClassnames, 'bg-stroke-w text-fill')}>
          {number}
        </div>
      );
    default:
      return null;
  }
};

type ProgressBarProps = {
  list: string[];
  runningIndex?: number;
};

export const ProgressBar: FC<ProgressBarProps> = ({ list, runningIndex = 0 }) => {
  return (
    <div className="flex w-full items-center justify-between">
      {list.map((item, index) => (
        <Fragment key={item}>
          <Circle
            status={
              index < runningIndex
                ? CircleStatus.Finished
                : index === runningIndex
                ? CircleStatus.Running
                : CircleStatus.Waiting
            }
            number={item}
          />
          {index !== list.length - 1 && (
            <div
              className={twMerge(
                'flex-auto h-[1px]',
                index < runningIndex ? 'bg-stroke-w' : 'bg-primary'
              )}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};
