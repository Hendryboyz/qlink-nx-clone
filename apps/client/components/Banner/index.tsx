import { BaseHTMLAttributes } from 'react';

interface BannerProps extends BaseHTMLAttributes<HTMLDivElement> {
  size?: string;
}

const Banner = ({size, className, ...props }: BannerProps) => {

  return (
    <div
      className="m-auto ${className}"
      {...props}
    >
      <img
        src="/assets/qrc_logo.svg"
        alt="logo"
        className={size ? size : "h-28 w-28"}
      />
    </div>
  );
};

export default Banner;
