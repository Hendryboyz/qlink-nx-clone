'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { get } from 'lodash';

import { IconButton } from '@radix-ui/themes';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import Header from '$/components/Header';
import { UserUpdateDto, UserVO } from '@org/types';
import API from '$/utils/fetch';

type KEY = keyof UserVO;

type EditableKey = Exclude<KEY, 'id' | 'phone' | 'type'>;

type Columns = {
  [k in KEY]: {
    title: string;
    editable?: boolean;
  };
};

const ATTRS: Columns = {
  id: {
    title: 'Member ID',
  },
  phone: {
    title: 'Phone number',
  },
  type: {
    title: 'Type',
  },
  firstName: {
    title: 'First name',
    editable: true,
  },
  midName: {
    title: 'Mid name',
    editable: true,
  },
  lastName: {
    title: 'Last name',
    editable: true,
  },
  email: {
    title: 'Email',
    editable: true,
  },
  addressCity: {
    title: 'City',
    editable: true,
  },
  addressState: {
    title: 'State',
    editable: true,
  },
  addressDetail: {
    title: 'Address',
    editable: true,
  },
  birthday: {
    title: 'Birthday',
    editable: true,
  },
  whatsapp: {
    title: 'Whatsapp',
    editable: true,
  },
  facebook: {
    title: 'Facebook',
    editable: true,
  },
  source: {
    title: 'Source',
    editable: true,
  },
};

const Member = () => {
  const [user, setUser] = useState<UserVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editKey, setEditKey] = useState<EditableKey | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const valueBeforeEditRef = useRef<string>('');
  const inputRefs = useRef<{
    [key in EditableKey]: React.RefObject<HTMLInputElement>;
  }>({} as { [key in EditableKey]: React.RefObject<HTMLInputElement> });

  const saveChange = useCallback(async () => {
    if (!editKey || !user) return;

    const payload: UserUpdateDto = {
      [editKey]: editValue,
    };

    try {
      const newUserVO = await API.put<UserVO>('/user/info', payload);
      setUser(newUserVO);
      setEditKey(null);
    } catch (err) {
      console.error('Error updating user info:', err);
      // 可以在這裡添加錯誤處理邏輯
    }
  }, [editKey, editValue, user]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await API.get<UserVO>('/user/info');
        setUser(data);
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

  useEffect(() => {
    (Object.keys(ATTRS) as Array<keyof typeof ATTRS>).forEach((key) => {
      if (ATTRS[key].editable) {
        inputRefs.current[key as EditableKey] = React.createRef<HTMLInputElement>();
      }
    });
  }, []);

  useEffect(() => {
    if (editKey) {
      inputRefs.current[editKey]?.current?.focus();
    }
  }, [editKey]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full min-h-full flex-1">
      <Header title="Member" />
      <div className="md:px-36">
        <div className="p-6 bg-gray-300 relative">
          <div className="border-white rounded-full border-4 w-16 h-16 ml-6" />
          <img
            src="/assets/mail.png"
            alt="mail icon"
            className="absolute right-6 top-6"
          />
        </div>
        <div>
          {(Object.entries(ATTRS) as [KEY, Columns[KEY]][]).map(([key, data]) => {
            const isValueChanged = valueBeforeEditRef.current !== editValue;

            return (
              <div
                className="flex justify-between items-center py-3 pl-12 pr-6 border-b-2 border-gray-100"
                key={key}
              >
                <div className="flex flex-col text-gray-400">
                  <span className="text-xs mb-1">{data.title}</span>
                  {editKey === key ? (
                    <input
                      ref={inputRefs.current[key as EditableKey]}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => {
                        // Delay turning off edit mode to prevent IconButton unmounting
                        setTimeout(() => {
                          setEditKey(null)
                        }, 100)
                      }}
                    />
                  ) : (
                    <span className="font-semibold">{user?.[key]}</span>
                  )}
                </div>
                {editKey === key && isValueChanged ? (
                  <div className="flex gap-1">
                    <IconButton color="blue" onClick={() => {
                      saveChange()
                    }}>
                      <CheckIcon height={18} width={18} />
                    </IconButton>
                    <IconButton
                      color="blue"
                      onClick={() => {
                        setEditKey(null);
                      }}
                    >
                      <Cross2Icon height={18} width={18} />
                    </IconButton>
                  </div>
                ) : (
                  data.editable && (
                    <img
                      src="/assets/pencil.png"
                      alt="edit"
                      onClick={() => {
                        const value = get(user, `${key}`, '').toString();
                        setEditKey(key as EditableKey);
                        setEditValue(value);
                        valueBeforeEditRef.current = value;
                      }}
                    />
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Member;
