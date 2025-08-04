import axios from 'axios';
import { useDispatch } from 'react-redux';
import './Sidebar.styles.css';
import { setFiles } from '../../store/userSlice';
import { Dialog } from 'primereact/dialog';
import { ContextMenu } from 'primereact/contextmenu';
import AddPermissionForm from '../AddPermissionForm/AddPermissionForm';
import DeleteFileForm from '../DeleteFileForm/DeleteFileForm';
import ViewPermissionsForm from '../ViewPermissionsForm/ViewPermissionsForm';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';

export function SidebarFiles({ userId, files, toastRef }) {
    const dispatch = useDispatch();
    const [addPermissionDialogVisible, setAddPermissionDialogVisible] = useState(false);
    const [viewPermissionsDialogVisible, setViewPermissionsDialogVisible] = useState(false);
    const [deleteFileDialogVisible, setDeleteFileDialogVisible] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState(null);

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

    return (
        <div className='sidebar__files'>
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
                        <p>{file.downloadName.length <= 16 ? file.downloadName : file.downloadName.slice(0, 16) + '...'}</p>
                    </Link>
                );
            })}
        </div>
    );
}
