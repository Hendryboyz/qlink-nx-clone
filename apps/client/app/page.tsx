'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { TopNav, Footer, TGButton, BottomNav } from '@org/components';
import Carousel from '$/components/Carousel';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import API from '$/utils/fetch';
import { PostEntity } from 'types/src/posts';
import dayjs from 'dayjs';

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

const mediaLinks = [
  {
    name: 'WhatsApp',
    href: '',
    imgSrc: '/assets/v2/whats-app.png',
  },
  {
    name: 'Facebook',
    href: '',
    imgSrc: '/assets/v2/fb.png',
  },
  {
    name: 'Instagram',
    href: '',
    imgSrc: '/assets/v2/ig.png',
  },
];

const termLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms Of Service', href: '/terms-of-service' },
];

const CarouselItems = [
  {
    src: '/assets/v2/Banner01.png',
    alt: '',
    buttonText: 'Sign Up Now',
  },
  {
    src: '/assets/v2/Banner02.png',
    alt: '',
    buttonText: 'Go to Website',
  },
  {
    src: '/assets/v2/Banner03.png',
    alt: '',
    buttonText: 'View Detail',
  },
  {
    src: '/assets/v2/Banner04.png',
    alt: '',
    buttonText: 'Sign Up Now',
  },
];

const newsItems = [
  {
    categoryColor: '#8F021B',
    categoryBgColor: '#FFEAEA',
  },
  {
    categoryColor: '#934200',
    categoryBgColor: '#FFF6E7',
  },
  {
    categoryColor: '#026900',
    categoryBgColor: '#ECFFE9',
  },
  {
    categoryColor: '#0D1BB7',
    categoryBgColor: '#E8F0FF',
  },
];

export default function Index() {
  const navRef = useRef<HTMLElement>(null);
  const [activeItem, setActiveItem] = useState<string>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(55);
  const router = useRouter();
  const { status } = useSession();
  const isSignedIn = status !== 'unauthenticated';

  const [posts, setPosts] = useState<PostEntity[]>([]);

  useEffect(() => {
    API.get<PostEntity[]>('/posts').then((res) => {
      setPosts(res);
    });
  }, []);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, [navRef]);

  return (
    <div
      className="size-full relative bg-secondary"
      style={{ paddingTop: `${navHeight}px` }}
    >
      <div className="fixed top-0 left-0 w-full z-50">
        <TopNav
          ref={navRef}
          imgSrc="/assets/v2/logo.png"
          isOpen={isMenuOpen}
          onMenuOpen={() => setIsMenuOpen(true)}
          onMenuClose={() => setIsMenuOpen(false)}
          onSignInClick={() => router?.push('/signin')}
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
                  className="text-base font-bold text-text-s py-4"
                >
                  {link.name}
                </a>
              ))}
            {isSignedIn &&
              SignedInLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-bold text-text-s py-4"
                >
                  {link.name}
                </a>
              ))}
            {termLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-base text-text-s py-4"
              >
                {link.name}
              </a>
            ))}
            <button
              className="flex items-center gap-2 text-base font-bold text-text-s justify-end"
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      <span className="p-4 bg-primary text-sm font-manrope text-fill flex items-center py-4 justify-center">
        Exclusive Member Test Ride See details
      </span>
      <Carousel items={CarouselItems} />
      <div
        className="p-6 grid place-items-center text-center w-full"
        style={{
          marginTop: '-6px',
        }}
      >
        <h3 className="font-bold text-text-s text-2xl">LATEST NEWS</h3>
        <div className="grid grid-1 mt-6 gap-4">
          {posts.map((item, index) => (
            <div key={item.id} className="grid grid-cols-[120px,1fr] gap-4">
              <Image
                src={item.coverImage || '/assets/v2/news-01.jpg'}
                alt={item.title}
                width={120}
                height={120}
                className="object-cover w-[120px] h-[120px]"
              />
              <div className="flex flex-col justify-between text-left rounded">
                <h4 className="text-base font-bold text-text-s mb-0">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between">
                  <span
                    className="py-1 px-4"
                    style={{
                      backgroundColor: newsItems[index % newsItems.length].categoryBgColor,
                      color: newsItems[index % newsItems.length].categoryColor,
                    }}
                  >
                    {item.category}
                  </span>
                  <span>{dayjs(item.updatedAt).format('YYYY/M/DD')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <TGButton variant="outline" size="md" className="w-auto mt-6">
          View More News
        </TGButton>
      </div>
      <Footer
        guestLinks={guestLinks}
        signedInLinks={SignedInLinks}
        mediaLinks={mediaLinks}
        termLinks={termLinks}
        isSignedIn={isSignedIn}
      />
      {isSignedIn && (
        <BottomNav
          activeItem={activeItem}
          onItemClick={(str) => setActiveItem(str)}
        />
      )}
    </div>
  );
}
