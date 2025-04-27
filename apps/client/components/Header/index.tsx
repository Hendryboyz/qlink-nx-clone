import React, { BaseHTMLAttributes, ReactNode, useState } from 'react';
import { HamburgerMenuIcon, PersonIcon } from '@radix-ui/react-icons';
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
  const contentPaddingTop = title ? 44 : 76;
  return (
    <>
      <style>{`body { padding-top: ${contentPaddingTop}px; }`}</style>
      <header
        className="bg-primary pt-2 pb-2 text-white px-4 w-full"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
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
              <HamburgerMenuIcon />
            </button>
          )}

          {title ? (
            <h1 className="text-white text-xl font-bold">{title}</h1>
          ) : (
            <div>
              <Banner className="text-xs/[0.75rem]" />
            </div>
          )}

          {title ?
            (customBtn ? customBtn : <div className="w-6"></div>)
            :
            (<div className="rounded-3xl border-white border-2 p-1 hover:cursor-pointer">
              <PersonIcon
                width={30}
                height={30}
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
