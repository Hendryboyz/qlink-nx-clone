'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  TGButton,
  TGOTPInput,
  TGInput,
  Modal,
  ModalHeader,
  ModalIcon,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@org/components';
import Image from 'next/image';
import WarningIcon from '../assets/warning.svg';
import { CODE_SUCCESS, emailRegex } from '@org/common';
import API from '$/utils/fetch';
import { IdentifierType, OtpTypeEnum } from '@org/types';

type Step = 1 | 2 | 3 | 4;

interface SharedData {
  currentEmail: string;
  newEmail: string;
  sessionId: string;
}

export default function ChangeEmail() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [shared, setShared] = useState<SharedData>({
    currentEmail: '',
    newEmail: '',
    sessionId: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1:
        return 'Verify your Email';
      case 2:
        return 'Enter verification code';
      case 3:
        return 'Enter New Email';
      case 4:
        return 'Enter verification code';
      default:
        return '';
    }
  };

  return (
    <div className="w-full min-h-screen bg-secondary flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-5 bg-secondary flex-none">
        <button onClick={handleBack} className="flex items-center gap-1 text-text-str">
          <ChevronLeftIcon className="w-8 h-8 text-stroke-s" />
          <span className="font-manrope font-bold text-[1.25rem] leading-[140%]">
            {getTitle()}
          </span>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-6 bg-secondary">
        {step === 1 && (
          <Step1VerifyEmail
            onSuccess={(email, sessionId) => {
              setShared((prev) => ({ ...prev, currentEmail: email, sessionId }));
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <Step2VerifyOTP
            email={shared.currentEmail}
            sessionId={shared.sessionId}
            onSuccess={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3EnterNewEmail
            onSuccess={(newEmail, sessionId) => {
              setShared((prev) => ({ ...prev, newEmail, sessionId }));
              setStep(4);
            }}
          />
        )}
        {step === 4 && (
          <Step4VerifyNewEmailOTP
            email={shared.newEmail}
            sessionId={shared.sessionId}
            onSuccess={() => setShowSuccessModal(true)}
          />
        )}
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal}>
        <ModalHeader>
          <ModalTitle className="text-base leading-[140%] text-text-str font-bold">
            Email has been changed
          </ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <TGButton
            variant="primary"
            fullWidth
            onClick={() => router.push('/member/edit')}
          >
            Back to Edit Profile
          </TGButton>
        </ModalFooter>
      </Modal>
    </div>
  );
}

// Step 1: Verify your Email (user inputs email + reCAPTCHA)
interface Step1Props {
  onSuccess: (email: string, sessionId: string) => void;
}

function Step1VerifyEmail({ onSuccess }: Step1Props) {
  const [email, setEmail] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTHCA_SITEKEY || '';

  // Check if reCAPTCHA is enabled (has sitekey)
  const isRecaptchaEnabled = !!recaptchaSiteKey;
  const isEmailValid = email && emailRegex.test(email);
  const isFormValid = isEmailValid && (isRecaptchaEnabled ? !!recaptchaToken : true);

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('');
    } else if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email format');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setEmail('');
    setEmailError('');
  };

  const handleSubmit = async () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email format');
      return;
    }
    if (isRecaptchaEnabled && !recaptchaToken) {
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('?')
      // Mock API call - simulate error for testing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = { bizCode: CODE_SUCCESS, data: { sessionId: 'mock-session-id' } };

      // Real API call (commented for now)
      // const response = await API.post('/v2/auth/otp', {
      //   identifier: email,
      //   identifierType: IdentifierType.EMAIL,
      //   type: OtpTypeEnum.CHANGE_EMAIL,
      //   recaptchaToken,
      // });

      if (response.bizCode === CODE_SUCCESS) {
        onSuccess(email, response.data.sessionId);
      } else {
        setErrorMessage('Sorry, the email you just entered is not in our system. Please enter it again.');
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setErrorMessage('Sorry, the email you just entered is not in our system. Please enter it again.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <p className="font-manrope text-sm text-text-w mb-6">
          We will send you a code via email to verify yourself. Please check your email
          after clicking the button below.
        </p>

        <div className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-manrope text-sm font-normal leading-[140%] text-gray-700">
              Email<span className="font-bold text-xs">(*Required)</span>
            </label>
            <TGInput
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder=""
              className="text-text-str font-bold"
              error={emailError}
            />
          </div>

          <div id="email-input-container">
            {isRecaptchaEnabled && (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
                onChange={(token) => setRecaptchaToken(token || '')}
              />
            )}
          </div>
        </div>

        <div className="mt-6">
          <TGButton
            fullWidth
            size="xl"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!isFormValid}
          >
            Email me a code
          </TGButton>
        </div>
      </div>

      {/* Email Invalid Modal */}
      <Modal isOpen={showErrorModal}>
        <ModalHeader>
          <ModalIcon>
            <Image src={WarningIcon} alt="warning" width={20} height={18} className="w-8 h-8" />
          </ModalIcon>
          <ModalTitle className="text-base leading-[140%] text-text-str font-bold">
            Email invalid
          </ModalTitle>
          <ModalDescription className="text-xs leading-[140%] text-text-str font-medium text-center">
            {errorMessage}
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <TGButton
            variant="primary"
            fullWidth
            onClick={handleCloseErrorModal}
          >
            Enter Email again
          </TGButton>
        </ModalFooter>
      </Modal>
    </>
  );
}

