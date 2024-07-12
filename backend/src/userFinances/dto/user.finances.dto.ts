import { FinanceType } from "../schemas/user.finance.schema";

export class CreateUserFinanceDto {
    name: string;
    img?: string;
    alt?: string;
    started_quantity?: number;
    started_price?: number;
    type: FinanceType;
}

export class monthResultDto {
    date: Date;
    new_quantity: number;
    new_price: number;
    finance_id: string;
    useremail: string; 
}

export class GetUpdatesDto {
    finance_id: string;
}

export class CreateIncomeDto {
    name: string;
    amount: number;
    useremail: string;
}