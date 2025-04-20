import React, { HTMLAttributes } from 'react';

const ColorBackground: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  color,
  children,
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      style={{
        background: color,
      }}
      className='w-full'
    >
      {children}
    </div>
  );
};

export default ColorBackground;
