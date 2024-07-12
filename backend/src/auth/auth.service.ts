import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, ChangeEmailDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const user = await this.usersService.create(email, password);
    const tokens = this.generateTokens(user.email);
    await this.usersService.updateRefreshToken(user.email, tokens.refreshToken);
    return tokens;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = this.generateTokens(user.email);
    await this.usersService.updateRefreshToken(user.email, tokens.refreshToken);
    return tokens;
  }

  async getUserData(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  generateTokens(email: string) {
    const payload = { email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async ActivateAccount(email: string): Promise<void>{
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.activateUser(email)
  }

  async changeEmail(changeEmailDto: ChangeEmailDto): Promise<void>{
    const user = await this.usersService.findByEmail(changeEmailDto.currentEmail);
    if (!user) {
      throw new NotFoundException('User not Found')
    }
    await this.usersService.updateEmailAndDeactivate(changeEmailDto)
  }
}
