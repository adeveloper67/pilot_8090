import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { PasswordResetDto, SignInDto, SignUpDto } from './dto';
import { User } from 'src/schemas';
import { IUser } from './interfaces';
import { PasswordResetGuard, RefreshTokenGuard } from 'src/guards';

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

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  refreshToken(@Req() request: Request): string {
    return this.authService.refreshToken(request);
  }

  @UseGuards(PasswordResetGuard)
  @Patch('password-reset/:token')
  passwordReset(@Body() dto: PasswordResetDto): Promise<boolean> {
    return this.authService.passwordReset(dto);
  }
}
