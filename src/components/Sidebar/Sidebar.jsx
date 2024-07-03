import { Link } from 'react-router-dom';
import './Sidebar.styles.css';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import CreateFileForm from '../CreateFileForm/CreateFileForm';

export default function Sidebar({userId, files}) {
  const toastRef = useRef(null);
  const createFileToastRef = useRef(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const copyIdToClipboard = (e) => {
    navigator.clipboard.writeText(userId);
    toastRef.current.show({severity: 'success', detail: 'ID Copied to clipboard!', life: 2500});
  };

  return (
    <div className='sidebar'>
      <div className='sidebar__user-id'>
        Your ID: {userId}
        <Button size='small' label='Copy' icon='pi pi-copy' outlined={true} onClick={copyIdToClipboard} />
        <Toast ref={toastRef} position='top-center' />
      </div>
      <div className='sidebar__files'>
        <div className='sidebar__create-file'>
          <h2>Your files</h2>
          <Button size='small' rounded={true} icon='pi pi-plus' onClick={() => setDialogVisible(true)} />
          <Dialog header='Create file' visible={dialogVisible} onHide={() => {if (!dialogVisible) return; setDialogVisible(false)}} draggable={false}>
            <CreateFileForm setDialogVisible={setDialogVisible} showToast={(msg) => toastRef.current.show(msg)} />
            <Toast ref={createFileToastRef} />
          </Dialog>
        </div>
        {files && files.map((file, index) => {
          return (
            <Link key={index} className='sidebar_file-link' to={'/file/' + file.id} draggable={false} onContextMenu={(e) => ctxMenuRef.current.show(e)}>
              <p>{file.downloadFilename}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
