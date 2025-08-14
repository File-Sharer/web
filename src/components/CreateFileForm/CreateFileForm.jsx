import {  useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { fileServiceURI } from '../../api/api';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addFile, incrSpaceSize } from '../../store/userSlice';
import './CreateFileForm.styles.css';
import { LEVEL_SPACE_SIZES } from '../../constants/index';

export default function CreateFileForm({ setDialogVisible, showToast, folderId }) {
  const [file, setFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [downloadName, setDownloadName] = useState('');
  const dispatch = useDispatch();
  const spaceLevel = useSelector((state) => state.user.spaceLevel);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData(e.target);
    if (!file) {
      return toast.warning('File is required');
    }

    if (folderId) {
      formData.append("folderId", folderId);
    }
    formData.append('file', file);
    formData.append('isPublic', isPublic);
    
    try {
      const { data } = await axios.post(`${fileServiceURI}/files`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(addFile(data.data));
      dispatch(incrSpaceSize(data.data.size));
      setDialogVisible(false);
      showToast({severity: 'success', detail: 'File uploaded', life: 2000});
    } catch (error) {
      return toast.error(error.response.data.error);
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.files[0];
    setFile(uploadedFile);

    const arr = uploadedFile.name.split('.');
    const arrLen = arr.length;
    setDownloadName(arr.slice(0, arrLen - 1).join('.'));
  };

  return (
    <div className='fileform'>
      <form onSubmit={handleSubmit}>
        <div className='fileform__options'>
          <div className='fileform__option'>
            File
            <FileUpload name='file' customUpload={true} uploadHandler={handleFileUpload} mode='basic' auto chooseLabel='Browse' maxFileSize={LEVEL_SPACE_SIZES[spaceLevel].maxFileSize} />
          </div>
          <div className='fileform__option'>
            <div className="p-inputgroup flex-1">
              <FloatLabel>
                <InputText
                  id='fileDownloadName'
                  name='downloadName'
                  value={downloadName}
                  onChange={(e) => setDownloadName(e.target.value)}
                  tooltip='Download name is the name of the file with which this file will be downloaded from other users'
                  tooltipOptions={{ position: 'bottom', event: 'focus' }}
                  autoComplete='off'
                />
                <label htmlFor='fileDownloadName'>Download name</label>
              </FloatLabel>
              <span className='p-inputgroup-addon'>
                {file ? `.${file.name.split('.').pop()}` : '.ext'}
              </span>
            </div>
          </div>
          <div className='fileform__option'>
            <Checkbox
              inputId='isPublic'
              checked={isPublic}
              onChange={(e) => setIsPublic(e.checked)}
            />
            <label htmlFor='isPublic' className='p-checkbox-label'>
              Public
            </label>
          </div>
          <div className='fileform__option'>
            <Button type='submit' label='Upload' icon='pi pi-upload' />
          </div>
        </div>
      </form>
    </div>
  );
}
