import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { ChangeEmailDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword });
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByActivationUuid(uuid: string): Promise<User> {
    return this.userModel.findOne({ activationUuid: uuid });
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.userModel.updateOne({ email }, { refreshToken });
  }

  async activateUser(email: string): Promise<void> {
    await this.userModel.updateOne({ email }, { activated: true, activationUuid: null });
  }

  async updateEmailAndDeactivate(changeEmailDto: ChangeEmailDto): Promise<void> {
    await this.userModel.updateOne(
      { email: changeEmailDto.currentEmail },
      { email: changeEmailDto.newEmail, activated: false }
    );
  }

  async updatePassword(email: string, newPassword: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = newPassword;
    await user.save();
  }
}