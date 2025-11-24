import { type FC, useState } from 'react';
import { Menu, X } from 'lucide-react';

import LogoPng from './assets/logo.png';
import { TGButton } from '../../tailgrids/button';

type TopNavProps = {
  onLogoClick?: () => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  isSignedIn?: boolean;
};

const TopNav: FC<TopNavProps> = ({
  onLogoClick,
  onMenuOpen,
  onMenuClose,
  isSignedIn,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="w-full px-6 py-3 flex items-center justify-between border-b bg-fill border-stroke-w">
      <img
        src={LogoPng}
        alt="Logo"
        className="size-[30px]"
        onClick={() => onLogoClick?.()}
      />
      <div className="flex items-center gap-2">
        {!isSignedIn && <TGButton size="sm">Sign In</TGButton>}
        {isMenuOpen && (
          <X
            className="size-6 text-stroke-s"
            onClick={() => {
              setIsMenuOpen(false);
              onMenuClose?.();
            }}
          />
        )}
        {!isMenuOpen && (
          <Menu
            className="size-6 text-stroke-s"
            onClick={() => {
              setIsMenuOpen(true);
              onMenuOpen?.();
            }}
          />
        )}
      </div>
    </nav>
  );
};

export default TopNav;
