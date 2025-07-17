import "./File.styles.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fileServiceURI } from "../api/api";
import { Button } from "primereact/button";
import { saveAs } from 'file-saver';
import { Toast } from "primereact/toast";

export default function File() {
  const toastRef = useRef(null);
  const fileId = useParams().id;
  const [file, setFile] = useState(null);

  const token = localStorage.getItem('token');
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${fileServiceURI}/files/${fileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFile(data.data);
      } catch (error) {
        if (error.response.data.error === 'you have no access') {
          return toast.error('⛔️ You have no access to view or download this file');
        }
        return toast.error(error.response.data.error);
      }
    })();
  }, [fileId]);

  const copyFileCreatorID = () => {
    navigator.clipboard.writeText(file.creatorId);
    toastRef.current.show({severity: 'success', detail: 'ID copied to clipboard', life: 2500});
  };

  const download = async () => {
    try {
      const response = await axios.get(`${fileServiceURI}/files/${file.id}/dl`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const filename = response.headers['filename'];
      console.log(filename)
      saveAs(response.data, filename);
    } catch (error) {
      return toast.error(error.response.data.error);
    }
  };

  return (
    <div className="file-container">
      {file && (
        <div className='file'>
          <div className='file__creator-id'>
            File creator ID: <Button size="small" label={file.creatorId} icon="pi pi-copy" outlined={true} onClick={copyFileCreatorID} />
            <Toast ref={toastRef} position="top-center" />
          </div>
          <div className='file__download'>
            <Button label='Download' size='large' onClick={download} />
          </div>
        </div>
      )}
    </div>
  );
}
