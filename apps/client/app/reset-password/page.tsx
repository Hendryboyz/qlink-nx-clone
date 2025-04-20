'use client';

import { useCallback, useMemo, useState } from 'react';
import GradientBackground from '../../components/Background/GradientBackground';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { PayloadProvider } from './PayloadContext';

export default function SignUp() {
  const [step, handleChangeStep] = useState(1);
  const goNextStep = useCallback(() => {
    handleChangeStep(pre => pre+1)
  }, [])
  const children = useMemo(() => {
    switch (step) {
      case 1:
        return <Step1 onSuccess={goNextStep} />;
      case 2:
        return <Step2 onSuccess={goNextStep} />;
      case 3:
        return <Step3 />;
    }
  }, [step, goNextStep])

  return (
    <PayloadProvider>
    <GradientBackground>
      {children}
    </GradientBackground>
    </PayloadProvider>
  );
}
