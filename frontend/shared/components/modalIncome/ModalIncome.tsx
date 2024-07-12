import React, { useEffect, useRef, useState } from "react"
import { IUser, userIncomes } from "../../utils/types";
import { useAppDispatch } from "../../../src/store/hoocs";
import './index.css';
import { updateIncome } from "../../../src/store/Reducers/financeReducer";
import { RootState } from "../../../src/store/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface Props {
    setIsModalOpen: any;
    income: userIncomes;
}

const ModalIncome: React.FC<Props> = ({setIsModalOpen, income}) => {
    const modalRef = useRef<any>(null);
    const dispatch = useAppDispatch();
    const userData: IUser = useSelector((state: RootState) => state.auth.userData);
    const [name, setName] = useState(income.name || '');
    const [amount, setAmount] = useState<number | string>(income.amount || 0);

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

      const handleUpdateFinance = async () => {
        const financeData: any = {
            id: income._id,
            name,
            amount: Number(amount),
            useremail: userData.email,
        };
        try {
            await dispatch(updateIncome(financeData));
            setIsModalOpen(false);
            toast.success('Вы успешно изменили запись')
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="modal">
            <form onSubmit={(e) => e.preventDefault()} ref={modalRef} className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}></span>
            
            <section>
                <span>Название дохода, например ваша должность</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название дохода" />
            </section>

            <section>
                <span>Доход в рублях</span>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Сумма дохода в рублях" />
            </section>
                <button onClick={handleUpdateFinance}>Изменить</button>

            </form>
        </div>
    )
}

export default ModalIncome