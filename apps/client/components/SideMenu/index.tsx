import React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';

type Link = {
  name: string;
  href: string;
};

type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  navHeight: number;
  guestLinks: Link[];
  signedInLinks: Link[];
  termLinks: Link[];
  isSignedIn: boolean;
};

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  navHeight,
  guestLinks,
  signedInLinks,
  termLinks,
  isSignedIn,
}) => {
  const router = useRouter();

  return (
    <>
      {/* Side Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Side Menu */}
      <div
        className={twMerge(
          'fixed top-0 right-0 h-full w-[280px] bg-secondary z-40 transform transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
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
              signedInLinks.map((link) => (
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
            {isSignedIn && (
              <button
                className="flex items-center gap-2 text-base font-bold text-text-s justify-end"
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
