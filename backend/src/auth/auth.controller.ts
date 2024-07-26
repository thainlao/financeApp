import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangeEmailDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    return this.authService.getUserData(req.user.email)
  }

  @Post('activate')
  async activateAccount(@Body() body: { email: string }) {
    const { email } = body;
    return this.authService.ActivateAccount(email);
  }

  @Post('change-email')
  async changeUserEmail(@Body() changeEmailDto: ChangeEmailDto) {
    return this.authService.changeEmail(changeEmailDto)
  }

  @Post('finduserbyemail')
  async FindUserByEmail(@Body() email: string) {
    return this.authService
  }

  @Post('forget-password')
async forgetPassword(@Body('email') email: string) {
  return this.authService.checkUserByEmail(email);
}

@Post('change-password')
async changePassword(@Body() changePasswordDto: { email: string, newPassword: string }) {
  const { email, newPassword } = changePasswordDto;
  return this.authService.changePassword(email, newPassword);
}
}