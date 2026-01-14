import React, { useState } from 'react';
import BannersTable from '$/pages/BannerManagement/BannersTable';
import EditBanner from '$/pages/BannerManagement/EditBanner';

const BannerManagement: React.FC = () => {
  const [editingBanner, setEditingBanner] = useState(undefined);

  function cancelBannerEditing() {
    setEditingBanner(undefined);
  }

  return (
    <div>
      <h1>Banner Management</h1>
      {
        editingBanner === undefined &&
          <BannersTable
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
