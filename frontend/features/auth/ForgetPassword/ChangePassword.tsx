import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length <= 4) {
      toast.error('Password must be longer than 4 characters');
      return;
    }

    try {
      await axios.post('http://localhost:3000/auth/change-password', { email, newPassword: password });
      toast.success('Password changed successfully');
      navigate('/')
    } catch (error) {
      console.error(error);
      toast.error('Failed to change password');
    }
  };

  return (
    <div className='login'>
      <form onSubmit={handleSubmit}>
        <h2>Change Password</h2>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='New Password'
          required
        />
        <input
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder='Confirm New Password'
          required
        />
        <button type='submit'>Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;