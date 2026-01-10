'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import ReCAPTCHA from 'react-google-recaptcha';
import { Field, FieldProps, Formik, FormikErrors } from 'formik';
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
import Recaptcha from '$/components/Fields/Recaptcha';
import Image from 'next/image';
import WarningIcon from '../assets/warning.svg';
import PwdAlertIcon from '../assets/pwd-alert.svg';
import { CODE_SUCCESS, emailRegex } from '@org/common';
import API from '$/utils/fetch';
import {
  IdentifierType,
  OtpTypeEnum,
  OtpVerificationRequestDto,
  ResendOtpReqDto,
  StartOtpReqDto,
} from '@org/types';

interface ChangeEmailOtpRequestDto {
  recaptchaToken?: string;
  newEmail: string;
  emailConfirmSessionId: string;
}

interface PatchUserEmailDto {
  sessionId: string;
  code: string;
  type?: OtpTypeEnum;
}

type Step = 1 | 2 | 3 | 4;

const ENABLE_RECAPTCHA = true;
const USE_MOCK_CHANGE_EMAIL_API = false;

function ErrorIcon() {
  return <Image src={PwdAlertIcon} alt="error" width={10} height={9} className="shrink-0" />;
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-1.5 px-1 mt-1">
      <ErrorIcon />
      <span className="text-xs font-normal text-error leading-[140%]">{message}</span>
    </div>
  );
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
            sessionId={shared.sessionId}
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

interface Step1FormData {
  email: string;
  recaptchaToken: string;
}

