'use client';

import { useEffect, useMemo, useState } from 'react';
import { UserVO, ClientUserUpdateDto, GenderType } from '@org/types';
import {
  DatePickerWithInput,
  Modal,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalIcon,
  ModalTitle,
  TGButton,
  TGDropdown,
  TGInput,
  TextFieldButton,
} from '@org/components';
import { STATES, CODE_SUCCESS } from '@org/common';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import TrashIcon from '../assets/trash.svg';
import WarningIcon from '../assets/warning.svg';
import Image from 'next/image';
import PersonIcon from '../assets/person.svg';
import { format } from 'date-fns';
import { Upload, UploadProps } from 'antd';
import Cookies from 'js-cookie';
import { BO_ACCESS_TOKEN } from '@org/common';
import { signOut } from 'next-auth/react';
import API from '$/utils/fetch';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const CITY_OPTIONS = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano'];
const GENDER_DROPDOWN_OPTIONS = GENDER_OPTIONS.map((option) => ({ label: option, value: option }));
const CITY_DROPDOWN_OPTIONS = CITY_OPTIONS.map((option) => ({ label: option, value: option }));
const STATE_DROPDOWN_OPTIONS = STATES.map((state) => ({ label: state, value: state }));
const DEFAULT_FORM_DATA: ClientUserUpdateDto = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthday: '',
  addressCity: '',
  addressState: '',
  whatsapp: '',
  facebook: '',
};
const INPUT_TEXT_CLASS = '!text-text-str !font-bold placeholder:!font-normal';
const DROPDOWN_TEXT_CLASS = '!text-text-str font-bold [&_span]:!text-text-str [&_span]:!font-bold';
const DATE_PICKER_TEXT_CLASS =
  '[&_button]:!text-text-str [&_button]:!font-bold [&_button>span]:!text-text-str [&_button>span]:!font-bold';

// Section Header component
// Font: Manrope Bold 700, 16px, line-height 140%, color #1A1A1A
// Background: #F5F5F5
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="w-full px-6 py-6 bg-secondary">
      <span className="font-manrope font-bold text-base leading-[140%] text-text-str">
        {title}
      </span>
    </div>
  );
}

function Line() {
  return <div className="border-t border-stroke-w mx-6" />;
}

