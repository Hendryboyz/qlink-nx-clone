import { forwardRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { TGButton } from '../button';

type TopNavProps = {
  imgSrc: string;
  onLogoClick?: () => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onSignInClick?: () => void;
  isSignedIn?: boolean;
  isOpen?: boolean;
};

const TopNav = forwardRef<HTMLElement, TopNavProps>(({
  imgSrc,
  onLogoClick,
  onMenuOpen,
  onMenuClose,
  onSignInClick,
  isSignedIn,
  isOpen,
}, ref) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isMenuOpen = isOpen !== undefined ? isOpen : internalIsOpen;

  return (
    <nav className="w-full px-6 py-3 flex items-center justify-between border-b bg-fill border-stroke-w" ref={ref}>
      <img
        src={imgSrc}
        alt="Logo"
        className="size-[30px]"
        onClick={() => onLogoClick?.()}
      />
      <div className="flex items-center gap-2">
        {!isSignedIn && <TGButton size="sm" onClick={() => onSignInClick?.()}>Sign In</TGButton>}
        {isMenuOpen && (
          <X
            className="size-6 text-stroke-s"
            onClick={() => {
              if (isOpen === undefined) setInternalIsOpen(false);
              onMenuClose?.();
            }}
          />
        )}
        {!isMenuOpen && (
          <Menu
            className="size-6 text-stroke-s"
            onClick={() => {
              if (isOpen === undefined) setInternalIsOpen(true);
              onMenuOpen?.();
            }}
          />
        )}
      </div>
    </nav>
  );
});

export default TopNav;
