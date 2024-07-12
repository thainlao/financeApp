import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../src/store/hoocs';
import '../styles/income.css';
import { RootState } from '../../../src/store/store';
import { createIncome, deleteIncome, getAllIncomesById } from '../../../src/store/Reducers/financeReducer';
import { useSelector } from 'react-redux';
import { IUser, userIncomes } from '../../../shared/utils/types';
import { toast } from 'react-toastify';
import ModalIncome from '../../../shared/components/modalIncome/ModalIncome';

interface Props {
    userIncomes: userIncomes[];
}

const Income: React.FC<Props> = ({userIncomes}) => {
    const dispatch = useAppDispatch();
    const [name, setName] = useState('Лучший таксист Москвы');
    const [amount, setAmount] = useState<number | string>('');
    const userData: IUser = useSelector((state: RootState) => state.auth.userData);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleAddIncome = () => {
        if (!name || !amount) {
            toast.error('Пожалуйста, заполните все поля');
            return;
        }

        if (userData && userData._id) {
            dispatch(createIncome({ useremail: userData.email, name, amount: Number(amount) }));
            setName('')
            setAmount(0);
            toast.success('Вы успешно создали запись')
        }
    };

    const convertCurrency = (amount: number, rate: number) => {
        return (amount / rate).toFixed(1).toString();
    };

    let usd = 84;
    let euro = 90
    let cny = 11;

    const handleDeleteFinanceById = (incomeId: string) => {
        try {
            dispatch(deleteIncome({ incomeId }));
            toast.success('Вы успешно удалили запись в Income')
        } catch(e) {
            console.log(e);
        }
    };

    return (
        <div>
            <div className='add_signes'>
                <section>
                    <span>Название дохода, например "Мененджер"</span>
                    <input style={{padding: '10px'}} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название дохода" />
                </section>
                
                <section>
                    <span>Сумма дохода в рублях</span>
                    <input style={{padding: '5px'}} type="number" value={amount.toLocaleString('ru-RU')} onChange={(e) => setAmount(e.target.value)} placeholder="Сумма дохода в рублях" />
                </section>
                <button onClick={handleAddIncome}>Добавить</button>
            </div>

            <div className='incomes'>
                {userIncomes?.map((income: userIncomes) => (
                    <div className='single_income' key={income._id}>
                        <div className='single_incommee'>
                        <div className='income_inside'>
                            <h2>{income.name}</h2>
                            <h3>{income.amount.toLocaleString('ru-RU')} Р</h3>
                        </div>
                        <div className='income_inside'>
                            <h2>Date: {new Date(income.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                        </div>

                        <div className="income_inside">
                            <button onClick={() => handleDeleteFinanceById(income._id)}>Удалить</button>
                            <button onClick={() => setIsModalOpen(true)}>Редактировать</button>
                        </div>

                        {isModalOpen && (
                            <ModalIncome income={income} setIsModalOpen={setIsModalOpen} />
                        )}
                        </div>

                        <div className="converted_amounts">
                            <div>
                                <h3 style={{marginBottom: '10px'}}>Сумма в валютах</h3>
                                <h3>USD: {convertCurrency(income.amount, usd)}</h3>
                            </div>
                            <div>
                                <h3>EUR: {convertCurrency(income.amount, euro)}</h3>
                            </div>
                            <div>
                                <h3>CNY: {convertCurrency(income.amount, cny)}</h3>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default Income;