import { useRef, useState } from 'react';
import './Sidebar.styles.css';
import { ContextMenu } from "primereact/contextmenu";

export function SidebarFolders({ folders, toastRef }) {
    const [selectedFolderId, setSelectedFolderId] = useState(null);

    const copyFolderLink = () => {
        navigator.clipboard.writeText(`http://localhost:5173/folder/${selectedFolderId}`);
        toastRef.current.show({severity: 'success', detail: 'Link copied to clipboard!', life: 2500});
    }

    const privateFolderContextMenuItems = [
        {
            label: 'Copy link',
            command: copyFolderLink,
        },
    ];
    const publicFolderContextMenuItems = [
        {
            label: 'Copy link',
            command: copyFolderLink,
        },
    ];
    const publicFolderContextMenuRef = useRef(null);
    const privateFolderContextMenuRef = useRef(null);

    const onFolderContextMenu = (e, folder) => {
        e.preventDefault();
        setSelectedFolderId(folder.id);
        if (!folder.public) {
            privateFolderContextMenuRef.current.show(e);
            publicFolderContextMenuRef.current ? publicFolderContextMenuRef.current.hide() : (() => {})();
        } else {
            publicFolderContextMenuRef.current.show(e);
            privateFolderContextMenuRef.current ? privateFolderContextMenuRef.current.hide() : (() => {})();
        }
    };

    return (
        <div className='sidebar__user-content'>
            {folders && folders.map((folder, index) => {
                return (
                    <div key={index} className='sidebar_resource-link' onContextMenu={(e) => onFolderContextMenu(e, folder)}>
                        {!folder.public ?
                        <>
                            <div className='pi pi-lock'></div>
                            <ContextMenu model={privateFolderContextMenuItems} ref={privateFolderContextMenuRef} />
                        </>
                        :
                        <>
                            <div className='pi pi-globe'></div>
                            <ContextMenu model={publicFolderContextMenuItems} ref={publicFolderContextMenuRef} />
                        </>
                        }
                        <p>{folder.name.length <= 16 ? folder.name : folder.name.slice(0, 16) + '...'}</p>
                    </div>
                );
            })}
        </div>
    );
}
