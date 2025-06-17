import { Context, createContext, ReactNode, useEffect, useState } from 'react';
import { BOUserDTO } from '@org/types';
import API from '$/utils/fetch';

type pagingType = {
  pageSize: number;
  page: number;
};

interface UserContextType {
  users: BOUserDTO[];
  total: number;
  paging: pagingType;
  editingUserId: string | undefined;
  setEditingUserId: (prevState) => void,
  setPaging: (prevState) => void;
}

export const UserContext: Context<UserContextType> = createContext({
  users: [],
  total: 0,
  paging: {
    pageSize: 10,
    page: 1,
  },
  editingUserId: undefined,
  setEditingUserId: (prevId) => {},
  setPaging: (prevState) => {},
});

export default function UserContextProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(undefined);
  const [total, setTotal] = useState(0);
  const [paging, setPaging] = useState({
    pageSize: 10,
    page: 1,
  })
  useEffect(() => {
    async function fetchUser(): Promise<void>  {
      const { data, total } = await API.listBoUsers(paging.page, paging.pageSize);
      setUsers(data);
      setTotal(total);
    }
    fetchUser();
  }, [paging]);

  const ctxValue = {
    users,
    total,
    paging,
    editingUserId,
    setPaging,
    setEditingUserId,
  }
  return (
    <UserContext.Provider value={ctxValue}>
      {children}
    </UserContext.Provider>
  )
}
