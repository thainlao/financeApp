import React, { useEffect, useState } from 'react';
import './userfinance.css';
import { fetchUserFinances } from '../../src/store/Reducers/financeReducer';
import { useAppDispatch, useAppSelector } from '../../src/store/hoocs';
import { IFinance, IUser } from '../../shared/utils/types';
import UserFinanceAllChanges from '../UserFinanceAllChanges/UserFinanceAllChanges';
import ModalUpdateFinance from '../../shared/components/modalUpdateFinance/ModalUpdateFinance';
import ModalDeleteFinance from '../../shared/components/modalDeleteFinance/ModalDeleteFinance';
import deleteImg from '../../src/assets/icons8-delete-30.png';
import updateImg from '../../src/assets/icons8-update-64.png';
import crypto from '../../src/assets/icons8-crypto-80.png';
import bonds from '../../src/assets/icons8-bearer-bonds-32.png';
import currency from '../../src/assets/icons8-currency-30.png';
import stocks from '../../src/assets/icons8-stocks-100.png';

const UserFinance: React.FC = () => {
  const dispatch = useAppDispatch();
  const userData: IUser = useAppSelector((state: any) => state.auth.userData);
  const userFinances = useAppSelector((state: any) => state.userFinance.userFinances);
  const isLoading = useAppSelector((state) => state.userFinance.isLoading);
  const isLoading2 = useAppSelector((state) => state.auth.isLoading);

  useEffect(() => {
    if (userData?.email) {
      dispatch(fetchUserFinances({ userEmail: userData.email }));
    }
  }, [dispatch, userData]);

  const [modalStates, setModalStates] = useState<{ [key: string]: boolean }>({});
  const [deleteModalStates, setDeleteModalStates] = useState<{ [key: string]: boolean }>({});

  const toggleModal = (id: string) => {
    setModalStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDeleteModal = (id: string) => {
    setDeleteModalStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sortedUserFinances = [...userFinances].sort((a: IFinance, b: IFinance) => b.monthly_updates.length - a.monthly_updates.length);

  const typeIcons: { [key: string]: string } = {
    Crypto: crypto,
    Bonds: bonds,
    Currency: currency,
    Stocks: stocks,
  };

  const getBorderClass = (type: string) => {
    switch (type) {
      case 'Crypto':
        return 'crypto-border';
      case 'Bonds':
        return 'bonds-border';
      case 'Currency':
        return 'currency-border';
      case 'Stocks':
        return 'stocks-border';
        case 'ETC':
          return 'etc-border';
      default:
        return '';
    }
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  };

  return (
    <div className='single_finance'>
      {isLoading && <p>Loading...</p>}
      <ul>
        {sortedUserFinances.map((finance: IFinance) => (
          <li key={finance._id} className={getBorderClass(finance.type)}>
            <div className='images_users'>
              <p>Name: <span>{finance.name}</span></p>
              {typeIcons[finance.type] && <img src={typeIcons[finance.type]} alt={finance.type} />}
            </div>
            {finance.img && <img src={finance.img} alt={finance.alt || 'No description'} />}
            <p>Started Quantity: <span>{finance.started_quantity}</span></p>
            <p>Started Price: <span>{formatNumber(finance.started_price)}$</span></p>
            <p>Type: <span>{finance.type}</span></p>
            <p>Created At: <span>{new Date(finance.created_at).toLocaleDateString()}</span></p>

            {deleteModalStates[finance._id] && (
              <ModalDeleteFinance setIsDeleteModal={toggleDeleteModal} financeId={finance._id} finance={finance} />
            )}

            {modalStates[finance._id] && (
              <ModalUpdateFinance setIsModalOpen={toggleModal} finance={finance} />
            )}

            <div className='images'>
              <img alt='' src={updateImg} onClick={() => toggleModal(finance._id)} />
              <img alt='Удалить запись' onClick={() => toggleDeleteModal(finance._id)} src={deleteImg} />
            </div>
            <div>
              <UserFinanceAllChanges finance={finance} financeId={finance._id} />
            </div>
          </li>
        ))}
      </ul>
      {isLoading ? (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      ) : ''}
      {isLoading2 ? (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      ) : ''}
    </div>
  );
};

export default UserFinance;