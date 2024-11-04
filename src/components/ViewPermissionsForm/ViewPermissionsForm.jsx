import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';

export default function ViewPermissionsForm({ fileId, setDialogVisible, showToast }) {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { data } = await axios.get(`http://localhost:9000/api/files/${fileId}/permissions`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
        });
        setPermissions(data.data);
      } catch (error) {
        showToast({ severity: 'error', detail: 'Failed to load permissions', life: 2500 });
      }
    };
    fetchPermissions();
  }, [fileId]);

  const handleDeletePermission = async (userId) => {
    try {
      await axios.delete(`http://localhost:9000/api/files/${fileId}/permission`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          'userToDelete': userId,
        },
      });
      setPermissions(permissions.filter((perm) => perm.userId !== userId));
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
          {permissions.map((permission) => (
            <li key={permission.userId} className="permission-item">
              {permission.userId}
              <Button
                label="Delete"
                icon="pi pi-trash"
                severity="danger"
                onClick={() => handleDeletePermission(permission.userId)}
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
