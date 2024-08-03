import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { userServiceURL } from './api/api';
import { clearUser, setUser } from './store/userSlice';
import Loader from './components/Loader/Loader';
import File from './pages/File';

export default function App() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    (async () => {
      if (token) {
        try {
          const { data } = await axios.get(userServiceURL + '/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(setUser(data.data));
        } catch (error) {
          dispatch(clearUser());
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    })();
  }, [dispatch]);

  if (loading) {
    return <Loader />
  }

  return (
    <Routes>
      {user ? (
        <>
          <Route path='/' element={<Home />} />
          <Route path='/file/:id' element={<File />} />
          <Route path='*' element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path='/auth/sign-up' element={<SignUp />} />
          <Route path='/auth/log-in' element={<SignIn />} />
          <Route path='*' element={<Navigate to="/auth/log-in" />} />
        </>
      )}
    </Routes>
  );
}
