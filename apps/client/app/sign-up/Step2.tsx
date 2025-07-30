import React, { useCallback, useEffect, useState } from 'react';
import Container from './Container';
import API from '$/utils/fetch';
import { IdentifierType, OtpTypeEnum } from 'types/src';
import { usePayload } from './PayloadContext';
import { CODE_SUCCESS, DEFAULT_ERROR_MSG } from 'common/src';
import SubmitButton from '$/components/Button/SubmitButton';
import Button from '$/components/Button';
import { usePopup } from '$/hooks/PopupProvider';

type Props = {
  onSuccess: () => void;
  goBack: () => void;
};

const Step2 = (props: Props) => {
  const secsBeforeResend: number = 60; // 1 minutes
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(''));
  const [countdown, setCountdown] = useState(secsBeforeResend);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSending, setSending] = useState<boolean>(false);
  const { email, setToken } = usePayload();
  const { showPopup } = usePopup()

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

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }, []);

  const handleResendOTP = useCallback(() => {
    API.post('/v2/auth/otp', {
      identifier: email || 'None',
      identifierType: IdentifierType.EMAIL,
      type: OtpTypeEnum.REGISTER,
      resend: true,
    })
      .then((res) => {
        if (res.bizCode == CODE_SUCCESS) {
          setCountdown(secsBeforeResend);
          setIsActive(true);
        } else {
          showPopup({ title: DEFAULT_ERROR_MSG})
        }
      })
      .finally(() => setSending(false));
  }, [email, showPopup]);

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

  const handleSubmit = () => {
    setLoading(true);
    API.post('/v2/auth/otp/verification', {
      identifier: email || 'None',
      identifierType: IdentifierType.EMAIL,
      code: otp.join(''),
      type: OtpTypeEnum.REGISTER,
    })
      .then((res) => {
        if (res.bizCode == CODE_SUCCESS) {
          setToken(res.data);
          props.onSuccess();
        } else {
          // show error message
        }
      })
      .catch((err) => {
        // show error message
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container title="Create an account" step={2}>
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
        {isActive ? (
          <h4 className="text-center text-[#DF6B00] mt-6 text-[13px] font-gilroy-medium font-normal leading-[100%] tracking-[0%]">
            Didn&apos;t receive code?
            <br />
            Resend in {formatTime(countdown)}
          </h4>
        ) : (
          <Button
            isLoading={isSending}
            className="mt-5 text-xs hover:cursor-pointer"
            onClick={handleResendOTP}
          >
            Resend
          </Button>
        )}
      </div>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-xl text-red-600 hover:underline hover:cursor-pointer" onClick={props.goBack}>Back</span>
        <SubmitButton text="Next" isLoading={isLoading} onClick={handleSubmit} />
      </div>
    </Container>
  );
};

export default Step2;
