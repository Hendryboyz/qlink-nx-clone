import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

type FooterProps = {
  isSignedIn?: boolean;
  guestLinks?: { name: string; href: string }[];
  signedInLinks?: { name: string; href: string }[];
  termLinks?: { name: string; href: string }[];
  mediaLinks?: { name: string; href: string; imgSrc: string }[];
};

const MAIL_ADDRESS = 'support@qlink-qasa.com';

const CommonFooter: FC<{
  links?: FooterProps['guestLinks' | 'signedInLinks'];
  mediaLinks?: FooterProps['mediaLinks'];
  termLinks?: FooterProps['termLinks'];
}> = ({ links, mediaLinks, termLinks }) => (
  <footer className="bg-text-w p-6 text-fill font-manrope">
    <div className="gird grid-col-1 mx-auto justify-center">
      {links?.map((link, index) => (
        <div
          key={link.name}
          className={twMerge(
            'font-bold pb-6 border-b border-fill',
            index !== 0 && 'mt-6'
          )}
        >
          <a href={link.href} rel="noopener noreferrer">
            {link.name}
          </a>
        </div>
      )) || null}
    </div>
    <div className="flex gap-6 mx-auto justify-center mt-6">
      <a className="font-bold" href={`mailto:${MAIL_ADDRESS}`}>
        {MAIL_ADDRESS}
      </a>
    </div>
    <div className="flex gap-4 mx-auto justify-center mt-4">
      {mediaLinks?.map((media) => (
        <a
          key={media.name}
          href={media.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={media.imgSrc}
            alt={media.name}
            className="size-12 rounded-full"
          />
        </a>
      ))}
    </div>
    <div className="flex gap-6 mx-auto justify-center mt-6">
      {
        termLinks?.map((term) => (
          <a
            key={term.name}
            href={term.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {term.name}
          </a>
        ))
      }
    </div>
  </footer>
);

const Footer: FC<FooterProps> = ({
  isSignedIn,
  guestLinks,
  signedInLinks,
  mediaLinks,
  termLinks,
}) => {
  if (isSignedIn) {
    return (
      <CommonFooter
        links={signedInLinks}
        mediaLinks={mediaLinks}
        termLinks={termLinks}
      />
    );
  }
  return (
    <CommonFooter
      links={guestLinks}
      mediaLinks={mediaLinks}
      termLinks={termLinks}
    />
  );
};

export default Footer;
