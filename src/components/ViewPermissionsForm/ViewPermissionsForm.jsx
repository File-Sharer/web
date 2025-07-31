import { useEffect, useState } from 'react';
import './ViewPermissionsForm.styles.css';
import axios from 'axios';
import { Button } from 'primereact/button';
import { fileServiceURI } from '../../api/api';

export default function ViewPermissionsForm({ fileId, setDialogVisible, showToast }) {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { data } = await axios.get(`${fileServiceURI}/files/${fileId}/permissions`, {
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
  }, [fileId]);

  const handleDeletePermission = async (username) => {
    try {
      await axios.delete(`${fileServiceURI}/files/${fileId}/${username}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPermissions(permissions.filter((permUsername) => permUsername !== username));
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
          {permissions.map((username) => (
            <li key={username} className="permission-item">
              {username}
              <Button
                label="Delete"
                icon="pi pi-trash"
                severity="danger"
                onClick={() => handleDeletePermission(username)}
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
