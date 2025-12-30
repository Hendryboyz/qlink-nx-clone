import { type FC, useEffect, useState } from 'react';
import { CODE_SUCCESS } from '@org/common';
import API from '$/utils/fetch';
import {
  IdentifierType,
  OtpTypeEnum,
  OtpVerificationRequestDto,
  ResendOtpReqDto,
} from '@org/types';
import { TGButton, TGOTPInput } from '@org/components';

type SignUpStep2Props = {
  email: string;
  sessionId: string;
  onSuccess: (data: { token: string }) => void;
  onResendSuccess: (sessionId: string) => void;
};

export const SignUpStep2Title = () => {
  return (
    <div className="flex flex-col ml-1">
      <span className="text-base text-red-600 font-bold">Step 2</span>
      <h4 className="text-2xl font-bold text-text-str">Enter the code</h4>
    </div>
  );
};

const SignUpStep2: FC<SignUpStep2Props> = ({
  email,
  sessionId,
  onSuccess,
  onResendSuccess,
}) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = (code: string) => {
    if (code.length !== 4) return;

    const payload: OtpVerificationRequestDto = {
      identifier: email,
      identifierType: IdentifierType.EMAIL,
      type: OtpTypeEnum.REGISTER,
      code,
      sessionId,
    };

    API.post('/v2/auth/otp/verification', payload)
      .then((res) => {
        if (res.bizCode === CODE_SUCCESS) {
          onSuccess({ token: res.data });
        } else {
          setError(res.message || 'Invalid code');
        }
      })
      .catch(() => {
        setError('Failed to verify code');
      });
  };

  const handleResend = () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);

    const payload: ResendOtpReqDto = {
      identifier: email,
      identifierType: IdentifierType.EMAIL,
      type: OtpTypeEnum.REGISTER,
      sessionId,
    };

    API.post('/v2/auth/otp/resend', payload)
      .then((res) => {
        if (res.bizCode === CODE_SUCCESS) {
          setTimer(60);
          setError('');
          if (res.data?.sessionId) {
            onResendSuccess(res.data.sessionId);
          }
        } else {
          setError(res.message || 'Failed to resend code');
        }
      })
      .finally(() => {
        setIsResending(false);
      });
  };

  return (
    <div className="flex flex-col flex-1 h-full mt-6">
      <div className="flex-grow">
        <div className="mb-6">
          <p className="text-sm text-text-strong">
            Please enter the 4-digit code we sent to{' '}
            <span className="font-bold">{email}</span>
          </p>
        </div>

        <div className="flex flex-col items-start mb-6">
          <TGOTPInput
            length={4}
            value={otp}
            onChange={(val) => {
              setOtp(val);
              setError('');
            }}
            onComplete={handleVerify}
            error={!!error}
            errorMessage={error}
          />
          <div className="text-center text-sm mt-4 w-full">
            <span className="text-primary">{`Didn't receive code? `}</span>
            {timer > 0 ? (
              <span className="text-primary">
                Resend again in {timer} seconds
              </span>
            ) : (
              <div className="mt-2">
                <TGButton onClick={handleResend} disabled={isResending}>
                  Resend
                </TGButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpStep2;
