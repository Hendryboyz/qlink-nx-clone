import React, { ReactElement, useContext } from 'react';
import {Layout} from 'antd';
import { UserContext } from '$/pages/UsersManagement/UsersContext';
import UserTable from '$/pages/UsersManagement/UserTable';
import CreateUser from '$/pages/UsersManagement/CreateUser';

const {Content} = Layout;

export default function Index(): ReactElement {
  const {isCreatingUser} = useContext(UserContext);
  return (<Layout>
    <h1>BO Users Management</h1>
    <Content>
      {isCreatingUser && <CreateUser />}
      {!isCreatingUser && <UserTable />}
    </Content>
  </Layout>)

}