function Step1VerifyEmail({ onSuccess }: Step1Props) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const isRecaptchaEnabled = ENABLE_RECAPTCHA;

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <>
      <div className="flex flex-col">
        <p className="font-manrope text-sm text-text-w mb-6">
          We will send you a code via email to verify yourself. Please check your email
          after clicking the button below.
        </p>

        <Formik
          initialValues={{ email: '', recaptchaToken: '' }}
          validate={(values: Step1FormData) => {
            const errors: FormikErrors<Step1FormData> = {};
            if (!values.email) {
              errors.email = 'Email is required';
            } else if (!emailRegex.test(values.email)) {
              errors.email = 'Please enter a valid email format';
            }
            if (isRecaptchaEnabled && !values.recaptchaToken) {
              errors.recaptchaToken = 'Please verify that you are not a robot';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setFieldValue }) => {
            setSubmitting(true);
            try {
              const payload: StartOtpReqDto = {
                identifier: values.email,
                identifierType: IdentifierType.EMAIL,
                type: OtpTypeEnum.EMAIL_CONFIRM,
                recaptchaToken: values.recaptchaToken,
              };
              const response = USE_MOCK_CHANGE_EMAIL_API
                ? await new Promise<{
                    bizCode: number;
                    data: { sessionId: string };
                    message?: string;
                  }>(
                    (resolve) => {
                      setTimeout(() => {
                        resolve({
                          bizCode: CODE_SUCCESS,
                          data: { sessionId: 'mock-email-confirm-session' },
                        });
                      }, 500);
                    }
                  )
                : await API.post('/v2/auth/otp', payload);
              if (response.bizCode === CODE_SUCCESS && response.data?.sessionId) {
                onSuccess(values.email, response.data.sessionId);
              } else {
                setErrorMessage(
                  response.message ||
                    'Sorry, the email you just entered is not in our system. Please enter it again.'
                );
                setShowErrorModal(true);
              }
            } catch (err) {
              console.error('Error sending OTP:', err);
              setErrorMessage(
                err?.message ||
                  'Sorry, the email you just entered is not in our system. Please enter it again.'
              );
              setShowErrorModal(true);
            } finally {
              setSubmitting(false);
              recaptchaRef.current?.reset();
              setFieldValue('recaptchaToken', '');
            }
          }}
        >
          {({ values, errors, isSubmitting, setFieldValue, handleSubmit }) => {
            const isFormValid =
              values.email &&
              emailRegex.test(values.email) &&
              (isRecaptchaEnabled ? !!values.recaptchaToken : true);
            return (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-manrope text-sm font-normal leading-[140%] text-gray-700">
                      Email<span className="font-bold text-xs">(*Required)</span>
                    </label>
                    <Field name="email">
                      {({ field, meta }: FieldProps) => (
                        <TGInput
                          {...field}
                          type="email"
                          placeholder=""
                          className={
                            meta.touched && meta.error
                              ? 'text-text-str font-bold !border-[rgba(242,48,48,1)]'
                              : 'text-text-str font-bold'
                          }
                        />
                      )}
                    </Field>
                    {errors.email && <ErrorMessage message={errors.email} />}
                  </div>

                  <div id="email-input-container">
                    {isRecaptchaEnabled && (
                      <Recaptcha
                        ref={recaptchaRef}
                        recaptchaToken={values.recaptchaToken}
                        recaptchaError={errors.recaptchaToken}
                        setFieldValue={setFieldValue}
                        targetElementId="email-input-container"
                      />
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <TGButton
                    fullWidth
                    size="xl"
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isFormValid}
                  >
                    Email me a code
                  </TGButton>
                </div>
              </form>
            );
          }}
        </Formik>
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
      const payload: ResendOtpReqDto = {
        identifier: email,
        identifierType: IdentifierType.EMAIL,
        type: OtpTypeEnum.EMAIL_CONFIRM,
        sessionId,
      };
      const res = USE_MOCK_CHANGE_EMAIL_API
        ? await new Promise<{ bizCode: number; message?: string }>((resolve) => {
            setTimeout(() => {
              resolve({ bizCode: CODE_SUCCESS });
            }, 300);
          })
        : await API.post('/v2/auth/otp/resend', payload);
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
    if (val.length !== 4) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: OtpVerificationRequestDto = {
        identifier: email,
        identifierType: IdentifierType.EMAIL,
        type: OtpTypeEnum.EMAIL_CONFIRM,
        code: val,
        sessionId,
      };
      const response = USE_MOCK_CHANGE_EMAIL_API
        ? await new Promise<{ bizCode: number; message?: string }>((resolve) => {
            setTimeout(() => {
              resolve({ bizCode: CODE_SUCCESS });
            }, 500);
          })
        : await API.post('/v2/auth/otp/verification', payload);

      if (response.bizCode === CODE_SUCCESS) {
        onSuccess();
      } else {
        setError(response.message || 'Invalid code');
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
            disabled={isSubmitting}
            className="!items-start gap-4"
            onComplete={handleVerify}
          />
          {error && <ErrorMessage message={error} />}
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
  sessionId: string;
  onSuccess: (newEmail: string, sessionId: string) => void;
}

interface Step3FormData {
  newEmail: string;
  recaptchaToken: string;
}

function Step3EnterNewEmail({ sessionId, onSuccess }: Step3Props) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const isRecaptchaEnabled = ENABLE_RECAPTCHA;

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <>
      <div className="flex flex-col">
        <p className="font-manrope text-sm text-text-w mb-6">
          We will send you a code via email to verify yourself. Please check your email
          after clicking the button below.
        </p>

        <Formik
          initialValues={{ newEmail: '', recaptchaToken: '' }}
          validate={(values: Step3FormData) => {
            const errors: FormikErrors<Step3FormData> = {};
            if (!values.newEmail) {
              errors.newEmail = 'Email is required';
            } else if (!emailRegex.test(values.newEmail)) {
              errors.newEmail = 'Please enter a valid email format';
            }
            if (isRecaptchaEnabled && !values.recaptchaToken) {
              errors.recaptchaToken = 'Please verify that you are not a robot';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setFieldValue }) => {
            setSubmitting(true);
            try {
              const payload: ChangeEmailOtpRequestDto = {
                newEmail: values.newEmail,
                emailConfirmSessionId: sessionId,
                recaptchaToken: values.recaptchaToken,
              };
              const response = USE_MOCK_CHANGE_EMAIL_API
                ? await new Promise<{
                    bizCode: number;
                    data: { sessionId: string };
                    message?: string;
                  }>(
                    (resolve) => {
                      setTimeout(() => {
                        resolve({
                          bizCode: CODE_SUCCESS,
                          data: { sessionId: 'mock-email-change-session' },
                        });
                      }, 500);
                    }
                  )
                : await API.post('/v2/auth/otp/email_change', payload);

              if (response.bizCode === CODE_SUCCESS) {
                const nextSessionId = response.data?.sessionId || sessionId;
                onSuccess(values.newEmail, nextSessionId);
              } else {
                setErrorMessage(
                  response.message ||
                    'Sorry, the email you just entered is not valid. Please enter it again.'
                );
                setShowErrorModal(true);
              }
            } catch (err) {
              console.error('Error sending OTP:', err);
              setErrorMessage(
                err?.message ||
                  'Sorry, the email you just entered is not valid. Please enter it again.'
              );
              setShowErrorModal(true);
            } finally {
              setSubmitting(false);
              recaptchaRef.current?.reset();
              setFieldValue('recaptchaToken', '');
            }
          }}
        >
          {({ values, errors, isSubmitting, setFieldValue, handleSubmit }) => {
            const isFormValid =
              values.newEmail &&
              emailRegex.test(values.newEmail) &&
              (isRecaptchaEnabled ? !!values.recaptchaToken : true);
            return (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-manrope text-sm font-normal leading-[140%] text-gray-700">
                      New Email<span className="font-bold text-xs">(*Required)</span>
                    </label>
                    <Field name="newEmail">
                      {({ field, meta }: FieldProps) => (
                        <TGInput
                          {...field}
                          type="email"
                          placeholder="Enter your new email"
                          className={
                            meta.touched && meta.error
                              ? 'text-text-str font-bold !border-[rgba(242,48,48,1)]'
                              : 'text-text-str font-bold'
                          }
                        />
                      )}
                    </Field>
                    {errors.newEmail && <ErrorMessage message={errors.newEmail} />}
                  </div>

                  <div id="new-email-input-container">
                    {isRecaptchaEnabled && (
                      <Recaptcha
                        ref={recaptchaRef}
                        recaptchaToken={values.recaptchaToken}
                        recaptchaError={errors.recaptchaToken}
                        setFieldValue={setFieldValue}
                        targetElementId="new-email-input-container"
                      />
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <TGButton
                    fullWidth
                    size="xl"
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isFormValid}
                  >
                    Email me a code
                  </TGButton>
                </div>
              </form>
            );
          }}
        </Formik>
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
      const payload: ResendOtpReqDto = {
        identifier: email,
        identifierType: IdentifierType.EMAIL,
        type: OtpTypeEnum.EMAIL_CHANGE,
        sessionId,
      };
      const res = USE_MOCK_CHANGE_EMAIL_API
        ? await new Promise<{ bizCode: number; message?: string }>((resolve) => {
            setTimeout(() => {
              resolve({ bizCode: CODE_SUCCESS });
            }, 300);
          })
        : await API.post('/v2/auth/otp/resend', payload);
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
    if (val.length !== 4) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: PatchUserEmailDto = {
        sessionId,
        code: val,
      };
      const response = USE_MOCK_CHANGE_EMAIL_API
        ? await new Promise<{ access_token: string }>((resolve) => {
            setTimeout(() => {
              resolve({ access_token: 'mock-access-token' });
            }, 500);
          })
        : await API.patch('/auth/email', payload);
      if (response?.access_token) {
        API.setToken(response.access_token);
      }
      onSuccess();
    } catch (err) {
      setError(err?.message || 'An error occurred during verification');
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
            disabled={isSubmitting}
            className="!items-start gap-4"
            onComplete={handleVerify}
          />
          {error && <ErrorMessage message={error} />}
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
