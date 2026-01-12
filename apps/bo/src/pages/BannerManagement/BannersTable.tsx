import React, { useContext } from 'react';
import { DragSortTable, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Space, Tooltip, Typography, Popconfirm } from 'antd';
import { BannerDto } from '@org/types';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { MdOutlineArchive, MdOutlineLaunch } from 'react-icons/md';
import { BannerContext } from '$/pages/BannerManagement/BannerContext';
import API from '$/utils/fetch';

const generateEnabledTableColumns = (
  setEditingBanner: (value: any) => void,
  archiveBanner: (recordId: string) => void,
): ProColumns[] => {
  return [
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
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
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
      dataIndex: 'link',
      key: 'link',
      search: false,
      render: (value: string, _: BannerDto) => (
        <Typography.Link href={value}>{value}</Typography.Link>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      search: false,
      render: (_: unknown, record: BannerDto) => (
        <Space size="middle">
          <Button variant="link" color="default" onClick={() => setEditingBanner(record)}>
            <Tooltip title="update">
              <EditOutlined style={{ fontSize: 16 }} />
            </Tooltip>
          </Button>
          <Button variant="link" color="danger" onClick={() => archiveBanner(record.id)}>
            <Tooltip title="archive">
              <MdOutlineArchive style={{ fontSize: 18 }} />
            </Tooltip>
          </Button>
        </Space>
      ),
    },
  ];
};

const getDisabledTableColumns = (
  activateBanner: (recordId: string) => void,
  deleteBanner: (recordId: string) => void,
): ProColumns[] => {
  return [
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
      dataIndex: 'link',
      key: 'link',
      search: false,
      render: (value: string, _: BannerDto) => (
        <Typography.Link href={value}>{value}</Typography.Link>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      search: false,
      render: (_: unknown, record: BannerDto) => (
        <Space size="middle">
          <Button
            color="primary"
            variant="link"
            onClick={() => { activateBanner(record.id) }}
          >
            <Tooltip title="activate">
              <MdOutlineLaunch style={{ fontSize: 16 }} />
            </Tooltip>
          </Button>
          <Popconfirm
            title={`Delete Banner: ${record.id}`}
            description='Are you sure to delete this banner?'
            onConfirm={() => { deleteBanner(record.id) }}
          >
            <Button color="danger" variant="link">
              <Tooltip title="delete">
                <DeleteOutlined style={{ fontSize: 16 }} />
              </Tooltip>
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
}
type BannersTableProps = {
  setEditingBanner: (value: any) => void;
}

function BannersTable({ setEditingBanner }: BannersTableProps) {
  const {
    isLoading,
    activeBanners,
    setActiveBanners,
    archivedBanners,
    setArchivedBanners,
  } = useContext(BannerContext);

  const archiveBanner = async (recordId: string) => {
    const prevActiveList = activeBanners;
    const archivingBanner = activeBanners.find((banner) => banner.id === recordId);
    setActiveBanners((prevActives: BannerDto[]) =>
      prevActives.filter((banner) => banner.id !== recordId));
    try {
      await API.archiveBanner(recordId);
      archivingBanner.archived = true;
      setArchivedBanners((prevArchives: BannerDto[]) => [...prevArchives, archivingBanner]);
    } catch (e) {
      console.error(e);
      message.error(`fail to archive banner`)
      setActiveBanners(prevActiveList);
    }
  };

  const handleDragSortEnd = async (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any[],
  ) => {
    newDataSource = newDataSource.map((data, idx) => ({
      ...data,
      order: idx,
    }));
    const oldBannerList = activeBanners;
    setActiveBanners(newDataSource);
    try {
      const orderUpdatedPayload = {
        list: newDataSource.map(item => ({
          id: item.id,
          order: item.order,
        }))
      };
      await API.reorderBanners(orderUpdatedPayload);
      console.debug('sorted payload', orderUpdatedPayload);
      message.success('revise list order success');
    } catch (e) {
      console.error(e);
      setActiveBanners(oldBannerList);
      message.error('fail to reorder banners');
    }
  };

  const activateBanner = async (recordId: string) => {
    const prevArchivedList = archivedBanners;
    const reActivateBanner = archivedBanners.find((banner) => banner.id === recordId);
    setArchivedBanners((prevArchives: BannerDto[]) => prevArchives.filter((banner) => banner.id !== recordId));
    try {
      const resp = await API.activateBanner(recordId);
      reActivateBanner.archived = false;
      reActivateBanner.order = resp.data.newOrder;
      setActiveBanners((prevActives: BannerDto[]) => [...prevActives, reActivateBanner]);
    } catch (e) {
      console.error(e);
      setArchivedBanners(prevArchivedList);
    }
  }

  const deleteBanner = async (recordId: string) => {
    const prevArchivedList = archivedBanners;
    setArchivedBanners((prevArchives: BannerDto[]) => prevArchives.filter((banner) => banner.id !== recordId));
    try {
      await API.deleteBanner(recordId)
    } catch(e) {
      console.error(e);
      setArchivedBanners(prevArchivedList);
    }
  }

  return (
    <>
      <DragSortTable
        options={{
          reload: false,
          density: false,
          setting: false,
        }}
        headerTitle="Active Banners"
        columns={generateEnabledTableColumns(setEditingBanner, archiveBanner)}
        dataSource={activeBanners}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            onClick={() => {  setEditingBanner(null); }}
          >
            New Banner
          </Button>,
        ]}
        dragSortKey='sort'
        search={false}
        pagination={false}
        onDragSortEnd={handleDragSortEnd}
        dateFormatter="string"
        style={{ marginBottom: '32px' }}
        loading={isLoading}
      />
      <ProTable
        options={{
          reload: false,
          density: false,
          setting: false,
        }}
        headerTitle="Archived Banners"
        columns={getDisabledTableColumns(activateBanner, deleteBanner)}
        dataSource={archivedBanners}
        rowKey="id"
        search={false}
        pagination={false}
        loading={isLoading}
      />
    </>
  );
}

export default BannersTable;
