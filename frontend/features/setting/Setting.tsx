import { useSelector } from 'react-redux';
import { IUser } from '../../shared/utils/types';
import './setting.css';
import { RootState } from '../../src/store/store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../src/store/hoocs';
import { fetchUserData, requestAccountActivation } from '../../src/store/Reducers/authReducer';
import ModalChangeEmail from '../../shared/components/modalChangeEmail/ModalChangeEmail';
import { toast } from 'react-toastify';

const Setting = () => {
    const userData: IUser = useSelector((state: RootState) => state.auth.userData);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
          navigate('/login');
        } else {
          dispatch(fetchUserData());
        }
    }, [dispatch, navigate]);

    const [modalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleRequestActivation = async () => {
        try {
            await dispatch(requestAccountActivation({email: userData.email}))
            toast.success('Аккаунт успешно активировн')
        } catch(e) {
            console.log(e)
        }
    };

    if (!userData) {
        return (
          <div>
            <h2>Что то пошло не так...</h2>
          </div>
        )
    }

    return (
        <div className="setting">
            <div className='sett'>
                <h5>SETTING</h5>
                <h5 onClick={() => navigate('/')}>ВЕРНУТЬСЯ К ФИНАНСАМ</h5>
            </div>
            <h2>Your email: <span>{userData.email}</span></h2>
            <h2>Ваш аккаунт: <span>{userData.activated ? 'Активирован' : 'Не активирован'}</span></h2>
            <h2>Your ID: <span>{userData._id}</span></h2>

            <button onClick={() => setIsModalOpen(true)} className='changeemail'>Изменить E-mail</button>
            {!userData.activated && (
                <button onClick={handleRequestActivation} className='activate-account'>Запрос на активацию аккаунта</button>
            )}

            {modalOpen && (
                <ModalChangeEmail setIsModalOpen={setIsModalOpen} />
            )}
        </div>
    )
}

export default Setting;