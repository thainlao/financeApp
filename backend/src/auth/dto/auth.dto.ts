export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDto {
  email: string;
  password: string;
}

export class ChangeEmailDto {
  newEmail: string;
  currentEmail: string
}