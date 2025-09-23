'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { UserSourceType, UserUpdateDto, UserVO } from '@org/types';
import Header from '$/components/Header';
import * as Yup from 'yup';
import API from '$/utils/fetch';
import Editable from '$/components/Fields/Editable';
import { STATES, UserSourceDisplay } from '@org/common';
import { Upload, UploadProps } from 'antd';
import { IconButton } from '@radix-ui/themes';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';

const StateDropdown = React.forwardRef<
  { handleSave: () => void; handleCancel: () => void },
  {
    value?: string;
    onChange: (value: string) => void;
    isEditing: boolean;
    onSave: () => void;
    onCancel: () => void;
  }
>(({ value, onChange, isEditing, onSave, onCancel }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const displayValue = value || 'None';

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = () => {
    if (currentValue && currentValue !== value) {
      onChange(currentValue);
    }
    onSave();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    onCancel();
    setIsOpen(false);
  };

  React.useImperativeHandle(ref, () => ({
    handleSave,
    handleCancel
  }));


  if (!isEditing) {
    return (
      <div className="h-6 flex items-center">
        <span className="font-[GilroySemiBold] text-[1rem]">
          {displayValue}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-32 sm:w-40 md:w-48">
      <div
        className="w-full mr-1 text-[1rem] font-[GilroySemiBold] h-6 py-0 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!currentValue ? 'text-gray-400' : ''}>
          {currentValue || 'Select State'}
        </span>
        <img
          src="/assets/chevron_down.svg"
          className="flex-shrink-0 ml-2"
          alt="dropdown arrow"
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-max whitespace-nowrap mt-1">
            {STATES.map((state) => (
              <div
                key={state}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                onClick={() => {
                  setCurrentValue(state);
                  setIsOpen(false);
                }}
              >
                {state}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

export default function Member() {
  const [user, setUser] = useState<UserVO | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStateEditing, setIsStateEditing] = useState(false);
  const stateDropdownRef = useRef<{ handleSave: () => void; handleCancel: () => void }>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await API.get<UserVO>('/user/info');
        setUser(data);
        setAvatarUrl(data.avatarImageUrl);
        setError(null);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Failed to load user information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const saveChange = useCallback(
    async (editingKey: string, savingValue: any) => {
    if (!editingKey || !user) return;

    const payload: UserUpdateDto = {
      [editingKey]: savingValue,
    };

    try {
      const newUserVO = await API.put<UserVO>('/user/info', payload);
      setUser(newUserVO);
    } catch (err) {
      console.error('Error updating user info:', err);
      // 可以在這裡添加錯誤處理邏輯
    }
  }, [user]);

  const handleAvatarUpload = () => {};

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('avatar', file as File);
    try {
      setUploading(true);
      const res = await API.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await res.data;
      setAvatarUrl(result.imageUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full min-h-full flex-1">
      <Header title="Member" />
      <div className="md:px-36">
        <div className="pt-3 pb-[0.375rem] bg-gray-300 relative flex justify-between">
          <div className="flex">
            <Upload
              name="avatar"
              showUploadList={false}
              disabled={uploading}
              customRequest={handleUpload}
            >
              <img
                src={avatarUrl ? avatarUrl : '/assets/user.svg'}
                className="border-white rounded-full border-4 w-[4.5rem] h-[4.5rem] ml-6 hover:cursor-pointer object-cover shadow-avatar"
                alt="avatar icon"
                onClick={handleAvatarUpload}
              />
            </Upload>
            <p className="content-center flex flex-col ml-3 mt-2 font-gilroy-semibold">
              <span className="text-2xl text-gray-500">{user?.firstName}</span>
              <span className="text-xl text-gray-500 -mt-1">{user?.lastName}</span>
            </p>
          </div>
        </div>
        {user && (
          <div className='mt-6 pl-1'>
            <Editable
              key="id"
              editKey="id"
              title="Member ID"
              defaultValue={user?.memberId}
              isChangeAllowed={false}
            />
            <Editable
              key="email"
              editKey="email"
              title="Email"
              defaultValue={user?.email}
              saveChange={saveChange}
              validation={Yup.string().email().required()}
              isChangeAllowed={true}
            />
            <Editable
              key="phone"
              editKey="phone"
              title="Phone number"
              defaultValue={user?.phone}
              isChangeAllowed={false}
            />
            <Editable
              key="type"
              editKey="type"
              title="Type"
              defaultValue={user?.type}
              isChangeAllowed={false}
            />
            <Editable
              key="firstName"
              editKey="firstName"
              title="First name"
              defaultValue={user?.firstName}
              saveChange={saveChange}
              isChangeAllowed={true}
            />
            <Editable
              key="midName"
              editKey="midName"
              title="Mid name"
              defaultValue={user?.midName}
              saveChange={saveChange}
              isChangeAllowed={true}
            />
            <Editable
              key="lastName"
              editKey="lastName"
              title="Last name"
              defaultValue={user?.lastName}
              saveChange={saveChange}
              isChangeAllowed={true}
            />
            <Editable
              key="addressCity"
              editKey="addressCity"
              title="City"
              defaultValue={user?.addressCity}
              saveChange={saveChange}
              isChangeAllowed={true}
            />
            <div className="flex justify-between items-start min-h-[3.1875rem] pl-[1.25rem] pr-[1.25rem] border-b-inset-6">
              <div className="flex flex-col text-gray-400 relative pt-2">
                <span className="text-xs font-gilroy-regular text-[12px] text-[#D70127]">State</span>
                <div className="min-h-[1.5rem] flex flex-col justify-start">
                  <div className="min-h-[1rem]">
                    <StateDropdown
                      ref={stateDropdownRef}
                      value={user?.addressState}
                      onChange={(value) => saveChange('addressState', value)}
                      isEditing={isStateEditing}
                      onSave={() => setIsStateEditing(false)}
                      onCancel={() => setIsStateEditing(false)}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                {isStateEditing ? (
                  <div className="flex gap-1">
                    <IconButton
                      className="icon-button-small"
                      color="blue"
                      onClick={() => stateDropdownRef.current?.handleSave()}
                    >
                      <CheckIcon height={16} width={16} />
                    </IconButton>
                    <IconButton
                      className="icon-button-small"
                      color="blue"
                      onClick={() => stateDropdownRef.current?.handleCancel()}
                    >
                      <Cross2Icon height={16} width={16} />
                    </IconButton>
                  </div>
                ) : (
                  <img
                    src="/assets/edit_pencil.svg"
                    alt="edit"
                    className="cursor-pointer"
                    onClick={() => setIsStateEditing(true)}
                  />
                )}
              </div>
            </div>
            <Editable
              key="addressDetail"
              editKey="addressDetail"
              title="Address"
              defaultValue={user?.addressDetail}
              saveChange={saveChange}
              isChangeAllowed={true}
            />
            <Editable
              key="birthday"
              editKey="birthday"
              title="Birthday"
              type="date"
              defaultValue={user?.birthday}
              saveChange={saveChange}
              isChangeAllowed={true}
            />
            <Editable
              key="whatsapp"
              editKey="whatsapp"
              title="Whatsapp"
              defaultValue={user?.whatsapp}
              saveChange={saveChange}
              isChangeAllowed={true}
            />
            <Editable
              key="facebook"
              editKey="facebook"
              title="Facebook"
              defaultValue={user?.facebook}
              saveChange={saveChange}
              isChangeAllowed={true}
            />
            <Editable
              key="source"
              editKey="source"
              title="Source"
              defaultValue={
                user && user.source
                  ? UserSourceDisplay[user.source as UserSourceType]
                  : UserSourceDisplay[UserSourceType.NONE]
              }
              isChangeAllowed={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
