'use client';

import { useCallback, useMemo, useState } from 'react';
import { ColorBackground } from '../../components/Background';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { PayloadProvider } from '$/store/payload';

export default function SignUp() {
  const [step, handleChangeStep] = useState(1);
  const goNextStep = useCallback(() => {
    handleChangeStep(pre => pre+1)
  }, [])
  
  const goFirstStep = useCallback(() => {
    handleChangeStep(1)
  }, [])
  const children = useMemo(() => {
    switch (step) {
      case 1:
        return <Step1 onSuccess={goNextStep} />;
      case 2:
        return <Step2 onSuccess={goNextStep} goBack={goFirstStep} />;
      case 3:
        return <Step3 />;
    }
  }, [step, goNextStep, goFirstStep])

  return (
    <PayloadProvider>
    <ColorBackground color="#D70127">
      {children}
    </ColorBackground>
    </PayloadProvider>
  );
}
