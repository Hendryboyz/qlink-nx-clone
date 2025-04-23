import { BaseHTMLAttributes } from 'react';

const Banner = ({ className, ...props }: BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`border-white border-solid text-white border-2 w-fit text-3xl text-h p-1 font-bold mt-auto mb-auto ${className}`}
      {...props}
    >
      <p>QLINK</p>
      <p className="tracking-wide">RIDER</p>
      <p className="tracking-widest">CLUB</p>
    </div>
  );
};

export default Banner;
