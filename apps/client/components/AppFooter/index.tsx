import React from 'react';
import { Footer } from '@org/components';

type Link = {
  name: string;
  href: string;
};

type MediaLink = Link & {
  imgSrc: string;
};

type AppFooterProps = {
  isSignedIn: boolean;
};

const guestLinks: Link[] = [
  { name: 'Home', href: '/' },
  { name: 'News', href: '/news' },
  { name: 'Promotion', href: '' },
  { name: 'Contact Us', href: '' },
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

const mediaLinks: MediaLink[] = [
  {
    name: 'WhatsApp',
    href: '',
    imgSrc: '/assets/v2/whats-app.png',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/1Da4LHfKBJ/?mibextid=wwXIfr',
    imgSrc: '/assets/v2/fb.png',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/qlink_motorcycle',
    imgSrc: '/assets/v2/ig.png',
  },
];

const termLinks: Link[] = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms Of Service', href: '/terms-of-service' },
];

const AppFooter: React.FC<AppFooterProps> = ({ isSignedIn }) => {
  return (
    <Footer
      guestLinks={guestLinks}
      signedInLinks={signedInLinks}
      mediaLinks={mediaLinks}
      termLinks={termLinks}
      isSignedIn={isSignedIn}
    />
  );
};

export default AppFooter;
