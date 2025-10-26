import React, { useState } from 'react';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { DragSortTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import { UserVO } from '@org/types';
import { EditOutlined, StopOutlined } from '@ant-design/icons';


const enabledTableColumns: ProColumns[] = [
  {
    title: 'order',
    dataIndex: 'sort',
    width: 60,
    className: 'drag-visible',
  },
  {
    dataIndex: 'id',
    key: 'id',
    hideInTable: true,
    search: false,
  },
  {
    dataIndex: 'order',
    key: 'order',
    hideInTable: true,
    search: false,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Subtitle',
    dataIndex: 'subtitle',
    key: 'subtitle',
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
  },
  {
    title: 'Link URL',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Actions',
    key: 'actions',
    search: false,
    render: (_: unknown, record: UserVO) => (
      <Space size="middle">
        <Button
          variant='link'
          color='default'
          onClick={() => {}}>
          <EditOutlined style={{ fontSize: 16 }} />
        </Button>
        <Button
          variant='link'
          color='danger'
          onClick={() => {}}
        >
          <StopOutlined style={{ fontSize: 16 }} />
        </Button>
      </Space>
    ),
  },
];

const enabledData = [
  {
    id: '1',
    order: 0,
    title: 'title 1',
    subtitle: 'subtitle 1',
    enabled: true,
  },
  {
    id: '2',
    order: 1,
    title: 'title 2',
    subtitle: 'subtitle 2',
    enabled: true,
  },
  {
    id: '3',
    order: 2,
    title: 'title 3',
    subtitle: 'subtitle 3',
    enabled: true,
  },
  {
    id: '4',
    order: NaN,
    title: 'title 4',
    subtitle: 'subtitle 4',
    enabled: true,
  },
];

const disabledTableColumns: ProColumns[] = [
  {
    dataIndex: 'id',
    key: 'id',
    hideInTable: true,
    search: false,
  },
  {
    dataIndex: 'order',
    key: 'order',
    hideInTable: true,
    search: false,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Subtitle',
    dataIndex: 'subtitle',
    key: 'subtitle',
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
  },
  {
    title: 'Link URL',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Actions',
    key: 'actions',
    search: false,
    render: (_: unknown, record: UserVO) => (
      <Space size="middle">
        <Button
          color="primary"
          variant="solid"
          onClick={() => {}}
        >
          Enabled
        </Button>
        <Button
          danger
          onClick={() => {}}
        >
          Delete
        </Button>
      </Space>
    ),
  },
];


const disabledData = [5, 6, 7, 8, 9, 10, 11].map((num: number) => (
  {
    id: num.toString(),
    order: num,
    title: `title ${num}`,
    subtitle: `subtitle ${num}`,
    enabled: true,
  }
));

function BannersTable() {
  const [dataSource, setDataSource] = useState(enabledData);
  const handleDragSortEnd = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any[],
  ) => {
    console.debug('sorted data', newDataSource);
    newDataSource = newDataSource.map((data, idx) => ({
      ...data,
      order: idx,
    }));
    setDataSource(newDataSource);
    const orderUpdatedPayload = newDataSource.map(item => ({
      id: item.id,
      order: item.order,
    }));
    console.debug('sorted payload', orderUpdatedPayload);
    message.success('revise list order success');
  };

  return (
    <>
      <DragSortTable
        options={{
          reload: false,
          density: false,
          setting: false,
        }}
        headerTitle="Enabled Items"
        columns={enabledTableColumns}
        dataSource={dataSource}
        rowKey="id"
        // search={{
        //   labelWidth: 'auto',
        // }}
        dragSortKey='sort'
        search={false}
        pagination={false}
        onDragSortEnd={handleDragSortEnd}
        dateFormatter="string"
        style={{ marginBottom: '32px' }}
      />
      <ProTable
        options={{
          reload: false,
          density: false,
          setting: false,
        }}
        headerTitle="Disabled Items"
        columns={disabledTableColumns}
        dataSource={disabledData}
        rowKey="id"
        // search={{
        //   labelWidth: 'auto',
        // }}
        search={false}
        pagination={false}
      />
    </>
  );
}

export default BannersTable;
