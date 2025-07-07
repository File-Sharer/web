import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { userServiceURI } from './api/api';
import { clearUser, setUser } from './store/userSlice';
import Loader from './components/Loader/Loader';
import File from './pages/File';
import { PrimeReactContext } from 'primereact/api';

export default function App() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { changeTheme } = useContext(PrimeReactContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    (async () => {
      if (token) {
        try {
          const { data } = await axios.get(userServiceURI + '/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(setUser(data.data));
        } catch (error) {
          if (error.response.status == 401) {
            try {
              const { data } = await axios.get(userServiceURI + "/auth/refresh", {
                withCredentials: true,
              });
  
              if (!data.user) return;

              localStorage.setItem('token', data.accessToken);

              dispatch(setUser(data.user));
            } catch {
              dispatch(clearUser());
              localStorage.removeItem('token');
              axios.get(userServiceURI + '/auth/signout');
            }
          } else {
            dispatch(clearUser());
            localStorage.removeItem('token');
            axios.get(userServiceURI + '/auth/signout');
          }
        }
      }
      setLoading(false);
    })();
  }, [dispatch]);

  useEffect(() => {
    const currentTheme = localStorage.getItem('current-theme');
    currentTheme ? changeTheme('bootstrap4-dark-blue', currentTheme, 'theme-link', () => {}) : (() => {})();
  }, []);

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
