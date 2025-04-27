'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { UserSourceType, UserUpdateDto, UserVO } from '@org/types';
import Header from '$/components/Header';
import * as Yup from 'yup';
import API from '$/utils/fetch';
import Editable from '$/components/Fields/Editable';
import { STATES, UserSourceDisplay } from '@org/common';
import { Upload, UploadProps } from 'antd';

export default function Member() {
  const [user, setUser] = useState<UserVO | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="p-6 bg-gray-300 relative flex justify-between">
          <div className="flex">
            <Upload
              name="avatar"
              showUploadList={false}
              disabled={uploading}
              customRequest={handleUpload}
            >
              <img
                className="border-white rounded-full border-4 w-16 h-16 ml-6 hover:cursor-pointer"
                src={avatarUrl ? avatarUrl : '/assets/user.svg'}
                alt="avatar icon"
                onClick={handleAvatarUpload}
              />
            </Upload>
            <p className="content-center flex flex-col ml-5">
              <span className="text-2xl text-gray-500">{user?.firstName}</span>
              <span className="text-xl text-gray-500">{user?.lastName}</span>
            </p>
          </div>
          <img
            className="right-6 top-6 w-6 h-6 content-end"
            src="/assets/mail.png"
            alt="mail icon"
          />
        </div>
        {user && (
          <div>
            <Editable
              key="id"
              editKey="id"
              title="Member ID"
              defaultValue={user?.id}
              isChangeAllowed={false}
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
              key="email"
              editKey="email"
              title="Email"
              defaultValue={user?.email}
              saveChange={saveChange}
              validation={Yup.string().email().required()}
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
            <Editable
              key="addressState"
              editKey="addressState"
              type="dropdown"
              title="State"
              defaultValue={user?.addressState}
              saveChange={saveChange}
              isChangeAllowed={true}
              options={STATES.map((value) => ({ value }))}
            />
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
