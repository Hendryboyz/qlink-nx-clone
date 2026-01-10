import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export type SectionHeaderProps = {
  title: string;
  className?: string;
};

const SectionHeader: FC<SectionHeaderProps> = ({ title, className }) => {
  return (
    <div
      className={twMerge(
        'px-4 py-4 bg-secondary flex items-center',
        className
      )}
    >
      <span className="font-manrope-bold font-bold text-base leading-[140%] text-text-str">
        {title}
      </span>
    </div>
  );
};

export default SectionHeader;
