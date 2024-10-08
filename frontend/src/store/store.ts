import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { authSlice } from "./Reducers/authReducer";
import { userFinanceSlice } from "./Reducers/financeReducer";

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    userFinance: userFinanceSlice.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']