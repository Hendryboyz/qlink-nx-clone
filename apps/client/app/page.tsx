'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { TopNav, Footer, TGButton, BottomNav } from '@org/components';
import Carousel from '$/components/Carousel';
import { twMerge } from 'tailwind-merge';

const SignedInLinks = [
  { name: 'Home', href: '/' },
  { name: 'Member', href: '' },
  { name: 'My Garage', href: '' },
  { name: 'Coupons', href: '' },
  { name: 'News', href: '' },
  { name: 'Promotion', href: '' },
  { name: 'Contact Us', href: '' },
];

const guestLinks = [
  { name: 'Home', href: '' },
  { name: 'News', href: '' },
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
  { name: 'Privacy Policy', href: '' },
  { name: 'Terms Of Service', href: '' },
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
    src: '/assets/v2/news-01.jpg',
    alt: 'news',
    title:
      'New Model Release! 2024 Vintage Motorcycle Series Now Available for Pre-Order',
    category: 'News',
    categoryColor: '#8F021B',
    categoryBgColor: '#FFEAEA',
    date: '2024/7/12',
  },
  {
    src: '/assets/v2/news-02.jpg',
    alt: 'promo',
    title: 'Summer Maintenance Specials, Limited Time Discounts Starting Soon',
    category: 'Promo',
    categoryColor: '#934200',
    categoryBgColor: '#FFF6E7',
    date: '2024/7/1',
  },
  {
    src: '/assets/v2/news-03.jpg',
    alt: 'event',
    title:
      'Exclusive Member Test Ride Event: Experience the Latest Motorcycle Models',
    category: 'Event',
    categoryColor: '#026900',
    categoryBgColor: '#ECFFE9',
    date: '2024/6/10',
  },
  {
    src: '/assets/v2/news-04.jpg',
    alt: 'media',
    title: 'Latest Maintenance Tips to Keep Your Bike in Top Condition',
    category: 'Media',
    categoryColor: '#0D1BB7',
    categoryBgColor: '#E8F0FF',
    date: '2024/6/08',
  },
];

export default function Index() {
  const isSignedIn = false;
  const navRef = useRef<HTMLElement>(null);
  const [activeItem, setActiveItem] = useState<string>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(55);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, [navRef]);

  return (
    <div
      className="size-full relative"
      style={{ paddingTop: `${navHeight}px` }}
    >
      <div className="fixed top-0 left-0 w-full z-50">
        <TopNav
          ref={navRef}
          imgSrc="/assets/v2/logo.png"
          isOpen={isMenuOpen}
          onMenuOpen={() => setIsMenuOpen(true)}
          onMenuClose={() => setIsMenuOpen(false)}
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
            {!isSignedIn && guestLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-base font-bold text-text-s py-4"
              >
                {link.name}
              </a>
            ))}
            {isSignedIn && SignedInLinks.map((link) => (
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
            <button className="flex items-center gap-2 text-base font-bold text-text-s justify-end">
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
        className="p-6 grid place-items-center text-center"
        style={{
          marginTop: '-6px',
        }}
      >
        <h3 className="font-bold text-text-s text-2xl">LATEST NEWS</h3>
        <div className="grid grid-1 mt-6 gap-4">
          {newsItems.map((item, index) => (
            <div key={item.src} className="grid grid-cols-[120px,1fr] gap-4">
              <Image
                src={item.src}
                alt={item.alt}
                width={120}
                height={120}
                className="object-cover w-[120px] h-[120px]"
              />
              <div className="flex flex-col justify-between text-left rounded">
                <h4 className="text-base mb-2 font-bold text-text-s">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between">
                  <span
                    className="py-1 px-4"
                    style={{
                      backgroundColor: item.categoryBgColor,
                      color: item.categoryColor,
                    }}
                  >
                    {item.category}
                  </span>
                  <span>{item.date}</span>
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
