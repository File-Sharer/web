import { useState } from 'react';
import './AddPermissionForm.styles.css';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { fileServiceURL } from '../../api/api';
import { toast } from 'react-toastify';

export default function AddPermissionForm({ fileId, setDialogVisible, showToast }) {
  const [userId, setUserId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(`${fileServiceURL}/files/${fileId}/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDialogVisible(false);
      showToast({severity: 'success', detail: `Permission to this file has been added successfully to user: ${userId}`, life: 2000});
    } catch (error) {
      return toast.error(error.response.data.error);
    }
  };

  return (
    <div>
      <div className='permission'>
        <form onSubmit={handleSubmit}>
          <div className='permission__options'>
            <div className='permission__option'>
              <FloatLabel>
                <InputText
                  id='userId'
                  name='userId'
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  tooltip='The ID of the user you want to give permission to view and download this file'
                  tooltipOptions={{ position: 'bottom', event: 'focus' }}
                  autoComplete='off'
                  required
                />
                <label htmlFor='userId'>User ID</label>
              </FloatLabel>
            </div>
            <div className='permission__option'>
              <Button type='submit' label='Add' icon='pi pi-plus' />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
