'use client';

import GradientBackground from '../../components/GradientBackground';
import { useCallback, useMemo, useState } from 'react';
import Step1 from './Setp1';
import Step2 from './Step2';
import Step3 from './Step3';
import Success from './Success';
import { PayloadProvider } from './PayloadContext';

const SignUp = () => {
  const isOTPEnabled: boolean = process.env.IS_OTP_ENABLED === 'true';
  const [step, handleChangeStep] = useState(1);
  const goNextStep = useCallback(() => {
    handleChangeStep(pre => {
      if (pre === 1 && !isOTPEnabled) {
        return pre + 2;
      }
      return pre+1;
    })
  }, [isOTPEnabled, handleChangeStep])
  const children = useMemo(() => {
    switch (step) {
      case 1:
        return <Step1 onSuccess={goNextStep} />;
      case 2:
        return <Step2 onSuccess={goNextStep} />;
      case 3:
        return <Step3 onSuccess={goNextStep} />;
      case 4:
        return <Success />;
    }
  }, [step, goNextStep])
  return <PayloadProvider>
    <GradientBackground>{children}</GradientBackground>
  </PayloadProvider>;
};


export default SignUp;
