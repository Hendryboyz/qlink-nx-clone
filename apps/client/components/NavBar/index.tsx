import React, { useRef, useState, useEffect } from 'react';
import { TopNav } from '@org/components';
import SideMenu from '$/components/SideMenu';

type Link = {
  name: string;
  href: string;
};

type NavBarProps = {
  imgSrc: string;
  isSignedIn: boolean;
  onSignInClick?: () => void;
  onNavHeightChange?: (height: number) => void;
};

const guestLinks: Link[] = [
  { name: 'Home', href: '/' },
  { name: 'News', href: '/news' },
  { name: 'Promotion', href: '' },
  { name: 'Contact Us', href: '/contact' },
];

const signedInLinks: Link[] = [
  { name: 'Home', href: '/' },
  { name: 'Member', href: '/member' },
  { name: 'My Garage', href: '/garage' },
  { name: 'Coupons', href: '' },
  { name: 'News', href: '/news' },
  { name: 'Promotion', href: '' },
  { name: 'Contact Us', href: '' },
];

const termLinks: Link[] = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms Of Service', href: '/terms-of-service' },
];

const NavBar = React.forwardRef<HTMLElement, NavBarProps>(
  (
    {
      imgSrc,
      isSignedIn,
      onSignInClick,
      onNavHeightChange,
    },
    ref
  ) => {
    const navRef = useRef<HTMLElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [navHeight, setNavHeight] = useState(55);

    useEffect(() => {
      if (navRef.current) {
        const height = navRef.current.offsetHeight;
        setNavHeight(height);
        onNavHeightChange?.(height);
      }
    }, [onNavHeightChange]);

    return (
      <>
        <div className="fixed top-0 left-0 w-full z-50">
          <TopNav
            ref={navRef}
            imgSrc={imgSrc}
            isOpen={isMenuOpen}
            onMenuOpen={() => setIsMenuOpen(true)}
            onMenuClose={() => setIsMenuOpen(false)}
            onSignInClick={onSignInClick}
            isSignedIn={isSignedIn}
          />
        </div>

        {/* Side Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        <SideMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          navHeight={navHeight}
          guestLinks={guestLinks}
          signedInLinks={signedInLinks}
          termLinks={termLinks}
          isSignedIn={isSignedIn}
        />
      </>
    );
  }
);

NavBar.displayName = 'NavBar';

export default NavBar;
