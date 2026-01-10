import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type ListItemProps = {
  icon?: ReactNode;
  title: string;
  value?: string;
  className?: string;
};

const ListItem: FC<ListItemProps> = ({
  icon,
  title,
  value,
  className,
}) => {
  return (
    <div
      className={twMerge(
        'flex items-center gap-4 px-4 py-3 bg-fill border-b border-stroke-w',
        className
      )}
    >
      {icon && (
        <div className="flex-shrink-0 text-stroke-s w-6 h-6 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-manrope-extrabold font-[800] text-base leading-[125%] tracking-[0.15px] text-text-str">
          {title}
        </span>
        {value && (
          <span className="font-manrope font-normal text-sm leading-[125%] text-text-w">
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

export default ListItem;
