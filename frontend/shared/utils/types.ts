export interface IUser{
    email: string;
    _id: string;
    activated: boolean;
}

export interface RegisterUserData {
    email: string;
    password: string;
}

export interface LoginUserData {
    email: string;
    password: string;
}

export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    userData: any | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface UserFinance {
    _id?: string;
    name: string;
    img?: string;
    alt?: string;
    started_quantity?: number;
    started_price?: number;
    current_quantity?: number;
    current_price?: number;
}

export enum FinanceType {
    Crypto = 'Crypto',
    Stocks = 'Stocks',
    Bonds = 'Bonds',
    Currency = 'Currency'
}

export interface IFinance {
    _id: string;
    name: string;
    img?: string;
    alt?: string;
    started_quantity: number;
    started_price: number;
    created_at: string; 
    monthly_updates: any[];
    type: FinanceType;
}

export interface IUpdates {
    user: string;
    finance_id: string;
    date: string;
    quantity: number;
    price: number;
    _id: string;
}

export interface MonthlyUpdate {
    date: Date;
    new_quantity: number | string;
    new_price: number | string;
    finance_id: string;
    useremail: string;
}

export interface NewUserFinance {
    name: string;
    img?: string;
    alt?: string;
    started_quantity?: number;
    started_price?: number;
    current_quantity?: number;
    current_price?: number;
}

export interface CreateIncomeDto {
    useremail: string;
    name: string;
    amount: number;
}
  
export interface UpdateIncomeDto {
    name?: string;
    amount?: number;
    useremail: string;
    _id: string;
}

export interface userIncomes {
    _id: string;
    useremail: string;
    name: string;
    amount: number;
    created_at: string;
}

export interface IChangeEmailDto {
    newEmail: string;
    currentEmail: string;
}