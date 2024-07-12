import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import { useAppDispatch } from '../../../src/store/hoocs';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store/store';
import { IUser } from '../../utils/types';
import { ChangeUserEmail, logout } from '../../../src/store/Reducers/authReducer';
import { useNavigate } from 'react-router-dom';

interface Props {
    setIsModalOpen: any;
}

const ModalChangeEmail: React.FC<Props> = ({setIsModalOpen}) => {
    const modalRef = useRef<any>(null);
    const dispatch = useAppDispatch();
    const userData: IUser = useSelector((state: RootState) => state.auth.userData);
    const navigate = useNavigate();

    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('keydown', handleEscapePress);
  
      return () => {
        document.removeEventListener('keydown', handleEscapePress);
      };
    }, []);

    const [email, setEmail] = useState<string>('');
    //change-email

    const handleChangeEmail = async () => {
      const changeEmailDto = {
        newEmail: email,
        currentEmail: userData.email
      }
      try {
        await dispatch(ChangeUserEmail({ changeEmailDto} ))
        await dispatch(logout())
        navigate('/login')
      } catch (e) {
        console.log(e)
      }
    }

    return (
        <div className='modal'>
            <form onSubmit={(e) => e.preventDefault()} className="modal-content" ref={modalRef}>
                <span className="close" onClick={() => setIsModalOpen(false)}></span>
                <h4>Вы действительно хотите изменить E-mail?</h4>

                <div className='insidediv'>
                    <input 
                        placeholder='Ваш новый Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleChangeEmail}>Изменить</button>
                </div>
                <h4>Ваш аккаунт снова будет не подтвержден</h4>
            </form>
        </div>
    )
}

export default ModalChangeEmail