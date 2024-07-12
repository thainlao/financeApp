import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { useAppDispatch } from '../../../src/store/hoocs';
import { createUserFinance } from '../../../src/store/Reducers/financeReducer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store/store';
import { IUser } from '../../utils/types';
import { toast } from 'react-toastify';

interface Props {
  setIsModalOpen: (open: boolean) => void;
}

const ModalCreateFinance: React.FC<Props> = ({ setIsModalOpen }) => {
  const [name, setName] = useState<string>('Bitcoin');
  const [startedQuantity, setStartedQuantity] = useState<string>('0.5');
  const [startedPrice, setStartedPrice] = useState<string>('30548.52');
  const [img, setImg] = useState('');
  const [type, setType] = useState<string>('Crypto');

  const modalRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const userData: IUser = useSelector((state: RootState) => state.auth.userData);

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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setStartedQuantity(value);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setStartedPrice(value);
    }
  };

  const handleCreateFinance = async () => {
    if (!name || !startedPrice || !startedQuantity) {
      toast.error('Пожалуйста, заполните все поля');
      return;
  }
    try {
      const financeData = {
        name,
        started_quantity: parseFloat(startedQuantity),
        started_price: parseFloat(startedPrice),
        img,
        type,
      };

      await dispatch(createUserFinance({ userEmail: userData.email, financeData }));
      setIsModalOpen(false); // Close the modal after submission
    } catch (e) {
      console.error('Failed to create finance:', e);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={(e) => e.preventDefault()} className="modal-content" ref={modalRef}>
        <span className="close" onClick={() => setIsModalOpen(false)}></span>
        <section>
          <span>Название, например Bitcoin</span>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </section>

        <section>
          <span>Количество, например 0,5</span>
          <input
            type="text"
            name="started_quantity"
            placeholder="Started Quantity"
            value={startedQuantity}
            onChange={handleQuantityChange}
            required
          />
        </section>

        <section>
          <span>Сумма актива в долларах</span>
          <input
            type="text"
            name="started_price"
            placeholder="Started Price"
            value={startedPrice}
            onChange={handlePriceChange}
            required
          />
        </section>

        <section style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem'}}>
          <span>Тип</span>
          <select name="type" value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="Crypto">Crypto</option>
            <option value="Stocks">Stocks</option>
            <option value="Bonds">Bonds</option>
            <option value="Currency">Currency</option>
          </select>
        </section>
        <button onClick={handleCreateFinance}>Создать таблицу</button>
      </form>
    </div>
  );
};

export default ModalCreateFinance;
