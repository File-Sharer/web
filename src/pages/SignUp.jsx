import './Auth.styles.css';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { userServiceURI } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../store/userSlice';

export default function SignUp() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateData = () => {
    if (login.length < 3) {
      toast.error('Login must have at least 3 characters');
      return;
    } else if (login.length > 16) {
      toast.error('Login must be not longer than 16');
      return;
    } else if (password.length < 8) {
      toast.error('Password must have at least 8 characters');
      return;
    } else if (password.length > 32) {
      toast.error('Password must be not longer than 32');
      return;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (validateData()) {
      try {
        const { data } = await axios.post(userServiceURI + '/auth/signup', {
          login,
          password
        }, {
          withCredentials: true,
        });

        dispatch(setUser(data.user));

        localStorage.setItem('token', data.accessToken);

        return navigate('/');
      } catch (error) {
        return toast.error(error.response?.data?.error || 'An unexpected error occured');
      }
    }
  }

  return (
    <div className='auth'>
      <div className='auth__form'>
        <div className='auth__options-container'>
          <FloatLabel>
            <InputText maxLength={16} id='login' onChange={(e) => setLogin(e.target.value)} className='auth__input-field' />
            <label htmlFor='login'>Login</label>
          </FloatLabel>
          <FloatLabel>
            <Password value={password} maxLength={32} id='password' onChange={(e) => setPassword(e.target.value)} toggleMask
            weakLabel='Too bad 💩' mediumLabel='Ok 👌' strongLabel='Strong 💪' className='auth__input-field' />
            <label htmlFor='password'>Password</label>
          </FloatLabel>
        </div>
        <div className='auth__submit-container'>
          <Button label='Create account' onClick={handleSubmit} />
        </div>
        <div className="auth__redirect">
          Already have an account? - <Link to={'/auth/log-in'}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
