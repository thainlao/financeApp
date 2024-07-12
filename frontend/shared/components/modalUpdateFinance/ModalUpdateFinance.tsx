import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../src/store/hoocs';
import { IUser, MonthlyUpdate } from '../../utils/types';
import './index.css';
import { addMonthlyUpdate } from '../../../src/store/Reducers/financeReducer';

interface Props {
  finance: any;
  setIsModalOpen: (id: string) => void;
}

const ModalUpdateFinance: React.FC<Props> = ({ finance, setIsModalOpen }) => {
  const dispatch = useAppDispatch();
  const userData: IUser = useAppSelector((state: any) => state.auth.userData);
  const [updateDate, setUpdateDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [updateQuantity, setUpdateQuantity] = useState<string>('0');
  const [updatePrice, setUpdatePrice] = useState<string>('0');
  const modalRef = useRef<any>(null);

  const handleUpdate = async () => {
    try {
      const updateData: MonthlyUpdate = {
        date: new Date(updateDate),
        new_quantity: updateQuantity,
        new_price: updatePrice,
        finance_id: finance._id,
        useremail: userData.email,
      };
  
      await dispatch(addMonthlyUpdate({ userEmail: userData.email, financeId: finance._id, updateData }));
      setIsModalOpen(finance._id);
    } catch (e) {
      console.log(e)
    }
  };

  const handleEscapePress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsModalOpen(finance._id);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscapePress);

    return () => {
      document.removeEventListener('keydown', handleEscapePress);
    };
  }, []);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setUpdateQuantity(value);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setUpdatePrice(value);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={(e) => e.preventDefault()} className="modal-content" ref={modalRef}>
        <span className="close" onClick={() => setIsModalOpen(finance._id)}></span>
        <h3>Update Finance: {finance.name}</h3>
        <input
          type="date"
          value={updateDate}
          onChange={(e) => setUpdateDate(e.target.value)}
        />
        <section>
          <span style={{color: 'white'}}>Current Quantity</span>
          <input
            type="number"
            placeholder="Current Quantity"
            value={updateQuantity}
            onChange={handleQuantityChange}
          />
        </section>

        <section>
          <span style={{color: 'white'}}>Current Price</span>
          <input
            type="number"
            placeholder="Current Price"
            value={updatePrice}
            onChange={handlePriceChange}
          />
        </section>

        <button onClick={handleUpdate}>Submit Update</button>
      </form>
    </div>
  );
};

export default ModalUpdateFinance;
