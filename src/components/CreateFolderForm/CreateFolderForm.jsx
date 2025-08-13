import "./CreateFolderForm.styles.css";
import { useState } from "react";
import { toast } from "react-toastify";
import { addFolder } from "../../store/userSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { fileServiceURI } from "../../api/api";

export default function CreateFolderForm({ setDialogVisible, showToast, parentFolderId }) {
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!name) {
            return toast.warning("Folder name is required");
        }

        try {
            const { data } = await axios.post(`${fileServiceURI}/folders`, {
                name,
                isPublic,
                folderId: parentFolderId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(addFolder(data));
            setDialogVisible(false);
            showToast({severity: 'success', detail: 'Folder created', life: 2000});
        } catch (error) {
            return toast.error(error.response.data.error);
        }
    };

    return (
        <div className="folderform">
            <form onSubmit={handleSubmit}>
                <div className="folderform__options">
                    <div className="folderform__option">
                        <FloatLabel>
                            <InputText
                            id='name'
                            name='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete='off'
                            />
                            <label htmlFor='name'>Name</label>
                        </FloatLabel>
                    </div>
                    <div className='folderform__option'>
                        <Checkbox
                        inputId='isPublic'
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.checked)}
                        />
                        <label htmlFor='isPublic' className='p-checkbox-label'>
                        Public
                        </label>
                    </div>
                    <div className='folderform__option'>
                        <Button type='submit' label='Create' icon='pi pi-plus' />
                    </div>
                </div>
            </form>
        </div>
    );
}
