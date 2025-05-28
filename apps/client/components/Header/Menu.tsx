import Link from 'next/link';
import React from 'react';
import API from '$/utils/fetch';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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
        <div className="px-9">
          <button onClick={onClose} className="text-4xl">
            <Cross2Icon height={24} width={24} />
          </button>
          <nav className="mt-9 text-xl pl-7">
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
                  <li key={index} className="py-2">
                    <Link href={link} className="text-[14px] hover:underline">
                      {title}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6">
              <a
                className="hover:cursor-pointer hover:underline text-gray-500"
                onClick={() => {
                  API.clearToken();
                  setTimeout(() => router.push('/sign-in'), 500);
                }}
              >
                <img height={18} width={18} className="inline mr-2 pb-0.5" src='/assets/logout.svg' />
                Logout
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Menu;
