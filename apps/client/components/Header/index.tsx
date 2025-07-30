import React, { BaseHTMLAttributes, ReactNode, useState } from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useRouter, usePathname } from 'next/navigation';
import Menu from './Menu';
// import classNames from 'classnames';
import Banner from '$/components/Banner';

type Props = BaseHTMLAttributes<HTMLDivElement> & {
  title?: string;
  useBackBtn?: boolean;
  customBackAction?: () => void;
  customBtn?: ReactNode;
};
const Header: React.FC<Props> = ({ title, useBackBtn, customBtn, customBackAction }) => {
  const router = useRouter();
  const pathname = usePathname()
  const [isOpen, toggleOpen] = useState<boolean>(false);
  return (
    <>
      <style>{`body { padding-top: 48px; }`}</style>
      <header
        className="bg-primary pt-3 text-white px-5 w-full h-12"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
        }}
      >
        <div className="container m-auto flex justify-between items-center">
          {useBackBtn ? (
            <img
              src="/assets/arrow_left.svg"
              onClick={() =>
                customBackAction ? customBackAction() : router.back()
              }
            />
          ) : (
            <button
              className="text-2xl"
              onClick={() => toggleOpen((pre) => !pre)}
            >
              <HamburgerMenuIcon width={24} height={24} />
            </button>
          )}

          {title ? (
            <h1 className="text-white text-xl font-bold">{title}</h1>
          ) : (
            <div>
              <Banner size="h-6 w-6" />
            </div>
          )}

          {title ?
            (customBtn ? customBtn : <div className="w-6"></div>)
            :
            (<div className="hover:cursor-pointer">
              <img
                src="/assets/user_circle.svg"
                onClick={() => router.push('/sign-in')}
              />
            </div>)}
        </div>
        <Menu isOpen={isOpen} onClose={() => toggleOpen((pre) => !pre)} />
      </header>
    </>
  );
};

export default Header;
