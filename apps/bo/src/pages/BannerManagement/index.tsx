import React, { useEffect, useState } from 'react';
import BannersTable from '$/pages/BannerManagement/BannersTable';
import EditBanner from '$/pages/BannerManagement/EditBanner';
import API from '$/utils/fetch';

const BannerManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(undefined);
  const [activeBanners, setActiveBanners] = useState([]);
  const [archivedBanners, setArchivedBanners] = useState([]);

  useEffect(() => {
    async function loadingBanners() {
      setIsLoading(true);
      const activeBanners = await API.listActiveBanners();
      setActiveBanners(activeBanners.data);
      const archivedBanners = await API.listArchivedBanners();
      setArchivedBanners(archivedBanners.data);
      setIsLoading(false);
    }
    loadingBanners();
  }, []);

  function cancelBannerEditing() {
    setEditingBanner(undefined);
  }

  return (
    <div>
      <h1>Banner Management</h1>
      {
        editingBanner === undefined &&
          <BannersTable
            activeBanners={activeBanners}
            archivedBanners={archivedBanners}
            setEditingBanner={setEditingBanner}
          />
      }
      {editingBanner !== undefined &&
        <EditBanner
          initialValues={editingBanner}
          onCancel={cancelBannerEditing}
        />}
    </div>
  );
};

export default BannerManagement;
