import React from 'react';
import '../styles/dashboard.css';
import { IUser } from '../../../shared/utils/types';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../src/store/Reducers/authReducer';
import { useAppDispatch } from '../../../src/store/hoocs';

interface Props {
    userData: IUser;
}

const Dashheader: React.FC<Props> = ({userData}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (!userData) {
        return (
            <div>
                <h2>Произошла ошибка</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>
        )
    }
    
    return (
        <div className='header'>
            <div>
                <h2>Welcome, {userData.email}!</h2>
            </div>

            <div>
                <button onClick={() => navigate('/faq')}>FAQ</button>
                <button onClick={() => navigate('/setting')}>Настойки</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Dashheader