// Step 2: Enter verification code (for current email)
interface Step2Props {
  email: string;
  sessionId: string;
  onSuccess: () => void;
}

function Step2VerifyOTP({ email, sessionId, onSuccess }: Step2Props) {
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

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCountdown(60);

      // Real API call (commented for now)
      // const res = await API.post('/v2/auth/otp/resend', {
      //   identifier: email,
      //   identifierType: IdentifierType.EMAIL,
      //   type: OtpTypeEnum.CHANGE_EMAIL,
      //   sessionId,
      // });
      // if (res.bizCode === CODE_SUCCESS) {
      //   setCountdown(60);
      // } else {
      //   setError(res.message || 'Failed to resend code');
      // }
    } catch (err) {
      setError('An error occurred while resending code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (val: string) => {
    if (val.length !== 4) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = { bizCode: CODE_SUCCESS };

      // Real API call (commented for now)
      // const response = await API.post('/v2/auth/otp/verification', {
      //   identifier: email,
      //   identifierType: IdentifierType.EMAIL,
      //   type: OtpTypeEnum.CHANGE_EMAIL,
      //   code: val,
      //   sessionId,
      // });

      if (response.bizCode === CODE_SUCCESS) {
        onSuccess();
      } else {
        setError('Invalid code');
      }
    } catch (err) {
      setError('An error occurred during verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <p className="font-manrope text-sm text-text-w mb-6">
        Please enter the 4-digit code we sent to{' '}
        <span className="font-bold">{email}</span>
      </p>

      <div className="flex-grow flex flex-col">
        <div className="mb-6 w-full">
          <TGOTPInput
            length={4}
            value={otp}
            onChange={setOtp}
            error={!!error}
            errorMessage={error || undefined}
            disabled={isSubmitting}
            className="!items-start gap-4"
            onComplete={handleVerify}
          />
        </div>

        <div className="text-left text-sm mt-4 w-full">
          <span className="text-primary">{`Didn't receive code? `}</span>
          {countdown > 0 ? (
            <span className="text-primary">Resend again in {countdown} seconds</span>
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
}

// Step 3: Enter New Email
interface Step3Props {
  onSuccess: (newEmail: string, sessionId: string) => void;
}

function Step3EnterNewEmail({ onSuccess }: Step3Props) {
  const [newEmail, setNewEmail] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTHCA_SITEKEY || '';

  // Check if reCAPTCHA is enabled (has sitekey)
  const isRecaptchaEnabled = !!recaptchaSiteKey;
  const isEmailValid = newEmail && emailRegex.test(newEmail);
  const isFormValid = isEmailValid && (isRecaptchaEnabled ? !!recaptchaToken : true);

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('');
    } else if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email format');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewEmail(value);
    validateEmail(value);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setNewEmail('');
    setEmailError('');
  };

  const handleSubmit = async () => {
    if (!newEmail) {
      setEmailError('Email is required');
      return;
    }
    if (!emailRegex.test(newEmail)) {
      setEmailError('Please enter a valid email format');
      return;
    }
    if (isRecaptchaEnabled && !recaptchaToken) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = { bizCode: CODE_SUCCESS, data: { sessionId: 'mock-session-id-2' } };

      // Real API call (commented for now)
      // const response = await API.post('/v2/auth/otp', {
      //   identifier: newEmail,
      //   identifierType: IdentifierType.EMAIL,
      //   type: OtpTypeEnum.CHANGE_EMAIL_NEW,
      //   recaptchaToken,
      // });

      if (response.bizCode === CODE_SUCCESS) {
        onSuccess(newEmail, response.data.sessionId);
      } else {
        setErrorMessage('Sorry, the email you just entered is not valid. Please enter it again.');
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setErrorMessage('Sorry, the email you just entered is not valid. Please enter it again.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <p className="font-manrope text-sm text-text-w mb-6">
          We will send you a code via email to verify yourself. Please check your email
          after clicking the button below.
        </p>

        <div className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-manrope text-sm font-normal leading-[140%] text-gray-700">
              New Email<span className="font-bold text-xs">(*Required)</span>
            </label>
            <TGInput
              type="email"
              value={newEmail}
              onChange={handleEmailChange}
              placeholder="Enter your new email"
              className="text-text-str font-bold"
              error={emailError}
            />
          </div>

          <div id="new-email-input-container">
            {isRecaptchaEnabled && (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
                onChange={(token) => setRecaptchaToken(token || '')}
              />
            )}
          </div>
        </div>

        <div className="mt-6">
          <TGButton
            fullWidth
            size="xl"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!isFormValid}
          >
            Email me a code
          </TGButton>
        </div>
      </div>

      {/* Email Invalid Modal */}
      <Modal isOpen={showErrorModal}>
        <ModalHeader>
          <ModalIcon>
            <Image src={WarningIcon} alt="warning" width={20} height={18} className="w-8 h-8" />
          </ModalIcon>
          <ModalTitle className="text-base leading-[140%] text-text-str font-bold">
            Email invalid
          </ModalTitle>
          <ModalDescription className="text-xs leading-[140%] text-text-str font-medium text-center">
            {errorMessage}
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <TGButton
            variant="primary"
            fullWidth
            onClick={handleCloseErrorModal}
          >
            Enter Email again
          </TGButton>
        </ModalFooter>
      </Modal>
    </>
  );
}

// Step 4: Enter verification code (for new email)
interface Step4Props {
  email: string;
  sessionId: string;
  onSuccess: () => void;
}

function Step4VerifyNewEmailOTP({ email, sessionId, onSuccess }: Step4Props) {
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

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCountdown(60);

      // Real API call (commented for now)
      // const res = await API.post('/v2/auth/otp/resend', {
      //   identifier: email,
      //   identifierType: IdentifierType.EMAIL,
      //   type: OtpTypeEnum.CHANGE_EMAIL_NEW,
      //   sessionId,
      // });
      // if (res.bizCode === CODE_SUCCESS) {
      //   setCountdown(60);
      // } else {
      //   setError(res.message || 'Failed to resend code');
      // }
    } catch (err) {
      setError('An error occurred while resending code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (val: string) => {
    if (val.length !== 4) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = { bizCode: CODE_SUCCESS };

      // Real API call (commented for now)
      // const response = await API.post('/v2/auth/otp/verification', {
      //   identifier: email,
      //   identifierType: IdentifierType.EMAIL,
      //   type: OtpTypeEnum.CHANGE_EMAIL_NEW,
      //   code: val,
      //   sessionId,
      // });

      if (response.bizCode === CODE_SUCCESS) {
        onSuccess();
      } else {
        setError('Invalid code');
      }
    } catch (err) {
      setError('An error occurred during verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <p className="font-manrope text-sm text-text-w mb-6">
        Please enter the 4-digit code we sent to{' '}
        <span className="font-bold">{email}</span>
      </p>

      <div className="flex-grow flex flex-col">
        <div className="mb-6 w-full">
          <TGOTPInput
            length={4}
            value={otp}
            onChange={setOtp}
            error={!!error}
            errorMessage={error || undefined}
            disabled={isSubmitting}
            className="!items-start gap-4"
            onComplete={handleVerify}
          />
        </div>

        <div className="text-left text-sm mt-4 w-full">
          <span className="text-primary">{`Didn't receive code? `}</span>
          {countdown > 0 ? (
            <span className="text-primary">Resend again in {countdown} seconds</span>
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
}