export default function MemberEdit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);

  // Form state
  const [formData, setFormData] = useState<ClientUserUpdateDto>(DEFAULT_FORM_DATA);
  const [initialFormData, setInitialFormData] = useState<ClientUserUpdateDto>(DEFAULT_FORM_DATA);
  const [gender, setGender] = useState<GenderType | ''>('');
  const [initialGender, setInitialGender] = useState<GenderType | ''>('');
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await API.get<UserVO>('/user/info');
        setAvatarUrl(data.avatarImageUrl || '');
        setCoverUrl(data.coverImageS3Uri || '');
        setGender(data.gender || '');
        setInitialGender(data.gender || '');
        const parsedBirthday = data.birthday ? new Date(data.birthday) : undefined;
        setBirthday(parsedBirthday && !Number.isNaN(parsedBirthday.getTime()) ? parsedBirthday : undefined);
        const normalizedData: ClientUserUpdateDto = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          birthday: data.birthday || '',
          addressCity: data.addressCity || '',
          addressState: data.addressState || '',
          whatsapp: data.whatsapp || '',
          facebook: data.facebook || '',
        };
        setFormData(normalizedData);
        setInitialFormData({ ...normalizedData });
      } catch (err) {
        console.error('Error fetching user info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleFieldChange = (field: keyof ClientUserUpdateDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    localStorage.removeItem('user');
    Cookies.remove(BO_ACCESS_TOKEN);
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      const response = await API.delete('/user');
      if (response.bizCode !== CODE_SUCCESS) {
        throw new Error('Delete account failed');
      }

      setShowDeleteModal(false);
      setShowDeleteSuccess(true);
    } catch (err) {
      console.error('Error deleting account:', err);
      setShowDeleteModal(false);
      setShowDeleteError(true);
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await API.put<UserVO>('/user/info', formData);
      setShowUpdateSuccess(true);
    } catch (err) {
      console.error('Error saving user info:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload: UploadProps['customRequest'] = async ({ file }) => {
    const formDataUpload = new FormData();
    formDataUpload.append('avatar', file as File);
    try {
      setAvatarUploading(true);
      const res = await API.post('/user/avatar', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = await res.data;
      setAvatarUrl(result.imageUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCoverUpload: UploadProps['customRequest'] = async ({ file }) => {
    const formDataUpload = new FormData();
    formDataUpload.append('cover', file as File);
    try {
      setCoverUploading(true);
      const res = await API.post('/user/cover', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = await res.data;
      setCoverUrl(result.imageUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setCoverUploading(false);
    }
  };

  const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ');

  const handleNameChange = (value: string) => {
    const parts = value.split(' ');
    handleFieldChange('firstName', parts[0] || '');
    handleFieldChange('lastName', parts.slice(1).join(' ') || '');
  };

  const handleBirthdayChange = (value?: Date) => {
    setBirthday(value);
    handleFieldChange('birthday', value ? format(value, 'yyyy-MM-dd') : '');
  };

  const isEdited = useMemo(() => {
    const keys = new Set<keyof ClientUserUpdateDto>([
      ...Object.keys(initialFormData),
      ...Object.keys(formData),
    ] as (keyof ClientUserUpdateDto)[]);
    const formChanged = Array.from(keys).some(
      (key) => (formData[key] ?? '') !== (initialFormData[key] ?? ''),
    );
    const genderChanged = gender !== initialGender;
    return formChanged || genderChanged;
  }, [formData, gender, initialFormData, initialGender]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-text-str">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-secondary">
      {/* Header */}
      <header className="w-full px-6 py-5 bg-secondary">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-text-str"
        >
          <ChevronLeftIcon className="w-8 h-8 text-stroke-s" />
          <span className="font-manrope font-bold text-[1.25rem] text-base leading-[140%]">Edit Profile</span>
        </button>
      </header>
      <Line />
      {/* Profile Photo Section */}
      <section className="w-full px-6 py-6 bg-secondary">
        <p className="font-manrope font-bold text-base leading-[140%] text-text-str mb-4">
          Profile Photo
        </p>
        <div className="flex justify-center">
          <Upload
            name="avatar"
            showUploadList={false}
            disabled={avatarUploading}
            customRequest={handleAvatarUpload}
          >
            <div className="relative cursor-pointer">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="w-24 h-24 rounded-full border-2 border-stroke-w bg-secondary object-cover"
                  alt="avatar"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-stroke-w bg-stroke-w flex items-center justify-center">
                  <Image src={PersonIcon} alt="avatar" width={64} height={64} />
                </div>
              )}
              {avatarUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <span className="text-white text-xs">Uploading...</span>
                </div>
              )}
            </div>
          </Upload>
        </div>
      </section>
      <Line />

      {/* Cover Image Section */}
      <section className="w-full px-6 py-6 bg-secondary">
        <p className="font-manrope font-bold text-base leading-[140%] text-text-str mb-4">
          Cover Image
        </p>
        <Upload
          name="cover"
          showUploadList={false}
          disabled={coverUploading}
          customRequest={handleCoverUpload}
          rootClassName="!block w-full [&_.ant-upload]:block [&_.ant-upload]:w-full"
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              className="w-full h-[8.75rem] object-cover cursor-pointer block"
              alt="cover"
            />
          ) : (
            <div className="w-full h-[8.75rem] bg-stroke-w cursor-pointer" />
          )}
        </Upload>
      </section>
      <Line />
      {/* Account Section */}
      <SectionHeader title="Account" />
      <div className="w-full px-6 bg-secondary space-y-3 mb-6">
        <TextFieldButton label="Change Email" onClick={() => router.push('/member/change-email')} />
        <TextFieldButton label="Change Password" onClick={() => router.push('/member/change-password')} />
      </div>
      <Line />
      {/* Personal Info Section */}
      <SectionHeader title="Personal Info" />
      <div className="w-full px-6 bg-secondary space-y-4 mb-6">
        <TGInput
          label="Name"
          value={fullName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Enter your name"
          className={INPUT_TEXT_CLASS}
        />
        <DatePickerWithInput
          label="Birthday"
          value={birthday}
          onChange={handleBirthdayChange}
          placeholder="yyyy / mm / dd"
          dateFormat="yyyy / MM / dd"
          className={DATE_PICKER_TEXT_CLASS}
        />
        <TGDropdown
          label="Gender"
          value={gender}
          onChange={(value) => setGender(value as GenderType)}
          options={GENDER_DROPDOWN_OPTIONS}
          placeholder="Select gender"
          className={DROPDOWN_TEXT_CLASS}
        />
        <TGDropdown
          label="City/Town"
          value={formData.addressCity || ''}
          onChange={(value) => handleFieldChange('addressCity', value)}
          options={CITY_DROPDOWN_OPTIONS}
          placeholder="Select city"
          className={DROPDOWN_TEXT_CLASS}
        />
        <TGDropdown
          label="State"
          value={formData.addressState || ''}
          onChange={(value) => handleFieldChange('addressState', value)}
          options={STATE_DROPDOWN_OPTIONS}
          placeholder="Select state"
          className={DROPDOWN_TEXT_CLASS}
        />
      </div>
      <Line />
      {/* Contact Info Section */}
      <SectionHeader title="Contact Info" />
      <div className="w-full px-6 bg-secondary space-y-4 mb-6">
        <TGInput
          label="Mobile Number"
          value={formData.phone || ''}
          onChange={(e) => handleFieldChange('phone', e.target.value)}
          placeholder="0000-000-0000"
          type="tel"
          className={INPUT_TEXT_CLASS}
        />
        <TGInput
          label="Whatsapp ID"
          value={formData.whatsapp || ''}
          onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
          placeholder="0000-000-0000"
          className={INPUT_TEXT_CLASS}
        />
        <TGInput
          label="Facebook ID"
          value={formData.facebook || ''}
          onChange={(e) => handleFieldChange('facebook', e.target.value)}
          placeholder="XXXXXXXXXX"
          className={INPUT_TEXT_CLASS}
        />
      </div>
      <Line />

      {/* Actions */}
      <div className="w-full px-6 py-4 bg-secondary">
        <TGButton
          fullWidth
          size="xl"
          onClick={handleSave}
          loading={saving}
          disabled={!isEdited || saving}
        >
          Save
        </TGButton>
      </div>
      <Line />
      <div className="w-full px-6 py-1 bg-secondary">
        <TGButton
          variant="ghost"
          fullWidth
          className="gap-2 text-text-str hover:text-text-str"
          onClick={() => setShowDeleteModal(true)}
        >
          <Image src={TrashIcon} alt="trash" width={16} height={16} className="w-4 h-4" />
          <span className="font-manrope font-bold text-base leading-[140%] text-text-str">Delete Account</span>
        </TGButton>
      </div>
      <Line />
      <div className="w-full mb-6"></div>

      {/* Delete Account Confirmation Modal */}
      <Modal isOpen={showDeleteModal}>
        <ModalHeader>
          <ModalIcon>
            <Image src={WarningIcon} alt="warning" width={20} height={18} className="w-8 h-8" />
          </ModalIcon>
          <ModalTitle className="text-base leading-[140%] text-text-str font-bold">
            Delete your member account?
          </ModalTitle>
          <ModalDescription className="text-[12px] leading-[140%] text-text-str font-medium text-center">
            Once you delete your account, your data will be deleted and cannot be restored.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <TGButton
            variant="ghost"
            fullWidth
            className="font-manrope font-bold text-base leading-[140%]"
            onClick={handleDeleteAccount}
            loading={deleting}
          >
            <span className="text-[#D70127]">Continue deleting account</span>
          </TGButton>
          <TGButton
            variant="primary"
            fullWidth
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </TGButton>
        </ModalFooter>
      </Modal>

      {/* Delete Success Modal */}
      <Modal isOpen={showDeleteSuccess}>
        <ModalHeader>
          <ModalTitle className="text-base leading-[140%] text-text-str font-bold">
            Account has been deleted
          </ModalTitle>
          <ModalDescription className="text-[12px] leading-[140%] text-text-str font-medium text-center">
            You will be directed to the home page
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <TGButton
            variant="primary"
            fullWidth
            onClick={async () => await signOut({ callbackUrl: '/' })}
          >
            OK
          </TGButton>
        </ModalFooter>
      </Modal>

      {/* Delete Error Modal */}
      <Modal isOpen={showDeleteError}>
        <ModalHeader>
          <ModalIcon>
            <Image src={WarningIcon} alt="warning" width={20} height={18} className="w-8 h-8" />
          </ModalIcon>
          <ModalTitle className="text-base leading-[140%] text-text-str font-bold">
            Failed to delete account
          </ModalTitle>
          <ModalDescription className="text-[12px] leading-[140%] text-text-str font-medium text-center">
            Something went wrong. Please try again later.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <TGButton
            variant="primary"
            fullWidth
            onClick={() => setShowDeleteError(false)}
          >
            OK
          </TGButton>
        </ModalFooter>
      </Modal>

      {/* Update Success Modal */}
      <Modal isOpen={showUpdateSuccess}>
        <ModalHeader>
          <ModalTitle className="text-base leading-[140%] text-text-str font-bold text-center">
            Information has been updated
          </ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <TGButton
            variant="primary"
            fullWidth
            className="bg-[#D70127] hover:bg-[#b50021]"
            onClick={() => {
              setShowUpdateSuccess(false);
              router.push('/member');
            }}
          >
            Go back to profile
          </TGButton>
        </ModalFooter>
      </Modal>
    </div>
  );
}
