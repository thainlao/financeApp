import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../src/store/hoocs";
import { deleteFinanceUpdateById, fetchUserFinanceUpdates } from "../../src/store/Reducers/financeReducer";
import './index.css';
import { IFinance, IUpdates, IUser } from "../../shared/utils/types";
import { useSelector } from "react-redux";
import { RootState } from "../../src/store/store";

interface UserFinanceAllChangesProps {
  finance: IFinance;
  financeId: string;
}

const UserFinanceAllChanges: React.FC<UserFinanceAllChangesProps> = ({ finance, financeId }) => {
  const dispatch = useAppDispatch();
  const userData: IUser = useSelector((state: RootState) => state.auth.userData);
  const isLoading = useAppSelector((state) => state.userFinance.isLoading);
  const isLoading2 = useAppSelector((state) => state.auth.isLoading);

  useEffect(() => {
    dispatch(fetchUserFinanceUpdates({ financeId }));
  }, [dispatch, financeId]);

  const calculatePercentageChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const handleDeleteMonthUpdate = (updateId: string) => {
    try {
      dispatch(deleteFinanceUpdateById({ financeId, updateId, userEmail: userData.email }));
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="allchanges">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {finance.monthly_updates?.map((update: IUpdates, index: number) => {
            const previousUpdate = finance.monthly_updates[index - 1];
            const quantityChange = previousUpdate ? calculatePercentageChange(update.quantity, previousUpdate.quantity) : 0;
            const priceChange = previousUpdate ? calculatePercentageChange(update.price, previousUpdate.price) : 0;

            const changeStyle = {
              borderLeft: quantityChange > 0 || priceChange > 0 ? '5px solid #73d984' : quantityChange < 0 || priceChange < 0 ? '5px solid #e77569' : 'none',
              borderRight: quantityChange > 0 || priceChange > 0 ? '5px solid #73d984' : quantityChange < 0 || priceChange < 0 ? '5px solid #e77569' : 'none',
            };

            return (
              <div className="allchanges_section" key={update._id} style={changeStyle}>
                <button className="del_but" onClick={() => handleDeleteMonthUpdate(update._id)}></button>
                <h2>Price: {update.price}</h2>
                <h2>Quantity: {update.quantity}</h2>
                <h2>Date: {new Date(update.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                {previousUpdate && (
                  <div>
                    <p style={{ backgroundColor: quantityChange > 0 ? '#73d984' : quantityChange < 0 ? '#e77569' : 'transparent', color: 'white', padding: '5px' }}>
                      Quantity Change: {quantityChange.toFixed(2)}%
                    </p>
                    <p style={{ backgroundColor: priceChange > 0 ? '#73d984' : priceChange < 0 ? '#e77569' : 'transparent', color: 'white', padding: '5px' }}>
                      Price Change: {priceChange.toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </ul>
      )}
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
}

export default UserFinanceAllChanges;
