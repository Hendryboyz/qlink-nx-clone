'use client';
import { useState } from 'react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import SignUpStep1, { SignUpStep1Title } from './step-1';
import SignUpStep2, { SignUpStep2Title } from './step-2';
import SignUpStep3, { SignUpStep3Title } from './step-3';
import { ProgressBar } from '@org/components';
import SuccessModal from './successModal';
import Success from './success';

type SHARED = { email?: string; sessionId?: string; token?: string };

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [shared, setShared] = useState<SHARED>({});

  if (step === 4) {
    return (
      <>
        <Success />
        {isOpenSuccessModal && <SuccessModal onClose={() => setIsOpenSuccessModal(false)} />}
      </>
    );
  }

  return (
    <div className="w-full h-screen bg-secondary flex flex-col p-6">
      <div className="flex items-center justify-start flex-none">
        <button
          onClick={() => {
            if (step === 1) {
              router.back();
            } else {
              setStep(step - 1);
            }
          }}
          className="p-2 -ml-2"
        >
          <ChevronLeftIcon className="w-8 h-8 text-stroke-s" />
        </button>
      </div>
      <div className="my-6">
        <ProgressBar list={['1', '2', '3']} runningIndex={step - 1} />
      </div>

      {step === 1 && <SignUpStep1Title />}
      {step === 2 && <SignUpStep2Title />}
      {step === 3 && <SignUpStep3Title />}

      {step === 1 && (
        <SignUpStep1
          onSuccess={({ email, sessionId }) => {
            setShared({ email, sessionId });
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <SignUpStep2
          email={shared.email || ''}
          sessionId={shared.sessionId || ''}
          onSuccess={({ token }) => {
            setShared({ ...shared, token });
            setStep(3);
          }}
          onResendSuccess={(sessionId) => {
            setShared({ ...shared, sessionId });
          }}
        />
      )}
      {step === 3 && (
        <SignUpStep3
          email={shared.email || ''}
          token={shared.token || ''}
          onSuccess={() => {
            setStep(4);
            setIsOpenSuccessModal(true);
          }}
        />
      )}
    </div>
  );
}
