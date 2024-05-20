import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { User } from 'src/schemas';
import { IUser } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto): Promise<User> {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  signIn(@Body() dto: SignInDto): Promise<IUser> {
    return this.authService.signIn(dto);
  }
}
