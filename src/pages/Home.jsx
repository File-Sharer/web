import './Home.styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar/Sidebar';
import axios from 'axios';
import { fileServiceURI } from '../api/api';
import { setFiles, setFolders } from '../store/userSlice';
import ThemeSwitchElement from '../components/ThemeSwitchElement/ThemeSwitchElement';

export default function Home({ folderId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userFiles = useSelector((state) => state.user.files);
  const userFolders = useSelector((state) => state.user.folders);

  useEffect(() => {
    const token = localStorage.getItem('token');

    (async () => {
      try {
        const { data } = await axios.get(fileServiceURI + '/files', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!data) return;

        dispatch(setFiles(data));
      } catch (error) {
        return toast.error(error.response.data.error);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    (async () => {
      try {
        const { data } = await axios.get(fileServiceURI + '/folders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!data) return;

        dispatch(setFolders(data));
      } catch (error) {
        return toast.error(error.response.data.error);
      }
    })();
  }, [dispatch]);

  return (
    <div className='home'>
      <Sidebar userId={user.id} files={userFiles} folders={userFolders} />
      <ThemeSwitchElement />
    </div>
  );
}
