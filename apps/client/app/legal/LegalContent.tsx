'use client';

import React, { useState, useEffect } from 'react';
import NavBar from '$/components/NavBar';
import AppFooter from '$/components/AppFooter';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '$/hooks/useAuth';
import { twMerge } from 'tailwind-merge';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import { ChevronLeftIcon } from 'lucide-react';

export default function LegalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [navHeight, setNavHeight] = useState(55);
  const [activeTab, setActiveTab] = useState<'terms' | 'policy'>('terms');
  const { isSignedIn } = useAuth();
  const isHideHeader = searchParams.get('hideheader') === 'true';

  useEffect(() => {
    const tab = searchParams.get('tab') as 'terms' | 'policy' | null;
    if (tab && (tab === 'terms' || tab === 'policy')) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'terms' | 'policy') => {
    setActiveTab(tab);
    router.push(`/legal?tab=${tab}`);
  };

  const tabs = [
    { label: 'Terms of Service', value: 'terms' },
    { label: 'Privacy Policy', value: 'policy' },
  ];

  return (
    <div
      className="w-full min-h-full flex-1"
      style={{ paddingTop: isHideHeader ? '0px' : `${navHeight}px` }}
    >
      {!isHideHeader && (
        <NavBar
          imgSrc="/assets/v2/logo.svg"
          isSignedIn={isSignedIn}
          onSignInClick={() => router?.push('/welcome')}
          onNavHeightChange={setNavHeight}
        />
      )}

      {/* Page Title Banner */}
      <div className="bg-primary px-6 py-12 flex flex-col gap-4">
        {isHideHeader && (
          <button
            onClick={() => router.back()}
            className="size-[40px] rounded-full bg-white flex items-center justify-center font-bold"
          >
            <ChevronLeftIcon className="w-8 h-8 text-stroke-s" />
          </button>
        )}
        <h1 className="text-4xl font-bold text-white">Legal</h1>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 py-6 border-b border-stroke-w">
        <div className="flex flex-col gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value as 'terms' | 'policy')}
              className={twMerge(
                'text-base text-left transition-colors',
                activeTab === tab.value
                  ? 'text-primary font-bold'
                  : 'text-text-s'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 content">
        {activeTab === 'terms' ? <TermsOfService /> : <PrivacyPolicy />}
      </div>
      <AppFooter isSignedIn={isSignedIn} />
    </div>
  );
}
