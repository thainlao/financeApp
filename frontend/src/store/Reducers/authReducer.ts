import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { AuthState, IChangeEmailDto, LoginUserData, RegisterUserData } from "../../../shared/utils/types";

const initialState: AuthState = {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    userData: null,
    isLoading: false,
    isAuthenticated: !!localStorage.getItem('accessToken'),
};

export const registerUser = createAsyncThunk<any, RegisterUserData>(
    'auth/registerUser',
    async ({ email, password }, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await axios.post('http://localhost:3000/auth/register', { email, password });
            if (data.token) {
                window.localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            console.log(error)
        }
    }
);

export const loginUser = createAsyncThunk<any, LoginUserData>(
    'auth/loginUser',
    async ({ email, password }) => {
      try {
        const { data } = await axios.post('http://localhost:3000/auth/login', { email, password });
        if (data.token) {
          window.localStorage.setItem('token', data.token);
        }
        return { accessToken: data.accessToken, refreshToken: data.refreshToken };
      } catch (error) {
        console.log(error)
      }
    }
);

export const fetchUserData = createAsyncThunk<any, void, { state: RootState }>(
    'auth/fetchUserData',
    async (_, { getState }) => {
        const state: any = getState();
        try {
            const response = await axios.get('http://localhost:3000/auth/me', {
                headers: {
                    Authorization: `Bearer ${state.auth.accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

export const requestAccountActivation = createAsyncThunk<any, {email: string}>(
    'auth/requestAccountActivationnr',
    async ({email}) => {
        try {
            const res = await axios.post('http://localhost:3000/auth/activate', {email});
            return res.data
        } catch (error) {
            throw error;
        }
    }
);
//change-email

export const ChangeUserEmail = createAsyncThunk<any, {changeEmailDto: IChangeEmailDto}>(
    'auth/ChangeUserEmail',
    async ({changeEmailDto}) => {
        try {
            const res = await axios.post('http://localhost:3000/auth/change-email', changeEmailDto);
            return res.data
        } catch (error) {
            throw error;
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.userData = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
                state.isLoading = false;
                localStorage.setItem('accessToken', action.payload.accessToken);
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            })
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
                state.isLoading = false;
                localStorage.setItem('accessToken', action.payload.accessToken);
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchUserData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<any>) => {
                state.userData = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchUserData.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(requestAccountActivation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(requestAccountActivation.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(requestAccountActivation.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { logout } = authSlice.actions;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUserData = (state: RootState) => state.auth.userData;
export default authSlice.reducer;
