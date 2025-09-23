'use client';

import React from 'react';
import { PopupProvider } from '$/hooks/PopupProvider';
import './global.css';
import { StyledJsxRegistry } from './registry';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import Providers from '$/app/providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <PopupProvider>
          <StyledJsxRegistry>
            <Theme>
              <div className="min-h-screen">
                <Wrapper>{children}</Wrapper>
              </div>
            </Theme>
          </StyledJsxRegistry>
        </PopupProvider>
      </body>
    </html>
  );
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <div className="min-h-full flex justify-center bg-white">
        {children}
      </div>
    </Providers>
  );
};
