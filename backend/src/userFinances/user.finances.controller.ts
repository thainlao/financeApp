import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { CreateIncomeDto, CreateUserFinanceDto, GetUpdatesDto, monthResultDto } from './dto/user.finances.dto';
import { UserFinanceService } from './user.finances.service';

@Controller('user-finances')
export class UserFinanceController {
  constructor(private readonly userFinanceService: UserFinanceService) {}

  @Post('createtable')
  async create(@Body('userEmail') userEmail: string, @Body() createUserFinanceDto: CreateUserFinanceDto) {
    return this.userFinanceService.create(userEmail, createUserFinanceDto);
  }

  @Post('records')
  async findAllByUser(@Body('userEmail') userEmail: string) {
    return this.userFinanceService.findAllByUser(userEmail);
  }

  @Post('add-month-update')
  async addMonthUpdate(@Body() monthResultDto: monthResultDto) {
    const { useremail, finance_id } = monthResultDto;
    return this.userFinanceService.addMonthResults(useremail, finance_id, monthResultDto);
  }

  @Post('get-updates')
  async getAllUpdatesByFinanceId(@Body() getUpdatesDto: GetUpdatesDto) {
    const { finance_id } = getUpdatesDto;
    return this.userFinanceService.findAllUpdatedById(finance_id);
  }

  @Post('delete')
  async deleteById(@Body() getUpdatesDto: GetUpdatesDto) {
    const { finance_id } = getUpdatesDto;
    return this.userFinanceService.deleteById(finance_id)
  };

  @Post('delete-monthly-update')
  async deleteMonthlyUpdate(
    @Body('updateId') updateId: string,
    @Body('financeId') financeId: string,
    @Body('userEmail') userEmail: string,
  ) {
    return this.userFinanceService.deleteMonthlyUpdate(updateId, financeId, userEmail);
  }

  @Post('create-income')
  async createIncome(@Body() createIncomeDto: CreateIncomeDto) {
    return this.userFinanceService.createIncome(createIncomeDto);
  }

  @Post('update-income')
  async updateIncome(@Body() updateData: { id: string, name?: string, amount?: number, userEmail: string }) {
    const { id, ...rest } = updateData;
    return this.userFinanceService.updateIncome(id, rest);
  }

  @Post('delete-income')
  async deleteIncome(@Body('incomeId') incomeId: string) {
    return this.userFinanceService.deleteIncomeById(incomeId)
  }

  @Post('get-all-by-user')
  async getAllByUser(@Body('userEmail') userEmail: string) {
    return this.userFinanceService.findAllIncomesByUser(userEmail);
  }
}
