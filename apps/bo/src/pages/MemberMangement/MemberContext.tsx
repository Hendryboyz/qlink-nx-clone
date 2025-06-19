import { createContext, ReactNode, useEffect, useState } from 'react';
import { UserVO } from '@org/types';
import API from '$/utils/fetch';

type pagingType = {
  pageSize: number;
  page: number;
};

interface MemberContextType {
  editingMember: UserVO;
  members: UserVO[];
  total: number;
  paging: pagingType;
  setPaging: (prevState) => void
  setMembers: (prevState) => void
  setEditingMember: (prevState) => void
}

const INITIAL_STATE: MemberContextType = {
  editingMember: null,
  members: [],
  total: 0,
  paging: {
    pageSize: 10,
    page: 1,
  },
  setPaging: (prevState) => {},
  setMembers: (prevState) => {},
  setEditingMember: (prevState) => {},
}

export const MemberContext = createContext<MemberContextType>(INITIAL_STATE);

const INITIAL_PAGING_VALUES = {
  pageSize: 10,
  page: 1,
};


export default function MemberContextProvider({ children }: { children: ReactNode }) {
  const [editingMember, setEditingMember] = useState<UserVO>(null);
  const [members, setMembers] = useState<UserVO[]>([]);
  const [total, setTotal] = useState(0);
  const [paging, setPaging] = useState(INITIAL_PAGING_VALUES);

  useEffect(() => {
    async function fetchClientUsers() {
      const { data, total } = await API.getClientUsers(paging.page, paging.pageSize);
      setMembers(data);
      setTotal(total);
    }
    fetchClientUsers();
  }, [paging]);

  const ctxValues: MemberContextType = {
    editingMember,
    members,
    total,
    paging,
    setPaging,
    setMembers,
    setEditingMember,
  }
  return (
    <MemberContext.Provider value={ctxValues}>
      {children}
    </MemberContext.Provider>
  );
}
