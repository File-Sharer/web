import { useState } from 'react';
import './AddPermissionForm.styles.css';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { fileServiceURI } from '../../api/api';
import { toast } from 'react-toastify';

export default function AddPermissionForm({ isFolder, resourceId, setDialogVisible, showToast }) {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = isFolder ? `${fileServiceURI}/folders/${resourceId}/${username}` : `${fileServiceURI}/files/${resourceId}/${username}`;

    try {
      await axios.put(url, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDialogVisible(false);
      showToast({severity: 'success', detail: `Permission has been added to user: ${username}`, life: 2000});
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
                  id='username'
                  name='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  tooltip={
                    isFolder ? 
                    'The name of the user you want to give permission to view and download this folder'
                    :
                    'The name of the user you want to give permission to view and download this file'
                  }
                  tooltipOptions={{ position: 'bottom', event: 'focus' }}
                  autoComplete='off'
                  required
                />
                <label htmlFor='username'>Username</label>
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
