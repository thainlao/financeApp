import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../src/store/Reducers/authReducer';
import { useAppDispatch } from '../../../src/store/hoocs';
import './register.css';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const resultAction = await dispatch(registerUser({ email, password })).unwrap();
      if (resultAction.accessToken) {
        navigate('/');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className='register'>
      <form onSubmit={(e) => e.preventDefault()}>
      <h2>Register</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button onClick={handleRegister} type="submit">Register</button>
        <span>уже есть аккаунт?<a href='/login'>войти</a></span>
      </form>
    </div>
  );
};

export default RegisterPage;