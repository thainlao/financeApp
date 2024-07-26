import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../src/store/Reducers/authReducer';
import { useAppDispatch } from '../../../src/store/hoocs';
import './login.css';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/');
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error('Login failed. Please check your credentials and try again.');
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className='login'>
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Login</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <a href='/forgetpass'>Забыли пароль?</a>
        <button onClick={handleLogin} type="submit">Login</button>
        <span>нет аккаунта?<a href='/register'>создать</a></span>
      </form>
    </div>
  );
};

export default LoginPage;
