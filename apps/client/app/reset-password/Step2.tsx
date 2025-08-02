import React, { useCallback, useEffect, useState } from 'react';
import Container from './Container';
import API from '$/utils/fetch';
import { IdentifierType, OtpTypeEnum, OtpVerificationRequestDto } from 'types/src';
import { usePayload } from '$/store/payload';
import { CODE_SUCCESS, DEFAULT_ERROR_MSG } from 'common/src';
import SubmitButton from '$/components/Button/SubmitButton';
import { usePopup } from '$/hooks/PopupProvider';
import { formatTime } from '$/utils';
import Button from '$/components/Button';

type Props = {
  onSuccess: () => void;
};

const Step2 = (props: Props) => {
  const secsBeforeResend: number = 10; // 1 minutes
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(''));
  const [countdown, setCountdown] = useState(secsBeforeResend);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSending, setSending] = useState<boolean>(false);
  const { email, otpSessionId, setToken } = usePayload();
  const { showPopup } = usePopup();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, countdown]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (isNaN(Number(e.target.value))) return;

    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    // Focus on next input
    if (e.target.nextSibling && e.target.value) {
      (e.target.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleResendOTP = useCallback(() => {
    setSending(true);
    API.post('/v2/auth/otp/resend', {
      identifier: email || 'None',
      identifierType: IdentifierType.EMAIL,
      type: OtpTypeEnum.RESET_PASSWORD,
      sessionId: otpSessionId,
    })
      .then((res) => {
        if (res.bizCode == CODE_SUCCESS) {
          setCountdown(secsBeforeResend);
          setIsActive(true);
        } else {
          showPopup({ title: DEFAULT_ERROR_MSG })
        }
      })
      .finally(() => setSending(false));
  }, [email, showPopup, otpSessionId]);

  const handleSubmit = () => {
    const payload: OtpVerificationRequestDto = {
      identifier: email || 'None',
      identifierType: IdentifierType.EMAIL,
      code: otp.join(''),
      type: OtpTypeEnum.RESET_PASSWORD,
      sessionId: otpSessionId ? otpSessionId : '',
    };
    setLoading(true);
    API.post('/v2/auth/otp/verification', payload)
      .then((res) => {
        if (res.bizCode == CODE_SUCCESS) {
          setToken(res.data);
          props.onSuccess();
        } else {
          showPopup({ title: DEFAULT_ERROR_MSG });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container
      title="OTP Verification"
      bottomEle={
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl text-[#FFF0D3]">Back</span>
          <SubmitButton text="Next" buttonColor="beige" onClick={handleSubmit} isLoading={isLoading} />
        </div>
      }
    >
      <div className="mt-auto">
        <h4 className="text-[#FFF0D3] text-sm mb-9 text-center">
          Please enter the 4-digit OTP (One-Time Password) sent to your
          registered mobile number.
        </h4>
        <div className="flex justify-between items-center">
          {otp.map((data, index) => (
            <input
              className="flex items-center justify-center
              text-center
            w-12 h-12 rounded-xl
           bg-white border-white border-2 font-bold text-xl"
              type="number"
              name="otp"
              maxLength={1}
              key={index}
              value={data}
              onChange={(e) => handleChange(e, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
        {isActive ? (
          <h4 className="text-center text-[#FFF0D3] mt-6">
            Didn&apos;t receive code?
            <br />
            Resend in {formatTime(countdown)}
          </h4>
        ) : (
          <Button
            theme='light'
            isLoading={isSending}
            className="mt-5 text-xs hover:cursor-pointer"
            onClick={handleResendOTP}
          >
            Resend
          </Button>
        )}
      </div>
    </Container>
  );
};

export default Step2;
