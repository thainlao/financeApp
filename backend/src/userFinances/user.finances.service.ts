import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Income, UserFinance, UserFinanceUpdate } from './schemas/user.finance.schema';
import { CreateIncomeDto, CreateUserFinanceDto, monthResultDto } from './dto/user.finances.dto';

@Injectable()
export class UserFinanceService {
  constructor(
    @InjectModel(UserFinanceUpdate.name) private userFinanceUpdateModel: Model<UserFinanceUpdate>,
    @InjectModel(UserFinance.name) private userFinanceModel: Model<UserFinance>,
    @InjectModel(Income.name) private incomeModel: Model<Income>,
  ) {}

  async create(userEmail: string, createUserFinanceDto: CreateUserFinanceDto): Promise<UserFinance> {
    const createdUserFinance = new this.userFinanceModel({ ...createUserFinanceDto, user: userEmail });
    return createdUserFinance.save();
  }

  async findAllByUser(userEmail: string): Promise<UserFinance[]> {
    return this.userFinanceModel.find({ user: userEmail }).exec();
  }

  async addMonthResults(userEmail: string, finance_id: string, monthResultDto: monthResultDto): Promise<UserFinance> {
    const monthlyUpdate = new this.userFinanceUpdateModel({
      user: userEmail,
      finance_id: finance_id,
      date: monthResultDto.date,
      quantity: monthResultDto.new_quantity,
      price: monthResultDto.new_price,
    });

    await monthlyUpdate.save();

    return this.userFinanceModel.findOneAndUpdate(
      { _id: finance_id, user: userEmail },
      { $push: { monthly_updates: monthlyUpdate } },
      { new: true, useFindAndModify: false }
    ).exec();
  }

  async findAllUpdatedById(finance_id: string): Promise<UserFinanceUpdate[]> {
    return this.userFinanceUpdateModel.find({ finance_id}).exec()
  }

  async deleteById(finance_id: string): Promise<{ deleted: boolean}> {
    const result = await this.userFinanceModel.deleteOne({ _id: finance_id}).exec();
    return { deleted: result.deletedCount > 0};
  }

  async deleteMonthlyUpdate(updateId: string, financeId: string, userEmail: string): Promise<{ deleted: boolean }> {
    const deleteResult = await this.userFinanceUpdateModel.deleteOne({ _id: updateId }).exec();

    if (deleteResult.deletedCount === 0) {
      return { deleted: false };
    }

    await this.userFinanceModel.updateOne(
      { _id: financeId, user: userEmail },
      { $pull: { monthly_updates: { _id: updateId } } }
    ).exec();

    return { deleted: true };
  }

  async createIncome(createIncomeDto: CreateIncomeDto): Promise<Income> {
    const createdIncome = new this.incomeModel({ ...createIncomeDto });
    return createdIncome.save();
  }

  async updateIncome(id: string, updateData: Partial<CreateIncomeDto>): Promise<Income> {
    return this.incomeModel.findByIdAndUpdate(id, updateData, { new: true, useFindAndModify: false }).exec();
  }

  async deleteIncomeById(incomeId: string): Promise<{ deleted: boolean }> {
    const result = await this.incomeModel.deleteOne({ _id: incomeId }).exec();
    return { deleted: result.deletedCount > 0 };
  }

  async findAllIncomesByUser(userEmail: string): Promise<any> {
    return this.incomeModel.find({ useremail: userEmail }).exec();
  }
}