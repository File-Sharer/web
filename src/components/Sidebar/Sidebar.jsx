import { Link } from 'react-router-dom';
import './Sidebar.styles.css';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import CreateFileForm from '../CreateFileForm/CreateFileForm';
import { ContextMenu } from 'primereact/contextmenu';
import AddPermissionForm from '../AddPermissionForm/AddPermissionForm';

export default function Sidebar({userId, files}) {
  const toastRef = useRef(null);
  const [createFileDialogVisible, setCreateFileDialogVisible] = useState(false);
  const [addPermissionDialogVisible, setAddPermissionDialogVisible] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const contextMenuRef = useRef(null);
  const contextMenuItems = [
    {
      label: 'Add permission',
      command: () => setAddPermissionDialogVisible(true),
    },
  ];

  const copyIdToClipboard = (e) => {
    navigator.clipboard.writeText(userId);
    toastRef.current.show({severity: 'success', detail: 'ID Copied to clipboard!', life: 2500});
  };

  const onFileContextMenu = (e, fileId) => {
    e.preventDefault();
    setSelectedFileId(fileId);
    contextMenuRef.current.show(e);
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
          <Button size='small' rounded={true} icon='pi pi-plus' onClick={() => setCreateFileDialogVisible(true)} />
          <Dialog header='Create file' visible={createFileDialogVisible} onHide={() => {if (!createFileDialogVisible) return; setCreateFileDialogVisible(false)}} draggable={false}>
            <CreateFileForm setDialogVisible={setCreateFileDialogVisible} showToast={(msg) => toastRef.current.show(msg)} />
          </Dialog>
        </div>
        <Dialog header='Add permission' visible={addPermissionDialogVisible} onHide={() => {if (!addPermissionDialogVisible) return; setAddPermissionDialogVisible(false)}} draggable={false}>
          <AddPermissionForm fileId={selectedFileId} setDialogVisible={setAddPermissionDialogVisible} showToast={(msg) => toastRef.current.show(msg)} />
        </Dialog>
        {files && files.map((file, index) => {
          return (
            <Link key={index} className='sidebar_file-link' to={'/file/' + file.id} draggable={false} onContextMenu={(e) => onFileContextMenu(e, file.id)}>
              <ContextMenu model={contextMenuItems} ref={contextMenuRef} />
              <p>{file.downloadFilename}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
