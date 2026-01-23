'use client';

import { useEffect, useState, useRef } from 'react';
import { UserVO } from '@org/types';
import { TopNav, BottomNav, BottomNavItem } from '@org/components';
import ListItem from './components/ListItem';
import SectionHeader from './components/SectionHeader';
import API from '$/utils/fetch';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

// Member page icons
import IdIcon from './assets/id.svg';
import BirthdayIcon from './assets/birthday.svg';
import GenderIcon from './assets/gender.svg';
import CityIcon from './assets/city.svg';
import LocationIcon from './assets/location.svg';
import MailIcon from './assets/mail.svg';
import PhoneIcon from './assets/Phone.svg';
import WhatsappIcon from './assets/whatsapp.svg';
import FacebookIcon from './assets/facebook.svg';
import EditButtonIcon from './assets/Button.svg';
import PersonIcon from './assets/person.svg';

const SignedInLinks = [
  { name: 'Home', href: '/' },
  { name: 'Member', href: '/member' },
  { name: 'My Garage', href: '/garage' },
  { name: 'Coupons', href: '' },
  { name: 'News', href: '/news' },
  { name: 'Promotion', href: '' },
  { name: 'Contact Us', href: '' },
];

const guestLinks = [
  { name: 'Home', href: '/' },
  { name: 'News', href: '/news' },
  { name: 'Promotion', href: '' },
  { name: 'Contact Us', href: '' },
];

const termLinks = [
  { name: 'Privacy Policy', href: '/legal?tab=policy' },
  { name: 'Terms Of Service', href: '/legal?tab=terms' },
];

