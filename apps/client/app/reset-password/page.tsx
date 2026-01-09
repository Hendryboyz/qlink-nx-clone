'use client';
import { useState } from 'react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import ResetPasswordStep1, { ResetPasswordStep1Title } from './step-1';
import ResetPasswordStep2, { ResetPasswordStep2Title } from './step-2';
import ResetPasswordStep3, { ResetPasswordStep3Title } from './step-3';
import SuccessModal from './successModal';

type SHARED = { email?: string; sessionId?: string; token?: string };

export default function ResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isShowSuccessModal, setIsShowSuccessModal] = useState(false);
  const [shared, setShared] = useState<SHARED>({});

  return (
    <div className="w-full h-screen bg-secondary flex flex-col p-6">
      <div className="flex items-center mb-6 flex-none">
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
        {step === 1 && <ResetPasswordStep1Title />}
        {step === 2 && <ResetPasswordStep2Title />}
        {step === 3 && <ResetPasswordStep3Title />}
      </div>
      {step === 1 && (
        <ResetPasswordStep1
          onSuccess={({ email, sessionId }) => {
            setShared({ email, sessionId });
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <ResetPasswordStep2
          email={shared.email!}
          sessionId={shared.sessionId!}
          onSuccess={(token) => {
            setShared((pre) => ({ ...pre, token }));
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <ResetPasswordStep3
          token={shared.token!}
          onSuccess={() => setIsShowSuccessModal(true)}
        />
      )}
      {isShowSuccessModal && <SuccessModal />}
    </div>
  );
}
