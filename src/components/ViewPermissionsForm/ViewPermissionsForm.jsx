import { useEffect, useState } from 'react';
import './ViewPermissionsForm.styles.css';
import axios from 'axios';
import { Button } from 'primereact/button';
import { fileServiceURI } from '../../api/api';

export default function ViewPermissionsForm({ isFolder, resourceId, setDialogVisible, showToast }) {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      const url = isFolder ? `${fileServiceURI}/folders/${resourceId}/permissions` : `${fileServiceURI}/files/${resourceId}/permissions`;

      try {
        const { data } = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
        });
        setPermissions(data);
      } catch (error) {
        showToast({ severity: 'error', detail: 'Failed to load permissions', life: 2500 });
      }
    };
    fetchPermissions();
  });

  const handleDeletePermission = async (userId) => {
    const url = isFolder ? `${fileServiceURI}/folders/${resourceId}/${userId}` : `${fileServiceURI}/files/${resourceId}/${userId}`;
    
    try {
      await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPermissions(permissions.filter((p) => p.userId !== userId));
      showToast({ severity: 'success', detail: 'Permission deleted', life: 2500 });
    } catch (error) {
      showToast({ severity: 'error', detail: 'Failed to delete permission', life: 2500 });
    }
  };

  return (
    <div className="permissions-list">
      <h3>File Permissions</h3>
      {permissions && permissions.length > 0 ? (
        <ul>
          {permissions.map((p) => (
            <li key={p.userId} className="permission-item">
              {p.username}
              <Button
                label="Delete"
                icon="pi pi-trash"
                severity="danger"
                onClick={() => handleDeletePermission(p.userId)}
                className="delete-button"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No permissions found.</p>
      )}
      <Button label="Close" icon="pi pi-times" onClick={() => setDialogVisible(false)} />
    </div>
  );
}
