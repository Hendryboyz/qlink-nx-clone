import React, { useContext } from 'react';
import MemberTable from '$/pages/MemberMangement/MemberTable';
import { MemberContext } from '$/pages/MemberMangement/MemberContext';
import MemberEditingForm from '$/pages/MemberMangement/MemberEditingForm';


const Index: React.FC = () => {
  const {editingMember} = useContext(MemberContext);
  return (
    <div>
      <h1>Member Management</h1>
      {!editingMember && <MemberTable />}
      {editingMember && <MemberEditingForm />}
    </div>
  );

};

export default Index;
