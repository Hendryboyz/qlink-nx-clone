import React, { HTMLAttributes } from 'react';
const GradientBackground: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #FFF0D3 40%, #D60027 100%)',
      }}
      className='w-full'
    >
      {children}
    </div>
  );
};

export default GradientBackground;
