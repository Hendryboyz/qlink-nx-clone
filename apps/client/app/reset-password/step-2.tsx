import { type FC, useEffect, useState } from 'react';
import { TGButton, TGOTPInput } from '@org/components';
import API from '$/utils/fetch';
import { CODE_SUCCESS } from '@org/common';
import {
  IdentifierType,
  OtpTypeEnum,
  OtpVerificationRequestDto,
  ResendOtpReqDto,
} from '@org/types';

type ResetPasswordStep2Props = {
  email: string;
  sessionId: string;
  onSuccess: (data: unknown) => void;
};

export const ResetPasswordStep2Title = () => {
  return (
    <h4 className="text-xl font-bold text-text-str ml-1">
      Enter verification code
    </h4>
  );
};

const ResetPasswordStep2: FC<ResetPasswordStep2Props> = ({
  email,
  sessionId,
  onSuccess,
}) => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0) return;

    setIsSubmitting(true);
    setError(null);

    const payload: ResendOtpReqDto = {
      identifier: email,
      identifierType: IdentifierType.EMAIL,
      type: OtpTypeEnum.RESET_PASSWORD,
      sessionId,
    };

    try {
      const res = await API.post('/v2/auth/otp/resend', payload);
      if (res.bizCode === CODE_SUCCESS) {
        setCountdown(60);
      } else {
        setError(res.message || 'Failed to resend code');
      }
    } catch (err) {
      setError('An error occurred while resending code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (val: string) => {
    console.log('Verifying OTP:', val);
    if (val.length !== 4) return;

    setIsSubmitting(true);
    setError(null);

    const payload: OtpVerificationRequestDto = {
      identifier: email,
      identifierType: IdentifierType.EMAIL,
      type: OtpTypeEnum.RESET_PASSWORD,
      code: val,
      sessionId,
    };

    try {
      const res = await API.post('/v2/auth/otp/verification', payload);
      if (res.bizCode === CODE_SUCCESS) {
        onSuccess(res.data);
      } else {
        setError(res.message || 'Invalid code');
      }
    } catch (err) {
      setError('An error occurred during verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="text-text-w text-sm font-manrope mb-6">
        Please enter the 4-digit code we sent to{' '}
        <span className="font-bold">{email}</span>
      </div>

      <div className="flex-grow flex flex-col items-center">
        <div className="mb-6 w-full">
          <TGOTPInput
            length={4}
            value={otp}
            onChange={setOtp}
            error={!!error}
            errorMessage={error || undefined}
            disabled={isSubmitting}
            className="justify-between gap-4"
            onComplete={handleVerify}
          />
        </div>

        <div className="text-center text-sm mt-4 w-full">
          <span className="text-primary">{`Didn't receive code? `}</span>
          {countdown > 0 ? (
            <span className="text-primary">
              Resend again in {countdown} seconds
            </span>
          ) : (
            <div className="mt-2">
              <TGButton onClick={handleResend} disabled={isSubmitting}>
                Resend
              </TGButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordStep2;
