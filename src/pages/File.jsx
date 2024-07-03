import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fileServiceURL } from "../api/api";

export default function File() {
  const fileId = useParams().id;
  const [file, setFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    (async () => {
      try {
        const { data } = await axios.get(fileServiceURL + `/files/${fileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFile(data.data);
      } catch (error) {
        return toast.error(error.response.data.error);
      }
    })();
  }, [file, fileId]);

  return (
    <div>
      {file && (
        file.filename
      )}
    </div>
  );
}
