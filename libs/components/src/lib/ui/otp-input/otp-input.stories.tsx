import type { Meta, StoryObj } from '@storybook/react';
import { TGOTPInput } from './otp-input';
import { useState } from 'react';
import { TGButton } from '../button/button';

const meta: Meta<typeof TGOTPInput> = {
  title: 'TailGrids/OTPInput',
  component: TGOTPInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TGOTPInput>;

export const Default: Story = {
  args: {
    length: 6,
  },
};

export const FourDigits: Story = {
  args: {
    length: 4,
  },
};

export const WithError: Story = {
  args: {
    length: 6,
    error: true,
    errorMessage: 'Error msg',
  },
};

export const Disabled: Story = {
  args: {
    length: 6,
    disabled: true,
    value: '123456',
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [completed, setCompleted] = useState(false);

    return (
      <div className="space-y-4">
        <TGOTPInput
          length={6}
          value={value}
          onChange={setValue}
          onComplete={() => setCompleted(true)}
        />
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Current value: <span className="font-mono font-bold">{value || '(empty)'}</span>
          </p>
          {completed && (
            <p className="text-sm text-green-600 font-semibold">
              ✓ OTP completed!
            </p>
          )}
          <TGButton
            size="sm"
            variant="outline"
            onClick={() => {
              setValue('');
              setCompleted(false);
            }}
          >
            Clear
          </TGButton>
        </div>
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const correctOTP = '123456';

    const handleComplete = (otp: string) => {
      if (otp === correctOTP) {
        setError(false);
        setSuccess(true);
      } else {
        setError(true);
        setSuccess(false);
      }
    };

    const handleChange = (otp: string) => {
      setValue(otp);
      setError(false);
      setSuccess(false);
    };

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Correct OTP: <span className="font-mono font-bold">{correctOTP}</span>
          </p>
        </div>
        <TGOTPInput
          length={6}
          value={value}
          onChange={handleChange}
          onComplete={handleComplete}
          error={error}
          errorMessage={error ? 'Invalid OTP, please try again' : undefined}
        />
        <div className="text-center">
          {success && (
            <p className="text-sm text-green-600 font-semibold">
              ✓ OTP verified successfully!
            </p>
          )}
        </div>
      </div>
    );
  },
};

export const DifferentLengths: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-600 mb-2 text-center">4 digits</p>
        <TGOTPInput length={4} />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2 text-center">6 digits (default)</p>
        <TGOTPInput length={6} />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2 text-center">8 digits</p>
        <TGOTPInput length={8} />
      </div>
    </div>
  ),
};

export const VerificationFlow: Story = {
  render: () => {
    const [step, setStep] = useState<'input' | 'verifying' | 'success' | 'error'>('input');
    const [value, setValue] = useState('');

    const handleComplete = (otp: string) => {
      setStep('verifying');
      // Simulate API call
      setTimeout(() => {
        if (otp === '123456') {
          setStep('success');
        } else {
          setStep('error');
          setTimeout(() => {
            setValue('');
            setStep('input');
          }, 2000);
        }
      }, 1500);
    };

    const handleResend = () => {
      setValue('');
      setStep('input');
      alert('Verification code resent!');
    };

    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2">Enter Verification Code</h3>
          <p className="text-sm text-gray-600">
            We sent a 6-digit code to your phone
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Hint: Correct code is 123456
          </p>
        </div>

        <TGOTPInput
          length={6}
          value={value}
          onChange={setValue}
          onComplete={handleComplete}
          error={step === 'error'}
          errorMessage={step === 'error' ? 'Invalid code, please try again' : undefined}
          disabled={step === 'verifying' || step === 'success'}
        />

        <div className="text-center">
          {step === 'verifying' && (
            <p className="text-sm text-blue-600">Verifying...</p>
          )}
          {step === 'success' && (
            <p className="text-sm text-green-600 font-semibold">
              ✓ Verification successful!
            </p>
          )}
          {step === 'input' && (
            <button
              onClick={handleResend}
              className="text-sm text-primary hover:underline"
            >
              Didn't receive the code? Resend
            </button>
          )}
        </div>
      </div>
    );
  },
};
