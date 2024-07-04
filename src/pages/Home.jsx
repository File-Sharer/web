import './Home.styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar/Sidebar';
import axios from 'axios';
import { fileServiceURL } from '../api/api';
import { setFiles } from '../store/userSlice';

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userFiles = useSelector((state) => state.user.files);

  useEffect(() => {
    const token = localStorage.getItem('token');

    (async () => {
      try {
        const { data } = await axios.get(fileServiceURL + '/files', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!data.data) return;

        dispatch(setFiles(data.data));
      } catch (error) {
        return toast.error(error.response.data.error);
      }
    })();
  }, [dispatch, user.login]);

  return (
    <div className='home'>
      <Sidebar userId={user.id} files={userFiles} />
    </div>
  );
}
