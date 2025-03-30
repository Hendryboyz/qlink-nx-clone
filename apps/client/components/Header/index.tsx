import React, { BaseHTMLAttributes, ReactNode, useState } from 'react';
import Menu from './Menu';
import { useRouter } from 'next/navigation';

type Props = BaseHTMLAttributes<HTMLDivElement> & {
  title?: string;
  useBackBtn?: boolean;
  customBackAction?: () => void;
  customBtn?: ReactNode;
};
const Header: React.FC<Props> = ({ title, useBackBtn, customBtn, customBackAction }) => {
  const router = useRouter();
  const [isOpen, toggleOpen] = useState<boolean>(false);
  return (
    <>
      <style>{`body { padding-top: 96px; }`}</style>
      <header
        className="bg-primary pt-14 pb-2 text-white px-4 w-full"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {useBackBtn ? (
            <img src="/assets/arrow_left.svg" onClick={
              () => customBackAction ? customBackAction() : router.back()
            } />
          ) : (
            <button
              className="text-2xl"
              onClick={() => toggleOpen((pre) => !pre)}
            >
              ☰
            </button>
          )}
          {title && <h1 className="text-white text-xl font-bold">{title}</h1>}
          <div>{customBtn ? customBtn : <img src="/assets/logo.png" />}</div>
          {!title && <div className="w-6"></div>}
        </div>
        <Menu isOpen={isOpen} onClose={() => toggleOpen((pre) => !pre)} />
      </header>
    </>
  );
};

export default Header;
