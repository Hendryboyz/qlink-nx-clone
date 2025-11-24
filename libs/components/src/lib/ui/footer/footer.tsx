import { FC } from 'react';
import WhatsAppPng from './assets/whats-app.png';
import FbPng from './assets/fb.png';
import IgPng from './assets/ig.png';
import { twMerge } from 'tailwind-merge';

type FooterProps = {
  isSignedIn?: boolean;
};

const WHATS_APP_LINK = '';
const FB_LINK = '';
const IG_LINK = '';

const MAIL_ADDRESS = 'support@qlink-qasa.com';

const PRIVACY_LINK = '';
const TERMS_LINK = '';

const CommonFooter: FC<{ links?: { name: string; href: string }[] }> = ({
  links,
}) => (
  <footer className="bg-text-w p-6 text-fill font-manrope">
    <div className="gird grid-col-1 mx-auto justify-center">
      {links?.map((link, index) => (
        <div
          key={link.name}
          className={twMerge(
            'font-bold pb-6 border-b border-fill',
            index !== 0 && 'mt-6'
          )}
        >
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.name}
          </a>
        </div>
      )) || null}
    </div>
    <div className="flex gap-6 mx-auto justify-center mt-6">
      <a className="font-bold" href={`mailto:${MAIL_ADDRESS}`}>
        {MAIL_ADDRESS}
      </a>
    </div>
    <div className="flex gap-4 mx-auto justify-center mt-4">
      <a href={WHATS_APP_LINK} target="_blank" rel="noopener noreferrer">
        <img
          src={WhatsAppPng}
          alt="WhatsApp"
          className="size-12 rounded-full"
        />
      </a>
      <a href={FB_LINK} target="_blank" rel="noopener noreferrer">
        <img src={FbPng} alt="Facebook" className="size-12" />
      </a>
      <a href={IG_LINK} target="_blank" rel="noopener noreferrer">
        <img src={IgPng} alt="Instagram" className="size-12" />
      </a>
    </div>
    <div className="flex gap-6 mx-auto justify-center mt-6">
      <a href={PRIVACY_LINK} target="_blank" rel="noopener noreferrer">
        Privacy Policy
      </a>
      <a href={TERMS_LINK} target="_blank" rel="noopener noreferrer">
        Terms Of Service
      </a>
    </div>
  </footer>
);

const SignedInFooter: FC = () => {
  const SignedInLinks = [
    { name: 'Home', href: '' },
    { name: 'Member', href: '' },
    { name: 'My Garage', href: '' },
    { name: 'Coupons', href: '' },
    { name: 'News', href: '' },
    { name: 'Promotion', href: '' },
    { name: 'Contact Us', href: '' },
  ];
  return <CommonFooter links={SignedInLinks} />;
};

const GuestFooter: FC = () => {
  const GuestLinks = [
    { name: 'Home', href: '' },
    { name: 'News', href: '' },
    { name: 'Promotion', href: '' },
    { name: 'Contact Us', href: '' },
  ];
  return <CommonFooter links={GuestLinks} />;
};

const Footer: FC<FooterProps> = ({ isSignedIn }) => {
  if (isSignedIn) {
    return <SignedInFooter />;
  }
  return <GuestFooter />;
};

export default Footer;
