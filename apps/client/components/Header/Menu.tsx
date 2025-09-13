import Link from 'next/link';
import React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import SignButton from '$/components/Header/SignButton';

const mainItems = [
  ['Home', '/'],
  ['Member', '/member'],
  ['My Garage', '/garage'],
  // ['Service Records', ''],
  // ['Coupons', ''],
  ['News', '/news'],
  // ['Promotion', ''],
  // ['Contact Us', ''],
];

const supportItems = [
  ['Privacy Policy', '/privacy-policy'],
  ['Terms of Service', '/terms-of-service'],
];

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
};
const Menu: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full pt-3 w-64 bg-orange-600 z-50 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5">
          <div className="h-7 flex items-center justify-start">
            <button onClick={onClose}>
              <Cross2Icon height={24} width={24} />
            </button>
          </div>
          <nav className="mt-8 text-xl pl-7 font-[GilroyRegular]">
            <ul>
              {mainItems.map((item, index) => {
                const [title, link] = item;
                return (
                  <li key={index} className="py-2">
                    <Link href={link} className="hover:underline" onClick={onClose}>
                      {title}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul>
              {supportItems.map((item, index) => {
                const [title, link] = item;
                return (
                  <li key={index} className="py-2">
                    <Link href={link} className="text-[14px] hover:underline" onClick={onClose}>
                      {title}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6">
              <SignButton />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Menu;
