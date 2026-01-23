'use client';

import React, { useState } from 'react';
import NavBar from '$/components/NavBar';
import AppFooter from '$/components/AppFooter';
import { useAuth } from '$/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ContactPage() {
  const [navHeight, setNavHeight] = useState(55);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <div
      className="w-full min-h-full flex-1"
      style={{ paddingTop: `${navHeight}px` }}
    >
      <NavBar
        imgSrc="/assets/v2/logo.svg"
        isSignedIn={isSignedIn}
        onSignInClick={() => router?.push('/welcome')}
        onNavHeightChange={setNavHeight}
      />

      {/* Page Title Banner */}
      <div className="bg-primary px-6 py-16 flex">
        <h1 className="text-2xl font-bold text-white">Contact us</h1>
      </div>

      {/* Contact Information */}
      <div className="bg-secondary px-6 py-6">
        <div className="max-w-2xl">
          <p className="text-text-s text-sm mb-8 leading-relaxed">
            Contact our service support or visit our social media website via our contact information below
          </p>

          {/* Contact Details */}
          <div className="flex gap-4">
            {/* Continuous Red Line */}
            <div className="w-1 bg-primary flex-shrink-0"></div>

            {/* Contact Information */}
            <div className="space-y-4">
              {/* Email */}
              <a
                href="mailto:support@qlink-qasa.com"
                className="block text-lg font-bold text-text-w underline hover:text-primary transition"
              >
                support@qlink-qasa.com
              </a>

              {/* Phone */}
              <a
                href="tel:0700-000-0000"
                className="block text-lg font-bold text-text-w underline hover:text-primary transition"
              >
                0700-000-0000
              </a>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4 mt-8" style={{
            paddingBottom: '284px'
          }}>
            {[
              {
                name: 'WhatsApp',
                href: '',
                imgSrc: '/assets/v2/whats-app.png',
              },
              {
                name: 'Facebook',
                href: 'https://www.facebook.com/share/1Da4LHfKBJ/?mibextid=wwXIfr',
                imgSrc: '/assets/v2/fb.png',
              },
              {
                name: 'Instagram',
                href: 'https://www.instagram.com/qlink_motorcycle',
                imgSrc: '/assets/v2/ig.png',
              },
            ].map((media) => (
              <a
                key={media.name}
                href={media.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={media.name}
              >
                <Image
                  src={media.imgSrc}
                  alt={media.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full hover:scale-110 transition transform"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <AppFooter isSignedIn={isSignedIn} />
    </div>
  );
}
