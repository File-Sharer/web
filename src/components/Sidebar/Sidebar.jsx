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
import { SidebarFiles } from './Sidebar.files';
import { SidebarFolders } from './Sidebar.folders';

export default function Sidebar({userId, files}) {
  const toastRef = useRef(null);
  const [viewFolders, setViewFolders] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [createFileDialogVisible, setCreateFileDialogVisible] = useState(false);

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
  }, [user.spaceLevel, dispatch]);

  const copyIdToClipboard = (e) => {
    navigator.clipboard.writeText(userId);
    toastRef.current.show({severity: 'success', detail: 'ID copied to clipboard', life: 2500});
  };

  const signOut = () => {
    axios.get(userServiceURI + '/auth/signout');

    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className='sidebar'>
      <div className='sidebar__user-info'>
        <span style={{color: '#999'}}>{user.user.login}</span>
        Your ID: <Button size='small' label={userId} icon='pi pi-copy' outlined={true} onClick={copyIdToClipboard} />
        <Toast ref={toastRef} position='top-center' />
        <div style={{display: 'flex', gap: '10px'}}>
          <Button label='Sign-out' icon='pi pi-sign-out' severity='danger' size='small' onClick={signOut} />
        </div>

        <div className='sidebar__create'>
            <div className="titlebtn">
                <h2>Your space</h2>
                <Button size='small' rounded={true} icon='pi pi-plus' onClick={() => setCreateFileDialogVisible(true)} />
                <Dialog header='Create file' visible={createFileDialogVisible} onHide={() => {if (!createFileDialogVisible) return; setCreateFileDialogVisible(false)}} draggable={false}>
                <CreateFileForm setDialogVisible={setCreateFileDialogVisible} showToast={(msg) => toastRef.current.show(msg)} />
                </Dialog>
            </div>
        </div>

        <Tooltip target='.space-bar' />
        <ProgressBar
          data-pr-tooltip={`Used: ${(user.spaceSize / 1024**3).toFixed(4)} GB / ${LEVEL_SPACE_SIZES[user.spaceLevel].maxSpaceSize / 1024**3} GB`}
          data-pr-position="right"
          className='space-bar'
          value={user.spaceSize / LEVEL_SPACE_SIZES[user.spaceLevel].maxSpaceSize * 100}
          showValue={false}
          style={{width: '70%'}} />
      </div>
      {viewFolders ? <SidebarFolders /> : <SidebarFiles userId={userId} files={files} toastRef={toastRef} />}
    </div>
  );
}
