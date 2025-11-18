import { type FC } from 'react';

import HomeSvg from './assets/Home';
import MotorbikeSvg from './assets/Motorbike';
import CouponSvg from './assets/Coupon';
import UserCircleSvg from './assets/UserCircle';
import { twMerge } from 'tailwind-merge';

enum BottomNavItem {
  Home = 'Home',
  MyGarage = 'My Garage',
  MyQpon = 'My Qpon',
  Member = 'Member',
}

const BottmItemList = [
  {
    icon: <HomeSvg />,
    label: BottomNavItem.Home,
  },
  {
    icon: <MotorbikeSvg />,
    label: BottomNavItem.MyGarage,
  },
  {
    icon: <CouponSvg />,
    label: BottomNavItem.MyQpon,
  },
  {
    icon: <UserCircleSvg />,
    label: BottomNavItem.Member,
  },
];

type BottomNavProps = {
  onItemClick: (itemLabel: string) => void;
  activeItem?: string;
};

const BottomNav: FC<BottomNavProps> = ({ onItemClick, activeItem }) => {
  return (
    <nav className="bg-fill grid grid-cols-4 w-full border-t border-[#D7D7D7] py-4">
      {BottmItemList.map((item) => (
        <div
          key={item.label}
          className={twMerge(
            'text-[#D7D7D7] cursor-pointer grid w-fit mx-auto grid-cols-1 justify-items-center',
            activeItem === item.label && 'text-primary'
          )}
          onClick={() => onItemClick(item.label)}
        >
          {item.icon}
          <div className="font-manrope-bold text-xs font-bold">{item.label}</div>
        </div>
      ))}
    </nav>
  );
};

export { BottomNavItem };
export default BottomNav;
