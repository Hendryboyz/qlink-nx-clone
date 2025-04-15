import Link from 'next/link';
import React from 'react';
import API from '$/utils/fetch';

const mainItems = [
  ['Home', '/home'],
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
        className={`fixed top-0 left-0 h-full pt-12 w-64 bg-orange-600 z-50 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6">
          <button onClick={onClose} className="text-4xl mb-4">
            ×
          </button>
          <nav className="px-6 text-xl">
            <ul>
              {mainItems.map((item, index) => {
                const [title, link] = item;
                return (
                  <li key={index} className="py-4">
                    <Link href={link} className="hover:underline">
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
                  <li key={index} className="py-4">
                    <Link href={link} className="text-[14px] hover:underline">
                      {title}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <hr className="my-3" />
            <Link
              className="py-4 text-base hover:cursor-pointer hover:underline"
              href="/sign-in"
              onClick={() => {
                API.clearToken();
              }}
            >
              Logout
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Menu;
