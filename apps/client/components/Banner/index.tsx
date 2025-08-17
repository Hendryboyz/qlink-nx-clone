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
        className={size ? size : "h-[6.375rem] w-[6.375rem]"}
      />
    </div>
  );
};

export default Banner;