export default function Member() {
  const [user, setUser] = useState<UserVO | null>(null);
  const [loading, setLoading] = useState(true);

  // Navigation states
  const navRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(55);
  const [activeItem, setActiveItem] = useState<string>(BottomNavItem.Member);
  const router = useRouter();
  const { status } = useSession();
  const isSignedIn = status !== 'unauthenticated';

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await API.get<UserVO>('/user/info');
        setUser(data);
      } catch (err) {
        console.error('Error fetching user info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');

  return (
    <div
      className="size-full relative bg-secondary"
      style={{ paddingTop: `${navHeight}px` }}
    >
      {/* Fixed TopNav */}
      <div className="fixed top-0 left-0 w-full z-50">
        <TopNav
          ref={navRef}
          imgSrc="/assets/v2/logo.svg"
          isOpen={isMenuOpen}
          onMenuOpen={() => setIsMenuOpen(true)}
          onMenuClose={() => setIsMenuOpen(false)}
          onSignInClick={() => router?.push('/welcome')}
          isSignedIn={isSignedIn}
        />
      </div>

      {/* Side Menu Overlay */}
      <div
        className={twMerge(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Side Menu */}
      <div
        className={twMerge(
          'fixed top-0 right-0 h-full w-[280px] bg-secondary z-40 transform transition-transform duration-300 ease-in-out flex flex-col',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ paddingTop: `${navHeight}px` }}
      >
        <div className="flex-1 overflow-y-auto px-4 flex flex-col text-right items-end">
          <div className="flex flex-col">
            {!isSignedIn &&
              guestLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-bold text-text-str py-4"
                >
                  {link.name}
                </a>
              ))}
            {isSignedIn &&
              SignedInLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-bold text-text-str py-4"
                >
                  {link.name}
                </a>
              ))}
            {termLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-base text-text-str py-4"
              >
                {link.name}
              </a>
            ))}
            <button
              className="flex items-center gap-2 text-base font-bold text-text-str justify-end py-4"
              onClick={() =>
                signOut({
                  redirect: false,
                  callbackUrl: '/',
                }).then(() => {
                  router.replace('/');
                })
              }
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        {/* Banner Section with Cover Image */}
        <div className="relative h-[200px]">
          {/* Cover Image - Default grey background */}
          {user?.coverImageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${user.coverImageUrl})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-stroke-w" />
          )}
          {/* Edit Button */}
          <button
            className="absolute top-[20px] right-[24px] z-10"
            onClick={() => router.push('/member/edit')}
          >
            <Image src={EditButtonIcon} alt="Edit" width={36} height={36} />
          </button>
          {/* Diagonal white overlay - trapezoid shape, higher on left, lower on right */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[114px] bg-secondary"
            style={{
              clipPath: 'polygon(0 45%, 100% 0%, 100% 100%, 0 100%)',
            }}
          />
        </div>

        {/* Avatar and Name Section */}
        <div className="relative bg-secondary -mt-[48px]">
          {/* Avatar - positioned to overlap banner */}
          <div className="absolute left-6 -top-[60px]">
            {user?.avatarImageUrl ? (
              <img
                src={user.avatarImageUrl}
                className="w-24 h-24 rounded-full border-2 border-fill bg-secondary object-cover"
                alt="avatar"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-fill bg-stroke-w flex items-center justify-center">
                <Image src={PersonIcon} alt="avatar" width={64} height={64} />
              </div>
            )}
          </div>
          {/* Name and Registration - aligned right and top */}
          <div className="absolute right-4 top-0 -translate-y-4 flex flex-col items-end">
            <h1 className="font-manrope-bold font-bold text-xl leading-[100%] text-text-str">
              {fullName || 'User'}
            </h1>
            <p className="font-manrope font-normal text-xs leading-[100%] text-text-w mt-1">
              Registered on <span className="font-bold">YYYY-MM-DD</span>
            </p>
          </div>
          {/* Spacer for layout */}
          <div className="h-12"></div>
        </div>

        {user && (
          <>
            {/* Personal Info Section */}
            <SectionHeader title="Personal Info" />
            <div className="flex flex-col border-t border-stroke-w">
              <ListItem
                icon={<Image src={IdIcon} alt="" width={24} height={24} />}
                title="Member ID"
                value={user.memberId || '-'}
              />
              <ListItem
                icon={
                  <Image src={BirthdayIcon} alt="" width={24} height={24} />
                }
                title="Birthday"
                value={user.birthday || '-'}
              />
              <ListItem
                icon={<Image src={GenderIcon} alt="" width={24} height={24} />}
                title="Gender"
                value={user.gender || '-'}
              />
              <ListItem
                icon={<Image src={CityIcon} alt="" width={24} height={24} />}
                title="City"
                value={user.addressCity || '-'}
              />
              <ListItem
                icon={
                  <Image src={LocationIcon} alt="" width={24} height={24} />
                }
                title="State"
                value={user.addressState || '-'}
              />
            </div>

            {/* Contact Info Section */}
            <SectionHeader title="Contact Info" />
            <div className="flex flex-col border-t border-stroke-w">
              <ListItem
                icon={<Image src={MailIcon} alt="" width={24} height={24} />}
                title="Email"
                value={user.email || '-'}
              />
              <ListItem
                icon={<Image src={PhoneIcon} alt="" width={24} height={24} />}
                title="Mobile Number"
                value={user.phone || '-'}
              />
              <ListItem
                icon={
                  <Image src={WhatsappIcon} alt="" width={24} height={24} />
                }
                title="Whatsapp ID"
                value={user.whatsapp || '-'}
              />
              <ListItem
                icon={
                  <Image src={FacebookIcon} alt="" width={24} height={24} />
                }
                title="Facebook ID"
                value={user.facebook || '-'}
              />
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      {isSignedIn && (
        <div className="fixed bottom-0 left-0 w-full z-50">
          <BottomNav
            activeItem={activeItem}
            onItemClick={(str) => {
              setActiveItem(str);
              if (str === BottomNavItem.Home) router.push('/');
              if (str === BottomNavItem.MyGarage) router.push('/garage');
              if (str === BottomNavItem.Member) router.push('/member');
            }}
          />
        </div>
      )}
    </div>
  );
}
