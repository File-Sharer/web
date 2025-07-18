import { Button } from 'primereact/button';
import './DeleteFileForm.styles.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { fileServiceURI } from '../../api/api';
import { useDispatch } from 'react-redux';
import { deleteFile } from '../../store/userSlice';

export default function DeleteFileForm({ fileId, setDialogVisible, showToast }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    try {
      await axios.delete(`${fileServiceURI}/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(deleteFile(fileId));
      setDialogVisible(false);
      showToast({severity: 'success', detail: `You have deleted file: ${fileId}`, life: 2000});
    } catch (error) {
      return toast.error(error.response.data.error);
    }
  };

  return (
    <div className='delete'>
      <h2>Are you sure you want to delete this file?</h2>
      <Button label='Delete' severity='danger' size='large' onClick={handleSubmit} />
    </div>
  );
}
