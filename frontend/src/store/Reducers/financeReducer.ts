import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { CreateIncomeDto, MonthlyUpdate, NewUserFinance, UpdateIncomeDto, UserFinance, userIncomes } from '../../../shared/utils/types';

export const createUserFinance = createAsyncThunk<UserFinance, { userEmail: string, financeData: NewUserFinance }, { state: RootState }>(
  'userFinance/createUserFinance',
  async ({ userEmail, financeData }) => {
    const response = await axios.post('http://localhost:3000/user-finances/createtable', { userEmail, ...financeData });
    return response.data;
  }
);

export const fetchUserFinances = createAsyncThunk<UserFinance[], { userEmail: string }>(
  'userFinance/fetchUserFinances',
  async ({ userEmail }) => {
    const response = await axios.post(`http://localhost:3000/user-finances/records`,{ userEmail }
    );
    return response.data;
  }
);

export const addMonthlyUpdate = createAsyncThunk<UserFinance, { userEmail: string, financeId: string, updateData: MonthlyUpdate }>(
  'userFinance/addMonthlyUpdate',
  async ({ userEmail, financeId, updateData }) => {
      const { date, new_quantity, new_price } = updateData;

      const response = await axios.post(`http://localhost:3000/user-finances/add-month-update`, {
          useremail: userEmail,
          finance_id: financeId,
          date,
          new_quantity,
          new_price
      });

      return response.data;
  }
);

export const fetchUserFinanceUpdates = createAsyncThunk<MonthlyUpdate[], { financeId: string }>(
  'userFinance/fetchUserFinanceUpdates',
  async ({ financeId }) => {
    const response = await axios.post(`http://localhost:3000/user-finances/get-updates`, { finance_id: financeId });
    return response.data;
  }
);

export const deleteUserFinance = createAsyncThunk<any, { financeId: string }>(
  'userFinance/deleteuserFinances',
  async ({ financeId }) => {
    const response = await axios.post(`http://localhost:3000/user-finances/delete`, { finance_id: financeId });
    return { financeId };
  }
);

export const deleteFinanceUpdateById = createAsyncThunk<any, {userEmail: string, updateId: string, financeId: string }>('deletesignbyid',
  async({financeId, updateId, userEmail}) => {
    const res = await axios.post(`http://localhost:3000/user-finances/delete-monthly-update`,{
      financeId, updateId, userEmail
    });
    return res.data;
  }
)

export const createIncome = createAsyncThunk<UserFinance, CreateIncomeDto>(
  'userFinance/createIncome',
  async (createIncomeDto) => {
    const response = await axios.post('http://localhost:3000/user-finances/create-income', createIncomeDto);
    return response.data;
  }
);

export const updateIncome = createAsyncThunk<UserFinance, UpdateIncomeDto>(
  'userFinance/updateIncome',
  async (updateIncomeDto) => {
    const response = await axios.post('http://localhost:3000/user-finances/update-income', updateIncomeDto);
    return response.data;
  }
);

export const deleteIncome = createAsyncThunk<{ deleted: boolean }, { incomeId: string }>(
  'userFinance/deleteIncome',
  async ({ incomeId }) => {
    const response = await axios.post('http://localhost:3000/user-finances/delete-income', { incomeId });
    return response.data;
  }
);

export const getAllIncomesById = createAsyncThunk<UserFinance[], { userEmail: string }>(
  'userFinance/get-all-by-user',
  async ({ userEmail }) => {
    const response = await axios.post('http://localhost:3000/user-finances/get-all-by-user', { userEmail });
    return response.data;
  }
);

const initialState: { userFinances: UserFinance[], isLoading: boolean, gainOrLoss: number | null, updates: MonthlyUpdate[] } = {
  userFinances: [],
  isLoading: false,
  gainOrLoss: null,
  updates: [],
};

export const userFinanceSlice = createSlice({
  name: 'userFinance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createUserFinance.fulfilled, (state, action: PayloadAction<UserFinance>) => {
      state.userFinances.push(action.payload);
      state.isLoading = false;
    });
    builder.addCase(createUserFinance.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createUserFinance.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchUserFinances.fulfilled, (state, action: PayloadAction<UserFinance[]>) => {
      state.userFinances = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchUserFinances.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUserFinances.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addMonthlyUpdate.fulfilled, (state, action: PayloadAction<UserFinance>) => {
      state.isLoading = false;
    });
    builder.addCase(addMonthlyUpdate.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addMonthlyUpdate.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(fetchUserFinanceUpdates.fulfilled, (state, action: PayloadAction<MonthlyUpdate[]>) => {
      state.updates = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchUserFinanceUpdates.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUserFinanceUpdates.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(deleteUserFinance.fulfilled, (state, action: PayloadAction<{ financeId: string }>) => {
      state.userFinances = state.userFinances.filter(finance => finance._id !== action.payload.financeId);
      state.isLoading = false;
    });
    builder.addCase(deleteUserFinance.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUserFinance.rejected, (state) => {
      state.isLoading = false;
    });
    //deleteFinanceUpdateById
    builder.addCase(deleteFinanceUpdateById.fulfilled, (state, action: PayloadAction<MonthlyUpdate[]>) => {
      state.isLoading = false;
    });
    builder.addCase(deleteFinanceUpdateById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteFinanceUpdateById.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(createIncome.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createIncome.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createIncome.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateIncome.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateIncome.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateIncome.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteIncome.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteIncome.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteIncome.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getAllIncomesById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllIncomesById.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getAllIncomesById.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});

export default userFinanceSlice.reducer;
