import { Link } from 'react-router-dom';
import './Sidebar.styles.css';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import CreateFileForm from '../CreateFileForm/CreateFileForm';
import { ContextMenu } from 'primereact/contextmenu';
import AddPermissionForm from '../AddPermissionForm/AddPermissionForm';
import DeleteFileForm from '../DeleteFileForm/DeleteFileForm';
import ViewPermissionsForm from '../ViewPermissionsForm/ViewPermissionsForm';
import axios from 'axios';
import { fileServiceURI, userServiceURI } from '../../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setFiles, setSpaceLevel, setSpaceSize } from '../../store/userSlice';
import { ProgressBar } from 'primereact/progressbar';
import { LEVEL_SPACE_SIZES } from '../../constants/index';
import { Tooltip } from 'primereact/tooltip';

export default function Sidebar({userId, files}) {
  const toastRef = useRef(null);
  const [createFileDialogVisible, setCreateFileDialogVisible] = useState(false);
  const [addPermissionDialogVisible, setAddPermissionDialogVisible] = useState(false);
  const [viewPermissionsDialogVisible, setViewPermissionsDialogVisible] = useState(false);
  const [deleteFileDialogVisible, setDeleteFileDialogVisible] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const spaceSize = useSelector((state) => state.user.spaceSize);
  const spaceLevel = useSelector((state) => state.user.spaceLevel);
  const dispatch = useDispatch();

  useEffect(() => {
    let currentSpaceSize = 0;
    for (let i = 0; i < files.length; i++) {
      currentSpaceSize += files[i].size;
    }
    dispatch(setSpaceSize(currentSpaceSize));
  }, [files, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    (async (token) => {
      const { data } = await axios.get(fileServiceURI + "/users-spaces/level", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data?.ok) return;

      dispatch(setSpaceLevel(data.level));
    })(token);
  }, [spaceLevel, dispatch]);

  const copyFileLink = () => {
    navigator.clipboard.writeText(`http://localhost:5173/file/${selectedFileId}`);
    toastRef.current.show({severity: 'success', detail: 'Link copied to clipboard!', life: 2500});
  };

  const togglePublic = async () => {
    const token = localStorage.getItem("token");

    const currentFile = files.find(file => file.id === selectedFileId);
    const prevPub = currentFile?.public;

    try {
      await axios.patch(fileServiceURI + `/files/${selectedFileId}/togglepub`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedFiles = files.map((file) =>
        file.id === selectedFileId ? { ...file, public: !file.public } : file
      );

      dispatch(setFiles(updatedFiles));
      
      const text = prevPub ? 'File has been made private' : 'File has been made public';
      toastRef.current.show({ severity: 'success', detail: text, life: 2500 });
    } catch (e) {
      toastRef.current.show({severity: 'danger', detail: e, life: 2000});
    }
  }

  const publicFileContextMenuItems = [
    {
      label: 'Copy link',
      command: copyFileLink,
    },
    {
      label: 'Make private',
      command: togglePublic,
    },
    {
      label: 'Delete',
      command: () => setDeleteFileDialogVisible(true),
    },
  ];
  const privateFileContextMenuItems = [
    {
      label: 'Add permission',
      command: () => setAddPermissionDialogVisible(true),
    },
    {
      label: 'View permissions',
      command: () => setViewPermissionsDialogVisible(true),
    },
    {
      label: 'Copy link',
      command: copyFileLink,
    },
    {
      label: "Make public",
      command: togglePublic,
    },
    {
      label: 'Delete',
      command: () => setDeleteFileDialogVisible(true),
    },
  ];
  const publicFileContextMenuRef = useRef(null);
  const privateFileContextMenuRef = useRef(null);

  const copyIdToClipboard = (e) => {
    navigator.clipboard.writeText(userId);
    toastRef.current.show({severity: 'success', detail: 'ID copied to clipboard', life: 2500});
  };

  const onFileContextMenu = (e, file) => {
    e.preventDefault();
    setSelectedFileId(file.id);
    if (!file.public) {
      privateFileContextMenuRef.current.show(e);
      publicFileContextMenuRef.current ? publicFileContextMenuRef.current.hide() : (() => {})();
    } else {
      publicFileContextMenuRef.current.show(e);
      privateFileContextMenuRef.current ? privateFileContextMenuRef.current.hide() : (() => {})();
    }
  };

  const signOut = () => {
    axios.get(userServiceURI + '/auth/signout')

    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className='sidebar'>
      <div className='sidebar__user-id'>
        Your ID: <Button size='small' label={userId} icon='pi pi-copy' outlined={true} onClick={copyIdToClipboard} />
        <Toast ref={toastRef} position='top-center' />
        <div style={{display: 'flex', gap: '10px'}}>
          <Button label='Sign-out' icon='pi pi-sign-out' severity='danger' size='small' onClick={signOut} />
        </div>
      </div>
      <div className='sidebar__files'>
        <div className='sidebar__create-file'>
          <div className="titlebtn">
            <h2>Your space</h2>
            <Button size='small' rounded={true} icon='pi pi-plus' onClick={() => setCreateFileDialogVisible(true)} />
            <Dialog header='Create file' visible={createFileDialogVisible} onHide={() => {if (!createFileDialogVisible) return; setCreateFileDialogVisible(false)}} draggable={false}>
              <CreateFileForm setDialogVisible={setCreateFileDialogVisible} showToast={(msg) => toastRef.current.show(msg)} />
            </Dialog>
          </div>
          <Tooltip target='.space-bar' />
          <ProgressBar
            data-pr-tooltip={`Used: ${(spaceSize / 1024**3).toFixed(4)} GB / ${LEVEL_SPACE_SIZES[spaceLevel].maxSpaceSize / 1024**3} GB`}
            data-pr-position="right"
            className='space-bar'
            value={spaceSize / LEVEL_SPACE_SIZES[spaceLevel].maxSpaceSize * 100}
            showValue={false} />
        </div>
        <Dialog header='Add Permission' visible={addPermissionDialogVisible} onHide={() => {if (!addPermissionDialogVisible) return; setAddPermissionDialogVisible(false)}} draggable={false}>
          <AddPermissionForm fileId={selectedFileId} setDialogVisible={setAddPermissionDialogVisible} showToast={(msg) => toastRef.current.show(msg)} />
        </Dialog>
        <Dialog header='Permissions' visible={viewPermissionsDialogVisible} onHide={() => {if (!viewPermissionsDialogVisible) return; setViewPermissionsDialogVisible(false)}} draggable={false}>
          <ViewPermissionsForm fileId={selectedFileId} setDialogVisible={setViewPermissionsDialogVisible} showToast={(msg) => toastRef.current.show(msg)} />
        </Dialog>
        <Dialog header='Delete File' visible={deleteFileDialogVisible} onHide={() => {if (!deleteFileDialogVisible) return; setDeleteFileDialogVisible(false)}} draggable={false}>
          <DeleteFileForm file={files.find(file => file.id === selectedFileId)} setDialogVisible={setDeleteFileDialogVisible} showToast={(msg) => toastRef.current.show(msg)} />
        </Dialog>
        {files && files.map((file, index) => {
          return (
            <Link key={index} className='sidebar_file-link' to={'/file/' + file.id} draggable={false} onContextMenu={(e) => onFileContextMenu(e, file)}>
              {!file.public ?
              <>
                <div className='pi pi-lock'></div>
                <ContextMenu model={privateFileContextMenuItems} ref={privateFileContextMenuRef} />
              </>
              :
              <>
                <div className='pi pi-globe'></div>
                <ContextMenu model={publicFileContextMenuItems} ref={publicFileContextMenuRef} />
              </>
              }
              <p>{file.downloadFilename.length <= 16 ? file.downloadFilename : file.downloadFilename.slice(0, 16) + '...'}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
