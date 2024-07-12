import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Income, IncomeSchema, UserFinance, UserFinanceSchema, UserFinanceUpdate, UserFinanceUpdateSchema } from './schemas/user.finance.schema';
import { UserFinanceService } from './user.finances.service';
import { UserFinanceController } from './user.finances.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserFinance.name, schema: UserFinanceSchema },
      { name: Income.name, schema: IncomeSchema },
      { name: UserFinanceUpdate.name, schema: UserFinanceUpdateSchema},
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [UserFinanceService],
  controllers: [UserFinanceController],
})
export class UserFinanceModule {}
