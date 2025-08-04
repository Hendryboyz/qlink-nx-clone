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
  goBack: () => void;
};

const Step2 = (props: Props) => {
  const secsBeforeResend: number = 60; // 1 minutes
  const secsBeforeExpiration: number = 600; // 10 minutes
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(''));
  const [countdown, setCountdown] = useState(secsBeforeResend);
  const [expirationCountdown, setExpirationCountdown] = useState(secsBeforeExpiration);
  const [isActive, setIsActive] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSending, setSending] = useState<boolean>(false);
  const { email, otpSessionId, setToken } = usePayload();
  const { showPopup } = usePopup();

  useEffect(() => {
    let resendInterval: NodeJS.Timeout | null = null;
    let expirationInterval: NodeJS.Timeout | null = null;

    // Handle 1-minute resend countdown
    if (isActive && countdown > 0 && !isExpired) {
      resendInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !isExpired) {
      setIsActive(false);
    }

    // Handle 10-minute expiration countdown
    if (expirationCountdown > 0 && !isExpired) {
      expirationInterval = setInterval(() => {
        setExpirationCountdown((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (resendInterval) clearInterval(resendInterval);
      if (expirationInterval) clearInterval(expirationInterval);
    };
  }, [isActive, countdown, expirationCountdown, isExpired]);

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
          setExpirationCountdown(secsBeforeExpiration);
          setIsActive(true);
          setIsExpired(false);
        } else {
          showPopup({ title: DEFAULT_ERROR_MSG })
        }
      })
      .finally(() => setSending(false));
  }, [email, showPopup, otpSessionId, secsBeforeResend, secsBeforeExpiration]);

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
    <Container title="OTP Verification">
      <div>
        <h4 className="text-primary text-xl">Enter OTP</h4>
        <div className="flex justify-between items-center mt-6">
          {otp.map((data, index) => (
            <input
              className="flex items-center justify-center
                text-center
                w-12 h-12 rounded-xl
                bg-white border-[#FFCFA3] border-2 font-bold text-xl"
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
        {isExpired ? (
          <div className="text-center mt-6">
            <h4 className="text-[#DF6B00] text-[13px] font-[GilroyMedium] font-normal leading-[100%] tracking-[0%]">
              Verification expired.{' '}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={props.goBack}
              >
                Try again
              </span>
            </h4>
          </div>
        ) : isActive ? (
          <h4 className="text-center text-[#FF7D7D] mt-6 text-[13px] font-gilroy-medium font-normal leading-[100%] tracking-[0%]">
            Didn&apos;t receive code?
            <br />
            Resend in {formatTime(countdown)}
          </h4>
        ) : (
          <Button
            theme='light'
            isLoading={isSending}
            className="mt-5 text-sm hover:cursor-pointer font-gilroy-medium"
            onClick={handleResendOTP}
          >
            Resend
          </Button>
        )}
      </div>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-xl text-[#FFF0D3]" onClick={props.goBack}>Back</span>
        <SubmitButton text="Next" buttonColor="beige" onClick={handleSubmit} isLoading={isLoading} />
      </div>
    </Container>
  );
};

export default Step2;
