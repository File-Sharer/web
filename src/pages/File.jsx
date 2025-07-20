import "./File.styles.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fileServiceURI } from "../api/api";
import { Button } from "primereact/button";
import { saveAs } from 'file-saver';
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export default function File() {
  const toastRef = useRef(null);
  const fileId = useParams().id;
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("kb");

  const formatOptions = [
    { label: "Bytes", value: "bytes" },
    { label: "KB", value: "kb" },
    { label: "MB", value: "mb" },
    { label: "GB", value: "gb" },
  ];

  const formatFileSize = (size, format) => {
    if (typeof size !== 'number') return 'N/A';

    switch (format) {
      case 'bytes':
        return size;
      case 'kb':
        return (size / 1024).toFixed(2);
      case 'mb':
        return (size / (1024 ** 2)).toFixed(2);
      case 'gb':
        return (size / (1024 ** 3)).toFixed(2);
      default:
        return size;
    }
  };

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
          <div className="file__size">
            <div className="p-inputgroup flex-1">
              <Button
                icon="pi pi-copy"
                className="p-button-outlined p-button-sm"
                onClick={() => {
                  navigator.clipboard.writeText(`${formatFileSize(file?.size, format)} ${format}`);
                  toastRef.current.show({ severity: 'success', detail: 'Size copied to clipboard', life: 2000 });
                }}
              />
              <InputText
                id='fileSize'
                value={`File size: ${formatFileSize(file?.size, format)}`}
                readOnly
                style={{ height: '40px', fontSize: '1rem' }}
              />
              <Dropdown
                value={format}
                options={formatOptions}
                onChange={(e) => setFormat(e.value)}
                className="p-inputgroup-addon"
                style={{ height: '40px' }}
              />
            </div>
          </div>
          <div className='file__download'>
            <Button label='Download' size='large' onClick={download} />
          </div>
        </div>
      )}
    </div>
  );
}
