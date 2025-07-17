import {  useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { fileServiceURI } from '../../api/api';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addFile } from '../../store/userSlice';
import './CreateFileForm.styles.css';

const MAX_FILE_SIZE = 268435456;

export default function CreateFileForm({ setDialogVisible, showToast }) {
  const [file, setFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [downloadFilename, setDownloadFilename] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    console.log(file);
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData(e.target);
    if (!file) {
      return toast.warning('File is required');
    }

    formData.append('file', file);
    formData.append('isPublic', isPublic);
    formData.append('downloadFilename', downloadFilename);

    try {
      const { data } = await axios.post(`${fileServiceURI}/files`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(addFile(data.data));
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
    setDownloadFilename(arr.slice(0, arrLen - 1).join('.'));
  };

  return (
    <div className='fileform'>
      <form onSubmit={handleSubmit}>
        <div className='fileform__options'>
          <div className='fileform__option'>
            File
            <FileUpload name='file' customUpload uploadHandler={handleFileUpload} mode='basic' auto chooseLabel='Browse' maxFileSize={MAX_FILE_SIZE} />
          </div>
          <div className='fileform__option'>
            <div className="p-inputgroup flex-1">
              <FloatLabel>
                <InputText
                  id='fileDownloadName'
                  name='downloadFilename'
                  value={downloadFilename}
                  onChange={(e) => setDownloadFilename(e.target.value)}
                  tooltip='Download filename is the name of the file with which this file will be downloaded from other users'
                  tooltipOptions={{ position: 'bottom', event: 'focus' }}
                  autoComplete='off'
                />
                <label htmlFor='fileDownloadName'>Download filename</label>
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
