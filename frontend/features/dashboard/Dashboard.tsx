import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../src/store/store';
import { fetchUserData } from '../../src/store/Reducers/authReducer';
import './styles/dashboard.css';
import { FinanceType, IFinance, IUser, userIncomes } from '../../shared/utils/types';
import Dashheader from './components/DashHeader';
import UserFinance from '../../entities/UserFinance/UserFinance';
import { useAppDispatch, useAppSelector } from '../../src/store/hoocs';
import ModalCreateFinance from '../../shared/components/modalCreateFinance/ModalCreateFinance';
import Income from './components/Income';
import { getAllIncomesById } from '../../src/store/Reducers/financeReducer';
import Donat from './components/Donat';
import Graph from './components/Graph';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userData: IUser = useSelector((state: RootState) => state.auth.userData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState<boolean>(false);
  const [userIncomes, setUserIncomes] = useState<userIncomes[]>([]);
  const [activeFilters, setActiveFilters] = useState<FinanceType[]>([
    FinanceType.Crypto,
    FinanceType.Stocks,
    FinanceType.Bonds,
    FinanceType.Currency,
    FinanceType.ETC,
  ]);

  const isLoading = useAppSelector((state) => state.userFinance.isLoading);
  const isLoading2 = useAppSelector((state) => state.auth.isLoading);
  const userFinances = useAppSelector((state: any) => state.userFinance.userFinances);

  useEffect(() => {
    if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
      navigate('/login');
    } else {
      dispatch(fetchUserData());
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response: any = await dispatch(getAllIncomesById({ userEmail: userData.email }));
        setUserIncomes(response.payload);
      } catch (error) {
        console.error('Error fetching incomes:', error);
      }
    };

    if (userData && userData.email) {
      fetchIncomes();
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (userData && userData.email) {
      document.title = `Finance App (${userData.email})`
    }
  }, [userData]);

  if (!userData) {
    return (
      <div>
        <h2>Что то пошло не так...</h2>
      </div>
    )
  }

  const calculateTotalSum = () => {
    const total = userFinances.reduce((total: number, finance: IFinance) => {
      if (finance.monthly_updates.length > 0) {
        const latestUpdate = finance.monthly_updates[finance.monthly_updates.length - 1];
        return total + latestUpdate.price;
      }
      return total + finance.started_price;
    }, 0);
    const usdRate = 84;
    const totalInUSD = total * usdRate;
    
    return {
      total,
      totalInUSD
    };
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  };

  const { total, totalInUSD } = calculateTotalSum();

  const calculatePercentages = (finances: IFinance[]): Record<FinanceType, string> => {
    const typesCount = finances.reduce((acc: Record<FinanceType, number>, finance: IFinance) => {
        acc[finance.type] = (acc[finance.type] || 0) + 1;
        return acc;
    }, {} as Record<FinanceType, number>);

    const total = Object.values(typesCount).reduce((acc, count) => acc + count, 0);

    const percentages: Record<FinanceType, string> = {} as Record<FinanceType, string>;
    for (const type in typesCount) {
        percentages[type as FinanceType] = ((typesCount[type as FinanceType] / total) * 100).toFixed(2) + '%';
    }

    return percentages;
  };

  const percentages = calculatePercentages(userFinances);

  const toggleFilter = (filter: FinanceType) => {
    setActiveFilters((prev) => prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter])
  };

  return (
    <div className='dashboard'>
      <Dashheader userData={userData} />
      <div className={!userData.activated ? 'activatedacc' : ''}>
        <h5>{!userData.activated ? 'Активируйте аккаунт в' : ''}{!userData.activated ? <span onClick={() => navigate('/setting')}> настройках</span> : ''}</h5>  
      </div>

      <div className='dashbody'>
        <div className='mainbuttons'>
          <button onClick={() => setIsIncomeOpen((prev) => !prev)} className={!isIncomeOpen ? 'activebut' : ''}>Ваши инвестиции</button>
          <button onClick={() => setIsIncomeOpen((prev) => !prev)} className={isIncomeOpen ? 'activebut' : ''}>Ваши доходы</button>
        </div>

        {isIncomeOpen ?
          <div>
            <Income userIncomes={userIncomes} />
          </div> :
          <div>
            {isModalOpen && (
              <ModalCreateFinance setIsModalOpen={setIsModalOpen} />
            )}
            <div className='user_finances'>
              <button className='createtable1' onClick={() => setIsModalOpen(true)}>Создать таблицу</button>

              <div className='sorted_with_section'>
                <h1>Сортировать По</h1>
                <div>
                {Object.values(FinanceType).map((type) => (
                <button
                  key={type}
                  className={`button ${activeFilters.includes(type) ? 'activemod' : ''}`}
                  onClick={() => toggleFilter(type)}
                >
                  {type}
                </button>
              ))}
                </div>
              </div>
              <UserFinance activeFilters={activeFilters} />

              <div className="total-sum">
                <h1>Общая сумма всех инвестиций:</h1>
                <h2>в рублях: ₽{formatNumber(totalInUSD)}</h2>
                <h2>в долларах: ${formatNumber(total)}</h2>
              </div>
            </div>

            <div className='graphs_section'>
              <h2>{userFinances.length > 0 ? `Инвестиционная стратегия ${userData.email}` : 'Вы пока ничего не добавили :('}</h2>
              <div className='stat-section'>
                {Object.keys(percentages).map((type) => (
                  <div key={type} className='stat-item'>
                    <span className='stat-type'>{type}:</span>
                    <span className='stat-percentage'>{percentages[type as FinanceType]}</span>
                  </div>
                ))}
              </div>

              <div className="total-sum_section">
                <h1>Общая сумма всех инвестиций:</h1>
                <span>в рублях ₽: {formatNumber(totalInUSD)}</span>
                <span>в долларах $: {formatNumber(total)}</span>
              </div>

              <div className='graphs'>
                <Donat />
                <Graph />
              </div>
            </div>
          </div>}
      </div>

      {isLoading && <div className='loader'></div>}
      {isLoading2 && <div className='loader'></div>}
    </div>
  );
};

export default Dashboard;
