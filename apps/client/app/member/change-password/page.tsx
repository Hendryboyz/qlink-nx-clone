'use client';

import { useState } from 'react';
import {
  TGButton,
  FloatingLabelInput,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@org/components';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import API from '$/utils/fetch';
import { CODE_SUCCESS, INVALID_PAYLOAD } from '@org/common';
import PwdAlertIcon from '../assets/pwd-alert.png';

// Error icon component
function ErrorIcon() {
  return <Image src={PwdAlertIcon} alt="error" width={10} height={9} className="shrink-0" />;
}

type FieldError = {
  currentPassword?: string;
  newPassword?: string;
  reNewPassword?: string;
};

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [errors, setErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const isFormValid = currentPassword && newPassword && reNewPassword;

  const validateForm = (): boolean => {
    const newErrors: FieldError = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    } else if (currentPassword.length < 6) {
      newErrors.currentPassword = 'Must be at least 6 characters';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Choose a more secure password and it\'s difficult for others to guess. Must be at least 6 characters';
    }

    if (!reNewPassword) {
      newErrors.reNewPassword = 'Please re-type your new password';
    } else if (newPassword !== reNewPassword) {
      newErrors.reNewPassword = 'New passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmChangePassword = async () => {
    try {
      setLoading(true);
      setErrors({});
      setShowConfirmModal(false);

      // TODO: Replace with actual API call
      // const response = await API.put<{
      //   bizCode: string;
      //   data: boolean | { error: { type: string; message: string } };
      // }>('/user/change-password', {
      //   currentPassword,
      //   newPassword,
      //   reNewPassword,
      // });

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = { bizCode: CODE_SUCCESS, data: true };

      if (response.bizCode === CODE_SUCCESS) {
        setShowSuccessModal(true);
      } else if (response.bizCode === INVALID_PAYLOAD) {
        const errorData = response.data as { error: { type: string; message: string } };
        if (errorData?.error) {
          setErrors({
            [errorData.error.type]: errorData.error.message,
          });
        }
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setErrors({
        currentPassword: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-secondary">
      {/* Header */}
      <header className="w-full px-6 py-5 bg-secondary">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-text-str"
        >
          <ChevronLeftIcon className="w-8 h-8 text-stroke-s" />
          <span className="font-manrope font-bold text-[1.25rem] leading-[140%]">
            Change Password
          </span>
        </button>
      </header>

      {/* Content */}
      <div className="w-full px-6 py-6 bg-secondary">
        {/* Helper text */}
        <p className="font-manrope text-[14px] font-bold leading-[75%] text-[#000000] mb-6">
          Your password must be at least 6 characters.
        </p>

        {/* Form */}
        <div className="space-y-4">
          <FloatingLabelInput
            type="password"
            label="Current Password *"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.currentPassword}
            errorIcon={<ErrorIcon />}
          />

          <FloatingLabelInput
            type="password"
            label="New Password *"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            errorIcon={<ErrorIcon />}
          />

          <FloatingLabelInput
            type="password"
            label="Re-type New Password *"
            value={reNewPassword}
            onChange={(e) => setReNewPassword(e.target.value)}
            error={errors.reNewPassword}
            errorIcon={<ErrorIcon />}
          />
        </div>

        {/* Forgot password link */}
        <button
          className="mt-6 font-manrope text-xs font-bold text-primary leading-[75%]"
          onClick={() => router.push('/forgot-password')}
        >
          Forgot your passwords?
        </button>
      </div>

      {/* Submit button - fixed at bottom */}
      <div className="fixed bottom-0 left-0 w-full px-6 py-6 bg-secondary">
        <TGButton
          fullWidth
          size="xl"
          onClick={handleSubmit}
          loading={loading}
          disabled={!isFormValid}
        >
          Change Password
        </TGButton>
      </div>

      {/* Confirm Change Password Modal */}
      <Modal isOpen={showConfirmModal}>
        <ModalHeader>
          <ModalTitle className="text-base leading-[140%] text-text-str font-bold">
            Confirm changing password?
          </ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <TGButton
            variant="primary"
            fullWidth
            onClick={handleConfirmChangePassword}
            loading={loading}
          >
            Change password
          </TGButton>
          <TGButton
            variant="ghost"
            fullWidth
            className="text-primary font-bold"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </TGButton>
        </ModalFooter>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal}>
        <ModalHeader>
          <ModalTitle className="text-base leading-[140%] text-text-str font-bold">
            Password has been changed
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
